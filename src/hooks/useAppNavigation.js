'use client';

import { useRouter, usePathname, useSearchParams, useParams as useNextParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';

export function useNavigate() {
  const router = useRouter();

  return useCallback((to, options) => {
    if (typeof to === 'number') {
      if (to === -1) {
        router.back();
      } else if (to === 1) {
        router.forward();
      }
      return;
    }

    if (options?.state && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('leh_nav_state', JSON.stringify(options.state));
        if (window.history?.replaceState) {
          window.history.replaceState({ ...window.history.state, ...options.state }, '', window.location.href);
        }
      } catch (e) {
        console.error('Failed to set nav state', e);
      }
    }

    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router]);
}

export function useLocation() {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  return useMemo(() => {
    let state = null;
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('leh_nav_state');
        if (saved) {
          state = JSON.parse(saved);
        }
      } catch (e) {}
      if (!state && window.history?.state) {
        state = window.history.state;
      }
    }

    return {
      pathname,
      search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
      state,
    };
  }, [pathname, searchParams]);
}

export function useParams() {
  return useNextParams();
}
