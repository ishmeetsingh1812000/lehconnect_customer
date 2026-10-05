'use client';

import React from 'react';
import { OfferItem } from './types';
import { offersDataList } from './homeData';

export interface AllOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers?: OfferItem[];
  onCopyCoupon?: (code: string) => void;
}

export const AllOffersModal: React.FC<AllOffersModalProps> = ({
  isOpen,
  onClose,
  offers = offersDataList,
  onCopyCoupon
}) => {
  if (!isOpen) return null;

  const handleApplyCoupon = (code: string) => {
    if (onCopyCoupon) {
      onCopyCoupon(code);
    }
    onClose();
  };

  return (
    <div
      className="modal fade show d-block leh-style-auto-1155"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg leh-style-auto-1156">
          <div className="modal-header border-bottom bg-light px-4 py-3 d-flex justify-content-between align-items-center">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2 mb-0">
              <i className="fa-solid fa-tags text-primary me-2"></i> All Offers & Coupons
            </h5>
            <button
              type="button"
              className="btn-close leh-style-auto-1020"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body p-4 bg-light leh-style-auto-1157">
            <p className="text-muted fs-8 mb-4 text-start">
              Click &quot;BOOK NOW&quot; or copy code to apply directly at checkout for extra savings.
            </p>
            <div className="row g-3">
              {offers.map((offer) => (
                <div className="col-md-6" key={offer.code}>
                  <div className="card border-0 shadow-sm h-100 overflow-hidden leh-style-auto-1158">
                    <div className="d-flex h-100 align-items-stretch">
                      <img
                        src={offer.img}
                        alt={offer.title}
                        width={130}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="leh-style-auto-1159"
                      />
                      <div className="p-3 d-flex flex-column justify-content-between flex-grow-1 text-start leh-style-auto-1045">
                        <div>
                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <span className="badge bg-primary text-uppercase fs-9 fw-bold">
                              {offer.category === 'all' ? 'general' : offer.category}
                            </span>
                            <span className="text-muted fw-bold leh-style-auto-1086">{offer.exp}</span>
                          </div>
                          <h6 className="fw-bold text-dark fs-7 mt-2 mb-1">{offer.title}</h6>
                          <p className="text-muted fs-8 mb-0 leh-style-auto-1160">
                            {offer.desc}
                          </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-3 flex-wrap gap-2">
                          <code className="fw-bold fs-8 bg-light px-2 py-1 rounded leh-style-auto-1161">
                            {offer.code}
                          </code>
                          <button
                            onClick={() => handleApplyCoupon(offer.code)}
                            className="btn btn-sm btn-primary fw-bold text-uppercase fs-9 px-3 py-1_5 leh-style-auto-1032"
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer border-top bg-light justify-content-end px-4 py-2">
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

export default AllOffersModal;
