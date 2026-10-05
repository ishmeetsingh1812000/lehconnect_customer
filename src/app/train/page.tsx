import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import TrainBooking from '@/views/train/TrainBooking';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Train Services & PNR Enquiry - LehConnect',
  description: 'Check IRCTC train schedule, routes, and PNR status online on LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function TrainBookingPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Home initialTab="train" />
  );
}
