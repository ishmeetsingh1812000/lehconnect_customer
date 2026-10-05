import React, { Suspense, JSX } from 'react';
import type { Metadata } from 'next';
import HolidayDetails from '@/views/holidays/HolidayDetails';
import { PACKAGES_DATA } from '@/constants/packagesData';

export const metadata: Metadata = {
  title: 'Package Details - LehConnect',
  description: 'View holiday package itinerary, inclusions, hotels, and details on LehConnect.',
};

export function generateStaticParams(): { id: string }[] {
  const ids: { id: string }[] = [];
  for (const list of Object.values(PACKAGES_DATA) as any[][]) {
    for (const pkg of list) {
      if (pkg?.id && !ids.some(x => x.id === pkg.id)) {
        ids.push({ id: pkg.id });
      }
    }
  }
  return ids;
}

interface HolidayDetailsPageProps {
  params: Promise<{ id?: string }>;
}

export default async function HolidayDetailsPage({ params }: HolidayDetailsPageProps): Promise<JSX.Element> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  return (
    <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <HolidayDetails id={id} />
    </Suspense>
  );
}
