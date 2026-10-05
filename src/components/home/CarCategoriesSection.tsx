'use client';

import React, { useRef } from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { ROUTES } from '../../constants/routes';
import { CarCategoryItem } from './types';
import { carCategoriesData } from './homeData';

export interface CarCategoriesSectionProps {
  titlePrefix?: string;
  titleHighlight?: string;
  tag?: string;
  categories?: CarCategoryItem[];
  onCategoryClick?: (filterType: string) => void;
}

export const CarCategoriesSection: React.FC<CarCategoriesSectionProps> = ({
  titlePrefix = 'Book ',
  titleHighlight = 'Car Types',
  tag = 'CATEGORIES',
  categories = carCategoriesData,
  onCategoryClick
}) => {
  const navigate = useNavigate();
  const categoryCarouselRef = useRef<HTMLDivElement>(null);

  const scrollCategoryCarousel = (direction: 'left' | 'right') => {
    if (categoryCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryCarouselRef.current;
      const step = 380;
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          categoryCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          categoryCarouselRef.current.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          categoryCarouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          categoryCarouselRef.current.scrollBy({ left: -step, behavior: 'smooth' });
        }
      }
    }
  };

  const handleCardClick = (filterType: string) => {
    if (onCategoryClick) {
      onCategoryClick(filterType);
    } else {
      navigate(ROUTES.CAB_SEARCH, { state: { filterType } });
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
              aria-label="Scroll categories left"
              onClick={() => scrollCategoryCarousel('left')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => scrollCategoryCarousel('right')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Categories Horizontal Carousel Container */}
        <div
          ref={categoryCarouselRef}
          className="d-flex overflow-auto gap-4 pb-3 scroll-bar-hidden leh-style-auto-1117"
        >
          {categories.map((item, idx) => (
            <div className="flex-shrink-0 leh-style-auto-1118" key={idx}>
              <div
                onClick={() => handleCardClick(item.filterType)}
                className="position-relative overflow-hidden rounded-4 shadow-sm card-hover-shadow cursor-pointer leh-style-auto-1123"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  width={350}
                  height={230}
                  loading="lazy"
                  decoding="async"
                  className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-3 text-start text-white leh-style-auto-1124">
                  <h3 className="fw-bold fs-6 mb-0">{item.name}</h3>
                  <span className="fs-8 opacity-75">{item.subtitle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarCategoriesSection;
