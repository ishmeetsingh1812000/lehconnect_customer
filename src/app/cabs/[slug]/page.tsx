import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import CabListing from '@/views/cabs/CabListing';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Cab Booking - LehConnect',
  description: 'Book cabs, taxis, and outstation rides with LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function CabListingPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Suspense fallback={null}>
      <CabListing />
    </Suspense>
  );
}
