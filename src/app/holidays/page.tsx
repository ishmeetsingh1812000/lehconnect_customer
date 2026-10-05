import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import HolidayListing from '@/views/holidays/HolidayListing';
import Home from '@/views/Home';

export const metadata: Metadata = {
  title: 'Holiday Packages - LehConnect',
  description: 'Explore and book curated holiday packages and tours on LehConnect.',
};

interface PageProps {
  searchParams?: Promise<{ search?: string; [key: string]: any }>;
}

export default async function HolidaysPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const resolved = searchParams ? await searchParams : {};
  return (
    <Home initialTab="holidays" />
  );
}
