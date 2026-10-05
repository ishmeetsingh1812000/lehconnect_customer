'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to the LehConnect Newsletter!');
    setEmail('');
  };

  return (
    <footer className="premium-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="logo">
                <Link href="/">
                  <img src="/logo.webp" alt="LehConnect logo" width={85} height={40} loading="lazy" decoding="async" className="leh-style-auto-1024"/>
                </Link>
              </div>
            </div>
            <p className="fs-7 text-muted mb-3">
              Your comprehensive premium travel booking companion. Discover luxury hotels, outstation cabs, domestic & international flights, and hand-crafted holiday packages.
            </p>
            <div className="mb-3 fs-8 text-muted">
              <div className="d-flex align-items-center gap-2 mb-1.5">
                <i className="fa-solid fa-phone flex-shrink-0"></i>
                <a href="tel:+919602212487" className="text-muted text-decoration-none hover-text-orange">+91 9602212487</a>
              </div>
              <div className="d-flex align-items-center gap-2 mb-1.5">
                <i className="fa-solid fa-envelope flex-shrink-0"></i>
                <a href="mailto:support@lehconnect.com" className="text-muted text-decoration-none hover-text-orange">support@lehconnect.com</a>
              </div>
              <div className="d-flex align-items-center gap-2 mb-1.5">
                <i className="fa-solid fa-location-dot flex-shrink-0"></i>
                <span>Jaipur, Rajasthan (India)</span>
              </div>
            </div>
            <div className="d-flex gap-3">
              <Link 
                href="https://www.facebook.com/people/Lehconnect/61582137915528/?mibextid=wwXIfr&rdid=7sgcluGjOmbEaYgC&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1KUohNUDnM%2F%3Fmibextid%3DwwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover-text-orange"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook fs-5"></i>
              </Link>
              <Link 
                href="https://twitter.com/LehConnect" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover-text-orange"
                aria-label="Twitter"
              >
                <i className="fa-brands fa-x-twitter fs-5"></i>
              </Link>
              <Link 
                href="https://www.instagram.com/lehconnect?igsh=MWJ2NnVsd3o3bzZ2Nw%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover-text-orange"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram fs-5"></i>
              </Link>
              <Link 
                href="https://www.youtube.com/@lehconnect" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover-text-orange"
                aria-label="YouTube"
              >
                <i className="fa-brands fa-youtube fs-5"></i>
              </Link>
              <Link 
                href="https://www.linkedin.com/company/lehconnect" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover-text-orange"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin fs-5"></i>
              </Link>
            </div>
          </div>

          {/* Booking Services Links */}
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 fw-bold text-white mb-3">Quick Links</h3>
            <Link href={ROUTES.HOME} className="footer-link">Home</Link>
            <Link href={ROUTES.ABOUT} className="footer-link">About Us</Link>
            <Link href={ROUTES.CONTACT} className="footer-link">Contact Us</Link>
            <Link href={ROUTES.CAB_SEARCH} className="footer-link">Cab Bookings</Link>
            <Link href={ROUTES.HOTEL_SEARCH} className="footer-link">Hotels Enquery</Link>
            <Link href={ROUTES.FLIGHT_SEARCH} className="footer-link">Flight Enquery</Link>
            <Link href={ROUTES.HOLIDAY_SEARCH} className="footer-link">Holiday Packages</Link>
            <Link href={ROUTES.BUS_SEARCH} className="footer-link">Bus Enquery</Link>
            <Link href={ROUTES.TRAIN_ENQUIRY} className="footer-link">Train Enquiry & PNR Status</Link>
          </div>

          {/* Legal / Policy Links */}
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 fw-bold text-white mb-3">Policies & Trust</h3>
            <Link href={ROUTES.PRIVACY} className="footer-link">Privacy Policy</Link>
            <Link href={ROUTES.TERMS} className="footer-link">Terms & Conditions</Link>
            <Link href={ROUTES.REFUND} className="footer-link">Refund Policy</Link>
            <Link href={ROUTES.CANCELLATION} className="footer-link">Cancellation Policy</Link>
            <Link href={ROUTES.COOKIES} className="footer-link">Cookies Policy</Link>
            <Link href={ROUTES.DISCLAIMER} className="footer-link">Disclaimer</Link>
          </div>

          {/* Newsletter Subscribe */}
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 fw-bold text-white mb-3">Join Our Newsletter</h3>
            <p className="fs-7 text-muted mb-3">
              Subscribe to get exclusive discount coupons, travel guides, and top-rated Ladakh tour offers directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="input-group mb-3">
              <input 
                type="email" 
                className="form-control bg-dark border-secondary text-white fs-7 py-2" 
                placeholder="Your email address" 
                aria-label="Your email address"
                id="newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-warning py-2 text-dark fw-bold" type="submit" aria-label="Subscribe to newsletter" title="Subscribe to newsletter">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
            <span className="fs-8 text-muted">We respect your privacy. Unsubscribe anytime.</span>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom text-center text-muted">
          <p className="mb-0">
           © 2026 Lehconnect. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
