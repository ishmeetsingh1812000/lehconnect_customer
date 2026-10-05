'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES_DATA, DESTINATIONS } from '../constants/packagesData';
import { ROUTES } from '../constants/routes';

export const HolidayPackagesSection = ({ isGridMode = false }: { isGridMode?: boolean }) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('explore');

  // Active packages based on category
  const activePackages = PACKAGES_DATA[activeCategory] || PACKAGES_DATA.explore;

  const handleCardClick = (id: string | number) => {
    router.push(`/holidays/${id}`);
  };

  return (
    <section className={`py-5 ${isGridMode ? 'bg-light' : 'bg-white'}`}>
      <div className="container">
        {!isGridMode && (
          <div className="text-center mb-5">
            <span className="text-brand-primary fw-bold text-uppercase tracking-wider fs-9 d-block mb-1">
              EXCLUSIVE TOUR PACKAGES
            </span>
            <h2 className="fw-bold text-dark mb-2">
              Popular <span className="text-brand-primary">Holiday Packages</span>
            </h2>
            <p className="text-muted fs-7 max-w-2xl mx-auto">
              Choose from our handpicked tour packages across the globe, fully customizable to suit your preferences and budget.
            </p>
          </div>
        )}

        {/* Destination Tabs Selector */}
        <div className="d-flex overflow-auto gap-2 pb-3 mb-4 scroll-bar-hidden justify-content-start justify-content-md-center">
          {DESTINATIONS.slice(0, 7).map((dest) => (
            <button
              key={dest.id}
              onClick={() => setActiveCategory(dest.id)}
              className={`btn btn-sm rounded-pill px-4 py-2 border-0 fw-semibold d-flex align-items-center gap-2 ${
                activeCategory === dest.id
                  ? 'btn-primary text-white'
                  : 'btn-light text-secondary hover-bg-light'
              }`}
              style={{ whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            >
              {dest.iconClass && <i className={dest.iconClass}></i>}
              {dest.name}
              {dest.trending && (
                <span className="badge bg-danger text-white fs-9 px-1.5 py-0.5 rounded-pill">
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Package Cards Grid */}
        <div className="row g-4">
          {activePackages.slice(0, 6).map((pkg) => (
            <div className="col-md-6 col-lg-4" key={pkg.id}>
              <div 
                onClick={() => handleCardClick(pkg.id)}
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover-shadow cursor-pointer bg-white text-start d-flex flex-column"
                style={{ transition: 'all 0.3s' }}
              >
                {/* Image and Promo Badge */}
                <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                  <img
                    src={(pkg.images[0] || '/images/holidays/photo-1529963183134-61a90db47eaf.webp').replace('.jpg', '.webp')}
                    alt={pkg.title}
                    width={380}
                    height={220}
                    loading="lazy"
                    decoding="async"
                    className="w-100 h-100 object-fit-cover hover-scale"
                    style={{ transition: 'transform 0.5s' }}
                  />
                  {pkg.promoText && (
                    <span 
                      className="position-absolute start-0 top-0 badge bg-danger text-white fw-bold px-3 py-2 fs-9 rounded-bottom-end rounded-0"
                    >
                      {pkg.promoText}
                    </span>
                  )}
                  <div className="position-absolute bottom-0 end-0 bg-dark bg-opacity-70 text-white px-3 py-1.5 rounded-top-start-3 d-flex align-items-center gap-1.5 fs-8 fw-semibold">
                    <i className="fa-regular fa-clock" style={{ fontSize: '12px' }}></i> {pkg.duration}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  {/* Rating Block */}
                  <div className="d-flex align-items-center gap-1.5 mb-2.5">
                    <span className="bg-success text-white px-2 py-0.5 rounded fs-9 fw-bold d-flex align-items-center gap-1">
                      <i className="fa-solid fa-star" style={{ fontSize: '9px' }}></i> {pkg.rating}
                    </span>
                    <span className="text-secondary fs-9">({pkg.reviews} Reviews)</span>
                  </div>

                  {/* Title */}
                  <h3 className="fw-bold text-dark text-start mb-2.5 text-line-clamp-2 flex-grow-1" style={{ fontSize: '0.95rem', height: '2.7rem', overflow: 'hidden' }}>
                    {pkg.title}
                  </h3>

                  {/* Itinerary Summary */}
                  <div className="text-secondary fs-8 mb-4 text-truncate">
                    {pkg.itinerary}
                  </div>

                  {/* Pricing and Action Row */}
                  <div className="d-flex justify-content-between align-items-end border-top pt-3.5 mt-auto">
                    <div>
                      {pkg.saveAmount && (
                        <div className="text-success fs-9 fw-bold mb-0.5">
                          Save ₹{pkg.saveAmount}
                        </div>
                      )}
                      <div className="d-flex align-items-center gap-1.5">
                        <span className="text-muted text-decoration-line-through fs-8">
                          ₹{pkg.originalPrice}
                        </span>
                        <span className="fw-black text-dark fs-5">
                          ₹{pkg.actualPrice}
                        </span>
                      </div>
                      <div className="text-muted fs-9">per person</div>
                    </div>
                    <button 
                      type="button"
                      className="btn btn-sm btn-primary rounded-pill px-3.5 py-2 fw-bold d-flex align-items-center gap-1 border-0"
                      style={{ fontSize: '0.75rem' }}
                    >
                      View Details <i className="fa-solid fa-chevron-right ms-1" style={{ fontSize: '10px' }}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {!isGridMode && (
          <div className="text-center mt-5">
            <button 
              onClick={() => router.push(ROUTES.HOLIDAY_SEARCH)}
              className="btn btn-outline-primary rounded-pill px-5 py-2.5 fw-bold fs-7 border-2 d-inline-flex align-items-center gap-2"
            >
              Explore All Holiday Packages <i className="fa-solid fa-chevron-right ms-1" style={{ fontSize: '12px' }}></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HolidayPackagesSection;
