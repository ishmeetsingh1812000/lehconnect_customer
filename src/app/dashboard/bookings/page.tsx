import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import BookingsList from '@/views/dashboard/BookingsList';

export const metadata: Metadata = {
  title: 'My Bookings - LehConnect',
  description: 'View, manage, and download vouchers for all your LehConnect bookings.',
};

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <BookingsList />
    </Suspense>
  );
}
