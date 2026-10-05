'use client';

import React, { useRef } from 'react';
import { useBooking } from '../../context/BookingContext';
import { OfferItem } from './types';
import { offersDataList } from './homeData';

export interface OffersSectionProps {
  offers?: OfferItem[];
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  onViewAllClick?: () => void;
  onCopyCoupon?: (code: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers = offersDataList,
  currentTab = 'all',
  onTabChange,
  onViewAllClick,
  onCopyCoupon
}) => {
  const { t, language } = useBooking();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const scrollAmount = direction === 'left'
        ? (isMobile ? -carouselRef.current.clientWidth : -440)
        : (isMobile ? carouselRef.current.clientWidth : 440);
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const filteredOffers = offers.filter(
    (o) => currentTab === 'all' || o.category === currentTab
  );

  return (
    <section className="container mb-5">
      <div className="leh-offers-container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-dark mb-0">{t('offers')}</h3>
          <div className="d-flex align-items-center gap-3">
            {onViewAllClick && (
              <button
                type="button"
                onClick={onViewAllClick}
                className="btn btn-link fw-bold text-decoration-none fs-8 text-uppercase tracking-wider p-0 border-0 leh-style-auto-1020"
              >
                VIEW ALL <i className="fa-solid fa-arrow-right ms-1"></i>
              </button>
            )}
            <div className="d-flex gap-2">
              <button
                type="button"
                aria-label="Scroll offers left"
                onClick={() => scrollCarousel('left')}
                className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center leh-carousel-nav-btn leh-style-auto-1109"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                aria-label="Scroll offers right"
                onClick={() => scrollCarousel('right')}
                className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center leh-carousel-nav-btn leh-style-auto-1109"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="leh-offers-tabs mb-4">
          <button
            onClick={() => handleTabClick('all')}
            className={`leh-offers-tab-btn ${currentTab === 'all' ? 'active' : ''}`}
          >
            {language === 'hi' ? 'सभी ऑफ़र' : language === 'lad' ? 'Phan-thogs' : 'All'}
          </button>
          <button
            onClick={() => handleTabClick('cabs')}
            className={`leh-offers-tab-btn ${currentTab === 'cabs' ? 'active' : ''}`}
          >
            {t('cabs')}
          </button>
          <button
            onClick={() => handleTabClick('hotels')}
            className={`leh-offers-tab-btn ${currentTab === 'hotels' ? 'active' : ''}`}
          >
            {t('hotels')}
          </button>
          <button
            onClick={() => handleTabClick('flights')}
            className={`leh-offers-tab-btn ${currentTab === 'flights' ? 'active' : ''}`}
          >
            {t('flights')}
          </button>
          <button
            onClick={() => handleTabClick('holidays')}
            className={`leh-offers-tab-btn ${currentTab === 'holidays' ? 'active' : ''}`}
          >
            {t('holidays')}
          </button>
          <button
            onClick={() => handleTabClick('bus')}
            className={`leh-offers-tab-btn ${currentTab === 'bus' ? 'active' : ''}`}
          >
            {t('bus')}
          </button>
          <button
            onClick={() => handleTabClick('train')}
            className={`leh-offers-tab-btn ${currentTab === 'train' ? 'active' : ''}`}
          >
            {t('train')}
          </button>
          <button
            onClick={() => handleTabClick('visa')}
            className={`leh-offers-tab-btn ${currentTab === 'visa' ? 'active' : ''}`}
          >
            {t('visa')}
          </button>
          <button
            onClick={() => handleTabClick('insurance')}
            className={`leh-offers-tab-btn ${currentTab === 'insurance' ? 'active' : ''}`}
          >
            {t('insurance')}
          </button>
        </div>

        {/* Carousel */}
        <div className="leh-offers-carousel" ref={carouselRef}>
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <div className="leh-offers-carousel-item" key={offer.code}>
                <div className="leh-offer-card">
                  <img
                    src={offer.img}
                    alt={offer.title}
                    width={130}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="leh-offer-card-img"
                  />
                  <div className="leh-offer-card-body d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <span className="text-muted fw-bold fs-9 text-uppercase tracking-wider d-block">
                        {offer.exp}
                      </span>
                      <h3 className="fw-bold text-dark fs-7 mt-1 mb-2">{offer.title}</h3>
                      <p className="fs-8 text-muted mb-0">{offer.desc}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-2 w-100">
                      <code className="fw-bold fs-7 leh-nowrap">{offer.code}</code>
                      <button
                        onClick={() => onCopyCoupon && onCopyCoupon(offer.code)}
                        className="btn btn-sm btn-link fw-bold text-decoration-none fs-8 p-0 leh-btn-coupon"
                      >
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-100 py-4 text-center text-muted fs-8">
              No active promotional offers available for this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
