'use client';

import React from 'react';
import { NavLink } from '../components/NavLink';
import { useBooking } from '../context/BookingContext';
import { ROUTES } from '../constants/routes';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const Sidebar = () => {
  const { user, setIsLoggedIn } = useBooking();
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success('Signed out successfully');
    router.push(ROUTES.HOME);
  };

  return (
    <div className="dashboard-sidebar">
      {/* Profile Header */}
      <div className="dashboard-sidebar-header text-center">
        <div className="position-relative d-inline-block">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="rounded-circle border border-3 border-primary mb-2 leh-style-auto-1038" 
          />
          <span 
            className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1" 
            title="Active & Verified"
            style={{ width: '12px', height: '12px' }}
          ></span>
        </div>
        <h5 className="fw-bold text-dark mb-0 fs-6">{user.name}</h5>
        <small className="text-muted fs-9 d-block">{user.email}</small>
      </div>

      {/* Profile Completion Mini Widget */}
      <div className="sidebar-completion-box text-start">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="fs-9 fw-bold text-dark">Profile Completion</span>
          <span className="badge bg-primary-subtle text-primary fw-bold fs-9">75%</span>
        </div>
        <div className="progress mb-1" style={{ height: '5px' }}>
          <div 
            className="progress-bar bg-primary progress-bar-striped progress-bar-animated" 
            role="progressbar" 
            style={{ width: '75%' }} 
            aria-valuenow={75} 
            aria-valuemin={0} 
            aria-valuemax={100}
          ></div>
        </div>
        <div className="text-end">
          <NavLink to={ROUTES.PROFILE} className="fs-10 text-primary fw-bold text-decoration-none">
            Complete Profile <i className="fa-solid fa-arrow-right ms-1"></i>
          </NavLink>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="dashboard-menu mt-2">
        <NavLink to={ROUTES.DASHBOARD} end className={({ isActive }) => `dashboard-menu-link ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-gauge me-2"></i> Dashboard
        </NavLink>
        <NavLink to={ROUTES.PROFILE} className={({ isActive }) => `dashboard-menu-link ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-user me-2"></i> Profile Details
        </NavLink>
        <NavLink to={ROUTES.BOOKINGS} className={({ isActive }) => `dashboard-menu-link ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-ticket me-2"></i> My Bookings
        </NavLink>
        <NavLink to={ROUTES.WALLET} className={({ isActive }) => `dashboard-menu-link ${isActive ? 'active' : ''} d-flex justify-content-between align-items-center`}>
          <span className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-wallet me-2"></i> Wallet & Cashbacks
          </span>
          <span className="badge bg-primary-subtle text-primary fs-9 px-2 py-0.5 rounded-pill">
            ₹{user.walletBalance.toLocaleString()}
          </span>
        </NavLink>
        <a href="/dashboard#refer-earn" className="dashboard-menu-link d-flex justify-content-between align-items-center text-decoration-none">
          <span className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-gift text-warning me-2"></i> Refer & Earn
          </span>
          <span className="badge bg-success-subtle text-success border border-success-subtle fs-9 px-2 py-0.5 rounded-pill">
            ₹500
          </span>
        </a>
        <NavLink to={ROUTES.SUPPORT} className={({ isActive }) => `dashboard-menu-link ${isActive ? 'active' : ''}`}>
          <i className="fa-solid fa-headset me-2"></i> Support Center
        </NavLink>
      </div>

      {/* Sign Out Action Button */}
      <div className="px-3 pt-3 border-top mt-3">
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-signout-btn"
          title="Sign out of your LehConnect account"
        >
          <i className="fa-solid fa-right-from-bracket me-2"></i> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
