'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

export const Wallet = () => {
  const { user, updateProfile } = useBooking();
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }

    updateProfile({ walletBalance: user.walletBalance + amt });
    toast.success(`₹${amt.toLocaleString()} successfully credited to your wallet!`);
    setDepositAmount('');
  };

  const transactions = [
    { id: 'TXN-001', type: 'credit', desc: 'Promotional Cashback', amount: 1000, date: '2026-07-21' },
    { id: 'TXN-002', type: 'credit', desc: 'Card Deposit', amount: 5000, date: '2026-07-18' },
    { id: 'TXN-003', type: 'debit', desc: 'Flight Booking LC-FLT-2210', amount: 8900, date: '2026-07-15' }
  ];

  return (
    <div className="container py-4">
      <div className="dashboard-outer-wrapper">
        <div className="dashboard-layout">
          <Sidebar />

          <div className="dashboard-content">
            <h4 className="fw-bold mb-4">My Wallet & Cashbacks</h4>

            <div className="row g-4">
              {/* Balance Card */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 bg-primary text-white p-4 rounded-3 shadow mb-4">
                  <i className="fa-solid fa-wallet mb-3 opacity-75 fs-1"></i>
                  <span className="opacity-75 fs-7 d-block">AVAILABLE BALANCE</span>
                  <h2 className="fw-bold my-1">₹{user.walletBalance.toLocaleString()}</h2>
                  <small className="opacity-50">100% Secure & Co-branded Travel Cash</small>
                </div>
              </div>

              {/* Deposit Box */}
              <div className="col-12 col-lg-6">
              <div className="border rounded-3 p-4 bg-light">
                <h5 className="fw-bold text-dark mb-3">Add Travel Credits</h5>
                <form onSubmit={handleDeposit}>
                  <div className="mb-3">
                    <label className="form-label fs-7 fw-semibold">Amount to Deposit (INR)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="E.g., 2000" 
                        value={depositAmount} 
                        onChange={(e) => setDepositAmount(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-premium-secondary w-100 justify-content-center">
                    <i className="fa-solid fa-plus me-1"></i> Deposit Credit
                  </button>
                </form>
              </div>
            </div>

            {/* Transaction Logs */}
            <div className="col-12">
              <h5 className="fw-bold mb-3">Transaction History</h5>
              <div className="table-responsive bg-white rounded border">
                <table className="table mb-0 table-hover fs-7">
                  <thead className="table-light text-muted">
                    <tr>
                      <th className="py-3 px-3">Transaction ID</th>
                      <th>Details</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id}>
                        <td className="py-3 px-3 fw-bold">{t.id}</td>
                        <td>
                          <span className="d-block text-dark fw-semibold">{t.desc}</span>
                        </td>
                        <td>{t.date}</td>
                        <td className={t.type === 'credit' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                          {t.type === 'credit' ? <i className="fa-solid fa-arrow-up me-1"></i> : <i className="fa-solid fa-arrow-down me-1"></i>} ₹{t.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Wallet;
