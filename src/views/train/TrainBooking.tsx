'use client';

import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

interface PnrDetails {
  pnr: string;
  trainName: string;
  trainNum: string;
  date: string;
  from: string;
  to: string;
  class: string;
  chart: string;
  passengers: Array<{
    name: string;
    seat: string;
    status: string;
  }>;
}

export const TrainBooking = () => {
  const { searchParams } = useBooking();
  const [pnrInput, setPnrInput] = useState(searchParams?.train?.pnr || '2456789012');
  const [pnrDetails, setPnrDetails] = useState<PnrDetails | null>(null);
  const [activeTab, setActiveTab] = useState('pnr'); // pnr, schedule

  const handlePnrCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrInput.length !== 10) {
      toast.error('Please enter a valid 10-digit PNR number.');
      return;
    }

    // Set mock PNR details
    setPnrDetails({
      pnr: pnrInput,
      trainName: 'Kalka Shatabdi Express',
      trainNum: '12011',
      date: '2026-07-25',
      from: 'New Delhi (NDLS)',
      to: 'Kalka (KLK)',
      class: 'CC (Chair Car)',
      chart: 'Chart Prepared',
      passengers: [
        { name: 'Vikram Singh', seat: 'Coach C4, Seat 24', status: 'CNF (Confirmed)' },
        { name: 'Priya Singh', seat: 'Coach C4, Seat 25', status: 'CNF (Confirmed)' }
      ]
    });
    toast.success('PNR Status Retrieved Successfully!');
  };

  return (
    <div className="container py-4 leh-style-auto-1200">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Train Services & Enquiry</h2>
        <p className="text-muted">Check PNR status, seat availability, train schedules, and route information.</p>
      </div>

      <div className="card shadow-sm border-0 mb-4 rounded-3 bg-white">
        <div className="d-flex border-bottom bg-light">
          <button onClick={() => setActiveTab('pnr')} className={`btn flex-1 py-3 fw-bold rounded-0 ${activeTab === 'pnr' ? 'btn-white border-bottom border-primary  ' : 'text-muted'}`}>
            <i className="fa-solid fa-magnifying-glass me-1"></i> PNR Status
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`btn flex-1 py-3 fw-bold rounded-0 ${activeTab === 'schedule' ? 'btn-white border-bottom border-primary  ' : 'text-muted'}`}>
            <i className="fa-solid fa-train me-1"></i> Train Route & Schedule
          </button>
        </div>

        <div className="card-body p-4">
          {activeTab === 'pnr' ? (
            <div>
              <form onSubmit={handlePnrCheck} className="mb-4">
                <label className="form-label fs-7 fw-semibold">Enter 10-Digit PNR Number</label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control py-2 fs-7" 
                    placeholder="E.g., 2345678901"
                    maxLength={10} 
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary px-4"><i className="fa-solid fa-magnifying-glass me-1"></i> Check Status</button>
                </div>
              </form>

              {pnrDetails && (
                <div className="border rounded-3 p-4 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">{pnrDetails.trainName} ({pnrDetails.trainNum})</h5>
                    <span className="badge bg-success">{pnrDetails.chart}</span>
                  </div>
                  <hr />
                  <div className="row g-3 fs-7 text-muted mb-4">
                    <div className="col-sm-6"><strong>PNR:</strong> {pnrDetails.pnr}</div>
                    <div className="col-sm-6"><strong>Date of Journey:</strong> {pnrDetails.date}</div>
                    <div className="col-sm-6"><strong>From Station:</strong> {pnrDetails.from}</div>
                    <div className="col-sm-6"><strong>To Station:</strong> {pnrDetails.to}</div>
                    <div className="col-sm-6"><strong>Travel Class:</strong> {pnrDetails.class}</div>
                  </div>

                  <h6 className="fw-bold text-dark mb-2">Passenger Info</h6>
                  <div className="table-responsive bg-white rounded border">
                    <table className="table mb-0 table-sm fs-7">
                      <thead className="table-light text-muted">
                        <tr>
                          <th className="py-2 px-3">Passenger</th>
                          <th>Seat Number</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pnrDetails.passengers.map((p, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3">{p.name}</td>
                            <td>{p.seat}</td>
                            <td className="text-success fw-bold">{p.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h5 className="fw-bold mb-3">Train Route Finder</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-5">
                  <label className="form-label fs-7 fw-semibold">From Station</label>
                  <input type="text" className="form-control fs-7" placeholder="E.g., NDLS" />
                </div>
                <div className="col-md-5">
                  <label className="form-label fs-7 fw-semibold">To Station</label>
                  <input type="text" className="form-control fs-7" placeholder="E.g., KLK" />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button onClick={() => toast.success('Searching trains on route...')} className="btn btn-primary w-100 fs-7 py-2">Search</button>
                </div>
              </div>

              <div className="border rounded-3 p-3 bg-light fs-8 text-muted">
                <i className="fa-solid fa-circle-info me-1"></i> Search results display general Indian Railways schedules. All seat inventory bookings are redirected to authorized IRCTC partner portals.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainBooking;
