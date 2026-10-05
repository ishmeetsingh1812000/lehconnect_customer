'use client';

import React, { useState } from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const HolidayCheckout = () => {
  const navigate = useNavigate();
  const { checkoutItem, addBooking, user } = useBooking();

  // Traveler forms based on adults count
  const guestCount = checkoutItem?.adults || 2;
  const [travelers, setTravelers] = useState(
    Array.from({ length: guestCount }, (_, i) => ({
      title: i === 0 ? 'Mr' : 'Mrs',
      firstName: i === 0 ? (user?.name ? user.name.split(' ')[0] : 'Arjun') : '',
      lastName: i === 0 ? (user?.name ? user.name.split(' ').slice(1).join(' ') : 'Sharma') : '',
      age: i === 0 ? '29' : '27',
      gender: i === 0 ? 'Male' : 'Female',
      idType: 'Passport',
      idNumber: ''
    }))
  );

  const [contactEmail, setContactEmail] = useState(user?.email || 'arjun.sharma@example.com');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 9876543210');
  const [specialRequest, setSpecialRequest] = useState('Vegetarian Meals');
  const [showCustomiseModal, setShowCustomiseModal] = useState(false);
  const [customPhone, setCustomPhone] = useState(user?.phone || '');
  const [customNotes, setCustomNotes] = useState('');

  // Add-ons states
  const [addInsurance, setAddInsurance] = useState(true); // ₹199 per person
  const [addVisa, setAddVisa] = useState(false); // ₹6,500 per person
  const [addVipSightseeing, setAddVipSightseeing] = useState(false); // ₹2,500 per person

  // Coupons state matching screenshot media_1788972043228.png
  const [selectedCoupon, setSelectedCoupon] = useState('SEPCLEARANCE');
  const [discountAmount, setDiscountAmount] = useState(1949);
  const [couponApplied, setCouponApplied] = useState(true);
  const [showEnterCodeInput, setShowEnterCodeInput] = useState(false);
  const [customCouponInput, setCustomCouponInput] = useState('');

  // Payment configuration (Full pay vs. Part pay)
  const [paymentType, setPaymentType] = useState('full'); // 'full' | 'part' (20% advance)
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [useWallet, setUseWallet] = useState(false);

  // If no package is selected for checkout, redirect to search
  if (!checkoutItem || checkoutItem.type !== 'holiday') {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="card p-5 border-0 shadow-sm rounded-4 bg-white text-center" style={{ maxWidth: '500px' }}>
          <div className="fs-1 text-muted mb-3">🏖️</div>
          <h4 className="fw-bold text-dark mb-2">No Holiday Package Selected</h4>
          <p className="text-secondary fs-8 mb-4">Please choose your favorite holiday package from our curated list to proceed with booking.</p>
          <button className="btn btn-primary rounded-pill px-4 py-2.5 fw-bold" style={{ backgroundColor: '#0061ae' }} onClick={() => navigate(ROUTES.HOLIDAY_SEARCH)}>
            Browse Holiday Packages
          </button>
        </div>
      </div>
    );
  }

  const couponsList = [
    {
      code: 'SEPCLEARANCE',
      discount: 1949,
      desc: 'September Travel Clearance – Exclusive Offers for a Limited Time!'
    },
    {
      code: 'ICICIEMI',
      discount: 889,
      desc: 'Grab special discounts upto 20% with ICICI credit cards'
    },
    {
      code: 'INDUSEMI',
      discount: 889,
      desc: 'Get Upto 35% OFF with IndusInd Bank Credit Card'
    }
  ];

  // Price calculations
  const basePackageTotal = checkoutItem.totalBasePrice || (checkoutItem.pricePerPerson * guestCount);
  const originalPricePerAdult = checkoutItem.originalPricePerPerson || 17555;
  const currentPricePerAdult = checkoutItem.pricePerPerson || 15606;
  const discountPercent = Math.max(12, Math.round(((originalPricePerAdult - currentPricePerAdult) / originalPricePerAdult) * 100)) || 12;

  const insuranceCost = addInsurance ? 199 * guestCount : 0;
  const visaCost = addVisa ? 6500 * guestCount : 0;
  const vipCost = addVipSightseeing ? 2500 * guestCount : 0;
  const totalAddons = insuranceCost + visaCost + vipCost;

  const subtotalBeforeDiscount = basePackageTotal + totalAddons;
  const finalDiscount = couponApplied ? Math.min(discountAmount, subtotalBeforeDiscount) : 0;
  const taxableAmount = subtotalBeforeDiscount - finalDiscount;
  const gstTax = Math.round(taxableAmount * 0.05); // 5% GST
  const grandTotal = taxableAmount + gstTax;

  // Split-pay / Part-pay calculations
  const advanceAmount = Math.round(grandTotal * 0.20); // 20% advance
  const payableNow = paymentType === 'part' ? advanceAmount : grandTotal;
  const remainingDue = paymentType === 'part' ? grandTotal - advanceAmount : 0;

  // Wallet deduction
  const walletBalance = user.walletBalance || 1000;
  const walletDeduction = useWallet ? Math.min(walletBalance, payableNow) : 0;
  const finalAmountToPay = payableNow - walletDeduction;

  const handleSelectCoupon = (c) => {
    if (selectedCoupon === c.code && couponApplied) {
      // Toggle Remove
      setCouponApplied(false);
      setSelectedCoupon('');
      setDiscountAmount(0);
      toast.success(`Coupon ${c.code} removed.`);
    } else {
      // Toggle Apply
      setSelectedCoupon(c.code);
      setDiscountAmount(c.discount);
      setCouponApplied(true);
      toast.success(`Coupon "${c.code}" applied! Saved ₹${c.discount.toLocaleString()}`);
    }
  };

  const handleApplyCustomCode = (e) => {
    e.preventDefault();
    const code = customCouponInput.toUpperCase().trim();
    if (!code) return;
    const match = couponsList.find(c => c.code === code);
    if (match) {
      handleSelectCoupon(match);
    } else if (code === 'HOLIDAY2026' || code === 'LEHWELCOME') {
      const amt = code === 'HOLIDAY2026' ? 5000 : Math.round(basePackageTotal * 0.15);
      setSelectedCoupon(code);
      setDiscountAmount(amt);
      setCouponApplied(true);
      toast.success(`Coupon "${code}" applied! Saved ₹${amt.toLocaleString()}`);
    } else {
      toast.error('Invalid coupon code.');
    }
  };

  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    // Validate traveler info
    for (let i = 0; i < travelers.length; i++) {
      if (!travelers[i].firstName || !travelers[i].lastName || !travelers[i].age) {
        toast.error(`Please complete name and age for Traveler ${i + 1}`);
        return;
      }
    }
    if (!contactEmail || !contactPhone) {
      toast.error('Please enter valid email and mobile number');
      return;
    }

    const bookingId = `LEH-HLD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: bookingId,
      type: 'holiday',
      title: checkoutItem.title,
      fromCity: checkoutItem.fromCity || 'New Delhi',
      date: checkoutItem.travelDate,
      duration: checkoutItem.duration,
      guestsCount: guestCount,
      adults: checkoutItem.adults,
      children: checkoutItem.children,
      rooms: checkoutItem.rooms,
      selectedRoom: checkoutItem.selectedRoom,
      hotelName: checkoutItem.hotelName,
      transferType: checkoutItem.transferType,
      travelers,
      contact: { email: contactEmail, phone: contactPhone, specialRequest },
      addOns: { insurance: addInsurance, visa: addVisa, vip: addVipSightseeing },
      pricing: {
        basePackageTotal,
        totalAddons,
        discount: finalDiscount,
        gstTax,
        grandTotal,
        paidNow: finalAmountToPay + walletDeduction,
        remainingDue,
        walletDeduction,
        paymentType,
        paymentMethod
      },
      price: grandTotal,
      paidAmount: finalAmountToPay + walletDeduction,
      status: 'confirmed',
      bookingDate: new Date().toLocaleDateString('en-GB')
    };

    addBooking(newBooking);
    toast.success('🎉 Holiday Package Successfully Booked!');
    navigate(ROUTES.HOLIDAY_SUCCESS, { state: { booking: newBooking } });
  };

  return (
    <div className="bg-light min-vh-100 text-start py-4">
      <div className="container">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fs-8"
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Back to Package Details
          </button>
          <div className="d-flex align-items-center gap-2 text-muted fs-8">
            <i className="fa-solid fa-lock text-success"></i>
            <span className="fw-semibold">256-Bit SSL Encrypted Safe Checkout</span>
          </div>
        </div>

        <div className="row g-4">
          {/* LEFT COLUMN: MULTI-STEP CHECKOUT FORM */}
          <div className="col-lg-8">
            {/* STEP 1: PACKAGE SUMMARY BANNER */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-3 mb-3">
                <div>
                  <span className="badge bg-primary px-3 py-1 rounded-pill fs-9 fw-bold mb-2" style={{ backgroundColor: '#0061ae' }}>
                    CONFIRMED TOUR ITINERARY
                  </span>
                  <h4 className="fw-bold text-dark mb-1">{checkoutItem.title}</h4>
                  <div className="d-flex flex-wrap gap-3 text-secondary fs-8 mt-1">
                    <span><i className="fa-solid fa-calendar-days text-primary me-1"></i> Departure: <b>{checkoutItem.travelDate}</b></span>
                    <span>•</span>
                    <span><i className="fa-solid fa-location-dot text-danger me-1"></i> From: <b>{checkoutItem.fromCity || 'New Delhi'}</b></span>
                    <span>•</span>
                    <span><i className="fa-solid fa-users text-muted me-1"></i> <b>{guestCount} Travelers, {checkoutItem.rooms || 1} Room</b></span>
                  </div>
                </div>
              </div>

              {/* Inclusions summary pills */}
              <div className="d-flex flex-wrap gap-2">
                {checkoutItem.includeFlights && checkoutItem.flightDetails && (
                  <span className="badge bg-primary text-white border-0 px-2.5 py-1.5 fs-9 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                    ✈ Roundtrip Flight: {checkoutItem.flightDetails.airline} ({checkoutItem.flightDetails.flightNo || checkoutItem.flightDetails.code})
                  </span>
                )}
                <span className="badge bg-light text-secondary border px-2.5 py-1.5 fs-9">
                  ✓ {checkoutItem.hotelName ? `${checkoutItem.hotelName} (${checkoutItem.selectedRoom || 'Deluxe Room'})` : `5-Star Hotel (${checkoutItem.selectedRoom || 'Deluxe Room'})`}
                </span>
                <span className="badge bg-light text-secondary border px-2.5 py-1.5 fs-9">
                  ✓ Daily Buffet Breakfast Included
                </span>
                <span className="badge bg-light text-secondary border px-2.5 py-1.5 fs-9">
                  ✓ {checkoutItem.transferType || 'Private AC Sedan / SUV Transfers'}
                </span>
                <span className="badge bg-light text-secondary border px-2.5 py-1.5 fs-9">
                  ✓ Sightseeing Passes Included
                </span>
              </div>
            </div>

            {/* STEP 2: TRAVELER DETAILS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2 d-flex align-items-center justify-content-between">
                <span>1. Traveler Details</span>
                <small className="fs-8 text-muted fw-normal">As per Govt. ID / Passport</small>
              </h5>

              {travelers.map((t, idx) => (
                <div key={idx} className="p-3 rounded-3 border bg-light mb-3">
                  <h6 className="fw-bold text-dark fs-8 mb-2 text-primary">
                    <i className="fa-solid fa-user me-1"></i> Traveler {idx + 1} {idx === 0 ? '(Primary Contact)' : ''}
                  </h6>
                  <div className="row g-2">
                    <div className="col-md-2 col-4">
                      <label className="form-label fs-9 text-muted mb-1">Title</label>
                      <select
                        value={t.title}
                        onChange={(e) => handleTravelerChange(idx, 'title', e.target.value)}
                        className="form-select form-select-sm fs-8"
                      >
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                      </select>
                    </div>

                    <div className="col-md-4 col-8">
                      <label className="form-label fs-9 text-muted mb-1">First Name</label>
                      <input
                        type="text"
                        value={t.firstName}
                        onChange={(e) => handleTravelerChange(idx, 'firstName', e.target.value)}
                        placeholder="First Name"
                        className="form-control form-control-sm fs-8"
                        required
                      />
                    </div>

                    <div className="col-md-4 col-6">
                      <label className="form-label fs-9 text-muted mb-1">Last Name</label>
                      <input
                        type="text"
                        value={t.lastName}
                        onChange={(e) => handleTravelerChange(idx, 'lastName', e.target.value)}
                        placeholder="Last Name"
                        className="form-control form-control-sm fs-8"
                        required
                      />
                    </div>

                    <div className="col-md-2 col-6">
                      <label className="form-label fs-9 text-muted mb-1">Age</label>
                      <input
                        type="number"
                        value={t.age}
                        onChange={(e) => handleTravelerChange(idx, 'age', e.target.value)}
                        placeholder="Age"
                        className="form-control form-control-sm fs-8"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Contact Information */}
              <h6 className="fw-bold text-dark fs-8 mt-2 mb-2">Booking Confirmation Delivery Contacts</h6>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label fs-9 text-muted mb-1">Email Address (For Vouchers & E-tickets)</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="form-control form-control-sm fs-8"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fs-9 text-muted mb-1">Mobile Number (For WhatsApp Updates)</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="form-control form-control-sm fs-8"
                    required
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: OPTIONAL ADD-ONS & TRIP PROTECTION */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">2. Trip Protection & Add-ons</h5>
              
              <div className="d-flex flex-column gap-3">
                {/* Travel Insurance */}
                <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light">
                  <div className="d-flex align-items-start gap-3">
                    <i className="fa-solid fa-shield-halved text-success fs-4 mt-1 flex-shrink-0"></i>
                    <div>
                      <h6 className="fw-bold text-dark mb-0 fs-8">Comprehensive International & Medical Insurance</h6>
                      <small className="text-muted">Covers medical emergencies, trip delays, baggage loss & cancellations up to ₹50 Lakhs.</small>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0 ms-3">
                    <span className="fw-bold text-dark fs-8 d-block">+ ₹199 / person</span>
                    <input
                      type="checkbox"
                      checked={addInsurance}
                      onChange={(e) => setAddInsurance(e.target.checked)}
                      className="form-check-input mt-1"
                    />
                  </div>
                </div>

                {/* VIP Sightseeing Fast-Track */}
                <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light">
                  <div className="d-flex align-items-start gap-3">
                    <i className="fa-solid fa-star text-warning fs-4 mt-1 flex-shrink-0"></i>
                    <div>
                      <h6 className="fw-bold text-dark mb-0 fs-8">VIP Fast-Track Sightseeing Passes</h6>
                      <small className="text-muted">Skip the queues at Burj Khalifa, Museum of the Future & theme parks.</small>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0 ms-3">
                    <span className="fw-bold text-dark fs-8 d-block">+ ₹2,500 / person</span>
                    <input
                      type="checkbox"
                      checked={addVipSightseeing}
                      onChange={(e) => setAddVipSightseeing(e.target.checked)}
                      className="form-check-input mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: PAYMENT OPTIONS & SELECTION */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">3. Payment Plan & Method</h5>

              {/* Full Pay vs. Part Pay Toggle */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div
                    onClick={() => setPaymentType('full')}
                    className={`p-3 border rounded-3 cursor-pointer ${paymentType === 'full' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-dark fs-8">Pay 100% Full Amount</strong>
                      {paymentType === 'full' && <span className="badge bg-primary" style={{ backgroundColor: '#0061ae' }}>Selected</span>}
                    </div>
                    <small className="text-muted d-block">Instant confirmed booking with zero pending dues.</small>
                    <div className="fs-6 fw-bold text-dark mt-2">₹{grandTotal.toLocaleString()}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    onClick={() => setPaymentType('part')}
                    className={`p-3 border rounded-3 cursor-pointer ${paymentType === 'part' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-dark fs-8">Book with 20% Part-Payment</strong>
                      {paymentType === 'part' && <span className="badge bg-primary" style={{ backgroundColor: '#0061ae' }}>Selected</span>}
                    </div>
                    <small className="text-muted d-block">Pay ₹{advanceAmount.toLocaleString()} today, balance 7 days before departure.</small>
                    <div className="fs-6 fw-bold text-primary mt-2">Pay Now: ₹{advanceAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="d-flex flex-column gap-2.5">
                <label className={`d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer ${paymentMethod === 'upi' ? 'border-primary bg-white shadow-sm' : 'bg-light'}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-check-input"
                  />
                  <i className="fa-solid fa-mobile-screen-button text-primary fs-5"></i>
                  <div className="flex-grow-1">
                    <strong className="text-dark fs-8 d-block">UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                    <small className="text-muted">Zero payment gateway fees</small>
                  </div>
                </label>

                <label className={`d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-white shadow-sm' : 'bg-light'}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-check-input"
                  />
                  <i className="fa-solid fa-credit-card text-primary fs-5"></i>
                  <div className="flex-grow-1">
                    <strong className="text-dark fs-8 d-block">Credit / Debit Card (Visa, Mastercard, RuPay, Amex)</strong>
                    <small className="text-muted">No cost EMI available on select cards</small>
                  </div>
                </label>

                <label className={`d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-white shadow-sm' : 'bg-light'}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-check-input"
                  />
                  <i className="fa-solid fa-wallet text-primary fs-5"></i>
                  <div className="flex-grow-1">
                    <strong className="text-dark fs-8 d-block">LehConnect Wallet (Balance: ₹{walletBalance.toLocaleString()})</strong>
                    <small className="text-muted">Instant one-tap deduction</small>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: EXACT MATCH FOR media_1788972043228.png */}
          <div className="col-lg-4 position-relative">
            <div className="sticky-payment-sidebar">
              {/* TOP PRICE & CTA CARD */}
              <div className="leh-checkout-top-box">
                <div className="leh-checkout-strike-row">
                  <span className="leh-strike-price-checkout">
                    ₹{originalPricePerAdult.toLocaleString()}
                  </span>
                  <span className="leh-discount-red-badge">
                    {discountPercent}% OFF
                  </span>
                </div>

                <div className="d-flex align-items-baseline">
                  <span className="leh-checkout-big-amount">
                    ₹{currentPricePerAdult.toLocaleString()}
                  </span>
                  <span className="leh-checkout-unit-text">/Adult</span>
                </div>

                <div className="leh-excl-tax-text">
                  Excluding applicable taxes
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  className="leh-payment-btn-exact"
                >
                  PROCEED TO PAYMENT
                </button>
              </div>

              {/* BOTTOM CARD: COUPONS & OFFERS */}
              <div className="leh-coupons-panel">
                <h5 className="leh-coupons-heading">Coupons & Offers</h5>

                {/* No Cost EMI Bar */}
                <div className="leh-emi-bar-exact">
                  <span className="leh-emi-purple-pill">
                    💳 EMI
                  </span>
                  <div className="fs-8">
                    <strong className="text-dark d-block">
                      No cost EMI @ ₹{Math.round(grandTotal / 6).toLocaleString()}
                    </strong>
                    <span className="text-muted">
                      Book your holidays with Easy{' '}
                      <span
                        className="text-primary fw-semibold cursor-pointer text-decoration-underline"
                        onClick={() => toast('No Cost EMI available on ICICI, HDFC, SBI & Axis Bank Credit Cards!')}
                      >
                        EMI options.
                      </span>
                    </span>
                  </div>
                </div>

                {/* Have a Coupon Code Header Row */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-8 text-secondary">Have a Coupon Code?</span>
                  <button
                    type="button"
                    onClick={() => setShowEnterCodeInput(!showEnterCodeInput)}
                    className="btn btn-link text-primary fw-bold fs-8 p-0 text-decoration-none"
                  >
                    {showEnterCodeInput ? 'Hide Code Input' : 'Enter Code'}
                  </button>
                </div>

                {/* Custom Code Input (toggleable) */}
                {showEnterCodeInput && (
                  <form onSubmit={handleApplyCustomCode} className="d-flex gap-2 mb-3">
                    <input
                      type="text"
                      value={customCouponInput}
                      onChange={(e) => setCustomCouponInput(e.target.value)}
                      placeholder="ENTER PROMO CODE"
                      className="form-control form-control-sm text-uppercase fw-bold fs-8"
                    />
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary rounded-pill px-3 fs-9 fw-bold"
                      style={{ backgroundColor: '#0061ae' }}
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* List of 3 Coupon Cards */}
                <div className="d-flex flex-column gap-2.5">
                  {couponsList.map((c) => {
                    const isApplied = couponApplied && selectedCoupon === c.code;

                    return (
                      <div
                        key={c.code}
                        className={isApplied ? 'leh-coupon-card-active' : 'leh-coupon-card-idle'}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-certificate leh-coupon-icon-star"></i>
                            <span className="leh-coupon-code-title">{c.code}</span>
                          </div>
                          <span className={isApplied ? 'leh-coupon-discount-amt' : 'leh-coupon-discount-amt-dark'}>
                            - ₹{c.discount.toLocaleString()}
                          </span>
                        </div>

                        <div className="leh-coupon-desc-text">
                          {c.desc}
                        </div>

                        <div className="text-end mt-2">
                          <button
                            type="button"
                            onClick={() => handleSelectCoupon(c)}
                            className="leh-coupon-action-link"
                          >
                            {isApplied ? 'REMOVE' : 'APPLY'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Row */}
                <div className="mt-3 pt-3 border-top fs-8 text-secondary">
                  <div className="d-flex justify-content-between mb-1.5">
                    <span>Base Fare ({guestCount} Adults):</span>
                    <strong className="text-dark font-monospace">₹{basePackageTotal.toLocaleString()}</strong>
                  </div>
                  {finalDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-1.5 text-success fw-bold">
                      <span>Promo Savings ({selectedCoupon}):</span>
                      <span className="font-monospace">- ₹{finalDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-1.5">
                    <span>Taxes & GST (5%):</span>
                    <span className="text-dark font-monospace">₹{gstTax.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between fs-7 fw-bold text-dark pt-2 border-top">
                    <span>Grand Total:</span>
                    <span className="font-monospace">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating "Customise my trip" Button */}
      <button 
        type="button" 
        onClick={() => setShowCustomiseModal(true)} 
        className="fixed-customise-trip-btn shadow-lg"
        title="Customise this trip with a holiday expert"
      >
        <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
        Customise my trip
      </button>

      {/* Customise Trip Modal Overlay */}
      {showCustomiseModal && (
        <div className="modal fade show d-block" tabIndex={-1} onClick={() => setShowCustomiseModal(false)} style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 100000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom bg-light px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                  <i className="fa-solid fa-wand-magic-sparkles text-primary"></i> Customise Your Trip
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowCustomiseModal(false)} />
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                toast.success(`Your customized trip request for "${checkoutItem.title}" has been received! Our destination expert will connect with you.`);
                setShowCustomiseModal(false);
              }} className="modal-body p-4 text-start">
                
                <div className="alert alert-primary border-0 rounded-3 fs-8 mb-4 py-2.5 px-3">
                  <b>✨ Tailor-Made Itinerary:</b> Want extra nights, specific airlines, luxury room upgrades, or special requests? Share your preferences below!
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Starting City</label>
                    <input
                      type="text"
                      className="form-control fs-8 customise-form-input"
                      defaultValue={checkoutItem.fromCity || 'New Delhi'}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Destination / Tour</label>
                    <input
                      type="text"
                      className="form-control fs-8 customise-form-input"
                      defaultValue={checkoutItem.title}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Preferred Departure Date</label>
                    <input
                      type="date"
                      className="form-control fs-8 customise-form-input"
                      defaultValue={checkoutItem.travelDate}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Trip Duration</label>
                    <input
                      type="text"
                      className="form-control fs-8 customise-form-input"
                      defaultValue={checkoutItem.duration}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Total Travelers</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control fs-8 customise-form-input"
                        min={1}
                        defaultValue={guestCount}
                        required
                      />
                      <span className="input-group-text bg-white fs-8 text-muted">Adult(s)</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Your Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control fs-8 customise-form-input"
                      maxLength={10}
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fs-8 fw-bold text-secondary">Custom Requirements / Notes (Optional)</label>
                    <textarea
                      rows={3}
                      className="form-control fs-8 customise-form-input"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Flight changes, specific meal requirements, hotel room view upgrade, private chauffeur requests..."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary btn-sm fw-bold px-3 py-2 rounded-pill" onClick={() => setShowCustomiseModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm fw-bold px-4 py-2 rounded-pill"
                    style={{ backgroundColor: '#0061ae', borderColor: '#0061ae' }}
                  >
                    <i className="fa-solid fa-paper-plane me-1"></i> Submit Custom Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCheckout;

