import React from 'react';
import type { Metadata } from 'next';
import Error500 from '@/views/public/Error500';

export const metadata: Metadata = {
  title: 'Internal Server Error - LehConnect',
  description: 'Internal server outage error page.',
};

export default function Error500Page() {
  return <Error500 />;
}
