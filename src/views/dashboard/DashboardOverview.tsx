'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { useBooking } from '../../context/BookingContext';
import Link from '../../components/Link';
import { ROUTES } from '../../constants/routes';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getProfileCompletion } from '../../utils/profileCompletion';
import { updateCustomerProfile } from '../../APIs/api';

export const DashboardOverview = () => {
  const { user, updateProfile, bookings, tickets, setIsLoggedIn, profileLoaded, profileLoadError } = useBooking();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const profileCompletion = getProfileCompletion(user);
  const completionLabel = profileLoadError
    ? 'Unavailable'
    : profileLoaded
      ? `${profileCompletion.percentage}% Complete`
      : 'Loading...';

  // Address Update State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editStreet, setEditStreet] = useState(user.address?.street || 'Flat 402, Himalayan Heights, Fort Road');
  const [editCity, setEditCity] = useState(user.address?.city || 'Leh');
  const [editState, setEditState] = useState(user.address?.state || 'Ladakh (UT)');
  const [editPincode, setEditPincode] = useState(user.address?.pincode || '194101');
  const [editCountry, setEditCountry] = useState(user.address?.country || 'India');

  useEffect(() => {
    if (!profileLoaded || profileLoadError) return;
    setEditStreet(user.address?.street || '');
    setEditCity(user.address?.city || '');
    setEditState(user.address?.state || '');
    setEditPincode(user.address?.pincode || '');
    setEditCountry(user.address?.country || '');
  }, [profileLoaded, profileLoadError, user.address]);

  const referralCode = 'LEH500VIKRAM';

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success('Signed out successfully');
    router.push(ROUTES.HOME);
  };

  const handleCopyReferral = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareWhatsapp = () => {
    const message = encodeURIComponent(
      `Hey! Planning a trip to Ladakh? Sign up on LehConnect using my referral code *${referralCode}* to get ₹500 travel cash instantly! Visit: https://lehconnect.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleQuickAdd = (amt) => {
    updateProfile({ walletBalance: user.walletBalance + amt });
    toast.success(`₹${amt.toLocaleString()} added to your wallet!`);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!editStreet.trim() || !editCity.trim() || !editState.trim() || !editPincode.trim() || !editCountry.trim()) {
      toast.error('Please complete all address fields.');
      return;
    }
    if (!user.firstName?.trim() || !user.lastName?.trim()) {
      toast.error('Please add your first and last name before saving your address.');
      return;
    }
    try {
      await updateCustomerProfile({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email || undefined,
        country: editCountry.trim(),
        state: editState.trim(),
        city: editCity.trim(),
        pincode: editPincode.trim(),
        address: editStreet.trim(),
      });
      updateProfile({
        address: {
          street: editStreet.trim(),
          city: editCity.trim(),
          state: editState.trim(),
          pincode: editPincode.trim(),
          country: editCountry.trim(),
        },
      });
      setShowAddressModal(false);
      toast.success('Address updated successfully!');
    } catch (error) {
      console.error('Customer address update failed:', error);
      toast.error(error.response?.data?.message || 'Could not update your address.');
    }
  };

  const activeCount = bookings.filter(b => b.status === 'confirmed').length;
  const openTickets = tickets.filter(t => t.status === 'open').length;

  return (
    <div className="container py-4 text-start">
      <div className="dashboard-outer-wrapper">
        <div className="dashboard-layout">
          <Sidebar />
          
          <div className="dashboard-content">
            {/* Top User Greeting Banner with Sign Out */}
            <div className="dashboard-user-banner d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <img src={user.avatar} 
                  alt={user.name} 
                  className="rounded-circle border border-2 border-white shadow-sm"
                  style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                loading="lazy" decoding="async" />
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h4 className="fw-bold text-white mb-0">Welcome back, {user.name}! 👋</h4>
                    <span className="badge bg-success text-white rounded-pill fs-9 fw-bold px-2 py-0.5">
                      <i className="fa-solid fa-circle-check me-1"></i> Verified Traveler
                    </span>
                  </div>
                  <div className="text-white-50 fs-8 mt-1">
                    <span>{user.email}</span> • <span className="text-warning fw-semibold">LehConnect Club Member</span>
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleLogout}
                className="btn btn-sm btn-outline-light d-flex align-items-center gap-2 rounded-pill px-3 py-1.5 fs-8 fw-bold shadow-none"
                title="Sign out of account"
              >
                <i className="fa-solid fa-right-from-bracket me-1"></i> Sign Out
              </button>
            </div>

            {/* Feature 1: Profile Completion Card (LehConnect Style) */}
            <div className="profile-completion-card mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h5 className="fw-bold text-dark mb-0">Profile Completion</h5>
                    <span className={`badge ${profileCompletion.percentage === 100 && profileLoaded && !profileLoadError ? 'bg-success' : 'bg-primary'} text-white rounded-pill px-2.5 py-1 fs-9 fw-bold`}>
                      {completionLabel}
                    </span>
                  </div>
                  <p className="text-muted fs-8 mb-0 mt-1">
                    {profileLoadError
                      ? 'We could not load your profile details. Please try again later.'
                      : 'Complete your profile to unlock 1-click checkout and faster Ladakh permit processing.'}
                  </p>
                </div>
                <Link to={ROUTES.PROFILE} className="btn btn-primary rounded-pill px-3 py-1.5 fs-8 fw-bold text-decoration-none">
                  Manage Profile <i className="fa-solid fa-arrow-right ms-1"></i>
                </Link>
              </div>

              {/* Progress Bar */}
              <div className="progress my-2.5" style={{ height: '7px' }}>
                <div 
                  className={`progress-bar ${profileCompletion.percentage === 100 && profileLoaded && !profileLoadError ? 'bg-success' : 'bg-primary'} progress-bar-striped progress-bar-animated`} 
                  role="progressbar" 
                  style={{ width: profileLoaded && !profileLoadError ? `${profileCompletion.percentage}%` : '0%' }} 
                  aria-valuenow={profileLoaded && !profileLoadError ? profileCompletion.percentage : 0} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                ></div>
              </div>

              {/* Profile Checklist Steps (Responsive 4 Columns on Desktop, 2x2 Grid on Mobile/Tablet) */}
              <div className="row g-2 pt-1">
                {profileCompletion.steps.map((step) => (
                  <div className="col-6 col-lg-3" key={step.key}>
                    <div className={`profile-step-pill ${profileLoaded && !profileLoadError && step.complete ? 'completed' : 'pending'}`}>
                      {profileLoaded && !profileLoadError && step.complete ? (
                        <i className="fa-solid fa-circle-check text-success flex-shrink-0"></i>
                      ) : (
                        <i className="fa-solid fa-circle-exclamation text-warning flex-shrink-0"></i>
                      )}
                      <div className="text-truncate">
                        <div className="fs-8 fw-bold text-dark">{step.label}</div>
                        <small className={step.complete ? 'text-muted fs-10' : 'text-warning-emphasis fs-10 fw-bold'}>
                          {profileLoadError ? 'Unavailable' : profileLoaded ? step.detail : 'Loading...'}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features 2 & 3: Wallet Card & Refer Your Friend Card (Responsive Stack on Mobile/Tablet) */}
            <div className="row g-3 mb-4">
              {/* Feature 2: Wallet & Cashbacks Card */}
              <div className="col-12 col-lg-6">
              <div className="wallet-dashboard-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-wallet text-white opacity-75 fs-5"></i>
                      <span className="fs-9 fw-bold text-uppercase tracking-wide text-white-50">LehConnect Travel Wallet</span>
                    </div>
                    <span className="badge bg-white text-primary fw-bold fs-9 rounded-pill px-2 py-0.5">
                      100% Usable
                    </span>
                  </div>

                  <div className="my-2">
                    <small className="text-white-50 fs-9 d-block">TOTAL AVAILABLE BALANCE</small>
                    <h2 className="fw-900 text-white mb-1">₹{user.walletBalance.toLocaleString()}</h2>
                    <div className="fs-9 text-white-50 d-flex align-items-center gap-3 flex-wrap">
                      <span>• Travel Cash: ₹{(user.walletBalance - 1000 > 0 ? user.walletBalance - 1000 : user.walletBalance).toLocaleString()}</span>
                      <span>• Promo Bonus: ₹1,000</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top border-white border-opacity-25 mt-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2.5">
                    <span className="fs-9 text-white-50 fw-semibold">Quick Top-Up:</span>
                    <div className="d-flex gap-1.5">
                      <button type="button" onClick={() => handleQuickAdd(500)} className="wallet-quick-chip">
                        + ₹500
                      </button>
                      <button type="button" onClick={() => handleQuickAdd(1000)} className="wallet-quick-chip">
                        + ₹1,000
                      </button>
                      <button type="button" onClick={() => handleQuickAdd(2000)} className="wallet-quick-chip">
                        + ₹2,000
                      </button>
                    </div>
                  </div>

                  <Link to={ROUTES.WALLET} className="btn btn-light text-primary fw-bold fs-8 w-100 rounded-pill py-1.5 text-center text-decoration-none shadow-none">
                    View Passbook & Add Money <i className="fa-solid fa-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3: Refer Your Friend & Earn Card */}
            <div className="col-12 col-lg-6" id="refer-earn">
              <div className="refer-earn-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-gift text-warning fs-5"></i>
                      <span className="fs-9 fw-bold text-uppercase tracking-wide text-muted">Refer & Earn</span>
                    </div>
                    <span className="badge bg-success text-white fw-bold fs-9 rounded-pill px-2 py-0.5">
                      Get ₹500
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1 fs-6">Refer Your Friend & Earn ₹500!</h5>
                  <p className="text-muted fs-8 mb-2.5">
                    Gift ₹500 travel credits. When your friend completes their first Ladakh booking, you get ₹500 too!
                  </p>

                  {/* Referral Code Box */}
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                    <div className="referral-code-box py-1 px-2.5 fs-7">
                      <span>{referralCode}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleCopyReferral} 
                      className="btn btn-sm btn-dark rounded-pill px-3 py-1.5 fs-8 fw-bold d-flex align-items-center gap-1.5 shadow-none"
                    >
                      {copied ? <><i className="fa-solid fa-check me-1"></i> Copied!</> : <><i className="fa-solid fa-copy me-1"></i> Copy Code</>}
                    </button>
                  </div>
                </div>

                <div className="pt-2.5 border-top border-warning border-opacity-25 mt-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2 text-muted fs-9">
                      <span className="fw-bold text-dark">3</span> Friends Joined • <span className="fw-bold text-success">₹1,500</span> Earned
                    </div>
                    <button 
                      type="button" 
                      onClick={handleShareWhatsapp} 
                      className="btn btn-sm btn-success rounded-pill px-2.5 py-1 fs-8 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
                    >
                      <i className="fa-brands fa-whatsapp fs-6 me-1"></i> WhatsApp Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Billing & Travel Address Card */}
          <div className="card border rounded-3 p-3 mb-4 bg-white shadow-sm">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <div className="d-flex align-items-center gap-2.5">
                <div className="bg-danger-subtle text-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                  <i className="fa-solid fa-location-dot fs-6"></i>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="fw-bold text-dark mb-0 fs-7">Registered Travel & Billing Address</h6>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill fs-9 px-2 py-0.5">
                      Primary
                    </span>
                  </div>
                  <small className="text-muted fs-9">Used for tourist permits, cab pickup points, and booking tax invoices</small>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setEditStreet(user.address?.street || 'Flat 402, Himalayan Heights, Fort Road');
                  setEditCity(user.address?.city || 'Leh');
                  setEditState(user.address?.state || 'Ladakh (UT)');
                  setEditPincode(user.address?.pincode || '194101');
                  setEditCountry(user.address?.country || 'India');
                  setShowAddressModal(true);
                }} 
                className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fs-8 fw-bold shadow-none"
              >
                <i className="fa-solid fa-location-dot me-1"></i> Update Address
              </button>
            </div>

            <div className="bg-light rounded-3 p-3 mt-1 border">
              <div className="row g-2 align-items-center">
                <div className="col-md-8">
                  <div className="fw-bold text-dark fs-7 mb-1">
                    {user.address?.street || 'Flat 402, Himalayan Heights, Fort Road'}
                  </div>
                  <div className="text-muted fs-8">
                    {user.address?.city || 'Leh'}, {user.address?.state || 'Ladakh (UT)'} - {user.address?.pincode || '194101'}, {user.address?.country || 'India'}
                  </div>
                </div>
                <div className="col-md-4 text-md-end">
                  <span className="text-success fs-8 fw-semibold d-inline-flex align-items-center gap-1">
                    <i className="fa-solid fa-circle-check me-1" style={{ fontSize: "13px" }}></i> Verified for Ladakh Permits
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar (Responsive on Mobile & Tablet) */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <div className="card border-0 bg-success text-white p-3 rounded-3 shadow-sm d-flex flex-row align-items-center justify-content-between">
                <div>
                  <small className="opacity-75 fs-9 text-uppercase fw-semibold">Active Reservations</small>
                  <h3 className="fw-bold mb-0" suppressHydrationWarning>{activeCount} Bookings</h3>
                </div>
                <i className="fa-solid fa-ticket opacity-50 fs-2"></i>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="card border-0 bg-warning text-dark p-3 rounded-3 shadow-sm d-flex flex-row align-items-center justify-content-between">
                <div>
                  <small className="opacity-75 fs-9 text-uppercase fw-semibold">Open Support Tickets</small>
                  <h3 className="fw-bold mb-0" suppressHydrationWarning>{openTickets} Active</h3>
                </div>
                <i className="fa-regular fa-clock opacity-50 fs-2"></i>
              </div>
            </div>
          </div>

          {/* Recent Bookings Panel */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Recent Reservations</h5>
            <Link to={ROUTES.BOOKINGS} className="btn btn-sm btn-link text-decoration-none fw-bold fs-8" suppressHydrationWarning>
              View All ({bookings.length}) <i className="fa-solid fa-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="table-responsive bg-white rounded-4 border shadow-sm">
            <table className="table mb-0 table-hover fs-7 align-middle">
              <thead className="table-light text-muted">
                <tr>
                  <th className="py-3 px-3">Service</th>
                  <th>Description</th>
                  <th>Schedule / Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">No reservations recorded yet.</td>
                  </tr>
                ) : (
                  bookings.slice(0, 5).map(b => (
                    <tr key={b.id}>
                      <td className="py-3 px-3">
                        {b.type === 'holiday' && (
                          <span className="badge bg-warning-subtle text-warning-emphasis px-2.5 py-1 rounded-pill border border-warning-subtle fs-9">
                            <i className="fa-solid fa-suitcase me-1"></i> Holiday
                          </span>
                        )}
                        {b.type === 'cab' && (
                          <span className="badge bg-primary-subtle text-primary px-2.5 py-1 rounded-pill border border-primary-subtle fs-9">
                            <i className="fa-solid fa-car me-1"></i> Cab
                          </span>
                        )}
                        {b.type === 'hotel' && (
                          <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded-pill border border-success-subtle fs-9">
                            <i className="fa-solid fa-hotel me-1"></i> Hotel
                          </span>
                        )}
                        {b.type === 'flight' && (
                          <span className="badge bg-info-subtle text-info px-2.5 py-1 rounded-pill border border-info-subtle fs-9">
                            <i className="fa-solid fa-plane me-1"></i> Flight
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{b.title}</div>
                        <small className="text-muted font-monospace">{b.id}</small>
                        {b.hotelName && <div className="fs-9 text-secondary">{b.hotelName}</div>}
                      </td>
                      <td>{b.date || `${b.checkIn} to ${b.checkOut}`}</td>
                      <td className="fw-bold text-dark">
                        ₹{(b.paidAmount || b.pricing?.paidNow || b.pricing?.grandTotal || b.price || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`status-badge ${b.status === 'confirmed' ? 'status-badge-success' : 'status-badge-failed'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Update Address Interactive Modal */}
      {showAddressModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h6 className="modal-title fw-bold text-white d-flex align-items-center gap-2 mb-0 fs-7">
                  <i className="fa-solid fa-location-dot me-1"></i> Update Travel & Billing Address
                </h6>
                <button 
                  type="button" 
                  className="btn-close btn-close-white shadow-none" 
                  onClick={() => setShowAddressModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSaveAddress}>
                <div className="modal-body p-3text-start">
                  <div className="mb-3">
                    <label className="form-label fs-8 fw-bold text-dark mb-1">House / Flat / Street Address</label>
                    <input 
                      type="text" 
                      className="form-control fs-7" 
                      placeholder="e.g. Flat 402, Himalayan Heights, Fort Road" 
                      value={editStreet} 
                      onChange={(e) => setEditStreet(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fs-8 fw-bold text-dark mb-1">City</label>
                      <input 
                        type="text" 
                        className="form-control fs-7" 
                        placeholder="Leh" 
                        value={editCity} 
                        onChange={(e) => setEditCity(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fs-8 fw-bold text-dark mb-1">State / UT</label>
                      <input 
                        type="text" 
                        className="form-control fs-7" 
                        placeholder="Ladakh (UT)" 
                        value={editState} 
                        onChange={(e) => setEditState(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fs-8 fw-bold text-dark mb-1">Pincode</label>
                      <input 
                        type="text" 
                        className="form-control fs-7" 
                        placeholder="194101" 
                        value={editPincode} 
                        onChange={(e) => setEditPincode(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fs-8 fw-bold text-dark mb-1">Country</label>
                      <input 
                        type="text" 
                        className="form-control fs-7" 
                        placeholder="India" 
                        value={editCountry} 
                        onChange={(e) => setEditCountry(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light p-3 d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 fs-8 fw-semibold" 
                    onClick={() => setShowAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-sm btn-primary rounded-pill px-4 fs-8 fw-bold shadow-none"
                  >
                    Save Address
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

export default DashboardOverview;
