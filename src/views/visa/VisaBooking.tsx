'use client';

import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

export const VisaBooking = () => {
  const { searchParams } = useBooking();
  const [formData, setFormData] = useState({
    country: searchParams?.visa?.country || 'Schengen (Europe)',
    visaType: searchParams?.visa?.visaType || 'Tourist',
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('All fields are required.');
      return;
    }
    toast.success(`Visa assistance request submitted for ${formData.country}. A visa counselor will contact you shortly.`);
    setFormData({ ...formData, name: '', phone: '', email: '' });
  };

  const visaRequirements: Record<string, { fee: string; time: string; docList: string[] }> = {
    'Schengen (Europe)': { fee: '₹7,500', time: '15-20 Days', docList: ['Original Passport with 6-month validity', 'Two passport-size photos with white background', 'Covering letter stating purpose of visit', 'Last 3 years Income Tax Returns (ITR)', '6 months bank statements with sufficient funds'] },
    'United Kingdom': { fee: '₹12,200', time: '15-25 Days', docList: ['Original Passport', 'Financial documents & bank statements', 'Proof of employment or business ownership', 'Detailed trip itinerary and hotel vouchers'] },
    'United Arab Emirates': { fee: '₹6,400', time: '3-5 Days', docList: ['Scanned color copy of first & last page of Passport', 'Passport size photo with white background', 'Confirmed return flight tickets'] }
  };

  const selectedReqs = visaRequirements[formData.country] || visaRequirements['Schengen (Europe)'];

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Global Visa Assistance</h2>
        <p className="text-muted">Apply tourist and business visas with expert documentation support.</p>
      </div>

      <div className="row g-4">
        {/* Visa Request Form */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2  ">
              <i className="fa-brands fa-cc-visa me-1"></i> Request Visa Consultation
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Destination Country</label>
                <select className="form-select fs-7" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
                  <option value="Schengen (Europe)">Schengen (Europe)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Visa Type</label>
                <select className="form-select fs-7" value={formData.visaType} onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}>
                  <option value="Tourist">Tourist / Leisure Visa</option>
                  <option value="Business">Business Visitor Visa</option>
                  <option value="Student">Student Visa</option>
                </select>
              </div>
              <hr />
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold">Applicant Full Name</label>
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

              <button type="submit" className="btn btn-premium-primary w-100 py-2 justify-content-center">Submit Visa Request</button>
            </form>
          </div>
        </div>

        {/* Documentation details */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <i className="fa-regular fa-file-lines text-danger me-1"></i> Required Documents: {formData.country}
            </h5>
            <div className="row g-2 fs-7 mb-4">
              <div className="col-6"><strong>Processing Fee:</strong> {selectedReqs.fee}</div>
              <div className="col-6"><strong>Processing Time:</strong> {selectedReqs.time}</div>
            </div>
            
            <h6 className="fw-bold fs-7 mb-2">Checklist Checklist:</h6>
            <ul className="list-unstyled fs-8 text-muted mb-4">
              {selectedReqs.docList.map((doc, idx) => (
                <li className="d-flex align-items-start gap-2 mb-2" key={idx}>
                  <i className="fa-solid fa-check text-success mt-1"></i>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>

            <div className="alert alert-info py-2 fs-8 mt-auto mb-0">
              <i className="fa-solid fa-circle-info me-1"></i> Visa fee is non-refundable once documents are submitted to the consulate. LehConnect provides formatting and permit assistance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaBooking;
