'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '../../constants/routes';

export const Error500 = () => {
  return (
    <div className="container py-5 text-center d-flex flex-column align-items-center justify-content-center leh-style-auto-1218">
      <h1 className="fw-bold text-danger leh-style-auto-1219">500</h1>
      <h3 className="fw-bold mb-2">Internal Service Outage</h3>
      <p className="text-muted mb-4 leh-style-auto-1220">Our servers are experiencing heavy climbing traffic. Please try reloading the route shortly.</p>
      <div className="d-flex gap-2">
        <button onClick={() => window.location.reload()} className="btn btn-premium-primary">Reload Page</button>
        <Link href={ROUTES.HOME} className="btn btn-premium-outline">Return Home</Link>
      </div>
    </div>
  );
};

export default Error500;

