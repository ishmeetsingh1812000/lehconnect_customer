import React, { Suspense, JSX } from 'react';
import CabSuccess from '@/views/cabs/CabSuccess';

export default function CabSuccessPage(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <CabSuccess />
    </Suspense>
  );
}
