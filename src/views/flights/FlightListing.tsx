'use client';

import React, { useState } from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';

export const FlightListing = () => {
  const navigate = useNavigate();
  const { searchParams, setCheckoutItem } = useBooking();
  const { from, to, departDate, passengers, travelClass } = searchParams.flights;

  const [filterPrice, setFilterPrice] = useState(15000);
  const [filterAirline, setFilterAirline] = useState('all');

  const flightsList = [
    { id: 'flt-1', carrier: 'IndiGo', code: '6E-2051', depart: '06:45 AM', arrive: '08:15 AM', duration: '1h 30m', price: 8900, stops: 'Non-stop', img: '/images/flights/airline-indigo.webp' },
    { id: 'flt-2', carrier: 'SpiceJet', code: 'SG-123', depart: '07:30 AM', arrive: '09:05 AM', duration: '1h 35m', price: 7400, stops: 'Non-stop', img: '/images/flights/airline-spicejet.webp' },
    { id: 'flt-3', carrier: 'Air India', code: 'AI-445', depart: '08:15 AM', arrive: '10:00 AM', duration: '1h 45m', price: 9200, stops: 'Non-stop', img: '/images/flights/airline-airindia.webp' },
    { id: 'flt-4', carrier: 'Vistara', code: 'UK-721', depart: '05:30 AM', arrive: '07:10 AM', duration: '1h 40m', price: 11500, stops: 'Non-stop', img: '/images/flights/airline-vistara.webp' }
  ];

  const filteredFlights = flightsList
    .filter(f => filterAirline === 'all' || f.carrier === filterAirline)
    .filter(f => f.price <= filterPrice);

  const handleBook = (flight) => {
    setCheckoutItem({
      type: 'flight',
      itemId: flight.id,
      title: `${flight.carrier} (${flight.code})`,
      price: flight.price * passengers,
      from,
      to,
      date: departDate,
      time: flight.depart,
      passengers,
      travelClass
    });
    navigate(ROUTES.FLIGHT_CHECKOUT);
  };

  return (
    <div className="container py-4">
      {/* Flight Search recap */}
      <div className="card shadow-sm border-0 p-3 mb-4 rounded-3 bg-white">
        <div className="row align-items-center g-3">
          <div className="col-md-5 d-flex align-items-center gap-2">
            <i className="fa-solid fa-plane-departure text-primary"></i>
            <div>
              <div className="fw-bold fs-7">{from} to {to}</div>
              <div className="text-muted fs-8">Travel Date: {departDate} | {passengers} Pax ({travelClass})</div>
            </div>
          </div>
          <div className="col-md-7 text-md-end">
            <button onClick={() => navigate(ROUTES.HOME)} className="btn btn-sm btn-outline-primary px-3 rounded-pill">Modify Search</button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Filters */}
        <div className="col-lg-3">
          <div className="filter-sidebar">
            <h5 className="fw-bold mb-3 border-bottom pb-2 fs-6">Filter Flights</h5>
            <div className="filter-section">
              <h6 className="filter-title">Airline Carriers</h6>
              <select className="form-select form-select-sm" value={filterAirline} onChange={(e) => setFilterAirline(e.target.value)}>
                <option value="all">All Airlines</option>
                <option value="IndiGo">IndiGo</option>
                <option value="SpiceJet">SpiceJet</option>
                <option value="Air India">Air India</option>
                <option value="Vistara">Vistara</option>
              </select>
            </div>
            <div className="filter-section">
              <h6 className="filter-title">Max Fare (₹{filterPrice})</h6>
              <input type="range" className="form-range" min="7000" max="15000" step="500" value={filterPrice} onChange={(e) => setFilterPrice(parseInt(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Flight Cards */}
        <div className="col-lg-9">
          {filteredFlights.length === 0 ? (
            <div className="card p-5 border text-center rounded-3 shadow-sm bg-white border-light mt-3">
              <div className="text-muted fs-3 mb-2"><i className="fa-solid fa-plane-slash"></i></div>
              <h5 className="fw-bold text-dark">No Flights Match Your Filters</h5>
              <p className="text-secondary fs-8">Try expanding your budget limits or resetting filters.</p>
              <button 
                onClick={() => {
                  setFilterAirline('all');
                  setFilterPrice(15000);
                }} 
                className="btn btn-primary rounded-pill px-4 py-2 mt-2 mx-auto border-0 fw-bold fs-8"
                style={{ backgroundColor: '#0061ae' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredFlights.map(flight => (
              <div className="listing-card" key={flight.id}>
                <div className="row align-items-center g-3">
                  <div className="col-md-3 d-flex align-items-center gap-3">
                    <div className="overflow-hidden rounded-3 flex-shrink-0 border" style={{ width: '54px', height: '54px' }}>
                      <img src={flight.img} alt={flight.carrier} className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
                    </div>
                    <div>
                      <div className="fw-bold fs-6 text-dark">{flight.carrier}</div>
                      <div className="text-muted fs-8">{flight.code} | {travelClass}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row text-center text-md-start">
                      <div className="col-4">
                        <div className="fw-bold fs-7">{flight.depart}</div>
                        <small className="text-muted">{from.split(' ')[0]}</small>
                      </div>
                      <div className="col-4 text-center">
                        <div className="fs-8 text-muted">{flight.duration}</div>
                        <div className="border-bottom mx-auto leh-style-auto-1099"></div>
                        <small className="text-muted fs-9">{flight.stops}</small>
                      </div>
                      <div className="col-4 text-md-end text-center">
                        <div className="fw-bold fs-7">{flight.arrive}</div>
                        <small className="text-muted">{to.split(' ')[0]}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 text-md-end border-start-md">
                    <div className="text-muted fs-8">Fare per traveler</div>
                    <div className="fs-3 fw-bold text-dark my-1">₹{flight.price.toLocaleString()}</div>
                    <button onClick={() => handleBook(flight)} className="btn btn-premium-primary w-100 justify-content-center">Book Flight</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightListing;

