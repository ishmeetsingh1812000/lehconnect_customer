import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import InsuranceBooking from '@/views/insurance/InsuranceBooking';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Travel Insurance Plans - LehConnect',
  description: 'Protect your journey with comprehensive travel insurance from LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function InsuranceBookingPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Home initialTab="insurance" />
  );
}
