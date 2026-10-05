import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import BusBooking from '@/views/bus/BusBooking';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Bus Booking - LehConnect',
  description: 'Book intercity bus tickets online with LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function BusBookingPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Home initialTab="bus" />
  );
}
