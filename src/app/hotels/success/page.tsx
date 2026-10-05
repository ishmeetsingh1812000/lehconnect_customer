import React, { Suspense, JSX } from 'react';
import HotelSuccess from '@/views/hotels/HotelSuccess';

export default function HotelSuccessPage(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <HotelSuccess />
    </Suspense>
  );
}
