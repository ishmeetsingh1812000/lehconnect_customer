'use client';

import React from 'react';
import { useNavigate, useLocation } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const HolidaySuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings } = useBooking();
  
  // Retrieve the booking details from navigation state, or fallback to latest holiday booking
  const booking = location.state?.booking || bookings?.find(b => b.type === 'holiday') || bookings?.[0];

  if (!booking) {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="card p-5 border-0 shadow-sm rounded-4 bg-white text-center" style={{ maxWidth: '500px' }}>
          <div className="fs-1 text-muted mb-3"><i className="fa-regular fa-clipboard"></i></div>
          <h4 className="fw-bold text-dark mb-2">No Booking Record Found</h4>
          <p className="text-secondary fs-8 mb-4">You have not completed a booking in this session.</p>
          <button className="btn btn-primary rounded-pill px-4 py-2.5 fw-bold" style={{ backgroundColor: '#0061ae' }} onClick={() => navigate(ROUTES.HOME)}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    toast.success('Itinerary and Voucher sent to your WhatsApp number!');
  };

  return (
    <div className="bg-light min-vh-100 py-5 text-start">
      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Success Header Card */}
        <div className="card p-5 border-0 shadow-sm bg-white rounded-4 text-center mb-4">
          <div className="text-success mb-3" style={{ fontSize: '64px' }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h2 className="fw-black text-dark mb-2">Holiday Package Confirmed!</h2>
          <p className="text-secondary fs-8 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Thank you for booking with LehConnect! Your official holiday travel voucher, 5-star hotel confirmation, and private chauffeur details have been sent to <b>{booking.contact?.email}</b> and via WhatsApp to <b>{booking.contact?.phone}</b>.
          </p>
          
          <div className="d-inline-flex align-items-center gap-2 bg-light px-4 py-2.5 rounded-pill border border-dashed border-success">
            <span className="text-muted fs-8">Booking Reference ID: </span>
            <strong className="text-success font-monospace fs-7">{booking.id}</strong>
          </div>
        </div>

        {/* Action Buttons: Print & WhatsApp */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <button onClick={handlePrint} className="btn btn-outline-secondary rounded-pill px-4 py-2 fs-8 fw-bold bg-white shadow-sm">
            <i className="fa-solid fa-print me-2"></i> Print / Save Voucher PDF
          </button>
          <button onClick={handleWhatsApp} className="btn btn-success rounded-pill px-4 py-2 fs-8 fw-bold shadow-sm">
            <i className="fa-brands fa-whatsapp me-2"></i> Receive Updates on WhatsApp
          </button>
        </div>

        {/* Package & Tour Summary Card */}
        <div className="card p-4 border rounded-4 shadow-sm bg-white mb-4">
          <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Tour Summary & Itinerary</h5>
          
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <span className="text-muted fs-9 text-uppercase fw-bold d-block">Package Title</span>
              <strong className="text-dark fs-7 d-block mt-0.5">{booking.title}</strong>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted fs-9 text-uppercase fw-bold d-block"><i className="fa-solid fa-calendar-days me-1 text-primary"></i> Departure Date</span>
              <strong className="text-dark fs-7 d-block mt-0.5">{booking.date}</strong>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted fs-9 text-uppercase fw-bold d-block"><i className="fa-solid fa-compass me-1 text-primary"></i> Duration</span>
              <strong className="text-dark fs-7 d-block mt-0.5">{booking.duration}</strong>
            </div>
          </div>

          <div className="row g-3 border-top pt-3">
            <div className="col-md-6">
              <span className="text-muted fs-9 text-uppercase fw-bold d-block"><i className="fa-solid fa-hotel me-1 text-primary"></i> Accommodations</span>
              <span className="fs-8 text-dark d-block mt-1">
                {booking.hotelName || '5-Star Luxury Resort'} ({booking.selectedRoom || 'Deluxe Room'}) • Daily Breakfast Included
              </span>
            </div>
            <div className="col-md-6">
              <span className="text-muted fs-9 text-uppercase fw-bold d-block"><i className="fa-solid fa-car me-1 text-primary"></i> Private Transfers</span>
              <span className="fs-8 text-dark d-block mt-1">
                {booking.transferType || 'Private Chauffeur AC Cab'} • Airport & Sightseeing Transfers
              </span>
            </div>
          </div>

          {/* Travelers Details */}
          <div className="border-top pt-3 mt-3">
            <span className="text-muted fs-9 text-uppercase fw-bold d-block mb-2">Registered Travelers</span>
            <div className="d-flex flex-wrap gap-3">
              {(booking.travelers || []).map((t, idx) => (
                <div key={idx} className="p-2.5 bg-light rounded-3 border fs-8 text-dark d-flex align-items-center gap-2">
                  <i className="fa-solid fa-user text-muted me-1"></i> <b>{t.title} {t.firstName} {t.lastName}</b> (Age: {t.age}, {t.gender})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Receipt Card */}
        <div className="card p-4 border rounded-4 shadow-sm bg-white mb-4">
          <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Payment Receipt</h5>
          
          <div className="d-flex justify-content-between fs-8 text-secondary mb-2">
            <span>Base Package Total ({booking.guestsCount} Travelers)</span>
            <span className="fw-semibold text-dark">₹{booking.pricing?.basePackageTotal?.toLocaleString()}</span>
          </div>

          {booking.pricing?.totalAddons > 0 && (
            <div className="d-flex justify-content-between fs-8 text-secondary mb-2">
              <span>Add-ons & Travel Insurance</span>
              <span className="fw-semibold text-dark">+ ₹{booking.pricing.totalAddons.toLocaleString()}</span>
            </div>
          )}

          {booking.pricing?.discount > 0 && (
            <div className="d-flex justify-content-between fs-8 text-success mb-2">
              <span>Promotional Discount Applied</span>
              <span className="fw-semibold">- ₹{booking.pricing.discount.toLocaleString()}</span>
            </div>
          )}

          <div className="d-flex justify-content-between fs-8 text-secondary mb-2">
            <span>Applicable GST & Government Taxes (5%)</span>
            <span className="fw-semibold text-dark">₹{booking.pricing?.gstTax?.toLocaleString()}</span>
          </div>

          <div className="d-flex justify-content-between fs-7 fw-bold text-dark pt-2 border-top mb-3">
            <span>Total Package Value</span>
            <span>₹{booking.pricing?.grandTotal?.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-success-subtle rounded-3 border border-success-subtle d-flex justify-content-between align-items-center">
            <div>
              <span className="fs-8 text-success fw-bold d-block">Amount Successfully Paid Now</span>
              <small className="text-muted">Payment Method: {booking.pricing?.paymentMethod?.toUpperCase()} • Status: Completed</small>
            </div>
            <div className="fs-5 fw-black text-success">
              ₹{booking.pricing?.paidNow?.toLocaleString()}
            </div>
          </div>

          {booking.pricing?.remainingDue > 0 && (
            <div className="mt-2 p-2.5 bg-warning-subtle rounded-3 text-warning-emphasis fs-8 d-flex justify-content-between align-items-center">
              <span>Remaining Balance (Due 7 days before departure):</span>
              <b>₹{booking.pricing.remainingDue.toLocaleString()}</b>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="d-flex flex-wrap justify-content-between gap-3">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="btn btn-outline-secondary rounded-pill px-4 py-2.5 fs-8 fw-bold"
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Return to Home
          </button>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD_BOOKINGS)}
            className="btn btn-primary rounded-pill px-4 py-2.5 fs-8 fw-bold"
            style={{ backgroundColor: '#0061ae' }}
          >
            View in My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolidaySuccess;

