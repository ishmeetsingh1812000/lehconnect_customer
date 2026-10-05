import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import HolidayCheckout from '@/views/holidays/HolidayCheckout';

export const metadata: Metadata = {
  title: 'Holiday Checkout - LehConnect',
  description: 'Complete your holiday package booking securely on LehConnect.',
};

export default function HolidayCheckoutPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <HolidayCheckout />
    </Suspense>
  );
}
