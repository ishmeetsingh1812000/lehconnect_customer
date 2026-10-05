'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useBooking } from '../context/BookingContext';
import { ROUTES } from '../constants/routes';
import { logoutUser } from '../APIs/api';
import toast from 'react-hot-toast';

export const Header = () => {
  const { user, isLoggedIn, setIsLoggedIn, activeTab, setActiveTab, language, setLanguage, t, openLoginModal } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const serviceRoutes: Record<string, string> = {
    cabs: '/cabs',
    holidays: '/holidays',
    flights: '/flights',
    hotels: '/hotels',
    train: '/train',
    bus: '/bus',
    visa: '/visa',
    insurance: '/insurance',
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileUserDropdownOpen(false);
    const path = pathname || '';
    if (path.startsWith('/cabs')) {
      setActiveTab('cabs');
    } else if (path.startsWith('/holidays')) {
      setActiveTab('holidays');
    } else if (path.startsWith('/flights')) {
      setActiveTab('flights');
    } else if (path.startsWith('/hotels')) {
      setActiveTab('hotels');
    } else if (path.startsWith('/bus')) {
      setActiveTab('bus');
    } else if (path.startsWith('/train')) {
      setActiveTab('train');
    } else if (path.startsWith('/insurance')) {
      setActiveTab('insurance');
    } else if (path.startsWith('/visa')) {
      setActiveTab('visa');
    } else if (path === '/') {
      setActiveTab('cabs');
    }
  }, [pathname, setActiveTab]);

  useEffect(() => {
    const syncTabFromUrl = () => {
      if (typeof window !== 'undefined') {
        const pathPart = window.location.pathname.replace(/^\//, '').split('/')[0];
        if (['cabs', 'holidays', 'flights', 'hotels', 'train', 'bus', 'visa', 'insurance'].includes(pathPart)) {
          setActiveTab(pathPart);
        } else if (window.location.pathname === '/') {
          setActiveTab('cabs');
        }
      }
    };
    window.addEventListener('popstate', syncTabFromUrl);
    return () => window.removeEventListener('popstate', syncTabFromUrl);
  }, [setActiveTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleServiceClick = (tabName: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const targetPath = serviceRoutes[tabName] || `/${tabName}`;
    setActiveTab(tabName);
    setMobileMenuOpen(false);
    router.push(targetPath);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerRefreshToken');
      setIsLoggedIn(false);
      toast.success('Successfully logged out!');
      router.push(ROUTES.HOME);
      setMobileMenuOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to logout');
      // If it fails on backend, we probably still want to log them out locally
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerRefreshToken');
      setIsLoggedIn(false);
      router.push(ROUTES.HOME);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`py-2 shadow-sm leh-header-wrapper ${isSticky ? 'sticky-header' : ''}`}>
      
      <div className="container">
        {/* Top Header Row */}
        <div className="d-flex align-items-center justify-content-between">

          {/* Logo Brand */}
          <Link href={ROUTES.HOME} className="navbar-brand d-flex align-items-center gap-2 text-decoration-none leh-navbar-brand">
            <div className="d-flex align-items-center gap-2">
              <div className="logo">
                <img src="/logo.jpg" alt="LehConnect logo" width={110} height={42} fetchPriority="high" className="leh-logo-img" />
              </div>
            </div>
          </Link>

          {/* LehConnect-Style Desktop Navigation Services (Visible only on large screen) */}
          <nav className="d-none d-lg-flex align-items-center gap-2 mx-auto">
            <Link 
              href="/cabs" 
              scroll={false}
              onClick={(e) => handleServiceClick('cabs', e)} 
              className={`leh-nav-item ${activeTab === 'cabs' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-car"></i>
              <span>Cabs</span>
            </Link>

            <Link 
              href="/holidays" 
              scroll={false}
              onClick={(e) => handleServiceClick('holidays', e)} 
              className={`leh-nav-item ${activeTab === 'holidays' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-suitcase"></i>
              <span>Holidays</span>
            </Link>

            <Link 
              href="/flights" 
              scroll={false}
              onClick={(e) => handleServiceClick('flights', e)} 
              className={`leh-nav-item ${activeTab === 'flights' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-plane"></i>
              <span>Flights</span>
            </Link>

            <Link 
              href="/hotels" 
              scroll={false}
              onClick={(e) => handleServiceClick('hotels', e)} 
              className={`leh-nav-item ${activeTab === 'hotels' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-hotel"></i>
              <span>Hotels</span>
            </Link>

            <Link 
              href="/train" 
              scroll={false}
              onClick={(e) => handleServiceClick('train', e)} 
              className={`leh-nav-item ${activeTab === 'train' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-train"></i>
              <span>Trains</span>
            </Link>

            <Link 
              href="/bus" 
              scroll={false}
              onClick={(e) => handleServiceClick('bus', e)} 
              className={`leh-nav-item ${activeTab === 'bus' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-bus"></i>
              <span>Buses</span>
            </Link>

            <Link 
              href="/visa" 
              scroll={false}
              onClick={(e) => handleServiceClick('visa', e)} 
              className={`leh-nav-item ${activeTab === 'visa' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-passport"></i>
              <span>Visa</span>
            </Link>

            <Link 
              href="/insurance" 
              scroll={false}
              onClick={(e) => handleServiceClick('insurance', e)} 
              className={`leh-nav-item ${activeTab === 'insurance' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>Insurance</span>
            </Link>
          </nav>

          {/* Desktop Right Side Controls */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {/* Language Selector Dropdown Box */}
            <div className="d-flex align-items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-select form-select-sm border-0 fw-semibold py-1 ps-2 pe-4 leh-header-lang-select"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            {/* Conditional Login Dropdown / Link Button Pill */}
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary rounded-pill px-3 py-1.5 fs-8 fw-bold d-flex align-items-center gap-2 leh-header-login-btn"
                  type="button"
                  id="userProfileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa-solid fa-user me-1 leh-header-user-icon" style={{ fontSize: '11px' }}></i>
                  <span>My Account</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 leh-dropdown-user-profile" aria-labelledby="userProfileDropdown">
                  <li>
                    <Link href={ROUTES.DASHBOARD} className="dropdown-item fs-8 py-2 text-start d-flex align-items-center gap-2">
                      <i className="fa-solid fa-user text-brand-primary" style={{ fontSize: '11px' }}></i> {t('dashboard')}
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item fs-8 py-2 text-start text-danger d-flex align-items-center gap-2 border-0 bg-transparent w-100"
                    >
                      <i className="fa-solid fa-right-from-bracket me-1" style={{ fontSize: '11px' }}></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="btn btn-outline-primary rounded-pill px-3 py-1.5 fs-8 fw-bold d-flex align-items-center gap-2 text-decoration-none leh-header-login-btn"
              >
                <i className="fa-solid fa-user me-1 leh-header-user-icon" style={{ fontSize: '11px' }}></i>
                <span>{t('login')}</span>
              </button>
            )}

          </div>

          {/* Mobile & Tablet Right Controls (Visible < lg screens) */}
          <div className="d-flex d-lg-none align-items-center gap-2.5">
            {isLoggedIn ? (
              <div className="dropdown position-relative">
                <button
                  type="button"
                  onClick={() => {
                    setMobileUserDropdownOpen(!mobileUserDropdownOpen);
                    setMobileMenuOpen(false);
                  }}
                  className={`leh-mobile-user-btn ${mobileUserDropdownOpen ? 'active' : ''}`}
                  aria-expanded={mobileUserDropdownOpen}
                  title={user.name}
                >
                  <i className="fa-solid fa-user"></i>
                </button>

                {mobileUserDropdownOpen && (
                  <>
                    {/* Backdrop to close on tap outside */}
                    <div 
                      className="position-fixed top-0 start-0 w-100 h-100" 
                      style={{ zIndex: 1040 }} 
                      onClick={() => setMobileUserDropdownOpen(false)}
                    ></div>

                    <div 
                      className="dropdown-menu dropdown-menu-end shadow-lg border rounded-3 mt-2 p-2 show position-absolute leh-dropdown-user-profile"
                      style={{ right: 0, minWidth: '220px', zIndex: 1045 }}
                    >
                      <div className="px-3 py-2 border-bottom mb-1 bg-light rounded-2 text-start">
                        <div className="fw-bold text-dark fs-8 text-truncate">{user.name}</div>
                        <div className="text-muted fs-10 text-truncate">{user.email}</div>
                      </div>
                      <Link 
                        href={ROUTES.DASHBOARD} 
                        onClick={() => setMobileUserDropdownOpen(false)}
                        className="dropdown-item fs-8 py-2 rounded-2 d-flex align-items-center gap-2 text-start"
                      >
                        <i className="fa-solid fa-user text-primary" style={{ fontSize: '12px' }}></i> {t('dashboard')}
                      </Link>
                      <Link 
                        href={ROUTES.PROFILE} 
                        onClick={() => setMobileUserDropdownOpen(false)}
                        className="dropdown-item fs-8 py-2 rounded-2 d-flex align-items-center gap-2 text-start"
                      >
                        <i className="fa-solid fa-id-card text-primary" style={{ fontSize: '12px' }}></i> Profile & Address
                      </Link>
                      <Link 
                        href={ROUTES.BOOKINGS} 
                        onClick={() => setMobileUserDropdownOpen(false)}
                        className="dropdown-item fs-8 py-2 rounded-2 d-flex align-items-center gap-2 text-start"
                      >
                        <i className="fa-solid fa-ticket text-primary" style={{ fontSize: '12px' }}></i> My Bookings
                      </Link>
                      <Link 
                        href={ROUTES.WALLET} 
                        onClick={() => setMobileUserDropdownOpen(false)}
                        className="dropdown-item fs-8 py-2 rounded-2 d-flex align-items-center gap-2 text-start"
                      >
                        <i className="fa-solid fa-wallet text-primary" style={{ fontSize: '12px' }}></i> Wallet (₹{user.walletBalance.toLocaleString()})
                      </Link>
                      <div className="dropdown-divider my-1"></div>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="dropdown-item fs-8 py-2 rounded-2 text-danger d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start"
                      >
                        <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '12px' }}></i> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="leh-mobile-user-btn"
                title="Login"
              >
                <i className="fa-solid fa-user"></i>
              </button>
            )}

            {/* Mobile Hamburguer Toggle Button */}
            <button
              className="btn btn-link text-dark border-0 p-1 d-flex align-items-center"
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileUserDropdownOpen(false);
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <i className="fa-solid fa-xmark fs-5"></i> : <i className="fa-solid fa-bars fs-5"></i>}
            </button>
          </div>

        </div>

        {/* LehConnect-Style Mobile/Tablet Horizontal Swipe Navigation (Visible < lg screens) */}
        <div className="d-block d-lg-none mt-2 pt-2 border-top">
          <nav className="leh-mobile-nav">
            <Link 
              href="/cabs" 
              scroll={false}
              onClick={(e) => handleServiceClick('cabs', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'cabs' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-car"></i>
              <span>Cabs</span>
            </Link>

            <Link 
              href="/holidays" 
              scroll={false}
              onClick={(e) => handleServiceClick('holidays', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'holidays' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-suitcase"></i>
              <span>Holidays</span>
            </Link>

            <Link 
              href="/flights" 
              scroll={false}
              onClick={(e) => handleServiceClick('flights', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'flights' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-plane"></i>
              <span>Flights</span>
            </Link>

            <Link 
              href="/hotels" 
              scroll={false}
              onClick={(e) => handleServiceClick('hotels', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'hotels' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-hotel"></i>
              <span>Hotels</span>
            </Link>

            <Link 
              href="/train" 
              scroll={false}
              onClick={(e) => handleServiceClick('train', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'train' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-train"></i>
              <span>Trains</span>
            </Link>

            <Link 
              href="/bus" 
              scroll={false}
              onClick={(e) => handleServiceClick('bus', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'bus' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-bus"></i>
              <span>Buses</span>
            </Link>

            <Link 
              href="/visa" 
              scroll={false}
              onClick={(e) => handleServiceClick('visa', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'visa' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-passport"></i>
              <span>Visa</span>
            </Link>

            <Link 
              href="/insurance" 
              scroll={false}
              onClick={(e) => handleServiceClick('insurance', e)} 
              className={`leh-mobile-nav-item ${activeTab === 'insurance' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>Insurance</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="position-absolute w-100 bg-white shadow-lg border-top py-3 d-lg-none leh-mobile-menu-dropdown">
          <div className="container d-flex flex-column gap-2 text-start">
            <Link href={ROUTES.HOME} onClick={() => setMobileMenuOpen(false)} className="nav-link py-2 border-bottom text-dark fw-bold fs-7">{t('home')}</Link>
            <Link href={ROUTES.ABOUT} onClick={() => setMobileMenuOpen(false)} className="nav-link py-2 border-bottom text-dark fw-bold fs-7 d-flex align-items-center justify-content-between">
              <span>{t('about_us')}</span>
              <i className="fa-solid fa-chevron-right text-muted fs-9"></i>
            </Link>

            {/* Language Selector inside mobile menu */}
            <div className="py-2 border-bottom d-flex align-items-center justify-content-between">
              <span className="text-dark fw-bold fs-7">Language</span>
              <select
                value={language}
                onChange={(e) => { setLanguage(e.target.value); setMobileMenuOpen(false); }}
                className="form-select form-select-sm w-50"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            {/* Login & Sign Out buttons inside mobile menu */}
            <div className="pt-2 d-flex flex-column gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="btn btn-outline-danger w-100 fw-bold justify-content-center py-2"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal();
                  }}
                  className="btn btn-primary w-100 fw-bold justify-content-center py-2"
                >
                  {t('login')}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
