import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Profile from '@/views/dashboard/Profile';

export const metadata: Metadata = {
  title: 'Profile Details - LehConnect',
  description: 'Manage your profile and saved travelers on LehConnect.',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <Profile />
    </Suspense>
  );
}
