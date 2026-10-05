'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

export const BookingsList = () => {
  const { bookings, cancelBooking } = useBooking();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'holiday' | 'cab' | 'hotel' | 'flight'
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const handleDownloadInvoice = (id) => {
    toast.success(`Downloading official Voucher & Invoice PDF for booking ${id}...`);
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking? Refund policy terms will apply.')) {
      cancelBooking(id);
      toast.success('Booking cancelled successfully. Refund processing initiated.');
    }
  };

  const filteredBookings = filterType === 'all'
    ? bookings
    : bookings.filter(b => b.type === filterType);

  const counts = {
    all: bookings.length,
    holiday: bookings.filter(b => b.type === 'holiday').length,
    cab: bookings.filter(b => b.type === 'cab').length,
    hotel: bookings.filter(b => b.type === 'hotel').length,
    flight: bookings.filter(b => b.type === 'flight').length,
  };

  return (
    <div className="container py-4 text-start">
      <div className="dashboard-outer-wrapper">
        <div className="dashboard-layout">
          <Sidebar />

        <div className="dashboard-content">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">My Bookings</h4>
              <p className="text-secondary fs-8 mb-0">View, manage, and download vouchers for all your travel reservations.</p>
            </div>
            <div className="text-muted fs-8">
              Total Active Reservations: <strong className="text-primary">{bookings.length}</strong>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom">
            <button
              onClick={() => setFilterType('all')}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fs-8 fw-semibold ${filterType === 'all' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              style={filterType === 'all' ? { backgroundColor: '#0061ae' } : {}}
            >
              All Bookings ({counts.all})
            </button>
            <button
              onClick={() => setFilterType('holiday')}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fs-8 fw-semibold ${filterType === 'holiday' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              style={filterType === 'holiday' ? { backgroundColor: '#0061ae' } : {}}
            >
              🏖️ Holiday Packages ({counts.holiday})
            </button>
            <button
              onClick={() => setFilterType('cab')}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fs-8 fw-semibold ${filterType === 'cab' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              style={filterType === 'cab' ? { backgroundColor: '#0061ae' } : {}}
            >
              🚗 Cabs ({counts.cab})
            </button>
            <button
              onClick={() => setFilterType('hotel')}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fs-8 fw-semibold ${filterType === 'hotel' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              style={filterType === 'hotel' ? { backgroundColor: '#0061ae' } : {}}
            >
              🏨 Hotels ({counts.hotel})
            </button>
            <button
              onClick={() => setFilterType('flight')}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fs-8 fw-semibold ${filterType === 'flight' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              style={filterType === 'flight' ? { backgroundColor: '#0061ae' } : {}}
            >
              ✈️ Flights ({counts.flight})
            </button>
          </div>

          {/* Bookings List */}
          <div className="d-flex flex-column gap-3">
            {filteredBookings.length === 0 ? (
              <div className="text-center p-5 border rounded-4 bg-white shadow-sm">
                <div className="fs-1 text-muted mb-2">📋</div>
                <h5 className="fw-bold text-dark mb-1">No Bookings Found</h5>
                <p className="text-secondary fs-8 mb-0">You do not have any reservations in this category yet.</p>
              </div>
            ) : (
              filteredBookings.map(b => {
                const totalAmount = b.pricing?.grandTotal || b.price || 0;
                const paidNowAmount = b.paidAmount || b.pricing?.paidNow || b.price || 0;
                const remainingAmount = b.pricing?.remainingDue || 0;

                return (
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" key={b.id}>
                    {/* Header Row */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom pb-3 mb-3">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        {b.type === 'holiday' && (
                          <span className="badge bg-warning-subtle text-warning-emphasis px-2.5 py-1.5 rounded-pill fs-9 fw-bold border border-warning-subtle">
                            🏖️ HOLIDAY PACKAGE
                          </span>
                        )}
                        {b.type === 'cab' && (
                          <span className="badge bg-primary-subtle text-primary px-2.5 py-1.5 rounded-pill fs-9 fw-bold border border-primary-subtle">
                            🚗 {b.isHourly || b.tripType === 'hourly' ? 'HOURLY RENTAL CAB' : 'CAB TRANSFER'}
                          </span>
                        )}
                        {b.type === 'hotel' && (
                          <span className="badge bg-success-subtle text-success px-2.5 py-1.5 rounded-pill fs-9 fw-bold border border-success-subtle">
                            🏨 HOTEL STAY
                          </span>
                        )}
                        {b.type === 'flight' && (
                          <span className="badge bg-info-subtle text-info px-2.5 py-1.5 rounded-pill fs-9 fw-bold border border-info-subtle">
                            ✈️ FLIGHT TICKET
                          </span>
                        )}

                        <strong className="fs-6 text-dark">{b.title}</strong>
                        <span className="badge bg-light text-muted border px-2 py-1 fs-9 font-monospace">
                          {b.id}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge px-3 py-1.5 rounded-pill fs-8 fw-semibold ${b.status === 'confirmed' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                          {b.status === 'confirmed' ? '✓ Confirmed' : '✕ Cancelled'}
                        </span>
                      </div>
                    </div>

                    {/* Booking Specific Content */}
                    {b.type === 'holiday' && (
                      <div className="row g-3 fs-8 text-secondary mb-3">
                        <div className="col-md-6">
                          <div className="p-2.5 bg-light rounded-3 border">
                            <div className="text-muted fs-9 text-uppercase fw-bold mb-1">
                              <i className="fa-solid fa-calendar-days text-primary me-1"></i> Tour Schedule & Route
                            </div>
                            <div className="text-dark fw-bold">{b.duration || '4 Nights / 5 Days'}</div>
                            <div className="text-secondary mt-0.5">
                              Departure Date: <strong className="text-dark">{b.date}</strong> • From: <b>{b.fromCity || 'New Delhi'}</b>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="p-2.5 bg-light rounded-3 border">
                            <div className="text-muted fs-9 text-uppercase fw-bold mb-1">
                              <i className="fa-solid fa-hotel text-primary me-1"></i> Hotel Accommodation
                            </div>
                            <div className="text-dark fw-bold">{b.hotelName || '5-Star Luxury Resort'}</div>
                            <div className="text-secondary mt-0.5">
                              Room: <b>{b.selectedRoom || 'Deluxe Room'}</b> ({b.rooms || 1} Room, {b.guestsCount || 2} Adults)
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="p-2.5 bg-light rounded-3 border">
                            <div className="text-muted fs-9 text-uppercase fw-bold mb-1">
                              <i className="fa-solid fa-car text-primary me-1"></i> Private Chauffeur Transfer
                            </div>
                            <div className="text-dark fw-bold">{b.transferType || 'Private AC Sedan / SUV Transfers'}</div>
                            <div className="text-muted mt-0.5 fs-9">Sightseeing, airport pick-up & intercity travel included</div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="p-2.5 bg-light rounded-3 border">
                            <div className="text-muted fs-9 text-uppercase fw-bold mb-1">
                              <i className="fa-solid fa-users text-primary me-1"></i> Primary Travelers ({b.guestsCount || 2} Guests)
                            </div>
                            <div className="text-dark fw-bold">
                              {b.travelers && b.travelers.length > 0
                                ? b.travelers.map(t => `${t.title} ${t.firstName} ${t.lastName}`).join(', ')
                                : '2 Registered Travelers'}
                            </div>
                            <div className="text-muted mt-0.5 fs-9">
                              Contact: {b.contact?.phone || '+91 98765 43210'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {b.type === 'cab' && (
                      <div className="row g-2 fs-8 text-secondary mb-3">
                        <div className="col-sm-6">
                          {b.isHourly || b.tripType === 'hourly' ? (
                            <>
                              <strong>Package:</strong> {b.packageDuration || 'Hourly Rental'} ({b.packageDistance || b.package || 'Custom Limit'}) • City: <b>{b.from}</b>
                            </>
                          ) : (
                            <>
                              <strong>Route:</strong> {b.from} to {b.to}
                            </>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <strong>Schedule:</strong> {b.date} at {b.time}
                        </div>
                        {b.pickupLandmark && (
                          <div className="col-12 text-muted fs-9">
                            <strong>Pickup Landmark:</strong> {b.pickupLandmark}
                          </div>
                        )}
                        {(b.extraKmRate || b.extraHrRate) && (
                          <div className="col-12 text-muted fs-9">
                            <span className="badge bg-warning-subtle text-dark border border-warning-subtle py-1 px-2 fw-normal">
                              Overtime Policy: ₹{b.extraKmRate || 14}/km after package limit • ₹{b.extraHrRate || 150}/hr extra
                            </span>
                          </div>
                        )}
                        {b.driver && (
                          <div className="col-12 text-muted fs-9">
                            Chauffeur: <b>{b.driver.name}</b> ({b.driver.vehicleNo}) • Ph: {b.driver.phone}
                          </div>
                        )}
                      </div>
                    )}

                    {b.type === 'hotel' && (
                      <div className="row g-2 fs-8 text-secondary mb-3">
                        <div className="col-sm-6">
                          <strong>Destination / City:</strong> {b.city}
                        </div>
                        <div className="col-sm-6">
                          <strong>Stay Dates:</strong> {b.checkIn} to {b.checkOut} ({b.rooms || 1} Rooms, {b.guests || 2} Guests)
                        </div>
                        {b.address && (
                          <div className="col-12 text-muted fs-9">
                            Address: {b.address}
                          </div>
                        )}
                      </div>
                    )}

                    {b.type === 'flight' && (
                      <div className="row g-2 fs-8 text-secondary mb-3">
                        <div className="col-sm-6">
                          <strong>Flight Route:</strong> {b.from} to {b.to}
                        </div>
                        <div className="col-sm-6">
                          <strong>Flight Schedule:</strong> {b.date} at {b.time} (Seats: {b.seats?.join(', ') || '12A'})
                        </div>
                      </div>
                    )}

                    {/* Price & Action Row */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pt-3 border-top bg-light-subtle rounded-3 px-3 py-2">
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div>
                          <span className="text-muted fs-9 text-uppercase fw-bold d-block">Package Total</span>
                          <strong className="text-dark fs-7">₹{totalAmount.toLocaleString()}</strong>
                        </div>
                        <div className="border-start ps-3">
                          <span className="text-muted fs-9 text-uppercase fw-bold d-block">Paid Amount</span>
                          <strong className="text-success fs-7">₹{paidNowAmount.toLocaleString()}</strong>
                        </div>
                        {remainingAmount > 0 && (
                          <div className="border-start ps-3">
                            <span className="text-warning-emphasis fs-9 text-uppercase fw-bold d-block">Pending Balance</span>
                            <strong className="text-danger fs-7">₹{remainingAmount.toLocaleString()}</strong>
                          </div>
                        )}
                      </div>

                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedBookingDetails(b)}
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fs-8 d-inline-flex align-items-center gap-1.5 bg-white"
                        >
                          <i className="fa-solid fa-eye me-1"></i> View Details
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(b.id)}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fs-8 d-inline-flex align-items-center gap-1.5 bg-white"
                        >
                          <i className="fa-solid fa-download me-1"></i> Voucher / Invoice
                        </button>
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 fs-8 d-inline-flex align-items-center gap-1.5"
                          >
                            <i className="fa-solid fa-xmark me-1"></i> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>

      {/* VIEW FULL DETAILS MODAL */}
      {selectedBookingDetails && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden text-start">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <div>
                  <span className="badge bg-primary px-2.5 py-1 rounded-pill fs-9 fw-bold mb-1" style={{ backgroundColor: '#0061ae' }}>
                    {selectedBookingDetails.type.toUpperCase()} BOOKING DETAILS
                  </span>
                  <h5 className="modal-title fw-bold text-dark mb-0">{selectedBookingDetails.title}</h5>
                  <small className="text-muted">Booking Reference: <strong className="font-monospace text-primary">{selectedBookingDetails.id}</strong></small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedBookingDetails(null)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Status and dates bar */}
                <div className="p-3 bg-light rounded-3 border mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <span className="text-muted fs-9 text-uppercase fw-bold d-block">Travel / Booking Date</span>
                    <strong className="text-dark fs-8">{selectedBookingDetails.date || selectedBookingDetails.bookingDate || '2026-09-11'}</strong>
                  </div>
                  <div>
                    <span className="text-muted fs-9 text-uppercase fw-bold d-block">Booking Status</span>
                    <span className={`badge px-3 py-1.5 rounded-pill fs-9 fw-bold ${selectedBookingDetails.status === 'confirmed' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                      {selectedBookingDetails.status === 'confirmed' ? '✓ CONFIRMED' : '✕ CANCELLED'}
                    </span>
                  </div>
                </div>

                {/* Holiday Package Detailed Breakdown */}
                {selectedBookingDetails.type === 'holiday' && (
                  <>
                    <h6 className="fw-bold text-dark fs-8 mb-2 border-bottom pb-1">Package Accommodations & Transfers</h6>
                    <div className="row g-2 mb-3 fs-8">
                      <div className="col-md-6">
                        <div className="p-2.5 border rounded-2 bg-white">
                          <strong className="text-dark d-block"><i className="fa-solid fa-hotel text-primary me-1"></i> Hotel:</strong>
                          <span>{selectedBookingDetails.hotelName || '5-Star Luxury Resort'}</span>
                          <small className="text-muted d-block mt-0.5">Room Type: {selectedBookingDetails.selectedRoom || 'Deluxe Room'} ({selectedBookingDetails.rooms || 1} Room)</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-2.5 border rounded-2 bg-white">
                          <strong className="text-dark d-block"><i className="fa-solid fa-car text-primary me-1"></i> Private Transfer:</strong>
                          <span>{selectedBookingDetails.transferType || 'Private AC Sedan / SUV Transfers'}</span>
                          <small className="text-muted d-block mt-0.5">Includes sightseeing & fuel/toll charges</small>
                        </div>
                      </div>
                    </div>

                    {/* Travelers List */}
                    {selectedBookingDetails.travelers && selectedBookingDetails.travelers.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold text-dark fs-8 mb-2 border-bottom pb-1">Registered Travelers</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedBookingDetails.travelers.map((t, idx) => (
                            <div key={idx} className="p-2 bg-light border rounded-2 fs-8 text-dark">
                              <i className="fa-solid fa-users text-muted me-1"></i>
                              <b>{t.title} {t.firstName} {t.lastName}</b> ({t.gender}, Age: {t.age}) {t.idNumber ? `• ${t.idType}: ${t.idNumber}` : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact details */}
                    {selectedBookingDetails.contact && (
                      <div className="mb-3">
                        <h6 className="fw-bold text-dark fs-8 mb-2 border-bottom pb-1">Delivery Contact Details</h6>
                        <div className="p-2.5 bg-light border rounded-2 fs-8 text-dark d-flex flex-wrap gap-4">
                          <div><b>Email:</b> {selectedBookingDetails.contact.email}</div>
                          <div><b>Phone:</b> {selectedBookingDetails.contact.phone}</div>
                          {selectedBookingDetails.contact.specialRequest && (
                            <div><b>Special Request:</b> {selectedBookingDetails.contact.specialRequest}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Cab / Hourly Rental Detailed Breakdown */}
                {selectedBookingDetails.type === 'cab' && (
                  <>
                    <h6 className="fw-bold text-dark fs-8 mb-2 border-bottom pb-1">
                      {selectedBookingDetails.isHourly || selectedBookingDetails.tripType === 'hourly' ? 'Hourly Rental Reservation Details' : 'Cab Transfer Details'}
                    </h6>
                    <div className="row g-2 mb-3 fs-8">
                      <div className="col-md-6">
                        <div className="p-2.5 border rounded-2 bg-white">
                          <strong className="text-dark d-block">
                            <i className="fa-solid fa-car text-primary me-1"></i> Vehicle & Service:
                          </strong>
                          <span>{selectedBookingDetails.title}</span>
                          <small className="text-muted d-block mt-0.5">
                            {selectedBookingDetails.isHourly || selectedBookingDetails.tripType === 'hourly'
                              ? `Package: ${selectedBookingDetails.packageDuration || 'Hourly'} (${selectedBookingDetails.packageDistance || selectedBookingDetails.package || ''})`
                              : `Trip: ${selectedBookingDetails.from} to ${selectedBookingDetails.to}`}
                          </small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-2.5 border rounded-2 bg-white">
                          <strong className="text-dark d-block">
                            <i className="fa-solid fa-calendar-days text-primary me-1"></i> Pickup & Time:
                          </strong>
                          <span>{selectedBookingDetails.date} at {selectedBookingDetails.time}</span>
                          {selectedBookingDetails.pickupLandmark && (
                            <small className="text-muted d-block mt-0.5">
                              Pickup Landmark: {selectedBookingDetails.pickupLandmark}
                            </small>
                          )}
                        </div>
                      </div>
                      {selectedBookingDetails.driver && (
                        <div className="col-12">
                          <div className="p-2.5 border rounded-2 bg-white">
                            <strong className="text-dark d-block">Chauffeur & Vehicle Assigned:</strong>
                            <span className="text-dark fw-semibold">{selectedBookingDetails.driver.name}</span> • 
                            <span className="text-muted"> Vehicle No: {selectedBookingDetails.driver.vehicleNo}</span> • 
                            <span className="text-muted"> Phone: {selectedBookingDetails.driver.phone}</span>
                          </div>
                        </div>
                      )}
                      {(selectedBookingDetails.isHourly || selectedBookingDetails.tripType === 'hourly') && (
                        <div className="col-12">
                          <div className="p-2.5 bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-2 fs-9">
                            <strong>Overtime & Distance Policy:</strong> Includes {selectedBookingDetails.packageDuration || '4 hr'} and {selectedBookingDetails.packageDistance || '40 kms'}. 
                            Extra distance will be charged at ₹{selectedBookingDetails.extraKmRate || 14}/km and extra duration at ₹{selectedBookingDetails.extraHrRate || 150}/hr.
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Price Breakdown */}
                <h6 className="fw-bold text-dark fs-8 mb-2 border-bottom pb-1">Fare & Payment Breakdown</h6>
                <div className="p-3 bg-light border rounded-3 fs-8">
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-secondary">Total Package Fare:</span>
                    <strong className="text-dark">₹{(selectedBookingDetails.pricing?.grandTotal || selectedBookingDetails.price || 0).toLocaleString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1.5 text-success fw-bold">
                    <span>Paid Amount:</span>
                    <span>₹{(selectedBookingDetails.paidAmount || selectedBookingDetails.pricing?.paidNow || selectedBookingDetails.price || 0).toLocaleString()}</span>
                  </div>
                  {selectedBookingDetails.pricing?.remainingDue > 0 && (
                    <div className="d-flex justify-content-between mb-1.5 text-danger fw-bold">
                      <span>Remaining Balance Due:</span>
                      <span>₹{selectedBookingDetails.pricing.remainingDue.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedBookingDetails.pricing?.paymentMethod && (
                    <div className="d-flex justify-content-between pt-2 border-top text-muted fs-9">
                      <span>Payment Method:</span>
                      <span className="text-uppercase fw-bold">{selectedBookingDetails.pricing.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top px-4 py-3 bg-light d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 py-2 fs-8 fw-semibold"
                  onClick={() => setSelectedBookingDetails(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 py-2 fs-8 fw-semibold d-inline-flex align-items-center gap-1.5"
                  style={{ backgroundColor: '#0061ae' }}
                  onClick={() => handleDownloadInvoice(selectedBookingDetails.id)}
                >
                  <i className="fa-solid fa-download me-1"></i> Download Voucher PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsList;

