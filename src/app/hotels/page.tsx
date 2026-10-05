import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import HotelListing from '@/views/hotels/HotelListing';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Hotel Booking - LehConnect',
  description: 'Book hotels, resorts, and homestays with LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function HotelListingPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Home initialTab="hotels" />
  );
}
