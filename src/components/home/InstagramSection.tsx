'use client';

import React, { useRef } from 'react';
import { instaPhotos } from './homeData';

export interface InstagramSectionProps {
  title?: string;
  buttonText?: string;
  photos?: string[];
  onViewAllClick?: () => void;
  onPhotoClick?: (index: number) => void;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  title = 'Follow Our Journey',
  buttonText = 'VIEW ALL ON INSTAGRAM', 
  photos = instaPhotos,
  onViewAllClick,
  onPhotoClick
}) => {
  const instaCarouselRef = useRef<HTMLDivElement>(null);

  const scrollInstaCarousel = (direction: 'left' | 'right') => {
    if (instaCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = instaCarouselRef.current;
      const step = 300;
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          instaCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          instaCarouselRef.current.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          instaCarouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          instaCarouselRef.current.scrollBy({ left: -step, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <section className="py-5 leh-style-auto-1122">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="text-start">
            <h4 className="fw-bold text-dark mb-0">{title}</h4>
          </div>

          {/* View All & Custom Carousel Arrows */}
          <div className="d-flex align-items-center gap-3">
            {onViewAllClick && (
              <button
                type="button"
                onClick={onViewAllClick}
                className="btn text-white fw-bold px-4 py-2 fs-8 text-uppercase border-0 shadow-sm leh-style-auto-1149"
              >
                {buttonText}
              </button>
            )}
            <div className="d-flex gap-2">
              <button
                type="button"
                aria-label="Scroll instagram left"
                onClick={() => scrollInstaCarousel('left')}
                className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1150"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                aria-label="Scroll instagram right"
                onClick={() => scrollInstaCarousel('right')}
                className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1150"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Instagram Photos Carousel */}
        <div
          ref={instaCarouselRef}
          className="d-flex overflow-auto gap-3 pb-2 scroll-bar-hidden leh-style-auto-1117"
        >
          {photos.map((photo, index) => (
            <div className="flex-shrink-0 leh-style-auto-1151" key={index}>
              <div
                onClick={() => onPhotoClick && onPhotoClick(index)}
                className="position-relative overflow-hidden rounded-3 shadow-sm cursor-pointer card-hover-shadow leh-style-auto-1152"
              >
                <img
                  src={photo}
                  alt={`LehConnect Himalayan journey travel photo ${index + 1}`}
                  width={230}
                  height={170}
                  loading="lazy"
                  decoding="async"
                  className="w-100 h-100 object-fit-cover leh-style-auto-1153"
                />
                <div className="position-absolute inset-0 d-flex align-items-center justify-content-center insta-hover-overlay">
                  <i className="fa-brands fa-instagram text-white fs-4"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
