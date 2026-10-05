'use client';

import React from 'react';
import { instaPhotos } from './homeData';

export interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos?: string[];
  activePhotoIndex: number | null;
  setActivePhotoIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const InstagramModal: React.FC<InstagramModalProps> = ({
  isOpen,
  onClose,
  photos = instaPhotos,
  activePhotoIndex,
  setActivePhotoIndex
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block leh-style-auto-1162"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className={`modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable ${
          activePhotoIndex !== null ? 'leh-insta-modal-detail' : 'leh-insta-modal-grid'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg text-white leh-style-auto-1163">
          {/* Header */}
          <div className="modal-header border-bottom border-secondary px-4 py-3 d-flex justify-content-between align-items-center leh-style-auto-1164">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2 mb-0">
              <i className="fa-brands fa-instagram me-1.5 leh-style-auto-1165"></i>
              {activePhotoIndex !== null
                ? `Photo ${activePhotoIndex + 1} of ${photos.length}`
                : 'Follow Our Journey - Photo Gallery'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white leh-style-auto-1020"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 text-center leh-style-auto-1166">
            {activePhotoIndex !== null ? (
              /* Lightbox View */
              <div className="position-relative d-flex flex-column align-items-center justify-content-center py-2">
                {/* Photo View */}
                <div className="position-relative overflow-hidden rounded-3 shadow leh-style-auto-1167">
                  <img
                    src={photos[activePhotoIndex]}
                    alt={`LehConnect Large Photo ${activePhotoIndex + 1}`}
                    width={600}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="img-fluid object-fit-contain rounded-3 leh-style-auto-1168"
                  />
                </div>

                {/* Left/Right controls inside modal */}
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === null || prev === 0 ? photos.length - 1 : prev - 1
                    )
                  }
                  className="btn btn-dark rounded-circle position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center leh-style-auto-1169"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === null || prev === photos.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="btn btn-dark rounded-circle position-absolute end-0 top-50 translate-middle-y d-flex align-items-center justify-content-center leh-style-auto-1169"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>

                {/* Back to Grid button */}
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="btn btn-sm btn-outline-light rounded-pill px-4 py-2 mt-4 fw-bold leh-style-auto-1022"
                >
                  Back to Grid View
                </button>
              </div>
            ) : (
              /* Grid View */
              <div>
                <p className="text-muted fs-8 mb-4 text-start">
                  Browse our travel highlights and click on any photo to see it in full view.
                </p>
                <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-4 justify-content-center">
                  {photos.map((photo, idx) => (
                    <div className="col" key={idx}>
                      <div
                        onClick={() => setActivePhotoIndex(idx)}
                        className="position-relative overflow-hidden rounded-3 cursor-pointer shadow-sm card-hover-shadow leh-style-auto-1170"
                      >
                        <img
                          src={photo}
                          alt={`LehConnect Gallery Post ${idx + 1}`}
                          width={250}
                          height={200}
                          loading="lazy"
                          decoding="async"
                          className="w-100 h-100 object-fit-cover rounded-3"
                        />
                        <div className="position-absolute inset-0 d-flex align-items-center justify-content-center insta-hover-overlay">
                          <i className="fa-solid fa-magnifying-glass text-white fs-4"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary justify-content-between px-4 py-2 leh-style-auto-1164">
            <span className="text-muted fs-8">LehConnect Instagram Highlights</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm fw-bold px-4 py-2 leh-style-auto-1032"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramModal;
