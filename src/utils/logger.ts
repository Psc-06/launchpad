type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  userId?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, any>;
  [key: string]: any; // Allow additional properties
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLog(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const baseLog = {
      timestamp,
      level,
      message,
      env: process.env.NODE_ENV,
    };

    if (context) {
      return { ...baseLog, ...context };
    }

    return baseLog;
  }

  info(message: string, context?: LogContext) {
    const log = this.formatLog('info', message, context);
    
    if (this.isDevelopment) {
      console.log('ℹ️', message, context || '');
    } else {
      console.log(JSON.stringify(log));
    }
  }

  warn(message: string, context?: LogContext) {
    const log = this.formatLog('warn', message, context);
    
    if (this.isDevelopment) {
      console.warn('⚠️', message, context || '');
    } else {
      console.warn(JSON.stringify(log));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const log = this.formatLog('error', message, {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    });

    if (this.isDevelopment) {
      console.error('❌', message, error, context || '');
    } else {
      console.error(JSON.stringify(log));
    }
  }

  debug(message: string, context?: LogContext) {
    if (!this.isDevelopment) return;
    
    console.log('🐛', message, context || '');
  }

  // Specific log methods for key events
  auth(action: 'login' | 'logout' | 'register' | 'failed', userId?: string, metadata?: Record<string, any>) {
    this.info(`Auth: ${action}`, { userId, action, resource: 'auth', metadata });
  }

  payment(action: 'created' | 'completed' | 'failed' | 'refunded', userId: string, metadata?: Record<string, any>) {
    this.info(`Payment: ${action}`, { userId, action, resource: 'payment', metadata });
  }

  ai(action: 'request' | 'success' | 'failed', userId: string, metadata?: Record<string, any>) {
    this.info(`AI: ${action}`, { userId, action, resource: 'ai', metadata });
  }

  product(action: 'created' | 'updated' | 'deleted' | 'viewed', userId?: string, metadata?: Record<string, any>) {
    this.info(`Product: ${action}`, { userId, action, resource: 'product', metadata });
  }
}

export const logger = new Logger();
