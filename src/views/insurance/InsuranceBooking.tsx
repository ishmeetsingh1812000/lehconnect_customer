'use client';

import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

export const InsuranceBooking = () => {
  const { searchParams } = useBooking();
  const [formData, setFormData] = useState({
    scope: searchParams?.insurance?.destination || 'Worldwide',
    days: searchParams?.insurance?.duration || 14,
    age: searchParams?.insurance?.age || 28,
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please enter contact information.');
      return;
    }
    toast.success('Insurance Enquiry submitted! Premium details and brochure sent to email.');
    setFormData({ ...formData, name: '', phone: '', email: '' });
  };

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="fw-bold text-dark">Travel Insurance Plans</h2>
          <p className="text-muted">Secure your flights, stays, treks, and outstation commutes with premium insurance packages. Covers medical emergencies, delays, and cancellations.</p>
          <div className="d-flex flex-column gap-3 mt-4">
            <div className="d-flex align-items-center gap-3">
              <i className="fa-solid fa-heart text-danger fs-4"></i>
              <div>
                <h6 className="fw-bold mb-0">Emergency Medical Cover</h6>
                <small className="text-muted">Cashless hospitalization up to $50,000 internationally.</small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <i className="fa-solid fa-plane-departure fs-4 text-primary"></i>
              <div>
                <h6 className="fw-bold mb-0">Trip Interruption & Delay</h6>
                <small className="text-muted">Covers hotel stays and new flights in case of delays.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-lg border-0 p-4 rounded-3 bg-white">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
              <i className="fa-solid fa-shield-halved me-1"></i> Get Free Insurance Quote
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Destination Scope</label>
                <select className="form-select fs-7" value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value })}>
                  <option value="Worldwide">Worldwide (including US/Canada)</option>
                  <option value="Asia">Schengen & Asia Only</option>
                  <option value="Domestic">Domestic (Within India)</option>
                </select>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fs-7 fw-semibold">Duration (Days)</label>
                  <input type="number" className="form-control fs-7" value={formData.days} onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })} required />
                </div>
                <div className="col-6">
                  <label className="form-label fs-7 fw-semibold">Oldest Member Age</label>
                  <input type="number" className="form-control fs-7" value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} required />
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Full Name</label>
                <input type="text" className="form-control fs-7" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Email Address</label>
                <input type="email" className="form-control fs-7" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Phone Number</label>
                <input type="tel" className="form-control fs-7" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>

              <button type="submit" className="btn btn-premium-secondary w-100 py-2 justify-content-center">Get Free Quote</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceBooking;
