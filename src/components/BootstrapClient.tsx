'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    const loadBootstrap = () => {
      // @ts-ignore
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(loadBootstrap, { timeout: 3000 });
    } else {
      setTimeout(loadBootstrap, 1500);
    }
  }, []);

  return null;
}
