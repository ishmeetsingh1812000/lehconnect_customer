'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

export const SupportTickets = () => {
  const { tickets, addSupportTicket } = useBooking();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Refunds');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      toast.error('Please describe your support issue.');
      return;
    }

    const ticketId = addSupportTicket(subject, category);
    toast.success(`Support ticket ${ticketId} created successfully! Our agents will contact you shortly.`);
    setSubject('');
  };

  return (
    <div className="container py-4">
      <div className="dashboard-outer-wrapper">
        <div className="dashboard-layout">
          <Sidebar />

          <div className="dashboard-content">
            <h4 className="fw-bold mb-4">Support Center</h4>

            <div className="row g-4">
              {/* Create Ticket */}
              <div className="col-12 col-lg-5">
              <div className="border rounded-3 p-4 bg-light">
                <h5 className="fw-bold text-dark mb-3"><i className="fa-solid fa-headset me-2"></i> Open Support Ticket</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fs-7 fw-semibold">Service Category</label>
                    <select className="form-select fs-7" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Refunds">Refunds & Payments</option>
                      <option value="Holidays">Holiday Packages Support</option>
                      <option value="Cabs">Cab Booking Assistance</option>
                      <option value="Hotels">Hotel Stay Queries</option>
                      <option value="Flights">Flight Tickets Support</option>
                      <option value="General">General / Other Queries</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fs-7 fw-semibold">Subject / Describe Issue</label>
                    <textarea 
                      className="form-control fs-7" 
                      rows={4} 
                      placeholder="E.g., Refund of Rs 4200 has not been credited to my bank account for cab LC-CAB-9871." 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)} 
                      required 
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-premium-primary w-100 justify-content-center">
                    <i className="fa-solid fa-paper-plane me-1"></i> Submit Ticket
                  </button>
                </form>
              </div>
            </div>

            {/* List Tickets */}
            <div className="col-12 col-lg-7">
              <h5 className="fw-bold mb-3">Your Support History</h5>
              <div className="d-flex flex-column gap-3">
                {tickets.map(t => (
                  <div className="border rounded-3 p-3 bg-light" key={t.id}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary text-uppercase fs-8">{t.category}</span>
                      <span className={`badge ${t.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="fw-semibold text-dark fs-7 mb-1">{t.subject}</div>
                    <div className="d-flex justify-content-between align-items-center mt-2 fs-8 text-muted">
                      <span>Ticket ID: {t.id}</span>
                      <span>Created on {t.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SupportTickets;
