import React, { Suspense, JSX } from 'react';
import FlightSuccess from '@/views/flights/FlightSuccess';

export default function FlightSuccessPage(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <FlightSuccess />
    </Suspense>
  );
}
