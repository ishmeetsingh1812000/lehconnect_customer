import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import HolidaySuccess from '@/views/holidays/HolidaySuccess';

export const metadata: Metadata = {
  title: 'Holiday Booking Confirmed - LehConnect',
  description: 'Your holiday package booking confirmation and details on LehConnect.',
};

export default function HolidaySuccessPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <HolidaySuccess />
    </Suspense>
  );
}
