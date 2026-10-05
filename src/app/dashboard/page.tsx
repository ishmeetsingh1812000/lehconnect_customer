import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import DashboardOverview from '@/views/dashboard/DashboardOverview';

export const metadata: Metadata = {
  title: 'User Dashboard - LehConnect',
  description: 'Manage your LehConnect travel bookings, wallet, and account settings.',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <DashboardOverview />
    </Suspense>
  );
}
