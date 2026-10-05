'use client';

import React from 'react';
import Error500 from '@/views/public/Error500';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <Error500 />;
}
