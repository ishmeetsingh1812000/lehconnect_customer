'use client';

import React, { useRef } from 'react';
import { TestimonialItem } from './types';
import { testimonialsData } from './homeData';

export interface TestimonialsSectionProps {
  tag?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  testimonials?: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  tag = 'TESTIMONIALS',
  titlePrefix = 'What ',
  titleHighlight = 'Clients Say',
  testimonials = testimonialsData
}) => {
  const testimonialsCarouselRef = useRef<HTMLDivElement>(null);

  const scrollTestimonialsCarousel = (direction: 'left' | 'right') => {
    if (testimonialsCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = testimonialsCarouselRef.current;
      const step = 380;
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          testimonialsCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          testimonialsCarouselRef.current.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          testimonialsCarouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          testimonialsCarouselRef.current.scrollBy({ left: -step, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <section className="py-5 leh-style-auto-1122">
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
          {/* Custom Carousel Arrows */}
          <div className="d-flex gap-2">
            <button
              type="button"
              aria-label="Scroll testimonials left"
              onClick={() => scrollTestimonialsCarousel('left')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              aria-label="Scroll testimonials right"
              onClick={() => scrollTestimonialsCarousel('right')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div
          ref={testimonialsCarouselRef}
          className="d-flex overflow-auto gap-4 pb-3 scroll-bar-hidden leh-style-auto-1117"
        >
          {testimonials.map((item) => (
            <div className="flex-shrink-0 leh-style-auto-1118" key={item.id}>
              <div className="bg-white p-4 border rounded-4 shadow-sm text-start d-flex flex-column justify-content-between h-100 leh-style-auto-1144">
                <div>
                  <div className="text-warning mb-2 leh-style-auto-1145">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <i key={i} className="fa-solid fa-star me-0.5"></i>
                    ))}
                  </div>
                  <p className="text-muted fs-8 mb-4">"{item.comment}"</p>
                </div>
                <div className="d-flex align-items-center gap-3 border-top pt-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="rounded-circle leh-style-auto-1146"
                  />
                  <div>
                    <h3 className="fw-bold text-dark mb-0 fs-7">{item.name}</h3>
                    <small className="text-muted fs-9">{item.role}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
