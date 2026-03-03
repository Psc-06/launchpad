# LaunchPad: Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Stripe account
- OpenAI API key
- Vercel account (recommended) or other Node.js host

## Environment Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd launchpad
npm install
```

### 2. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Fill in all required values:

#### Required Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://yourdomain.com"
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npm run seed
```

## Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel
```

#### Step 4: Set Environment Variables
```bash
# Set each variable
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... repeat for all variables
```

Or use Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add all variables from .env

#### Step 5: Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

#### Step 6: Final Deployment
```bash
vercel --prod
```

### Option 2: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      # ... add all env vars
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: launchpad
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

Deploy:
```bash
docker-compose up -d
```

### Option 3: Railway

1. Push to GitHub
2. Go to Railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables
6. Railway will auto-deploy

### Option 4: AWS (EC2 + RDS)

#### Step 1: Setup RDS PostgreSQL
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier launchpad-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20
```

#### Step 2: Setup EC2 Instance
```bash
# Launch EC2 instance
# SSH into instance
ssh -i key.pem ubuntu@your-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo>
cd launchpad
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "launchpad" -- start
pm2 save
pm2 startup
```

#### Step 3: Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Checklist

### Security
- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Database connection encrypted
- [ ] Rate limiting configured
- [ ] Security headers verified
- [ ] CORS configured correctly

### Stripe Setup
- [ ] Webhook endpoint configured
- [ ] Test mode transactions work
- [ ] Live mode enabled (production)
- [ ] Payout schedule configured
- [ ] Platform fee configured

### Monitoring
- [ ] Error tracking setup (Sentry)
- [ ] Uptime monitoring configured
- [ ] Analytics installed (GA)
- [ ] Log aggregation setup
- [ ] Database backups configured

### Performance
- [ ] Database indexes created
- [ ] Redis caching enabled
- [ ] CDN configured (images)
- [ ] Gzip compression enabled
- [ ] Response times optimized

### Testing
- [ ] Authentication flows tested
- [ ] Payment flows tested
- [ ] Email delivery tested
- [ ] AI endpoints tested
- [ ] Admin dashboard tested

## Database Migrations

### Production Migrations
```bash
# Never use migrate dev in production!
npx prisma migrate deploy
```

### Backup Before Migration
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore if needed
psql $DATABASE_URL < backup_20260303_120000.sql
```

## Monitoring & Maintenance

### Health Check Endpoint
Create `/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
```

### Log Monitoring
```bash
# View logs on Vercel
vercel logs

# View PM2 logs
pm2 logs launchpad

# View Docker logs
docker-compose logs -f app
```

### Database Monitoring
```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('launchpad'));

-- Check slow queries
SELECT query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Scaling Strategies

### Horizontal Scaling
- Multiple Vercel instances (automatic)
- Load balancer for custom hosting
- Database read replicas
- Redis cluster for caching

### Vertical Scaling
- Increase database instance size
- Increase server memory/CPU
- Optimize queries
- Enable caching

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Docker
```bash
# Keep previous image
docker tag launchpad:latest launchpad:previous
docker build -t launchpad:latest .

# Rollback if needed
docker tag launchpad:previous launchpad:latest
docker-compose up -d
```

### Database
```bash
# Rollback migration
npx prisma migrate resolve --rolled-back <migration-name>
```

## Common Issues

### Issue: Database Connection Timeout
```bash
# Check connection string format
# Increase connection pool size in schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_timeout = 20
  connection_limit = 10
}
```

### Issue: Stripe Webhook Failing
```bash
# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Issue: High Memory Usage
```bash
# Monitor Node.js memory
node --max-old-space-size=2048 server.js

# Enable production mode
NODE_ENV=production npm start
```

## Support Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)

## Estimated Costs (Monthly)

### Hobby/Small Scale
- Vercel Hobby: $0 (free tier)
- Database: $5-20 (Railway/Supabase)
- Stripe: 2.9% + $0.30 per transaction
- OpenAI: ~$10-50 (usage-based)
- **Total: ~$25-100/month**

### Production Scale
- Vercel Pro: $20
- Database: $50-200 (managed PostgreSQL)
- Redis: $10-30 (managed Redis)
- Stripe: 2.9% + $0.30 per transaction
- OpenAI: $100-500 (higher usage)
- Sentry: $26
- **Total: ~$200-800/month + transaction fees**

## Next Steps After Deployment

1. Monitor error rates first 24 hours
2. Test all critical user flows
3. Set up automated backups
4. Configure alerts for downtime
5. Optimize slow queries
6. Implement caching strategy
7. Add monitoring dashboards
8. Plan scaling strategy
