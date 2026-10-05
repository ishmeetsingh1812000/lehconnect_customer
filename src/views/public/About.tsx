'use client';

import React from 'react';
import Link from '../../components/Link';
import { ROUTES } from '../../constants/routes';

export const About = () => {
  return (
    <div className="leh-about-page py-4">
      <div className="container">
        
        {/* Hero Header Card Wrapper */}
        <section className="leh-about-hero-card text-start text-white position-relative overflow-hidden mb-5 rounded-4">
          <div className="leh-about-hero-overlay position-absolute top-0 start-0 w-100 h-100"></div>
          <div className="position-relative z-index-2 py-5 px-4 px-md-5">
            <div className="row align-items-center">
              <div className="col-lg-7 py-3">
                <span className="text-warning fw-bold text-uppercase tracking-wider fs-9 d-block mb-2">OUR JOURNEY</span>
                <h1 className="fw-black text-white mb-3 display-5">
                  About <span className="text-warning">LehConnect</span>
                </h1>
                <p className="text-white-50 fs-7 mb-4 lh-lg">
                  Connecting travelers with seamless high-altitude adventures, luxury stay provisions, and verified local commutes across Ladakh and neighboring regions.
                </p>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div className="leh-about-hero-badge">
                    <i className="fa-solid fa-shield-halved text-white fs-6"></i>
                    <div>
                      <h6 className="fw-bold mb-0 text-white fs-8">Trusted by Thousands</h6>
                      <span className="text-white-50 fs-9">Safe, Reliable & Verified</span>
                    </div>
                  </div>
                  <div className="leh-about-hero-badge">
                    <i className="fa-solid fa-location-dot text-white fs-6"></i>
                    <div>
                      <h6 className="fw-bold mb-0 text-white fs-8">Local Strong Network</h6>
                      <span className="text-white-50 fs-9">Ladakh & Nearby Regions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="mb-5 py-2">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 text-start">
              <span className="  fw-bold text-uppercase tracking-wider fs-9 d-block mb-2">WHO WE ARE</span>
              <h2 className="fw-bold text-dark mb-4 display-6">Your Trusted Travel Companion Since Day One</h2>
              <p className="text-muted fs-7 mb-3 lh-lg">
                LehConnect is a comprehensive premium travel booking platform designed to bridge the travel infrastructure gap in high-altitude zones. Founded with a vision to streamline outstation commutes and premium stays, we connect travelers directly with registered, rated local transport partners and handpicked boutique hotels.
              </p>
              <p className="text-muted fs-7 mb-4 lh-lg">
                Headquartered in Jaipur with operational base camps in Leh, we manage local SUV rentals, luxury car hires, domestic & international flights, and customizable tour packages. Every booking made with LehConnect directly contributes to the local Himalayan communities by working hand-in-hand with local driver unions and homestay guilds.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="leh-about-local-badge">
                  <div className="leh-about-badge-icon-circle">
                    <i className="fa-solid fa-handshake   fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark fs-8">Local Alliance</h6>
                    <span className="fs-9 text-muted">100% Certified Local Partners</span>
                  </div>
                </div>
                <div className="leh-about-local-badge">
                  <div className="leh-about-badge-icon-circle">
                    <i className="fa-solid fa-location-dot   fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark fs-8">Jaipur Base</h6>
                    <span className="fs-9 text-muted">D-6, Rani Sathi Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative p-2">
                <img src="/images/about/about-monastery.webp" 
                  alt="About LehConnect Monastery" 
                  className="img-fluid rounded-4 shadow-md w-100 object-fit-cover leh-about-mockup-img" 
                loading="lazy" decoding="async" />
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 w-90 text-center">
                  <div className="bg-white rounded-pill shadow-sm py-2 px-4 d-inline-block text-dark fs-8 fw-semibold border border-light">
                    Building Local • Empowering Communities • Creating Unforgettable Journeys
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-5 mb-5 border-top">
          <div className="text-center py-3">
            <span className="  fw-bold text-uppercase tracking-wider fs-9 d-block mb-2">OUR PILLARS</span>
            <h2 className="fw-bold text-dark mb-3">Values That Drive Us</h2>
            <div className="leh-about-section-divider mb-5">
              <span className="line"></span>
              <span className="dots"><i className="fa-solid fa-compass   fs-7"></i></span>
              <span className="line"></span>
            </div>
            
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="leh-about-value-card text-center">
                  <div className="leh-about-value-icon-box">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <h5 className="fw-bold mb-3 fs-7 text-dark">Safety Standards</h5>
                  <p className="text-muted fs-8 mb-0 lh-lg">
                    Certified SUV fleets with experienced high-altitude mountain drivers, GPS tracking, and oxygen support kits.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="leh-about-value-card text-center">
                  <div className="leh-about-value-icon-box">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h5 className="fw-bold mb-3 fs-7 text-dark">Community First</h5>
                  <p className="text-muted fs-8 mb-0 lh-lg">
                    Keeping tourism earnings directly in local hands by partnering with local service associations and homestays.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="leh-about-value-card text-center">
                  <div className="leh-about-value-icon-box">
                    <i className="fa-solid fa-compass"></i>
                  </div>
                  <h5 className="fw-bold mb-3 fs-7 text-dark">Customized Travel</h5>
                  <p className="text-muted fs-8 mb-0 lh-lg">
                    Tailored holiday packages designed by travel experts to match your speed, comfort preference, and budget.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="leh-about-value-card text-center">
                  <div className="leh-about-value-icon-box">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <h5 className="fw-bold mb-3 fs-7 text-dark">Honest Pricing</h5>
                  <p className="text-muted fs-8 mb-0 lh-lg">
                    Zero hidden transaction fees, transparent cancellation policies, and guaranteed best rates for local bookings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Timeline */}
        <section className="mb-5 text-center">
          <span className="  fw-bold text-uppercase tracking-wider fs-9 d-block mb-2">GROWTH TIMELINE</span>
          <h2 className="fw-bold text-dark mb-3">Our Journey Through Time</h2>
          <div className="leh-about-section-divider mb-5">
            <span className="line"></span>
            <span className="dots"><i className="fa-solid fa-timeline   fs-7"></i></span>
            <span className="line"></span>
          </div>
          
          <div className="leh-about-timeline">
            <div className="leh-about-timeline-item left">
              <div className="content">
                <div className="d-flex align-items-center gap-3 mb-2 justify-content-end text-end">
                  <div className="timeline-title-block">
                    <span className="year">2023</span>
                    <h5 className="fw-bold mb-0 text-dark fs-7">Company Foundation</h5>
                  </div>
                  <div className="timeline-icon-box">
                    <i className="fa-solid fa-building"></i>
                  </div>
                </div>
                <p className="text-muted fs-8 mb-0 lh-lg">
                  Conceptualized in Jaipur to solve complex outstation commute issues and high-altitude hotel discovery gaps for travelers.
                </p>
              </div>
            </div>
            
            <div className="leh-about-timeline-item right">
              <div className="content">
                <div className="d-flex align-items-center gap-3 mb-2 justify-content-start text-start">
                  <div className="timeline-icon-box">
                    <i className="fa-solid fa-car"></i>
                  </div>
                  <div className="timeline-title-block">
                    <span className="year">2024</span>
                    <h5 className="fw-bold mb-0 text-dark fs-7">Cab Network Launch</h5>
                  </div>
                </div>
                <p className="text-muted fs-8 mb-0 lh-lg">
                  Partnered directly with local taxi guilds to launch verified SUV rentals, outstation cabs, and local sightseeing drives.
                </p>
              </div>
            </div>
            
            <div className="leh-about-timeline-item left">
              <div className="content">
                <div className="d-flex align-items-center gap-3 mb-2 justify-content-end text-end">
                  <div className="timeline-title-block">
                    <span className="year">2025</span>
                    <h5 className="fw-bold mb-0 text-dark fs-7">Hotel & Flight Integration</h5>
                  </div>
                  <div className="timeline-icon-box">
                    <i className="fa-solid fa-plane"></i>
                  </div>
                </div>
                <p className="text-muted fs-8 mb-0 lh-lg">
                  Integrated luxury boutique stays, flights, and customized holiday packages, creating a unified booking experience.
                </p>
              </div>
            </div>
            
            <div className="leh-about-timeline-item right">
              <div className="content">
                <div className="d-flex align-items-center gap-3 mb-2 justify-content-start text-start">
                  <div className="timeline-icon-box">
                    <i className="fa-solid fa-rocket"></i>
                  </div>
                  <div className="timeline-title-block">
                    <span className="year">2026</span>
                    <h5 className="fw-bold mb-0 text-dark fs-7">Digital Transformation</h5>
                  </div>
                </div>
                <p className="text-muted fs-8 mb-0 lh-lg">
                  Upgraded to a fully responsive, state-of-the-art web application serving thousands of travelers monthly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-4">
          <div className="leh-about-cta-banner text-start text-white py-5 px-4 px-md-5 rounded-4 overflow-hidden position-relative">
            <div className="leh-about-hero-overlay position-absolute top-0 start-0 w-100 h-100"></div>
            <div className="position-relative z-index-2 py-4">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h2 className="fw-bold text-white mb-2 display-6">
                    Plan Your Next <span className="text-warning">Himalayan</span> Getaway
                  </h2>
                  <p className="text-white-50 fs-7 mb-4 lh-lg">
                    Explore hand-crafted holiday packages, secure luxury stays, and book clean outstation cabs with verified mountain drivers.
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <Link to={ROUTES.HOLIDAY_SEARCH} className="btn btn-premium-primary rounded-pill px-4 py-2_5 fs-8">
                      Holiday Packages <i className="fa-solid fa-chevron-right ms-1 fs-9"></i>
                    </Link>
                    <Link to={ROUTES.CAB_SEARCH} className="btn btn-premium-secondary rounded-pill px-4 py-2_5 fs-8 text-dark">
                      Book Cabs <i className="fa-solid fa-chevron-right ms-1 fs-9"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;

