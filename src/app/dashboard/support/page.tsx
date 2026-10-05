import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SupportTickets from '@/views/dashboard/SupportTickets';

export const metadata: Metadata = {
  title: 'Support Center - LehConnect',
  description: 'Create and track customer support requests with LehConnect support desk.',
};

export default function SupportPage() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <SupportTickets />
    </Suspense>
  );
}
