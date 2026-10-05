import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import FlightListing from '@/views/flights/FlightListing';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Flight Booking - LehConnect',
  description: 'Search and book domestic and international flights on LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function FlightListingPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Home initialTab="flights" />
  );
}
