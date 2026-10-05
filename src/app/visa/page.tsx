import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import VisaBooking from '@/views/visa/VisaBooking';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Global Visa Assistance - LehConnect',
  description: 'Apply for tourist and business visas with expert documentation support on LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function VisaBookingPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Home initialTab="visa" />
  );
}
