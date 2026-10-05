'use client';

import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

interface BusItem {
  id: string;
  operator: string;
  type: string;
  depart: string;
  arrive: string;
  price: number;
  rating: number;
}

export const BusBooking = () => {
  const { searchParams } = useBooking();
  const { from = 'Delhi', to = 'Manali', date = '2026-08-15' } = searchParams?.bus || {};

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);

  const buses: BusItem[] = [
    { id: 'bus-1', operator: 'Lahaul & Spiti Travels', type: 'Volvo AC Sleeper', depart: '08:00 PM', arrive: '06:00 AM', price: 1800, rating: 4.8 },
    { id: 'bus-2', operator: 'Himalayan Humsafar', type: 'Scania Multi-Axle AC', depart: '06:30 PM', arrive: '05:00 AM', price: 2100, rating: 4.6 }
  ];

  const toggleSeat = (seatNo: string) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      if (selectedSeats.length >= 4) {
        toast.error('You can select a maximum of 4 seats.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  const handleBook = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat.');
      return;
    }
    toast.success(`Booking successful! Seats ${selectedSeats.join(', ')} reserved. PNR sent to email.`);
    setSelectedSeats([]);
    setSelectedBus(null);
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Intercity Bus Booking</h2>
        <p className="text-muted">Route: {from} to {to} | Date: {date}</p>
      </div>

      <div className="row g-4">
        {/* Bus List */}
        <div className="col-lg-8">
          {buses.map(bus => (
            <div className="card shadow-sm border-0 p-3 mb-3 rounded-3 bg-white" key={bus.id}>
              <div className="row align-items-center">
                <div className="col-md-4">
                  <h5 className="fw-bold text-dark mb-1">{bus.operator}</h5>
                  <span className="text-muted fs-8">{bus.type}</span>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2">
                    <div>
                      <div className="fw-bold fs-7">{bus.depart}</div>
                      <small className="text-muted">{from}</small>
                    </div>
                    <div className="text-muted fs-8 px-2">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    <div>
                      <div className="fw-bold fs-7">{bus.arrive}</div>
                      <small className="text-muted">{to}</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <div className="fs-5 fw-bold text-dark mb-2">₹{bus.price.toLocaleString()} / Seat</div>
                  <button onClick={() => setSelectedBus(selectedBus?.id === bus.id ? null : bus)} className="btn btn-sm btn-premium-primary">
                    {selectedBus?.id === bus.id ? 'Hide Seats' : 'Select Seats'}
                  </button>
                </div>
              </div>

              {/* Seating Layout Grid */}
              {selectedBus?.id === bus.id && (
                <div className="border-top mt-3 pt-3 bg-light p-3 rounded">
                  <h6 className="fw-bold text-dark mb-3"><i className="fa-solid fa-bus me-1"></i> Select Seat Layout</h6>
                  <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                    {['L1', 'L2', 'L3', 'L4', 'R1', 'R2', 'R3', 'R4', 'L5', 'L6', 'R5', 'R6'].map(seat => {
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button key={seat} onClick={() => toggleSeat(seat)} className={`btn btn-sm ${isSelected ? 'btn-success' : 'btn-outline-secondary'} leh-style-auto-1059`}>
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fs-7 text-muted">Selected Seats: <strong>{selectedSeats.join(', ') || 'None'}</strong></span>
                    <button onClick={handleBook} className="btn btn-sm btn-premium-secondary">Confirm Seat & Pay</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3 rounded-3 bg-white">
            <h6 className="fw-bold text-dark mb-3"><i className="fa-solid fa-circle-info me-1"></i> Important Information</h6>
            <ul className="fs-8 text-muted ps-3 mb-0">
              <li className="mb-2">Passengers must carry valid Photo ID proofs for checking.</li>
              <li className="mb-2">Report at the boarding station 15 minutes before the departure time.</li>
              <li>Free baggage up to 15 kg is allowed per passenger seat.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusBooking;
