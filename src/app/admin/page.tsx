import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminDashboard from '@/views/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - LehConnect',
  description: 'Control center for LehConnect platform administration and booking management.',
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <AdminDashboard />
    </Suspense>
  );
}
