'use client';

import React from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { ROUTES } from '../../constants/routes';
import { HolidayPackagesSection } from '../HolidayPackagesSection';
import {
  recentlyViewedData,
  holidayOffersData,
  lastMinuteEscapeData,
  spiritualEscapesData,
  internationalDestinationsData
} from './homeData';
import {
  RecentlyViewedPackage,
  HolidayDestinationItem
} from './types';

export interface HolidayExploreSectionProps {
  recentlyViewed?: RecentlyViewedPackage[];
  offers?: HolidayDestinationItem[];
  lastMinute?: HolidayDestinationItem[];
  spiritual?: HolidayDestinationItem[];
  international?: HolidayDestinationItem[];
}

export const HolidayExploreSection: React.FC<HolidayExploreSectionProps> = ({
  recentlyViewed = recentlyViewedData,
  offers = holidayOffersData,
  lastMinute = lastMinuteEscapeData,
  spiritual = spiritualEscapesData,
  international = internationalDestinationsData
}) => {
  const navigate = useNavigate();

  const handleScroll = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-4">
      {/* 1. Recently Viewed Packages */}
      <div className="leh-carousel-section mt-4">
        <div className="leh-carousel-header">
          <div>
            <h4 className="leh-carousel-title text-start">Recently Viewed Packages</h4>
          </div>
          <div className="leh-scroll-btn-group">
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Previous viewed packages"
              onClick={() => handleScroll('carousel-recently-viewed', 'left')}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Next viewed packages"
              onClick={() => handleScroll('carousel-recently-viewed', 'right')}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="leh-carousel-container" id="carousel-recently-viewed">
          {recentlyViewed.map((pkg, idx) => (
            <div
              className="leh-viewed-card"
              key={pkg.id || idx}
              onClick={() => navigate(`/holidays/${pkg.id}`)}
            >
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div style={{ maxWidth: '170px' }}>
                    <span
                      className="text-muted d-block uppercase"
                      style={{ fontSize: '10px', fontWeight: 'bold' }}
                    >
                      {pkg.title}
                    </span>
                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>
                      {pkg.subtitle}
                    </h6>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>
                      {pkg.details}
                    </span>
                  </div>
                  <div
                    className="position-relative"
                    style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden' }}
                  >
                    <img
                      src={pkg.img}
                      alt={pkg.subtitle}
                      width={60}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      className="w-100 h-100 object-fit-cover"
                    />
                    <span
                      className="position-absolute bottom-0 start-0 end-0 bg-primary text-white text-center fw-bold"
                      style={{ fontSize: '8px', padding: '1px 0' }}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                </div>
                <div className="border-top pt-2 mt-2">
                  <span className="fw-black text-dark fs-5">{pkg.price}</span>
                  <span className="text-muted" style={{ fontSize: '10px' }}> /person</span>
                </div>
              </div>
              <div
                className="d-flex justify-content-between align-items-center border-top pt-2 mt-3"
                style={{
                  margin: '-16px -16px -16px -16px',
                  padding: '12px 16px',
                  backgroundColor: '#f5f9ff',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px'
                }}
              >
                <span
                  className="text-secondary fw-bold"
                  style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: pkg.action === 'VIEW' ? '#999999' : '#ff9900',
                      display: 'inline-block'
                    }}
                  ></span>
                  {pkg.footer}
                </span>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none fw-bold text-brand-primary border-0 bg-transparent"
                  style={{ fontSize: '12px' }}
                >
                  {pkg.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Up to Rs 10,000 off! Offers Carousel */}
      <div className="leh-carousel-section">
        <div className="leh-carousel-header">
          <div className="text-start">
            <h4 className="leh-carousel-title mb-1">Up to Rs 10,000 off!</h4>
            <p className="leh-carousel-subtitle">
              Use Coupon Code: <strong>LEHESCAPE</strong>
            </p>
          </div>
          <div className="leh-scroll-btn-group">
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Previous offers"
              onClick={() => handleScroll('carousel-offers', 'left')}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Next offers"
              onClick={() => handleScroll('carousel-offers', 'right')}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="leh-carousel-container" id="carousel-offers">
          {offers.map((item, idx) => (
            <div
              className="leh-dest-overlay-card"
              key={idx}
              onClick={() => navigate(ROUTES.HOLIDAY_SEARCH)}
            >
              <img
                src={item.img}
                alt={item.name}
                width={200}
                height={260}
                loading="lazy"
                decoding="async"
                className="leh-dest-overlay-img"
              />
              <div className="leh-dest-gradient"></div>
              <h3 className="leh-dest-name-overlay fs-6 mb-0">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Last-Minute Escape Sale Carousel */}
      <div className="leh-carousel-section">
        <div className="leh-carousel-header">
          <div className="text-start">
            <h4 className="leh-carousel-title mb-1">Last-Minute Escape Sale!</h4>
            <p className="leh-carousel-subtitle">
              Book your spontaneous getaway. Use code: <strong>LASTMINUTE</strong>
            </p>
          </div>
          <div className="leh-scroll-btn-group">
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Previous last minute deals"
              onClick={() => handleScroll('carousel-last-minute', 'left')}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Next last minute deals"
              onClick={() => handleScroll('carousel-last-minute', 'right')}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="leh-carousel-container" id="carousel-last-minute">
          {lastMinute.map((item, idx) => (
            <div
              className="leh-dest-overlay-card"
              key={idx}
              onClick={() => navigate(ROUTES.HOLIDAY_SEARCH)}
            >
              <img
                src={item.img}
                alt={item.name}
                width={200}
                height={260}
                loading="lazy"
                decoding="async"
                className="leh-dest-overlay-img"
              />
              <div className="leh-dest-gradient"></div>
              <h3 className="leh-dest-name-overlay fs-6 mb-0">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Spiritual Escapes Carousel */}
      <div className="leh-carousel-section">
        <div className="leh-carousel-header">
          <div className="text-start">
            <h4 className="leh-carousel-title mb-1">Spiritual Escapes at Lowest prices!</h4>
            <p className="leh-carousel-subtitle">Explore Pilgrimage packages</p>
          </div>
          <div className="leh-scroll-btn-group">
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Previous spiritual tours"
              onClick={() => handleScroll('carousel-spiritual', 'left')}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Next spiritual tours"
              onClick={() => handleScroll('carousel-spiritual', 'right')}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="leh-carousel-container" id="carousel-spiritual">
          {spiritual.map((item, idx) => (
            <div
              className="leh-dest-overlay-card"
              key={idx}
              onClick={() => navigate(ROUTES.HOLIDAY_SEARCH)}
            >
              <img
                src={item.img}
                alt={item.name}
                width={200}
                height={260}
                loading="lazy"
                decoding="async"
                className="leh-dest-overlay-img"
              />
              <div className="leh-dest-gradient"></div>
              <h3 className="leh-dest-name-overlay fs-6 mb-0">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* 5. International Destinations Carousel */}
      <div className="leh-carousel-section">
        <div className="leh-carousel-header">
          <div className="text-start">
            <h4 className="leh-carousel-title mb-1">International Destinations</h4>
            <p className="leh-carousel-subtitle">From Bucket List to Boarding Pass!</p>
          </div>
          <div className="leh-scroll-btn-group">
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Previous international destinations"
              onClick={() => handleScroll('carousel-international', 'left')}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="leh-scroll-btn"
              aria-label="Next international destinations"
              onClick={() => handleScroll('carousel-international', 'right')}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="leh-carousel-container" id="carousel-international">
          {international.map((item, idx) => (
            <div
              className="leh-intl-card"
              key={idx}
              onClick={() => navigate(ROUTES.HOLIDAY_SEARCH)}
            >
              <div className="leh-intl-img-frame">
                <img
                  src={item.img}
                  alt={item.name}
                  width={200}
                  height={260}
                  loading="lazy"
                  decoding="async"
                  className="leh-dest-overlay-img"
                />
                <div className="leh-dest-gradient"></div>
              </div>
              <h3 className="leh-intl-name fs-6 mb-0">{item.name}</h3>
              <span className="leh-intl-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Holiday Packages Section */}
      <HolidayPackagesSection />
    </div>
  );
};

export default HolidayExploreSection;
