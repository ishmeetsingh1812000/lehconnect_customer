import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Wallet from '@/views/dashboard/Wallet';

export const metadata: Metadata = {
  title: 'Wallet & Cashbacks - LehConnect',
  description: 'Manage your LehConnect wallet balance, credits, and transaction history.',
};

export default function WalletPage() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <Wallet />
    </Suspense>
  );
}
