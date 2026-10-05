'use client';

import React, { useRef } from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { ServiceItem } from './types';
import { servicesData } from './homeData';

export interface ServicesSectionProps {
  titlePrefix?: string;
  titleHighlight?: string;
  tag?: string;
  services?: ServiceItem[];
  onServiceClick?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  titlePrefix = 'Our ',
  titleHighlight = 'Services',
  tag = 'WHAT WE DO',
  services = servicesData,
  onServiceClick
}) => {
  const navigate = useNavigate();
  const servicesCarouselRef = useRef<HTMLDivElement>(null);

  const scrollServicesCarousel = (direction: 'left' | 'right') => {
    if (servicesCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = servicesCarouselRef.current;
      const step = 380;
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          servicesCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          servicesCarouselRef.current.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          servicesCarouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          servicesCarouselRef.current.scrollBy({ left: -step, behavior: 'smooth' });
        }
      }
    }
  };

  const handleCardAction = (serviceId: string) => {
    if (onServiceClick) {
      onServiceClick(serviceId);
    } else {
      navigate(`/services/${serviceId}`);
    }
  };

  return (
    <section className="py-5 bg-white">
      <div className="container">
        {/* Header with Navigation Icons */}
        <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
          <div className="text-start">
            <span className="fw-bold text-uppercase tracking-wider fs-9 d-block mb-1">
              {tag}
            </span>
            <h2 className="fw-bold text-dark mb-0">
              {titlePrefix}
              <span className="leh-style-auto-1112">{titleHighlight}</span>
            </h2>
          </div>
          {/* Carousel Arrows */}
          <div className="d-flex gap-2">
            <button
              type="button"
              aria-label="Scroll services left"
              onClick={() => scrollServicesCarousel('left')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              aria-label="Scroll services right"
              onClick={() => scrollServicesCarousel('right')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Services Carousel */}
        <div
          ref={servicesCarouselRef}
          className="d-flex overflow-auto gap-4 pb-3 scroll-bar-hidden leh-style-auto-1117"
        >
          {services.map((item) => (
            <div className="flex-shrink-0 leh-style-auto-1118" key={item.id}>
              <div className="card h-100 border-0 shadow-sm overflow-hidden text-start leh-style-auto-1119">
                <div className="leh-style-auto-1120">
                  <img
                    src={item.img}
                    alt={item.title}
                    width={350}
                    height={180}
                    loading="lazy"
                    decoding="async"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="fw-bold text-dark fs-6 mb-2">{item.title}</h3>
                    <p className="text-muted fs-8">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleCardAction(item.id)}
                    className="btn btn-primary btn-sm rounded-pill fw-bold px-3 py-1_5 mt-3 text-uppercase align-self-start border-0 leh-style-auto-1121"
                  >
                    {item.linkText || 'Details'} <i className="fa-solid fa-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
