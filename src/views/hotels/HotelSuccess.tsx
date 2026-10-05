'use client';

import React from 'react';
import Link from '../../components/Link';
import { useLocation } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const HotelSuccess = () => {
  const location = useLocation();
  const { bookings } = useBooking();
  const booking = location.state?.booking || bookings?.find(b => b.type === 'hotel') || bookings?.[0];

  const handleInvoice = () => {
    toast.success('Downloading Stay Voucher Invoice...');
  };

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h4>Stay Voucher Details Not Found</h4>
        <Link to={ROUTES.HOME} className="btn btn-premium-primary mt-2">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 p-5 text-center rounded-3 bg-white mx-auto leh-style-auto-1100">
        <i className="fa-solid fa-circle-check text-success mb-3" style={{ fontSize: '60px' }}></i>
        <h2 className="fw-bold">Stay Reservation Confirmed!</h2>
        <p className="text-muted fs-7">Your booking is secured. You will receive an SMS and email voucher code shortly.</p>

        <span className="badge bg-success-subtle text-success fs-7 py-2 px-3 my-3 align-self-center">
          Voucher Code: {booking.id}
        </span>

        <div className="border rounded-3 p-3 text-start my-4 bg-light">
          <h5 className="fw-bold fs-7 mb-2 text-dark"><i className="fa-solid fa-hotel me-2"></i> {booking.title}</h5>
          <p className="text-muted fs-8 mb-2"><i className="fa-solid fa-location-dot me-1"></i> {booking.city}</p>
          <div className="row g-2 fs-7">
            <div className="col-6"><strong>Check In:</strong> {booking.checkIn}</div>
            <div className="col-6"><strong>Check Out:</strong> {booking.checkOut}</div>
            <div className="col-12 mt-1"><strong>Details:</strong> {booking.rooms} Room(s), {booking.guests} Guest(s)</div>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button onClick={handleInvoice} className="btn btn-premium-outline"><i className="fa-solid fa-download me-1"></i> Voucher Invoice</button>
          <Link to={ROUTES.DASHBOARD} className="btn btn-premium-primary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default HotelSuccess;
