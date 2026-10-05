'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const stats = [ 
    { label: 'Total Users', count: '1,450', icon: <i className="fa-solid fa-users text-primary"></i> },
    { label: 'System Bookings', count: '9,812', icon: <i className="fa-solid fa-ticket text-success"></i> },
    { label: 'Revenue (INR)', count: '₹2,45,000', icon: <i className="fa-solid fa-credit-card text-info"></i> },
    { label: 'Active Coupons', count: '12', icon: <i className="fa-solid fa-tags text-warning"></i> }
  ];

  const bookings = [
    { id: 'LC-CAB-9871', user: 'Vikram Singh', service: 'Cab Booking', amount: '₹4,500', status: 'confirmed' },
    { id: 'LC-HTL-1024', user: 'John Doe', service: 'Hotel Reservation', amount: '₹24,500', status: 'confirmed' },
    { id: 'LC-FLT-5542', user: 'Jane Smith', service: 'Flight Ticket', amount: '₹8,900', status: 'pending' }
  ];

  const handleAction = (id: string, action: string) => {
    toast.success(`Booking ${id} is marked as ${action} by administrator.`);
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark d-flex align-items-center justify-content-center gap-2">
          <i className="fa-solid fa-lock text-danger"></i> Admin Control Center
        </h2>
        <p className="text-muted">Manage LehConnect bookings, verify payments, manage active coupons, and view platform logs.</p>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        {stats.map((s, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card shadow-sm border-0 p-3 bg-white rounded-3 d-flex flex-row align-items-center justify-content-between">
              <div>
                <small className="text-muted fs-8 text-uppercase fw-semibold">{s.label}</small>
                <h4 className="fw-bold mb-0 mt-1">{s.count}</h4>
              </div>
              <div className="fs-3">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0 mb-4 rounded-3 bg-white">
        <div className="d-flex border-bottom bg-light">
          <button onClick={() => setActiveTab('bookings')} className={`btn flex-1 py-3 fw-bold rounded-0 ${activeTab === 'bookings' ? 'btn-white border-bottom border-primary  ' : 'text-muted'}`}>
            Bookings Log
          </button>
          <button onClick={() => setActiveTab('coupons')} className={`btn flex-1 py-3 fw-bold rounded-0 ${activeTab === 'coupons' ? 'btn-white border-bottom border-primary  ' : 'text-muted'}`}>
            Coupons / CMS Management
          </button>
        </div>

        <div className="card-body p-4">
          {activeTab === 'bookings' ? (
            <div className="table-responsive">
              <table className="table mb-0 table-hover fs-7">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="py-3 px-3">Booking ID</th>
                    <th>User</th>
                    <th>Service</th>
                    <th>Billing</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className="py-3 px-3 fw-bold">{b.id}</td>
                      <td>{b.user}</td>
                      <td>{b.service}</td>
                      <td>{b.amount}</td>
                      <td>
                        <span className={`status-badge ${b.status === 'confirmed' ? 'status-badge-success' : 'status-badge-pending'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button onClick={() => handleAction(b.id, 'Approved')} className="btn btn-sm btn-success me-1 fs-8 py-1">Approve</button>
                        <button onClick={() => handleAction(b.id, 'Declined')} className="btn btn-sm btn-outline-danger fs-8 py-1">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <h5 className="fw-bold mb-3">Add Discount Coupon</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <input type="text" className="form-control fs-7 text-uppercase" placeholder="COUPON CODE" />
                </div>
                <div className="col-md-4">
                  <input type="number" className="form-control fs-7" placeholder="Discount %" />
                </div>
                <div className="col-md-4">
                  <button onClick={() => toast.success('Coupon code saved to platform catalog')} className="btn btn-primary w-100 fs-7 py-2">Create Coupon</button>
                </div>
              </div>
              <div className="border rounded-3 p-3 bg-light text-muted fs-8">
                <i className="fa-solid fa-wrench me-1"></i> CMS: Change layout content, headers, and pricing grids dynamically.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
