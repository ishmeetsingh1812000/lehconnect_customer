'use client';

import React, { useState, useEffect, Suspense, JSX } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ROUTES } from '../constants/routes';
import { PACKAGES_DATA } from '../constants/packagesData';

interface CrumbItem {
  label: string;
  href: string;
}

const serviceNames: Record<string, string> = {
  cabs: 'Cab Services',
  flights: 'Flight Booking',
  hotels: 'Hotel Booking',
  holidays: 'Holiday Packages',
  bus: 'Bus Booking',
  train: 'Train Services & Enquiry',
  visa: 'Visa Assistance',
  insurance: 'Travel Insurance'
};

const segmentTitles: Record<string, string> = {
  cabs: 'Cabs',
  hotels: 'Hotels',
  flights: 'Flights',
  holidays: 'Holiday Packages',
  bus: 'Buses',
  train: 'Trains',
  visa: 'Visa Assistance',
  insurance: 'Travel Insurance',
  checkout: 'Checkout',
  success: 'Booking Confirmed',
  failed: 'Booking Failed',
  dashboard: 'Dashboard',
  bookings: 'My Bookings',
  profile: 'User Profile',
  support: 'Support Tickets',
  wallet: 'Wallet & Rewards',
  admin: 'Admin Dashboard',
  about: 'About Us',
  contact: 'Contact Us',
  'contact-us': 'Contact Us',
  services: 'Our Services',
  testimonials: 'Testimonials',
  faqs: 'Frequently Asked Questions',
  blog: 'Blog',
  'privacy-policy': 'Privacy Policy',
  'terms-conditions': 'Terms & Conditions',
  'refund-policy': 'Refund Policy',
  'cancellation-policy': 'Cancellation Policy',
  'cookies-policy': 'Cookies Policy',
  disclaimer: 'Disclaimer',
  login: 'Login',
  register: 'Create Account',
  'forgot-password': 'Forgot Password',
  'otp-verification': 'OTP Verification',
  '404': 'Page Not Found',
  'error-500': 'Server Error'
};

const routeHierarchyMap: Record<string, CrumbItem[]> = {
  // Service Pages (Search listing views)
  '/cabs': [
    { label: 'Cabs', href: '/cabs?search=results' }
  ],
  '/cabs/checkout': [
    { label: 'Cabs', href: '/cabs?search=results' },
    { label: 'Checkout', href: '/cabs/checkout' }
  ],
  '/cabs/success': [
    { label: 'Cabs', href: '/cabs?search=results' },
    { label: 'Booking Confirmed', href: '/cabs/success' }
  ],
  '/hotels': [
    { label: 'Hotels', href: '/hotels?search=results' }
  ],
  '/hotels/checkout': [
    { label: 'Hotels', href: '/hotels?search=results' },
    { label: 'Checkout', href: '/hotels/checkout' }
  ],
  '/hotels/success': [
    { label: 'Hotels', href: '/hotels?search=results' },
    { label: 'Booking Confirmed', href: '/hotels/success' }
  ],
  '/flights': [
    { label: 'Flights', href: '/flights?search=results' }
  ],
  '/flights/checkout': [
    { label: 'Flights', href: '/flights?search=results' },
    { label: 'Checkout', href: '/flights/checkout' }
  ],
  '/flights/success': [
    { label: 'Flights', href: '/flights?search=results' },
    { label: 'Booking Confirmed', href: '/flights/success' }
  ],
  '/holidays': [
    { label: 'Holiday Packages', href: '/holidays?search=results' }
  ],
  '/holidays/checkout': [
    { label: 'Holiday Packages', href: '/holidays?search=results' },
    { label: 'Checkout', href: '/holidays/checkout' }
  ],
  '/holidays/success': [
    { label: 'Holiday Packages', href: '/holidays?search=results' },
    { label: 'Booking Confirmed', href: '/holidays/success' }
  ],
  '/bus': [
    { label: 'Buses', href: '/bus?search=results' }
  ],
  '/bus/checkout': [
    { label: 'Buses', href: '/bus?search=results' },
    { label: 'Checkout', href: '/bus/checkout' }
  ],
  '/bus/success': [
    { label: 'Buses', href: '/bus?search=results' },
    { label: 'Booking Confirmed', href: '/bus/success' }
  ],
  '/train': [
    { label: 'Trains', href: '/train?search=results' }
  ],
  '/visa': [
    { label: 'Visa Assistance', href: '/visa?search=results' }
  ],
  '/insurance': [
    { label: 'Travel Insurance', href: '/insurance?search=results' }
  ],

  // Dashboard Pages
  '/dashboard': [
    { label: 'My Dashboard', href: '/dashboard' }
  ],
  '/dashboard/bookings': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Bookings', href: '/dashboard/bookings' }
  ],
  '/dashboard/profile': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'User Profile', href: '/dashboard/profile' }
  ],
  '/dashboard/support': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Support Tickets', href: '/dashboard/support' }
  ],
  '/dashboard/wallet': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Wallet & Rewards', href: '/dashboard/wallet' }
  ],
  '/admin': [
    { label: 'Admin Dashboard', href: '/admin' }
  ],

  // Public & Policy Pages
  '/about': [
    { label: 'About Us', href: '/about' }
  ],
  '/contact': [
    { label: 'Contact Us', href: '/contact' }
  ],
  '/contact-us': [
    { label: 'Contact Us', href: '/contact-us' }
  ],
  '/services': [
    { label: 'Our Services', href: '/services' }
  ],
  '/testimonials': [
    { label: 'Testimonials', href: '/testimonials' }
  ],
  '/faqs': [
    { label: 'Frequently Asked Questions', href: '/faqs' }
  ],
  '/privacy-policy': [
    { label: 'Privacy Policy', href: '/privacy-policy' }
  ],
  '/terms-conditions': [
    { label: 'Terms & Conditions', href: '/terms-conditions' }
  ],
  '/refund-policy': [
    { label: 'Refund Policy', href: '/refund-policy' }
  ],
  '/cancellation-policy': [
    { label: 'Cancellation Policy', href: '/cancellation-policy' }
  ],
  '/cookies-policy': [
    { label: 'Cookies Policy', href: '/cookies-policy' }
  ],
  '/disclaimer': [
    { label: 'Disclaimer', href: '/disclaimer' }
  ],

  // Auth Pages
  '/login': [
    { label: 'Login', href: '/login' }
  ],
  '/register': [
    { label: 'Create Account', href: '/register' }
  ],
  '/forgot-password': [
    { label: 'Forgot Password', href: '/forgot-password' }
  ],
  '/otp-verification': [
    { label: 'OTP Verification', href: '/otp-verification' }
  ],

  // Error Pages
  '/404': [
    { label: 'Page Not Found', href: '/404' }
  ],
  '/error-500': [
    { label: 'Server Error', href: '/error-500' }
  ]
};

const HOME_LANDING_TABS = [
  '/cabs',
  '/hotels',
  '/flights',
  '/holidays',
  '/bus',
  '/train',
  '/visa',
  '/insurance',
];

const STATIC_HOME_SECTIONS = [
  '/services',
  '/faqs',
  '/testimonials'
];

interface BreadcrumbRendererProps {
  crumbs: CrumbItem[];
}

const BreadcrumbRenderer = ({ crumbs }: BreadcrumbRendererProps): JSX.Element => {
  return (
    <nav 
      aria-label="breadcrumb" 
      className="leh-global-breadcrumb-nav bg-light border-bottom text-start mb-0 py-1.5 py-md-2"
    >
      <div className="container">
        <ol 
          className="breadcrumb mb-0 d-flex align-items-center flex-nowrap flex-md-wrap overflow-x-auto fs-8 py-0 list-unstyled"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Home clickable crumb */}
          <li className="d-inline-flex align-items-center flex-shrink-0">
            <Link 
              href="/" 
              className="leh-global-breadcrumb-link text-decoration-none d-inline-flex align-items-center gap-1.5"
              style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
              title="Home"
            >
              <i className="fa-solid fa-house fs-9 text-primary"></i>
              <span>Home</span>
            </Link>
          </li>

          {/* Hierarchy Crumb Items */}
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.href + idx}>
                <li className="leh-global-breadcrumb-separator" aria-hidden="true">
                  <i className="fa-solid fa-chevron-right opacity-60"></i>
                </li>
                <li 
                  className={`d-inline-flex align-items-center flex-shrink-0 ${isLast ? 'active' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isLast ? (
                    <span 
                      className="leh-global-breadcrumb-active leh-global-breadcrumb-label"
                      title={crumb.label}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="leh-global-breadcrumb-link leh-global-breadcrumb-label text-decoration-none"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      title={crumb.label}
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

// Component that handles the tabs on Home and search results:
const HomeTabSearchBreadcrumb = ({ activePath }: { activePath: string }): JSX.Element | null => {
  const searchParams = useSearchParams();
  const isSearchMode = searchParams?.get('search') === 'results';

  if (!isSearchMode) {
    return null;
  }

  const crumbs = routeHierarchyMap[activePath] || [
    { label: segmentTitles[activePath.replace(/^\//, '')] || 'Search Results', href: `${activePath}?search=results` }
  ];

  return <BreadcrumbRenderer crumbs={crumbs} />;
};

export const Breadcrumb = (): JSX.Element | null => {
  const pathname = usePathname() || '';
  const [currentPath, setCurrentPath] = useState<string>(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const syncState = () => {
      if (typeof window !== 'undefined') {
        setCurrentPath(window.location.pathname);
      }
    };
    window.addEventListener('popstate', syncState);
    return () => window.removeEventListener('popstate', syncState);
  }, []);

  const activePath = currentPath || pathname;

  // 1. Root homepage or Home sections: always null (hidden)
  if (activePath === ROUTES.HOME || activePath === '' || activePath === '/' || STATIC_HOME_SECTIONS.includes(activePath)) {
    return null;
  }

  // 2. Home landing tabs (e.g. /cabs, /hotels): ONLY show when search=results
  if (HOME_LANDING_TABS.includes(activePath)) {
    return (
      <Suspense fallback={null}>
        <HomeTabSearchBreadcrumb activePath={activePath} />
      </Suspense>
    );
  }

  // 3. For ALL other pages (search listings, checkout, details, policies, auth, dashboard, etc.):
  // Compute breadcrumbs list without touching useSearchParams to preserve full static SSR
  let crumbs: CrumbItem[] = [];

  if (routeHierarchyMap[activePath]) {
    crumbs = routeHierarchyMap[activePath];
  } 
  else if (activePath.startsWith('/holidays/') && !routeHierarchyMap[activePath]) {
    const packageId = activePath.split('/')[2] || '';
    let pkgTitle = 'Package Details';
    if (packageId && PACKAGES_DATA) {
      for (const list of Object.values(PACKAGES_DATA) as any[][]) {
        if (Array.isArray(list)) {
          const found = list.find((p: any) => String(p?.id) === String(packageId));
          if (found?.name || found?.title) {
            pkgTitle = found.name || found.title;
            break;
          }
        }
      }
    }
    crumbs = [
      { label: 'Holiday Packages', href: '/holidays?search=results' },
      { label: pkgTitle, href: activePath }
    ];
  } 
  else if (activePath.startsWith('/services/') && !routeHierarchyMap[activePath]) {
    const serviceKey = activePath.split('/')[2] || '';
    const title = serviceNames[serviceKey] || 'Service Details';
    crumbs = [
      { label: 'Our Services', href: '/services' },
      { label: title, href: activePath }
    ];
  } 
  else if (activePath.startsWith('/blog/')) {
    const slug = activePath.split('/')[2] || '';
    const formattedTitle = slug
      ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Article Details';
    crumbs = [
      { label: 'Blog', href: '/blog' },
      { label: formattedTitle, href: activePath }
    ];
  } 
  else {
    const segments = activePath.split('/').filter(Boolean);
    crumbs = segments.map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      const label = segmentTitles[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
      return { label, href };
    });
  }

  return <BreadcrumbRenderer crumbs={crumbs} />;
};

export default Breadcrumb;
