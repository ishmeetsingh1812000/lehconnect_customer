import React from 'react';
import ServiceDetails from '@/views/public/ServiceDetails';

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const resolvedParams = await params;
  return <ServiceDetails serviceId={resolvedParams.serviceId} />;
}
