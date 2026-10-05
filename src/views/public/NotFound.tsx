'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '../../constants/routes';

export const NotFound = () => {
  return (
    <div className="container py-5 text-center d-flex flex-column align-items-center justify-content-center leh-style-auto-1218">
      <h1 className="fw-bold   leh-style-auto-1219">404</h1>
      <h3 className="fw-bold mb-2">Lost in the Himalayas?</h3>
      <p className="text-muted mb-4 leh-style-auto-1220">The route you are searching for is blocked or does not exist. Let's redirect you back to base camp.</p>
      <Link href={ROUTES.HOME} className="btn btn-premium-primary">Go to Home Page</Link>
    </div>
  );
};

export default NotFound;

