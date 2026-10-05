'use client';

import React, { useState } from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const HotelCheckout = () => {
  const navigate = useNavigate();
  const { checkoutItem, user, coupons, addBooking, updateProfile } = useBooking();

  if (!checkoutItem || checkoutItem.type !== 'hotel') {
    return (
      <div className="container py-5 text-center">
        <i className="fa-solid fa-circle-exclamation text-warning mb-3" style={{ fontSize: "45px" }}></i>
        <h4>No Active Hotel Reservation Details Found</h4>
        <button onClick={() => navigate(ROUTES.HOME)} className="btn btn-premium-primary">Go Home</button>
      </div>
    );
  }

  const [activeStep, setActiveStep] = useState(1);
  const [guestName, setGuestName] = useState(user.name);
  const [guestEmail, setGuestEmail] = useState(user.email);
  const [useWallet, setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const basePrice = checkoutItem.price;
  let discount = 0;
  if (appliedCoupon) {
    discount = Math.min((basePrice * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount);
  }
  const subtotal = basePrice - discount;
  const walletApplied = useWallet ? Math.min(subtotal, user.walletBalance) : 0;
  const grandTotal = subtotal - walletApplied;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      toast.success('Coupon applied!');
    } else {
      toast.error('Invalid Coupon Code');
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const bookingId = `LC-HTL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: bookingId,
      type: 'hotel',
      title: checkoutItem.title,
      city: checkoutItem.location,
      checkIn: checkoutItem.checkIn,
      checkOut: checkoutItem.checkOut,
      guests: checkoutItem.guests,
      rooms: checkoutItem.rooms,
      price: checkoutItem.price,
      paidAmount: grandTotal,
      walletDebited: walletApplied,
      status: 'confirmed'
    };

    if (walletApplied > 0) {
      updateProfile({ walletBalance: user.walletBalance - walletApplied });
    }

    addBooking(newBooking);
    toast.success('Hotel Booked Successfully!');
    navigate(ROUTES.HOTEL_SUCCESS, { state: { booking: newBooking } });
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white mb-3">
            {activeStep === 1 ? (
              <div>
                <h4 className="fw-bold mb-4">Review Stays & Guests</h4>
                <div className="border rounded-3 p-3 bg-light mb-3">
                  <h5 className="fw-bold mb-1">{checkoutItem.title}</h5>
                  <p className="text-muted fs-8 mb-2">{checkoutItem.location}</p>
                  {checkoutItem.roomName && (
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-8">
                        {checkoutItem.roomName}
                      </span>
                      {checkoutItem.planName && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle fs-8">
                          ✓ {checkoutItem.planName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <span className="text-muted fs-8">CHECK IN</span>
                    <div className="fw-bold">{checkoutItem.checkIn}</div>
                  </div>
                  <div className="col-6">
                    <span className="text-muted fs-8">CHECK OUT</span>
                    <div className="fw-bold">{checkoutItem.checkOut}</div>
                  </div>
                  <div className="col-6">
                    <span className="text-muted fs-8">ROOMS & GUESTS</span>
                    <div className="fw-bold">
                      {checkoutItem.rooms} Room(s), {typeof checkoutItem.guests === 'string' && checkoutItem.guests.includes('Guest') ? checkoutItem.guests : `${checkoutItem.guests} Guests`}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold fs-7">Lead Guest Name</label>
                  <input type="text" className="form-control" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold fs-7">Guest Email</label>
                  <input type="email" className="form-control" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required />
                </div>

                <button onClick={() => setActiveStep(2)} className="btn btn-premium-primary w-100 mt-2 ssae">Proceed to Payment</button>
              </div>
            ) : (
              <div>
                <h4 className="fw-bold mb-4">Secure Reservation Payment</h4>
                <form onSubmit={handleConfirm}>
                  <div className="border rounded-3 p-3 bg-light mb-4">
                    <label className="form-label fs-8 text-muted fw-semibold">CARD NUMBER</label>
                    <input type="text" className="form-control fs-7 py-2 mb-3" placeholder="1111-2222-3333-4444" required />
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label fs-8 text-muted fw-semibold">EXPIRY</label>
                        <input type="text" className="form-control fs-7 py-2" placeholder="MM/YY" required />
                      </div>
                      <div className="col-6">
                        <label className="form-label fs-8 text-muted fw-semibold">CVV</label>
                        <input type="password" placeholder="***" className="form-control fs-7 py-2" required />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button type="button" onClick={() => setActiveStep(1)} className="btn btn-outline-secondary">Back</button>
                    <button type="submit" className="btn btn-premium-secondary">Confirm Reservation</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4 position-relative">
          <div className="sticky-payment-sidebar">
          {/* Coupon */}
          <div className="card shadow-sm border-0 p-3 mb-3 rounded-3 bg-white">
            <h6 className="fw-bold mb-3 fs-7"><i className="fa-solid fa-ticket me-1"></i> Apply Promo Code</h6>
            {appliedCoupon ? (
              <div className="d-flex justify-content-between align-items-center bg-success-subtle p-2 rounded">
                <span className="text-success fw-bold">{appliedCoupon.code}</span>
                <button onClick={() => setAppliedCoupon(null)} className="btn btn-sm btn-link text-danger">Remove</button>
              </div>
            ) : (
              <div className="input-group">
                <input type="text" className="form-control text-uppercase fs-7" placeholder="Promo Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <button onClick={handleApplyCoupon} className="btn btn-primary">Apply</button>
              </div>
            )}
          </div>

          {/* Wallet */}
          <div className="card shadow-sm border-0 p-3 mb-3 rounded-3 bg-white">
            <div className="form-check d-flex justify-content-between align-items-center p-0">
              <label className="form-check-label fs-7 fw-semibold cursor-pointer" htmlFor="hotelWallet">
                <i className="fa-solid fa-wallet me-1"></i> Deduct from Wallet
                <small className="text-muted d-block">Available: ₹{user.walletBalance}</small>
              </label>
              <input className="form-check-input ms-0" type="checkbox" id="hotelWallet" checked={useWallet} onChange={() => setUseWallet(!useWallet)} />
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="card shadow-sm border-0 p-3 rounded-3 bg-white">
            <h6 className="fw-bold mb-3 fs-7">Fare Breakup</h6>
            <div className="d-flex justify-content-between fs-7 text-muted mb-2">
              <span>Rooms Base Rate</span>
              <span>₹{basePrice.toLocaleString()}</span>
            </div>
            {discount > 0 && <div className="d-flex justify-content-between fs-7 text-success mb-2"><span>Coupon Discount</span><span>- ₹{discount}</span></div>}
            {walletApplied > 0 && <div className="d-flex justify-content-between fs-7   mb-2"><span>Wallet Paid</span><span>- ₹{walletApplied}</span></div>}
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-6">
              <span>Total Price</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCheckout;

