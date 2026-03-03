'use client';

import { Suspense } from 'react';
import { RegisterContent } from './RegisterContent';

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

