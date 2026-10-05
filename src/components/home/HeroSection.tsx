'use client';

import React from 'react';
import { useBooking } from '../../context/BookingContext';

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  mobileImage?: string;
  desktopImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  mobileImage = '/images/gallery/gallery-scenic-ladakh-mobile.webp',
  desktopImage = '/images/gallery/gallery-scenic-ladakh.webp'
}) => {
  const { t } = useBooking();

  const displayTitle = title || t('hero_title');
  const displaySubtitle = subtitle || t('hero_subtitle');

  return (
    <section className="leh-hero-section">
      <picture className="leh-hero-bg-picture">
        <source media="(max-width: 768px)" srcSet={mobileImage} type="image/webp" />
        <source media="(min-width: 769px)" srcSet={desktopImage} type="image/webp" />
        <img
          src={mobileImage}
          alt="Scenic Ladakh Himalayas Travel"
          width={768}
          height={400}
          fetchPriority="high"
          decoding="async"
          className="leh-hero-bg-img"
        />
      </picture>
      <div className="leh-hero-overlay" />
      <div className="container position-relative leh-hero-content">
        <h2 className="leh-hero-title">{displayTitle}</h2>
        <p className="leh-hero-subtitle">{displaySubtitle}</p>
      </div>
    </section>
  );
};

export default HeroSection;
