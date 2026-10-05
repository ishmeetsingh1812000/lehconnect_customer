import React from 'react';
import BlogDetails from '@/views/public/BlogDetails';

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <BlogDetails id={resolvedParams.id} />;
}
