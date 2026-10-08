'use client';

import React from 'react';
import Link from '../../components/Link';
import { useLocation, useNavigate } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const CabSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings } = useBooking();
  const booking = location.state?.booking || bookings?.find(b => b.type === 'cab') || bookings?.[0];

  const handleDownload = () => {
    toast.success('Downloading Invoice PDF...');
  };

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold">Booking Details Not Found</h4>
        <Link to={ROUTES.HOME} className="btn btn-primary rounded-pill mt-3 px-4 py-2 border-0 leh-style-auto-1060">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white mx-auto text-start leh-style-auto-1094">
          
          {/* Dark Blue Header Banner (Same style as listing recap) */}
          <div className="position-relative overflow-hidden text-white p-4 leh-style-auto-1095">
            <div className="position-absolute start-0 top-0 w-100 h-100 leh-style-auto-1079" />
            
            <div className="position-relative d-flex align-items-center justify-content-between flex-wrap gap-3 leh-style-auto-1080">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center leh-style-auto-1096"><i className="fa-solid fa-check"></i></div>
                <div>
                  <h4 className="fw-bold mb-1">Booking Confirmed!</h4>
                  <p className="text-white-50 fs-8 mb-0">
                    {booking.isHourly || booking.tripType === 'hourly'
                      ? 'Your local hourly rental cab is successfully scheduled.'
                      : 'Your outstation cab is successfully scheduled.'}
                  </p>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 border border-white border-opacity-25 rounded-3 px-3 py-2 text-md-end">
                <small className="text-white-50 fs-9 d-block text-uppercase fw-bold tracking-wider">BOOKING ID</small>
                <span className="fw-bold text-white fs-7">{booking.id}</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Receipt Summary Grid */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-3 fs-7 border-bottom pb-2">Booking Receipt Summary</h6>
              
              <div className="row g-3">
                <div className="col-sm-6 text-start">
                  <span className="text-muted fs-9 d-block text-uppercase fw-bold">
                    {booking.isHourly || booking.tripType === 'hourly' ? 'Service & Package' : 'Route Details'}
                  </span>
                  <span className="fw-bold text-dark fs-7">
                    {booking.isHourly || booking.tripType === 'hourly' 
                      ? `${booking.from} • ${booking.package || booking.to}` 
                      : `${booking.from} to ${booking.to}`}
                  </span>
                  {booking.pickupLandmark && (
                    <small className="text-muted d-block fs-9 mt-0.5">Pickup at: {booking.pickupLandmark}</small>
                  )}
                </div>
                <div className="col-sm-6 text-start">
                  <span className="text-muted fs-9 d-block text-uppercase fw-bold">Scheduled Date & Time</span>
                  <span className="fw-bold text-dark fs-7">{booking.date} at {booking.time}</span>
                </div>
                <div className="col-sm-6 text-start">
                  <span className="text-muted fs-9 d-block text-uppercase fw-bold">Base Cab Fare</span>
                  <span className="fw-bold text-dark fs-7">₹{booking.price.toLocaleString()}</span>
                </div>
                {booking.walletDebited > 0 && (
                  <div className="col-sm-6 text-start">
                    <span className="  fs-9 d-block text-uppercase fw-bold">Paid using Wallet</span>
                    <span className="fw-bold   fs-7">- ₹{booking.walletDebited.toLocaleString()}</span>
                  </div>
                )}
                {(booking.isHourly || booking.tripType === 'hourly') && (
                  <div className="col-12 text-start">
                    <div className="p-2.5 bg-light rounded-3 border fs-9 text-secondary">
                      <strong>Hourly Overtime Terms:</strong> Extra ₹{booking.extraKmRate || 13}/km after package distance • Extra ₹{booking.extraHrRate || 120}/hr after package time. Fuel & chauffeur allowance included.
                    </div>
                  </div>
                )}
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
                <div>
                  <span className="fw-bold text-dark fs-7">
                    {booking.paymentOption === 'PARTIAL' ? 'Paid Today (30%)' : 'Total Paid Amount'}
                  </span>
                  <small className="text-muted d-block leh-style-auto-1062">All tolls and taxes included</small>
                </div>
                <h4 className="fw-black   mb-0 leh-style-auto-1098">
                  ₹{(booking.paidAmount ?? booking.price ?? 0).toLocaleString()}
                </h4>
              </div>
              {booking.paymentOption === 'PARTIAL' && Number(booking.balanceDue) > 0 && (
                <div className="d-flex justify-content-between align-items-center border border-warning-subtle bg-warning-subtle p-3 rounded-3 mt-2">
                  <span className="fw-bold text-dark fs-7">Remaining Balance</span>
                  <span className="fw-bold text-dark fs-7">
                    ₹{Number(booking.balanceDue).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-5 border-top pt-3">
              <button 
                onClick={handleDownload} 
                className="btn btn-outline-secondary rounded-pill px-4 py-2 fs-8 fw-semibold border d-flex align-items-center gap-1.5"
              >
                <i className="fa-solid fa-download me-1.5"></i> Download Invoice
              </button>
              <button onClick={() => navigate(ROUTES.DASHBOARD)} className="btn btn-primary rounded-pill px-4 py-2 fs-8 fw-bold border-0 d-flex align-items-center gap-1.5 leh-style-auto-1060">
                Go to Dashboard <i className="fa-solid fa-arrow-right ms-1"></i>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CabSuccess;
