'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '../../hooks/useAppNavigation';
import Link from '../../components/Link';
import { useBooking } from '../../context/BookingContext';
import { PACKAGES_DATA } from '../../constants/packagesData';
import { ROUTES } from '../../constants/routes';
import {
  getDestinationHotels,
  getDestinationTransfers,
  getDestinationFlights,
  getDestinationDetails
} from '../../constants/packageDetailsData';
import toast from 'react-hot-toast';

export const HolidayDetails = ({ id: propId }: { id?: string }) => {
  const routeParams = useParams();
  const id = propId || routeParams?.id;
  const navigate = useNavigate();
  const { setCheckoutItem } = useBooking();

  // Find base package from centralized database
  let basePkg = null;
  let pkgCategory = '';
  for (const [cat, list] of Object.entries(PACKAGES_DATA)) {
    const match = list.find(p => p.id === id);
    if (match) {
      basePkg = match;
      pkgCategory = cat;
      break;
    }
  }

  // Fallback if id is invalid/not found
  if (!basePkg) {
    if (id?.includes('krl')) {
      basePkg = PACKAGES_DATA.kerala ? PACKAGES_DATA.kerala[0] : PACKAGES_DATA.europe[0];
      pkgCategory = 'kerala';
    } else if (id?.includes('goa')) {
      basePkg = PACKAGES_DATA.goa ? PACKAGES_DATA.goa[0] : PACKAGES_DATA.europe[0];
      pkgCategory = 'goa';
    } else if (id?.includes('jap')) {
      basePkg = PACKAGES_DATA.japan ? PACKAGES_DATA.japan[0] : PACKAGES_DATA.europe[0];
      pkgCategory = 'japan';
    } else if (id?.includes('mld')) {
      basePkg = PACKAGES_DATA.maldives ? PACKAGES_DATA.maldives[0] : PACKAGES_DATA.europe[0];
      pkgCategory = 'maldives';
    } else {
      basePkg = PACKAGES_DATA.europe ? PACKAGES_DATA.europe[0] : PACKAGES_DATA.dubai[0];
      pkgCategory = 'europe';
    }
  }

  // Active subnavigation tab
  const [activeTab, setActiveTab] = useState('itinerary');

  // Search Context Strip States
  const [fromCity, setFromCity] = useState('New Delhi');
  const [departDate, setDepartDate] = useState('2026-09-11');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showCustomiseModal, setShowCustomiseModal] = useState(false);
  const [customPhone, setCustomPhone] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Gallery Modal State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(0);

  // Interactive Activity Customization State
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeDayToCustomize, setActiveDayToCustomize] = useState(null);

  // Interactive Room Upgrade State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoomUpgrade, setSelectedRoomUpgrade] = useState({ name: 'Deluxe Valley View Room', price: 0 });

  // Interactive Transfer / Cab Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferDetail, setSelectedTransferDetail] = useState(null);

  // Interactive Hotel Change Modal State
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [selectedHotelDetail, setSelectedHotelDetail] = useState(null);
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [hotelSortBy, setHotelSortBy] = useState('recommended');
  const [hotelFilterStar, setHotelFilterStar] = useState('all');
  const [hotelFilterBreakfast, setHotelFilterBreakfast] = useState(false);

  // Dynamic destination-specific hotel, transfer, and flight options
  const transferOptions = getDestinationTransfers(pkgCategory, basePkg);
  const hotelOptions = getDestinationHotels(pkgCategory, basePkg);
  const flightOptions = getDestinationFlights(pkgCategory, basePkg, fromCity);

  // Selected Transfer & Hotel state
  const [selectedTransfer, setSelectedTransfer] = useState(() => transferOptions[0]);
  const [selectedHotel, setSelectedHotel] = useState(() => hotelOptions[0]);

  // Flights state (with/without flight toggle & flight selection)
  const [includeFlights, setIncludeFlights] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(() => flightOptions[0]);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [flightSortBy, setFlightSortBy] = useState('recommended');

  // Sync state when base package or destination category changes
  useEffect(() => {
    const hotels = getDestinationHotels(pkgCategory, basePkg);
    const transfers = getDestinationTransfers(pkgCategory, basePkg);
    const flights = getDestinationFlights(pkgCategory, basePkg, fromCity);
    setSelectedHotel(hotels[0]);
    setSelectedTransfer(transfers[0]);
    setSelectedFlight(flights[0]);
  }, [basePkg?.id, pkgCategory, fromCity]);

  const details = getDestinationDetails(pkgCategory, basePkg, selectedHotel || hotelOptions[0], selectedTransfer || transferOptions[0]);

  // Day accordion expand/collapse
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: true });

  useEffect(() => {
    if (details?.itinerary) {
      const exp: Record<number, boolean> = {};
      details.itinerary.forEach((_, idx) => {
        exp[idx] = idx < 4;
      });
      setExpandedDays(exp);
    }
  }, [basePkg?.id, details?.itinerary?.length]);


  // Price Calculations
  const numericActualPrice = parseInt(basePkg.actualPrice?.replace(/[^\d]/g, '') || '28999', 10);
  const numericOriginalPrice = parseInt(basePkg.originalPrice?.replace(/[^\d]/g, '') || '34999', 10);

  const roomUpgradeFee = selectedRoomUpgrade?.price || 0;
  const hotelDiffFee = selectedHotel?.priceDiff || 0;
  const transferDiffFee = selectedTransfer?.priceDiff || 0;
  const flightFee = includeFlights ? ((selectedFlight?.basePrice || 0) + (selectedFlight?.priceDiff || 0)) : 0;

  const pricePerPerson = Math.max(1000, numericActualPrice + roomUpgradeFee + hotelDiffFee + transferDiffFee + flightFee);
  const totalBasePrice = pricePerPerson * adults;
  const taxesAndFees = Math.round(totalBasePrice * 0.05); // 5% GST
  const grandTotalPrice = totalBasePrice + taxesAndFees;
  const baseSavings = basePkg.saveAmount
    ? parseInt(basePkg.saveAmount.replace(/[^\d]/g, ''), 10)
    : Math.max(0, numericOriginalPrice - numericActualPrice);
  const perPersonSavings = baseSavings + (includeFlights ? 6500 : 0);
  const totalSavings = perPersonSavings * adults;

  const toggleDay = (idx) => {
    setExpandedDays(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleAllDays = () => {
    const allExpanded = Object.values(expandedDays).every(v => v);
    const updated: Record<number, boolean> = {};
    details.itinerary.forEach((_, idx) => {
      updated[idx] = !allExpanded;
    });
    setExpandedDays(updated);
  };

  const handleProceedToBook = () => {
    if (!departDate) {
      toast.error('Please select your preferred departure date!');
      return;
    }

    setCheckoutItem({
      type: 'holiday',
      pkgId: basePkg.id,
      title: basePkg.title,
      duration: basePkg.duration,
      fromCity,
      travelDate: departDate,
      adults,
      children,
      rooms,
      pricePerPerson,
      originalPricePerPerson: numericOriginalPrice + (includeFlights ? flightFee + 8000 : 0),
      totalBasePrice,
      taxesAndFees,
      grandTotalPrice,
      totalSavings,
      includeFlights,
      flightDetails: includeFlights ? selectedFlight : null,
      selectedRoom: selectedRoomUpgrade.name,
      hotelName: selectedHotel.name,
      transferType: selectedTransfer.name,
      hotelDetails: selectedHotel,
      transferDetails: selectedTransfer,
      images: basePkg.images
    });

    navigate(ROUTES.HOLIDAY_CHECKOUT);
  };

  // Filtered & Sorted Flight List for Modal
  const sortedFlightOptions = [...flightOptions].sort((a, b) => {
    if (flightSortBy === 'price_asc') {
      const priceA = a.basePrice + (a.priceDiff || 0);
      const priceB = b.basePrice + (b.priceDiff || 0);
      return priceA - priceB;
    }
    if (flightSortBy === 'duration') {
      const getMin = (str = '') => {
        const h = parseInt(str.match(/(\d+)h/)?.[1] || '0', 10);
        const m = parseInt(str.match(/(\d+)m/)?.[1] || '0', 10);
        return h * 60 + m;
      };
      return getMin(a.onward?.duration) - getMin(b.onward?.duration);
    }
    return 0; // recommended default
  });

  // Filtered & Sorted Hotel List for Modal
  const filteredHotelOptions = hotelOptions.filter(hotel => {
    if (hotelSearchQuery) {
      const q = hotelSearchQuery.toLowerCase();
      const matchName = hotel.name.toLowerCase().includes(q);
      const matchLoc = hotel.location.toLowerCase().includes(q);
      if (!matchName && !matchLoc) return false;
    }
    if (hotelFilterBreakfast && !hotel.hasBreakfast) return false;
    if (hotelFilterStar !== 'all' && hotel.starRating !== parseInt(hotelFilterStar, 10)) return false;
    return true;
  }).sort((a, b) => {
    if (hotelSortBy === 'price_asc') return a.priceDiff - b.priceDiff;
    if (hotelSortBy === 'price_desc') return b.priceDiff - a.priceDiff;
    if (hotelSortBy === 'rating') return b.userRating - a.userRating;
    return 0;
  });

  return (
    <div className="leh-hld-page text-start pb-5">


      {/* 2. TOP SEARCH CONTEXT STRIP */}
      <section className="leh-hld-strip sticky-top">
        <div className="container">
          <div className="row align-items-center g-2">
            <div className="col-12">
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => navigate(ROUTES.HOLIDAY_SEARCH)}
                  className="btn btn-sm btn-light border me-1"
                  title="Back to search results"
                >
                  <i className="fa-solid fa-arrow-left" style={{ fontSize: '13px' }}></i>
                </button>

                <div className="leh-strip-box flex-grow-1 flex-wrap">
                  <div className="leh-strip-item flex-grow-1" onClick={() => setShowModifyModal(true)}>
                    <span className="leh-strip-label">Starting From</span>
                    <span className="leh-strip-value text-primary">
                      <i className="fa-solid fa-city" style={{ fontSize: '12px' }}></i> {fromCity}
                    </span>
                  </div>

                  <div className="leh-strip-item flex-grow-1" onClick={() => setShowModifyModal(true)}>
                    <span className="leh-strip-label">Departure Date</span>
                    <span className="leh-strip-value">
                      <i className="fa-solid fa-calendar-days text-muted" style={{ fontSize: '12px' }}></i> {departDate}
                    </span>
                  </div>

                  <div className="leh-strip-item flex-grow-1" onClick={() => setShowGuestModal(true)}>
                    <span className="leh-strip-label">Rooms & Guests</span>
                    <span className="leh-strip-value">
                      <i className="fa-solid fa-users text-muted" style={{ fontSize: '12px' }}></i> {rooms} Room, {adults + children} Guests
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PACKAGE TITLE, BADGES & 5-IMAGE COLLAGE HERO */}
      <section className="container pt-4 mb-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-2 mb-3">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-primary px-3 py-1.5 rounded-pill fs-9 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                CUSTOMIZABLE
              </span>
              <span className="badge bg-danger px-3 py-1.5 rounded-pill fs-9 fw-bold">
                {basePkg.promoText || 'MONSOON SALE!'}
              </span>
              <span className="badge bg-white text-dark border px-3 py-1.5 rounded-pill fs-9 fw-bold shadow-sm">
                <i className="fa-regular fa-clock text-primary me-1"></i> {basePkg.duration}
              </span>
            </div>
            <h1 className="fw-black text-dark fs-3 mb-1">{basePkg.title}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 fs-8" style={{ color: "#4a5568" }}>
              <span><i className="fa-solid fa-location-dot text-danger me-1"></i> {fromCity} ➔ {basePkg.itinerary.replace(/ • /g, ' ➔ ')}</span>
              <span>•</span>
              <span className="d-flex align-items-center fw-bold" style={{ color: "#b45309" }}>
                <i className="fa-solid fa-star me-1"></i> {basePkg.rating || 4.8} / 5 ({basePkg.reviews || 412} verified ratings)
              </span>
            </div>
          </div>
        </div>

        {/* 5-Photo Collage Grid */}
        <div className="leh-hld-gallery">
          <div className="leh-gallery-main" onClick={() => { setSelectedGalleryImg(0); setShowGalleryModal(true); }}>
            <img src={basePkg.images?.[0] || '/images/holidays/kerala.webp'} alt={basePkg.title} fetchPriority="high" decoding="async" />
          </div>
          <div className="leh-gallery-grid">
            {(basePkg.images?.slice(1, 5) || []).map((imgUrl, idx) => (
              <div key={idx} className="leh-gallery-thumb" onClick={() => { setSelectedGalleryImg(idx + 1); setShowGalleryModal(true); }}>
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
          <button className="leh-gallery-btn" onClick={() => setShowGalleryModal(true)}>
            <i className="fa-solid fa-camera" ></i> View All Photos ({basePkg.images?.length || 5})
          </button>
        </div>
      </section>

      {/* 4. STICKY SUB-NAVIGATION TAB BAR (ALL 8 TABS) */}
      <section className="leh-subnav-wrapper">
        <div className="container">
          <ul className="leh-subnav-list">
            {[
              { id: 'itinerary', label: 'Day Plan & Itinerary' },
              { id: 'flights', label: 'Flights' },
              { id: 'hotels', label: 'Hotels & Stays' },
              { id: 'transfers', label: 'Transfers & Cab' },
              { id: 'activities', label: 'Activities & Sightseeing' },
              { id: 'inclusions', label: 'Inclusions & Exclusions' },
              { id: 'policies', label: 'Policies & Terms' },
              { id: 'reviews', label: 'Ratings & Reviews' }
            ].map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    const el = document.getElementById(`section-${tab.id}`);
                    if (el) {
                      const offset = 140;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`leh-subnav-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. MAIN CONTENT AREA: 2-COLUMN LAYOUT */}
      <div className="container py-4">
        <div className="row g-4">
          {/* LEFT COLUMN: DETAILED CONTENT SECTIONS */}
          <div className="col-lg-8">
            
            {/* TRIP SNAPSHOT CARDS */}
            <div className="leh-snapshot-grid">
              <div
                className="leh-snapshot-item cursor-pointer"
                onClick={() => {
                  if (!includeFlights) {
                    setIncludeFlights(true);
                  }
                  setShowFlightModal(true);
                }}
                title="Click to view & change flights"
              >
                <div
                  className="leh-snapshot-icon"
                  style={{
                    backgroundColor: includeFlights ? '#e8f0fe' : '#f8f9fa',
                    color: includeFlights ? '#0061ae' : '#5f6368'
                  }}
                >
                  <i className="fa-solid fa-plane" ></i>
                </div>
                <div className="leh-snapshot-text">
                  <span className="leh-snapshot-label" title={includeFlights ? 'Flights (Included)' : 'Flights (Optional)'}>
                    {includeFlights ? 'Flights (Incl.)' : 'Flights (Opt.)'}
                  </span>
                  {includeFlights ? (
                    <strong className="leh-snapshot-value text-primary">
                      {selectedFlight?.airline} ({selectedFlight?.onward?.departureCode} ⇄ {selectedFlight?.onward?.arrivalCode}) ✎
                    </strong>
                  ) : (
                    <strong className="leh-snapshot-value text-secondary">
                      + Add Flights ✎
                    </strong>
                  )}
                </div>
              </div>
              <div className="leh-snapshot-item cursor-pointer" onClick={() => setShowHotelModal(true)} title="Click to Change Hotel">
                <div className="leh-snapshot-icon"><i className="fa-solid fa-hotel" ></i></div>
                <div className="leh-snapshot-text">
                  <span className="leh-snapshot-label" title="Accommodations">Accommodations</span>
                  <strong className="leh-snapshot-value text-primary">{selectedHotel.name.split(' ')[0]} {selectedHotel.name.split(' ')[1]}... ✎</strong>
                </div>
              </div>
              <div className="leh-snapshot-item cursor-pointer" onClick={() => setShowTransferModal(true)} title="Click to Change Transfer">
                <div className="leh-snapshot-icon"><i className="fa-solid fa-car" ></i></div>
                <div className="leh-snapshot-text">
                  <span className="leh-snapshot-label" title="Transfers">Transfers</span>
                  <strong className="leh-snapshot-value text-primary">{selectedTransfer.name.split('(')[0]} ✎</strong>
                </div>
              </div>
              <div className="leh-snapshot-item">
                <div className="leh-snapshot-icon"><i className="fa-solid fa-utensils" ></i></div>
                <div className="leh-snapshot-text">
                  <span className="leh-snapshot-label" title="Meals">Meals</span>
                  <strong className="leh-snapshot-value text-dark">Breakfast Included</strong>
                </div>
              </div>
              <div className="leh-snapshot-item">
                <div className="leh-snapshot-icon"><i className="fa-solid fa-ticket" ></i></div>
                <div className="leh-snapshot-text">
                  <span className="leh-snapshot-label" title="Sightseeing">Sightseeing</span>
                  <strong className="leh-snapshot-value text-dark">6+ Experiences</strong>
                </div>
              </div>
            </div>

            {/* TAB 1: ITINERARY SECTION (DAY-WISE TIMELINE) */}
            <div id="section-itinerary" className="leh-card">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 leh-card-header">
                <div>
                  <h2 className="leh-card-title">Day-by-Day Detailed Itinerary</h2>
                  <small className="text-muted fs-8">Activity timings, sightseeing entry passes, and meal plans included</small>
                </div>
                <button onClick={toggleAllDays} className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fs-8 fw-bold">
                  {Object.values(expandedDays).every(v => v) ? 'Collapse All Days' : 'Expand All Days'}
                </button>
              </div>

              {/* Day Tab Pills */}
              <div className="d-flex gap-2 overflow-x-auto pb-3 mb-3 border-bottom">
                {details.itinerary.map((d, di) => (
                  <button
                    key={di}
                    onClick={() => {
                      setExpandedDays({ ...expandedDays, [di]: true });
                      const el = document.getElementById(`day-card-${di}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="btn btn-sm btn-light border rounded-pill px-3 py-1.5 fs-8 fw-bold whitespace-nowrap"
                  >
                    Day {d.day}
                  </button>
                ))}
              </div>

              {/* Timeline Container */}
              <div className="leh-timeline-container">
                {details.itinerary.map((dayItem, idx) => (
                  <div key={idx} id={`day-card-${idx}`} className="leh-day-node">
                    <div className="leh-day-dot">{dayItem.day}</div>
                    
                    <div className="leh-day-card">
                      <div className="leh-day-header" onClick={() => toggleDay(idx)}>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <span className="badge bg-primary px-3 py-1 rounded-pill fs-9 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                            DAY {dayItem.day}
                          </span>
                          <h3 className="fw-bold text-dark mb-0 fs-7">{dayItem.title}</h3>
                        </div>
                        <div className="d-flex align-items-center gap-2 text-secondary fs-8">
                          <span className="d-none d-md-inline fw-semibold">{dayItem.timing}</span>
                          {expandedDays[idx] ? <i className="fa-solid fa-chevron-up" ></i> : <i className="fa-solid fa-chevron-down" ></i>}
                        </div>
                      </div>

                      {expandedDays[idx] && (
                        <div className="leh-day-body">
                          <p className="leh-day-desc">{dayItem.desc}</p>
                          
                          {/* Meals Included Row */}
                          <div className="leh-meals-row">
                            <span className="fs-9 fw-bold text-muted text-uppercase me-1">Meals Included:</span>
                            {dayItem.meals.map((m, mi) => (
                              <span key={mi} className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fs-9 fw-bold">
                                <i className="fa-solid fa-utensils me-1"></i> {m}
                              </span>
                            ))}
                          </div>

                          {/* Included Activity Cards */}
                          <div className="leh-activity-list">
                            {dayItem.activities.map((act, actIdx) => (
                              <div key={actIdx} className="leh-activity-box">
                                <img src={act.img} alt={act.name} className="leh-activity-img" loading="lazy" decoding="async" />
                                <div className="d-flex flex-column justify-content-between flex-grow-1 w-100">
                                  <div>
                                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                                      <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1 rounded fs-9 fw-bold">
                                        {act.tag}
                                      </span>
                                      <span className="fs-9 text-muted d-flex align-items-center fw-semibold">
                                        <i className="fa-regular fa-clock me-1"></i> {act.duration}
                                      </span>
                                    </div>
                                    <h3 className="fw-bold text-dark fs-7 mb-1 mt-1">{act.name}</h3>
                                  </div>
                                  <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                                    <span className="text-success fs-9 fw-bold d-flex align-items-center">
                                      <i className="fa-solid fa-circle-check me-1"></i> Included in package
                                    </span>
                                    {act.isTransfer ? (
                                      <button
                                        onClick={() => setShowTransferModal(true)}
                                        className="btn btn-sm btn-link text-primary p-0 fs-8 fw-bold text-decoration-none"
                                      >
                                        Change Vehicle / Cab 🚗
                                      </button>
                                    ) : act.isHotel ? (
                                      <button
                                        onClick={() => setShowHotelModal(true)}
                                        className="btn btn-sm btn-link text-primary p-0 fs-8 fw-bold text-decoration-none"
                                      >
                                        Change Hotel 🏨
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => { setActiveDayToCustomize(dayItem.day); setShowActivityModal(true); }}
                                        className="btn btn-sm btn-link text-primary p-0 fs-8 fw-bold text-decoration-none"
                                      >
                                        Customize / Change
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TAB: ROUNDTRIP FLIGHTS SECTION */}
            <div id="section-flights" className="leh-card">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 leh-card-header">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h2 className="leh-card-title mb-0">Roundtrip Flights</h2>
                    <span className={`badge ${includeFlights ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border'} px-2.5 py-1 rounded-pill fs-9 fw-bold`}>
                      {includeFlights ? '✓ Included in Package' : 'Not Included'}
                    </span>
                  </div>
                  <small className="text-muted fs-8">
                    {includeFlights
                      ? `${fromCity} (${selectedFlight?.onward?.departureCode || 'DEL'}) ⇄ ${selectedFlight?.onward?.arrivalAirport || 'Destination'} roundtrip airfare with verified baggage & meals`
                      : `Add convenient roundtrip flights departing from ${fromCity} with included baggage and meals`}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {includeFlights ? (
                    <>
                      <button
                        onClick={() => setShowFlightModal(true)}
                        className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fs-8 fw-bold"
                        style={{ backgroundColor: '#0061ae' }}
                      >
                        <i className="fa-solid fa-arrow-right-arrow-left me-1"></i> Change Flight
                      </button>
                      <button
                        onClick={() => {
                          setIncludeFlights(false);
                          toast.success('Flights removed from package.');
                        }}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 fs-8 fw-bold"
                      >
                        <i className="fa-solid fa-xmark me-1"></i> Remove Flight
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIncludeFlights(true);
                        toast.success(`Added ${selectedFlight?.airline || 'Flights'} to your package!`);
                      }}
                      className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fs-8 fw-bold"
                      style={{ backgroundColor: '#0061ae' }}
                    >
                      <i className="fa-solid fa-plane me-1"></i> + Add Flights (+₹{((selectedFlight?.basePrice || 0) + (selectedFlight?.priceDiff || 0)).toLocaleString()}/person)
                    </button>
                  )}
                </div>
              </div>

              {includeFlights ? (
                <div className="d-flex flex-column gap-3">
                  {/* Onward Flight Card */}
                  <div className="border rounded-3 p-3bg-white shadow-xs">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary-subtle text-primary px-2.5 py-1 rounded fs-9 fw-bold">
                          ONWARD FLIGHT
                        </span>
                        <span className="fw-bold text-dark fs-8">
                          {selectedFlight?.airline} • {selectedFlight?.onward?.flightNumber}
                        </span>
                        <span className="text-muted fs-9">({selectedFlight?.onward?.aircraft})</span>
                      </div>
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-pill fs-9 fw-bold">
                        {selectedFlight?.badge || 'Confirmed Seat'}
                      </span>
                    </div>

                    <div className="row align-items-center g-3">
                      {/* Departure */}
                      <div className="col-md-3 col-sm-4 text-start">
                        <div className="fs-4 fw-black text-dark">{selectedFlight?.onward?.departureTime}</div>
                        <div className="fw-bold text-secondary fs-8">{selectedFlight?.onward?.departureAirport}</div>
                        <span className="badge bg-light text-muted border px-2 py-0.5 fs-9 mt-1">
                          {departDate}
                        </span>
                      </div>

                      {/* Flight Path / Duration */}
                      <div className="col-md-6 col-sm-4 text-center">
                        <div className="fs-9 text-muted fw-bold mb-1">{selectedFlight?.onward?.duration}</div>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <span style={{ width: '35%', height: '2px', backgroundColor: '#cbd5e1' }}></span>
                          <i className="fa-solid fa-plane text-primary" style={{ transform: 'rotate(0deg)' }}></i>
                          <span style={{ width: '35%', height: '2px', backgroundColor: '#cbd5e1' }}></span>
                        </div>
                        <div className="fs-9 text-secondary fw-semibold mt-1">
                          {selectedFlight?.onward?.stops}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="col-md-3 col-sm-4 text-end">
                        <div className="fs-4 fw-black text-dark">{selectedFlight?.onward?.arrivalTime}</div>
                        <div className="fw-bold text-secondary fs-8">{selectedFlight?.onward?.arrivalAirport}</div>
                        <span className="badge bg-light text-muted border px-2 py-0.5 fs-9 mt-1">
                          Arrival
                        </span>
                      </div>
                    </div>

                    {/* Flight Inclusions / Amenities */}
                    <div className="d-flex flex-wrap gap-2 pt-3 mt-3 border-top fs-8 text-secondary">
                      <span className="badge bg-light text-dark border px-2.5 py-1">
                        🧳 {selectedFlight?.baggage}
                      </span>
                      <span className="badge bg-light text-dark border px-2.5 py-1">
                        🍱 {selectedFlight?.meals}
                      </span>
                      <span className="badge bg-light text-dark border px-2.5 py-1">
                        💺 {selectedFlight?.seatPitch}
                      </span>
                      <span className="badge bg-light text-success border px-2.5 py-1">
                        ✓ {selectedFlight?.refundPolicy}
                      </span>
                    </div>
                  </div>

                  {/* Return Flight Card */}
                  <div className="border rounded-3 p-3bg-white shadow-xs">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded fs-9 fw-bold">
                          RETURN FLIGHT
                        </span>
                        <span className="fw-bold text-dark fs-8">
                          {selectedFlight?.airline} • {selectedFlight?.returnFlight?.flightNumber}
                        </span>
                        <span className="text-muted fs-9">({selectedFlight?.returnFlight?.aircraft})</span>
                      </div>
                      <span className="text-muted fs-9">Roundtrip Inclusions Applied</span>
                    </div>

                    <div className="row align-items-center g-3">
                      {/* Departure */}
                      <div className="col-md-3 col-sm-4 text-start">
                        <div className="fs-4 fw-black text-dark">{selectedFlight?.returnFlight?.departureTime}</div>
                        <div className="fw-bold text-secondary fs-8">{selectedFlight?.returnFlight?.departureAirport}</div>
                        <span className="badge bg-light text-muted border px-2 py-0.5 fs-9 mt-1">
                          Tour Return
                        </span>
                      </div>

                      {/* Flight Path / Duration */}
                      <div className="col-md-6 col-sm-4 text-center">
                        <div className="fs-9 text-muted fw-bold mb-1">{selectedFlight?.returnFlight?.duration}</div>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <span style={{ width: '35%', height: '2px', backgroundColor: '#cbd5e1' }}></span>
                          <i className="fa-solid fa-plane text-success" style={{ transform: 'rotate(180deg)' }}></i>
                          <span style={{ width: '35%', height: '2px', backgroundColor: '#cbd5e1' }}></span>
                        </div>
                        <div className="fs-9 text-secondary fw-semibold mt-1">
                          {selectedFlight?.returnFlight?.stops}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="col-md-3 col-sm-4 text-end">
                        <div className="fs-4 fw-black text-dark">{selectedFlight?.returnFlight?.arrivalTime}</div>
                        <div className="fw-bold text-secondary fs-8">{selectedFlight?.returnFlight?.arrivalAirport}</div>
                        <span className="badge bg-light text-muted border px-2 py-0.5 fs-9 mt-1">
                          {fromCity} Return
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
                      <span className="fs-9 text-muted">
                        Need different flight timings or a different airline?
                      </span>
                      <button
                        onClick={() => setShowFlightModal(true)}
                        className="btn btn-sm btn-link text-primary p-0 fs-8 fw-bold text-decoration-none"
                      >
                        Modify / Change Flight ✎
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-3 border bg-light text-center">
                  <div className="mb-2">
                    <span className="d-inline-flex p-3 rounded-circle bg-white shadow-sm text-primary fs-3">
                      <i className="fa-solid fa-plane" ></i>
                    </span>
                  </div>
                  <h3 className="fw-bold text-dark mb-1 fs-5">Flights Not Included in Current Selection</h3>
                  <p className="text-secondary fs-8 mb-3" style={{ maxWidth: '580px', margin: '0 auto' }}>
                    You have selected the land-only package. You can arrange your own flights or add roundtrip flights with {selectedFlight?.airline || 'major airlines'} departing from {fromCity} including 20-30kg check-in baggage, hot meals, and airport transfers.
                  </p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <button
                      onClick={() => {
                        setIncludeFlights(true);
                        toast.success(`Roundtrip flights added to package!`);
                      }}
                      className="btn btn-primary rounded-pill px-4 py-2 fs-8 fw-bold"
                      style={{ backgroundColor: '#0061ae' }}
                    >
                      + Add Flights with {selectedFlight?.airline} (+₹{((selectedFlight?.basePrice || 0) + (selectedFlight?.priceDiff || 0)).toLocaleString()}/person)
                    </button>
                    <button
                      onClick={() => {
                        setShowFlightModal(true);
                      }}
                      className="btn btn-outline-secondary rounded-pill px-4 py-2 fs-8 fw-bold"
                    >
                      Browse Available Flight Options
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TAB 2: HOTELS & STAYS SECTION */}
            <div id="section-hotels" className="leh-card">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 leh-card-header">
                <div>
                  <h2 className="leh-card-title">Hotels & Verified Stays</h2>
                  <small className="text-muted fs-8">Handpicked luxury stays with verified hygiene and amenities</small>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => setShowHotelModal(true)} className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fs-8 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                    <i className="fa-solid fa-arrow-right-arrow-left me-1"></i> Change Hotel
                  </button>
                  <button onClick={() => setShowRoomModal(true)} className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fs-8 fw-bold">
                    <i className="fa-solid fa-bed me-1"></i> Upgrade Room
                  </button>
                </div>
              </div>

              <div className="leh-stay-card mb-3">
                <div className="row g-4 align-items-center">
                  <div className="col-md-5">
                    <img src={selectedHotel.img} alt={selectedHotel.name} className="leh-stay-img" loading="lazy" decoding="async" />
                  </div>
                  <div className="col-md-7 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center gap-1 text-warning fs-8 mb-1">
                        {Array.from({ length: selectedHotel.rating }).map((_, i) => <i className="fa-solid fa-star" key={i}></i>)}
                        <span className="text-dark fw-bold ms-1">{selectedHotel.rating} Star Luxury</span>
                      </div>
                      <h3 className="fw-bold text-dark mb-1 fs-5">{selectedHotel.name}</h3>
                      <p className="text-muted fs-8 mb-2"><i className="fa-solid fa-location-dot text-danger me-1"></i> {selectedHotel.location}</p>
                      
                      <div className="leh-room-badge-box">
                        <div className="fs-8 fw-bold text-dark">Selected Room: {selectedRoomUpgrade.name}</div>
                        <div className="fs-9 text-success fw-bold mt-1"><i className="fa-solid fa-check me-1"></i> {selectedHotel.mealsIncluded || 'Breakfast is included'}</div>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {['Free Wi-Fi', 'Infinity Pool', 'Ayurvedic Spa', 'Valley View', 'Fine Dining'].map((am, ai) => (
                          <span key={ai} className="badge bg-light text-secondary border px-2.5 py-1 fs-9">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                      <span className="fs-9 text-muted">Check-in: <b>02:00 PM</b> | Check-out: <b>11:00 AM</b></span>
                      <div className="d-flex gap-2">
                        <button onClick={() => setShowHotelModal(true)} className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fs-8 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                          Change Hotel
                        </button>
                        <button onClick={() => setShowRoomModal(true)} className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fs-8 fw-bold">
                          Change Room
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 3: TRANSFERS & COMMUTE SECTION */}
            <div id="section-transfers" className="leh-card">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 leh-card-header">
                <div>
                  <h2 className="leh-card-title">Transfers & Private Cab</h2>
                  <small className="text-muted fs-8">Dedicated sanitized private vehicle for airport and sightseeing</small>
                </div>
                <button onClick={() => setShowTransferModal(true)} className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fs-8 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                  <i className="fa-solid fa-arrow-right-arrow-left me-1"></i> Change Transfer
                </button>
              </div>
              
              <div className="leh-transfer-card">
                <div className="row align-items-center g-4">
                  <div className="col-md-4 text-center">
                    <img src={selectedTransfer.img} alt={selectedTransfer.name} className="img-fluid rounded-3 shadow-sm mb-2" style={{ maxHeight: '140px', objectFit: 'cover' }} loading="lazy" decoding="async" />
                    <div className="fw-bold text-dark fs-7">{selectedTransfer.name}</div>
                    <small className="text-muted">{selectedTransfer.category}</small>
                  </div>
                  <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h3 className="fw-bold text-dark mb-0 fs-7">{selectedTransfer.category}</h3>
                      <button onClick={() => setShowTransferModal(true)} className="btn btn-sm btn-link text-primary p-0 fw-bold fs-8 text-decoration-none">
                        CHANGE VEHICLE ✎
                      </button>
                    </div>
                    <p className="fs-8 text-secondary mb-2">{selectedTransfer.routes}</p>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedTransfer.facilities.map((ft, fi) => (
                        <span key={fi} className="badge bg-white text-secondary border px-3 py-1.5 fs-9 shadow-sm">
                          ✓ {ft}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 4: ACTIVITIES & SIGHTSEEING SECTION */}
            <div id="section-activities" className="leh-card">
              <div className="leh-card-header">
                <h2 className="leh-card-title">Activities & Included Passes</h2>
              </div>
              
              <div className="d-flex flex-column gap-3">
                {(details.activities || []).map((act, ai) => (
                  <div key={ai} className="d-flex align-items-center justify-content-between p-3border rounded-3 bg-light">
                    <div className="d-flex align-items-center gap-3">
                      <img src={act.img} alt={act.name} className="rounded-3 shadow-sm" style={{ width: '85px', height: '65px', objectFit: 'cover' }} loading="lazy" decoding="async" />
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-secondary-subtle text-secondary px-2.5 py-0.5 rounded fs-9 fw-bold">
                            {act.tag}
                          </span>
                          <span className="fs-9 text-muted fw-semibold"><i className="fa-regular fa-clock me-1"></i> {act.duration}</span>
                        </div>
                        <h3 className="fw-bold text-dark mb-0 fs-8">{act.name}</h3>
                      </div>
                    </div>
                    <div className="text-end">
                      {act.included ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill fs-8 fw-bold">
                          ✓ Included
                        </span>
                      ) : (
                        <div>
                          <span className="fs-8 fw-bold text-dark d-block">+ ₹{act.price} / person</span>
                          <button className="btn btn-sm btn-outline-primary rounded-pill px-3 py-0.5 mt-1 fs-9 fw-bold">
                            Add to Plan
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TAB 5: INCLUSIONS & EXCLUSIONS SECTION */}
            <div id="section-inclusions" className="leh-card">
              <div className="leh-card-header">
                <h2 className="leh-card-title">Inclusions & Exclusions</h2>
              </div>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="leh-inc-box h-100">
                    <h3 className="fw-bold text-success mb-3 d-flex align-items-center fs-7">
                      <i className="fa-solid fa-circle-check me-2"></i> What is INCLUDED
                    </h3>
                    <ul className="list-unstyled d-flex flex-column gap-3 fs-8 text-dark mb-0">
                      {includeFlights && (
                        <li className="d-flex align-items-start gap-2 text-primary fw-semibold">
                          <i className="fa-solid fa-check text-success mt-1 flex-shrink-0"></i>
                          <span>Roundtrip Airfare: {selectedFlight?.airline} ({fromCity} ⇄ {selectedFlight?.onward?.arrivalAirport}) with {selectedFlight?.baggage} & hot meals</span>
                        </li>
                      )}
                      {details.inclusions.map((inc, i) => (
                        <li key={i} className="d-flex align-items-start gap-2">
                          <i className="fa-solid fa-check text-success mt-1 flex-shrink-0"></i>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="leh-exc-box h-100">
                    <h3 className="fw-bold text-danger mb-3 d-flex align-items-center fs-7">
                      <i className="fa-solid fa-xmark me-2"></i> What is NOT INCLUDED
                    </h3>
                    <ul className="list-unstyled d-flex flex-column gap-3 fs-8 text-dark mb-0">
                      {!includeFlights && (
                        <li className="d-flex align-items-start gap-2 text-muted">
                          <i className="fa-solid fa-xmark text-danger mt-1 flex-shrink-0"></i>
                          <span>Roundtrip Airfare / Flights (Available as optional add-on above)</span>
                        </li>
                      )}
                      {details.exclusions.map((exc, i) => (
                        <li key={i} className="d-flex align-items-start gap-2">
                          <i className="fa-solid fa-xmark text-danger mt-1 flex-shrink-0"></i>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 6: POLICIES & TERMS SECTION */}
            <div id="section-policies" className="leh-card">
              <div className="leh-card-header">
                <h2 className="leh-card-title">Cancellation Policy & Terms</h2>
              </div>
              
              <div className="table-responsive mb-4">
                <table className="table table-bordered fs-8 mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="p-3">Cancellation Timeline</th>
                      <th className="p-3">Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3">30+ Days before departure</td>
                      <td className="p-3 text-success fw-bold">90% Refund (10% standard processing fee)</td>
                    </tr>
                    <tr>
                      <td className="p-3">15 to 30 Days before departure</td>
                      <td className="p-3 text-primary fw-bold">75% Refund</td>
                    </tr>
                    <tr>
                      <td className="p-3">7 to 14 Days before departure</td>
                      <td className="p-3 text-warning fw-bold">50% Refund</td>
                    </tr>
                    <tr>
                      <td className="p-3">Less than 7 Days before departure</td>
                      <td className="p-3 text-danger fw-bold">Non-Refundable</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="alert alert-info border-0 rounded-3 fs-8 mb-0 p-3">
                <i className="fa-solid fa-circle-info me-2"></i>
                <b>Payment Schedule:</b> Pay only 20% advance today to lock your package pricing and dates. Remaining balance can be paid 7 days prior to departure.
              </div>
            </div>

            {/* TAB 7: RATINGS & REVIEWS SECTION */}
            <div id="section-reviews" className="leh-card">
              <div className="leh-card-header d-flex justify-content-between align-items-center">
                <h2 className="leh-card-title">Verified Traveler Reviews</h2>
                <div className="d-flex align-items-center gap-1 text-warning fw-bold fs-7">
                  <i className="fa-solid fa-star" ></i> {basePkg.rating || 4.8} / 5 ({basePkg.reviews || 412} reviews)
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {(details.reviews || []).map((rev, ri) => (
                  <div key={ri} className="leh-review-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <img src={rev.avatar} alt={rev.name} className="rounded-circle shadow-sm" style={{ width: '40px', height: '40px', objectFit: 'cover' }} loading="lazy" decoding="async" />
                        <div>
                          <strong className="text-dark fs-8 d-block">{rev.name}</strong>
                          <small className="text-muted fs-9">Traveled in {rev.date}</small>
                        </div>
                      </div>
                      <div className="d-flex text-warning fs-9">
                        {Array.from({ length: rev.rating }).map((_, i) => <i className="fa-solid fa-star" key={i}></i>)}
                      </div>
                    </div>
                    <p className="fs-8 text-secondary mb-0 leading-relaxed">{rev.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING WIDGET */}
          <div className="col-lg-4 position-relative">
            <div className="leh-price-widget" style={{ position: 'sticky', top: '135px', zIndex: 850 }}>
              {/* Urgency Badge */}
              <div className="leh-urgency-banner">
                <i className="fa-solid fa-fire" ></i> High Demand • 18 Travelers Booked Today
              </div>

              {/* FLIGHT INCLUSION TOGGLE (Without Flight vs With Flight) */}
              <div className="my-3 p-1 bg-light rounded-pill border d-flex align-items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (includeFlights) {
                      setIncludeFlights(false);
                      toast.success('Switched to Without Flight package.');
                    }
                  }}
                  className={`btn btn-sm w-50 rounded-pill py-2 fs-8 fw-bold border-0 transition-all ${
                    !includeFlights
                      ? 'bg-white text-dark shadow-sm'
                      : 'text-muted'
                  }`}
                >
                  Without Flight
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!includeFlights) {
                      setIncludeFlights(true);
                      toast.success(`Switched to With Flight (${selectedFlight?.airline})!`);
                    }
                  }}
                  className={`btn btn-sm w-50 rounded-pill py-2 fs-8 fw-bold border-0 transition-all ${
                    includeFlights
                      ? 'text-white shadow-sm'
                      : 'text-muted'
                  }`}
                  style={includeFlights ? { backgroundColor: '#0061ae' } : {}}
                >
                  ✈ With Flight
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-danger px-3 py-1 rounded-pill fs-9 fw-bold">
                  {basePkg.promoText || 'MONSOON SALE!'}
                </span>
                <span className="text-success fs-8 fw-bold">
                  Save ₹{basePkg.saveAmount || perPersonSavings.toLocaleString()} / person
                </span>
              </div>

              <div className="mb-3">
                <span className="text-muted text-decoration-line-through fs-7">
                  ₹{(numericOriginalPrice + (includeFlights ? flightFee + 8000 : 0)).toLocaleString()}
                </span>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="fs-2 fw-black text-dark">
                    ₹{pricePerPerson.toLocaleString()}
                  </span>
                  <span className="text-muted fs-8">/ person on twin sharing</span>
                </div>
                <small className="text-muted d-block mt-0.5">
                  Total for {adults} Traveler(s): <b>₹{totalBasePrice.toLocaleString()}</b> (+ 5% GST ₹{taxesAndFees.toLocaleString()})
                </small>
                <div className="text-success fs-9 fw-bold mt-1">
                  Total Savings: ₹{totalSavings.toLocaleString()} for {adults} Travelers
                </div>
              </div>

              {/* Trip Summary Mini Table */}
              <div className="d-flex flex-column gap-2.5 mb-4 fs-8 border-bottom pb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Departure City:</span>
                  <strong className="text-dark">{fromCity}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Travel Date:</span>
                  <strong className="text-dark">{departDate}</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Flights:</span>
                  {includeFlights ? (
                    <strong
                      className="text-primary cursor-pointer d-flex align-items-center gap-1"
                      onClick={() => setShowFlightModal(true)}
                      title="Click to Change Flight"
                    >
                      <i className="fa-solid fa-plane fs-9"></i> {selectedFlight?.airline} ({selectedFlight?.code}) ✎
                    </strong>
                  ) : (
                    <span
                      className="text-primary text-decoration-underline cursor-pointer fs-9 fw-bold"
                      onClick={() => {
                        setIncludeFlights(true);
                        setShowFlightModal(true);
                      }}
                    >
                      + Add Flight ✎
                    </span>
                  )}
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Selected Stay:</span>
                  <strong className="text-primary cursor-pointer" onClick={() => setShowHotelModal(true)}>{selectedHotel.name.split(' ')[0]} {selectedHotel.name.split(' ')[1]}... ✎</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Selected Cab:</span>
                  <strong className="text-primary cursor-pointer" onClick={() => setShowTransferModal(true)}>{selectedTransfer.name.split('(')[0]} ✎</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Guests & Rooms:</span>
                  <strong className="text-dark">{adults} Adults, {rooms} Room</strong>
                </div>
              </div>

              {/* PROCEED TO BOOK & CUSTOMISE TRIP BUTTONS */}
              <div className="d-flex flex-column gap-2 mb-3">
                <button
                  onClick={handleProceedToBook}
                  className="leh-book-btn"
                >
                  PROCEED TO BOOK <i className="fa-solid fa-arrow-left" style={{ transform: 'rotate(180deg)' }}></i>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomiseModal(true)}
                  className="btn btn-outline-primary rounded-pill py-2.5 fs-8 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ borderColor: '#0061ae', color: '#0061ae' }}
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Customise my trip
                </button>
              </div>

              <div className="leh-emi-banner">
                💳 No-Cost EMI options available starting at <b>₹{Math.round(grandTotalPrice / 6).toLocaleString()}/month</b>
              </div>

              {/* Trust & Safety Highlights */}
              <div className="d-flex flex-column gap-2.5 fs-8 text-secondary">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-success"></i>
                  <span>100% Verified Hotels & Private Transport</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-check text-success"></i>
                  <span>Free cancellation within 24 hours of booking</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-phone text-primary"></i>
                  <span>24x7 Dedicated Trip Support on WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. CHANGE TRANSFER MODAL (Matching Screenshot 1: media_1788968735284.png) */}
      {/* ========================================================================= */}
      {showTransferModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-4 pt-4 pb-3 align-items-start">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Change Transfer</h4>
                  <div className="fs-7 text-dark fw-semibold">
                    {pkgCategory === 'kerala' || basePkg.id?.includes('krl') ? 'Munnar - Thekkady - Alleppey' : basePkg.itinerary || 'City Tours & Airport Transfers'}
                  </div>
                  <div className="fs-8 text-muted fst-italic mt-0.5">
                    Changes would be reflected to whole itinerary
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowTransferModal(false)}></button>
              </div>

              {/* Modal Body: Transfer Cards List */}
              <div className="modal-body p-4">
                <div className="d-flex flex-column gap-3">
                  {transferOptions.map((item) => {
                    const isSelected = selectedTransfer.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`leh-transfer-card-modal ${isSelected ? 'selected' : ''}`}
                      >
                        {/* Red Selected Badge */}
                        {isSelected && (
                          <div className="leh-transfer-selected-badge">
                            <i className="fa-solid fa-check" style={{ fontSize: '9px' }}></i> SELECTED
                          </div>
                        )}

                        <div className="row g-3 align-items-center">
                          {/* Left: Car Image */}
                          <div className="col-md-3 text-center">
                            <img src={item.img}
                              alt={item.name}
                              className="img-fluid rounded-3"
                              style={{ maxHeight: '110px', objectFit: 'contain' }}
                            loading="lazy" decoding="async" />
                          </div>

                          {/* Middle: Vehicle details & Facilities */}
                          <div className="col-md-6">
                            <div className="d-flex align-items-baseline justify-content-between mb-1">
                              <h5 className="fw-bold text-dark mb-0 fs-6">{item.name}</h5>
                            </div>
                            <div className="fs-8 text-secondary mb-2">{item.category}</div>

                            {/* Facilities Row */}
                            <div className="d-flex flex-wrap align-items-center gap-2 py-2 border-top border-bottom fs-8 text-dark mb-2">
                              <span className="fw-bold text-muted">Facilities:</span>
                              {item.facilities.map((fac, fi) => (
                                <span key={fi} className="d-inline-flex align-items-center gap-1">
                                  {fac.includes('seater') && '💺'}
                                  {fac.includes('AC') && '❄️'}
                                  {fac.includes('Luggage') && '🧳'}
                                  {fac.includes('luggage') && '🧳'}
                                  {fac.includes('Water') && '⭐'}
                                  {fac.includes('Charger') && '⭐'}
                                  {fac.includes('First Aid') && '🩹'}
                                  {fac.includes('Seats') && '⭐'}
                                  {fac.includes('Comfort') && '⭐'}
                                  {fac}
                                </span>
                              ))}
                            </div>

                            <div className="fs-8 text-muted">
                              {item.routes}
                            </div>
                          </div>

                          {/* Right: Price diff & Action button */}
                          <div className="col-md-3 text-end d-flex flex-column justify-content-between align-items-end" style={{ minHeight: '110px' }}>
                            <button
                              onClick={() => setSelectedTransferDetail(item)}
                              className="btn btn-link text-primary p-0 fs-9 fw-bold text-uppercase text-decoration-none"
                            >
                              VIEW DETAILS
                            </button>

                            <div className="my-auto">
                              {item.priceDiff === 0 ? (
                                <span className="fs-8 fw-bold text-muted d-block">Included in Base</span>
                              ) : item.priceDiff < 0 ? (
                                <div>
                                  <div className="fs-5 fw-black text-dark">
                                    -₹{Math.abs(item.priceDiff).toLocaleString()}
                                  </div>
                                  <small className="text-muted fs-9">Price/Person</small>
                                </div>
                              ) : (
                                <div>
                                  <div className="fs-5 fw-black text-dark">
                                    + ₹{item.priceDiff.toLocaleString()}
                                  </div>
                                  <small className="text-muted fs-9">Price/Person</small>
                                </div>
                              )}
                            </div>

                            {isSelected ? (
                              <button
                                onClick={() => {
                                  // Switch to default or keep selected
                                  toast('This transfer is currently selected for your itinerary.');
                                }}
                                className="btn btn-link text-primary p-0 fs-8 fw-bold text-decoration-none text-uppercase"
                              >
                                REMOVE
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedTransfer(item);
                                  setShowTransferModal(false);
                                  toast.success(`Vehicle updated to ${item.name}!`);
                                }}
                                className="leh-select-btn-outline"
                              >
                                SELECT
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CHANGE HOTEL MODAL (Matching Screenshot 2: media_1788968833025.png) */}
      {/* ========================================================================= */}
      {showHotelModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-4 pt-4 pb-3 align-items-center">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Change Hotel</h4>
                  <div className="fs-7 text-dark fw-semibold">
                    {departDate} • {basePkg.duration || 'Full Tour'}
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowHotelModal(false)}></button>
              </div>

              {/* Search & Filter Bar */}
              <div className="px-4 py-3 bg-light border-bottom">
                <div className="row g-2 align-items-center mb-3">
                  <div className="col-md-9">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <i className="fa-solid fa-magnifying-glass" ></i>
                      </span>
                      <input
                        type="text"
                        value={hotelSearchQuery}
                        onChange={(e) => setHotelSearchQuery(e.target.value)}
                        placeholder="Search by hotel name or location"
                        className="form-control border-start-0 fs-8 py-2"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      value={hotelSortBy}
                      onChange={(e) => setHotelSortBy(e.target.value)}
                      className="form-select fs-8 py-2"
                    >
                      <option value="recommended">Sorted by: Recommended</option>
                      <option value="price_asc">Sorted by: Price (Low to High)</option>
                      <option value="price_desc">Sorted by: Price (High to Low)</option>
                      <option value="rating">Sorted by: Guest Rating</option>
                    </select>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    onClick={() => { setHotelFilterStar('all'); setHotelFilterBreakfast(false); setHotelSearchQuery(''); }}
                    className="leh-filter-pill"
                  >
                    <i className="fa-solid fa-sliders" style={{ fontSize: '11px' }}></i> All Filters
                  </button>
                  <button
                    onClick={() => setHotelFilterStar(hotelFilterStar === '5' ? 'all' : '5')}
                    className={`leh-filter-pill ${hotelFilterStar === '5' ? 'active' : ''}`}
                  >
                    Star Rating (5★)
                  </button>
                  <button
                    onClick={() => setHotelFilterStar(hotelFilterStar === '4' ? 'all' : '4')}
                    className={`leh-filter-pill ${hotelFilterStar === '4' ? 'active' : ''}`}
                  >
                    Star Rating (4★)
                  </button>
                  <button
                    onClick={() => setHotelFilterBreakfast(!hotelFilterBreakfast)}
                    className={`leh-filter-pill ${hotelFilterBreakfast ? 'active' : ''}`}
                  >
                    Free Breakfast Available (1)
                  </button>
                </div>
              </div>

              {/* Modal Body: Hotel Cards List */}
              <div className="modal-body p-4 leh-modal-scrollable-body">
                <div className="d-flex flex-column gap-3">
                  {filteredHotelOptions.map((item) => {
                    const isSelected = selectedHotel.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`leh-hotel-card-modal ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="row g-4">
                          {/* Left Column: Images Collage */}
                          <div className="col-md-4">
                            <img src={item.img}
                              alt={item.name}
                              className="img-fluid rounded-3 shadow-sm w-100"
                              style={{ height: '170px', objectFit: 'cover' }}
                            loading="lazy" decoding="async" />
                            {/* Thumbnails Row */}
                            <div className="leh-hotel-thumb-grid">
                              {item.thumbnails.slice(0, 3).map((thumb, ti) => (
                                <img key={ti}
                                  src={thumb}
                                  alt={`Thumb ${ti}`}
                                  className="leh-hotel-thumb-img"
                                  onClick={() => { setSelectedGalleryImg(ti); setShowGalleryModal(true); }}
                                  loading="lazy"
                                  decoding="async"
                                />
                              ))}
                              <div
                                className="leh-hotel-thumb-more cursor-pointer"
                                onClick={() => { setSelectedGalleryImg(0); setShowGalleryModal(true); }}
                              >
                                <img src={item.thumbnails[3] || item.img} alt="More" className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
                                <div className="leh-hotel-thumb-overlay">1+ View All</div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Details, AI Box, Room & Action */}
                          <div className="col-md-8 d-flex flex-column justify-content-between">
                            <div>
                              {/* Rating badge & reviews */}
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge bg-primary px-2.5 py-1 rounded fs-9 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                                  {item.userRating}
                                </span>
                                <strong className="fs-8 text-primary">{item.userRatingLabel}</strong>
                                <span className="fs-9 text-muted">({item.reviewsCount} Ratings)</span>
                              </div>

                              {/* Title & Stars */}
                              <h5 className="fw-bold text-dark mb-1">
                                {item.name}{' '}
                                <span className="text-warning fs-8">
                                  {Array.from({ length: item.rating }).map((_, i) => <i className="fa-solid fa-star" key={i}></i>)}
                                </span>
                              </h5>

                              {/* Location */}
                              <p className="fs-8 text-secondary mb-1">
                                {item.location}
                              </p>

                              {/* Guests & Dates Note */}
                              <div className="d-flex flex-wrap gap-3 fs-9 text-muted mb-2">
                                <span><i className="fa-solid fa-users me-1"></i> {item.guestsNote}</span>
                                <span>•</span>
                                <span><i className="fa-solid fa-calendar-days me-1"></i> {item.timingNote}</span>
                              </div>

                              {/* AI Summary Box */}
                              <div className="leh-ai-summary-box">
                                <span className="fs-6 mt-0.5">🤖</span>
                                <div>
                                  {item.aiSummary}{' '}
                                  <span className="fw-bold text-primary cursor-pointer text-decoration-underline" onClick={() => toast(item.aiSummary)}>Read more</span>
                                </div>
                              </div>

                              {/* Room Type & Meal Note */}
                              <div className="d-flex align-items-center justify-content-between mb-1">
                                <strong className="fs-8 text-dark">{item.roomType}</strong>
                                <button
                                  onClick={() => {
                                    setSelectedHotel(item);
                                    setShowRoomModal(true);
                                  }}
                                  className="btn btn-link text-primary p-0 fs-8 fw-bold text-decoration-none"
                                >
                                  Change Room
                                </button>
                              </div>

                              <div className="fs-8 text-dark mb-1">
                                <i className="fa-solid fa-utensils me-1 text-muted"></i> {item.mealsIncluded}
                              </div>

                              <div className="fs-9 text-success fw-bold">
                                ✓ {item.complimentaryNote}
                              </div>
                            </div>

                            {/* Footer: View Details & Select Button */}
                            <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3">
                              <button
                                onClick={() => setSelectedHotelDetail(item)}
                                className="btn btn-link text-primary p-0 fs-8 fw-bold text-decoration-none"
                              >
                                View Details
                              </button>

                              <div className="d-flex align-items-center gap-3">
                                {!isSelected && item.priceDiff > 0 && (
                                  <div className="text-end">
                                    <div className="fs-5 fw-black text-dark">+ ₹{item.priceDiff.toLocaleString()}</div>
                                    <small className="text-muted fs-9">/adult</small>
                                  </div>
                                )}

                                {isSelected ? (
                                  <button className="btn btn-primary rounded-pill px-4 py-2 fs-8 fw-bold shadow-sm" style={{ backgroundColor: '#0061ae' }}>
                                    ✓ SELECTED
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedHotel(item);
                                      if (item.roomOptions && item.roomOptions[0]) {
                                        setSelectedRoomUpgrade({ name: item.roomOptions[0].name, price: 0 });
                                      }
                                      setShowHotelModal(false);
                                      toast.success(`Hotel updated to ${item.name}!`);
                                    }}
                                    className="leh-select-btn-outline"
                                  >
                                    SELECT
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. ROOM UPGRADE MODAL */}
      {/* ========================================================================= */}
      {showRoomModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1070 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Upgrade Your Hotel Room</h5>
                  <small className="text-muted">{selectedHotel.name}</small>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowRoomModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                <div className="d-flex flex-column gap-3">
                  {(selectedHotel.roomOptions || []).map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedRoomUpgrade({ name: opt.name, price: opt.price })}
                      className={`card p-3 rounded-3 border cursor-pointer ${selectedRoomUpgrade.name === opt.name ? 'border-primary bg-primary-subtle' : 'border-light bg-light'}`}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <img src={opt.img} alt={opt.name} className="rounded-3" style={{ width: '80px', height: '60px', objectFit: 'cover' }} loading="lazy" decoding="async" />
                          <div>
                            <h6 className="fw-bold mb-1 text-dark">{opt.name}</h6>
                            <small className="text-muted">{opt.desc}</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-dark">
                            {opt.price === 0 ? 'Included in Base Price' : `+ ₹${opt.price.toLocaleString()} / person`}
                          </div>
                          {selectedRoomUpgrade.name === opt.name ? (
                            <span className="badge bg-primary px-3 py-1 rounded-pill mt-1" style={{ backgroundColor: '#0061ae' }}>Selected</span>
                          ) : (
                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 py-0.5 mt-1">Select</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  onClick={() => {
                    setShowRoomModal(false);
                    toast.success(`Room selected: ${selectedRoomUpgrade.name}`);
                  }}
                  className="btn btn-primary rounded-pill w-100 py-2.5 fw-bold"
                  style={{ backgroundColor: '#0061ae' }}
                >
                  Confirm Room Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. GUEST & ROOM SELECTION MODAL */}
      {/* ========================================================================= */}
      {showGuestModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Select Travelers & Rooms</h5>
                <button type="button" className="btn-close" onClick={() => setShowGuestModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                {/* Adults */}
                <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Adults</h6>
                    <small className="text-muted">Age 12+ years</small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                      disabled={adults <= 1}
                    >-</button>
                    <span className="fw-bold fs-6" style={{ minWidth: '20px', textAlign: 'center' }}>{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                    >+</button>
                  </div>
                </div>

                {/* Children */}
                <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Children</h6>
                    <small className="text-muted">Age 2-11 years</small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                      disabled={children <= 0}
                    >-</button>
                    <span className="fw-bold fs-6" style={{ minWidth: '20px', textAlign: 'center' }}>{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                    >+</button>
                  </div>
                </div>

                {/* Rooms */}
                <div className="d-flex align-items-center justify-content-between py-3">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Rooms</h6>
                    <small className="text-muted">Max 3 guests per room</small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                      disabled={rooms <= 1}
                    >-</button>
                    <span className="fw-bold fs-6" style={{ minWidth: '20px', textAlign: 'center' }}>{rooms}</span>
                    <button
                      onClick={() => setRooms(rooms + 1)}
                      className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                    >+</button>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  onClick={() => setShowGuestModal(false)}
                  className="btn btn-primary rounded-pill w-100 py-2.5 fw-bold"
                  style={{ backgroundColor: '#0061ae' }}
                >
                  Apply Travelers & Rooms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODIFY SEARCH STRIP MODAL */}
      {/* ========================================================================= */}
      {showModifyModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Modify Departure & Date</h5>
                <button type="button" className="btn-close" onClick={() => setShowModifyModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                <div className="mb-3">
                  <label className="form-label fs-8 fw-bold text-muted">Starting From City</label>
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="form-select form-select-lg fs-7"
                  >
                    <option value="New Delhi">New Delhi (DEL)</option>
                    <option value="Mumbai">Mumbai (BOM)</option>
                    <option value="Bengaluru">Bengaluru (BLR)</option>
                    <option value="Kolkata">Kolkata (CCU)</option>
                    <option value="Chennai">Chennai (MAA)</option>
                    <option value="Hyderabad">Hyderabad (HYD)</option>
                    <option value="Ahmedabad">Ahmedabad (AMD)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fs-8 fw-bold text-muted">Select Departure Date</label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="form-control form-control-lg fs-7"
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  onClick={() => setShowModifyModal(false)}
                  className="btn btn-primary rounded-pill w-100 py-2.5 fw-bold"
                  style={{ backgroundColor: '#0061ae' }}
                >
                  Update Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. FULL PHOTO GALLERY LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {showGalleryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1080 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 bg-dark text-white p-3">
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-bold text-white">Package Photo Gallery ({basePkg.title})</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowGalleryModal(false)}></button>
              </div>
              <div className="modal-body text-center p-2">
                <img src={basePkg.images?.[selectedGalleryImg] || basePkg.images?.[0]}
                  alt="Selected Gallery Preview"
                  className="img-fluid rounded-3 shadow-lg mb-3"
                  style={{ maxHeight: '450px', width: '100%', objectFit: 'cover' }}
                loading="lazy" decoding="async" />
                
                <div className="d-flex justify-content-center gap-2 overflow-x-auto py-2">
                  {(basePkg.images || []).map((imgUrl, idx) => (
                    <img key={idx}
                      src={imgUrl}
                      alt={`Thumb ${idx}`}
                      onClick={() => setSelectedGalleryImg(idx)}
                      loading="lazy"
                      decoding="async"
                      className={`rounded-2 cursor-pointer border ${selectedGalleryImg === idx ? 'border-primary border-3' : 'opacity-60'}`}
                      style={{ width: '70px', height: '50px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. ACTIVITY CUSTOMIZE MODAL */}
      {/* ========================================================================= */}
      {showActivityModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Customize Day {activeDayToCustomize} Activity</h5>
                <button type="button" className="btn-close" onClick={() => setShowActivityModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                <p className="fs-8 text-secondary mb-3">
                  You can swap or upgrade your sightseeing activities on Day {activeDayToCustomize}.
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 border rounded-3 bg-light cursor-pointer border-primary">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-8 text-dark">Standard Included Experience</span>
                      <span className="badge bg-success px-3 py-1 rounded-pill">Included</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-3 bg-white cursor-pointer shadow-sm" onClick={() => { setShowActivityModal(false); toast.success('VIP Pass option noted for your itinerary!'); }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold fs-8 text-dark">VIP Fast-Track & Private Guide Upgrade</div>
                        <small className="text-muted">+ ₹2,500 / person</small>
                      </div>
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fs-8 fw-bold">Choose</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="btn btn-secondary rounded-pill w-100 py-2.5 fs-8 fw-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. VEHICLE / TRANSFER VIEW DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedTransferDetail && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1070 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-3 px-md-4 py-3 bg-white d-flex align-items-start align-items-sm-center justify-content-between gap-2">
                <div className="d-flex align-items-start align-items-sm-center gap-2 gap-md-3 flex-grow-1" style={{ minWidth: 0 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedTransferDetail(null)}
                    className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1 mt-sm-0"
                    style={{ width: '36px', height: '36px' }}
                    title="Back to Transfers"
                  >
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '13px' }}></i>
                  </button>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <h4 className="fw-bold text-dark mb-0 fs-5 text-break">{selectedTransferDetail.name}</h4>
                      {selectedTransferDetail.category && (
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill fs-8 fw-semibold text-wrap text-start">
                          {selectedTransferDetail.category}
                        </span>
                      )}
                    </div>
                    <div className="text-muted fs-8 text-break lh-sm">
                      <span>Private Chauffeur-Driven Vehicle</span>
                      {selectedTransferDetail.routes && (
                        <>
                          <span className="mx-1.5">•</span>
                          <span>Route: {selectedTransferDetail.routes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close flex-shrink-0 ms-2 mt-1 mt-sm-0"
                  onClick={() => setSelectedTransferDetail(null)}
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 leh-modal-scrollable-body">
                {/* Hero Showcase Card */}
                <div className="leh-detail-hero-box mb-4">
                  <div className="row g-4 align-items-center">
                    <div className="col-md-5 text-center">
                      <img src={selectedTransferDetail.img}
                        alt={selectedTransferDetail.name}
                        className="img-fluid rounded-3 shadow-sm"
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                      loading="lazy" decoding="async" />
                      <div className="mt-2 fs-9 text-muted fw-semibold">
                        Car Models: <span className="text-dark fw-bold">{selectedTransferDetail.carModels}</span>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="leh-pill-badge bg-white shadow-sm border">
                          <i className="fa-solid fa-circle-check text-success"></i> 100% Private AC Vehicle
                        </span>
                        <span className="leh-pill-badge bg-white shadow-sm border">
                          <i className="fa-solid fa-circle-check text-success"></i> Verified Tourist Permit
                        </span>
                        <span className="leh-pill-badge bg-white shadow-sm border">
                          <i className="fa-solid fa-circle-check text-success"></i> Tolls & Fuel Included
                        </span>
                        <span className="leh-pill-badge bg-white shadow-sm border">
                          <i className="fa-solid fa-circle-check text-success"></i> Professional Chauffeur
                        </span>
                      </div>
                      <h5 className="fw-bold text-dark mb-2">Signature Chauffeur-Driven Experience</h5>
                      <p className="fs-8 text-secondary mb-3">
                        Travel in unmatched comfort and peace of mind with a dedicated private tourist vehicle assigned exclusively to your party for the entire duration of the itinerary. Includes all interstate permits, toll taxes, parking fees, and chauffeur allowances with zero hidden fees.
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedTransferDetail.facilities.map((fac, fi) => (
                          <span key={fi} className="badge bg-light text-dark border px-3 py-1.5 rounded-pill fs-8">
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Specifications Grid */}
                <h5 className="fw-bold text-dark mb-3">Vehicle Specifications & Amenities</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-4 col-sm-6">
                    <div className="leh-detail-spec-card">
                      <div className="leh-detail-spec-icon">💺</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 fs-8">Passenger Capacity</h6>
                        <p className="fs-9 text-secondary mb-0">{selectedTransferDetail.specs?.seating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="leh-detail-spec-card">
                      <div className="leh-detail-spec-icon">❄️</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 fs-8">AC & Climate Control</h6>
                        <p className="fs-9 text-secondary mb-0">{selectedTransferDetail.specs?.ac}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="leh-detail-spec-card">
                      <div className="leh-detail-spec-icon">🧳</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 fs-8">Luggage Capacity</h6>
                        <p className="fs-9 text-secondary mb-0">{selectedTransferDetail.specs?.luggage}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="leh-detail-spec-card">
                      <div className="leh-detail-spec-icon">⛽</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 fs-8">Toll & Fuel Inclusions</h6>
                        <p className="fs-9 text-secondary mb-0">{selectedTransferDetail.specs?.fuelTolls}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="leh-detail-spec-card">
                      <div className="leh-detail-spec-icon">⭐</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 fs-8">Onboard Amenities</h6>
                        <p className="fs-9 text-secondary mb-0">{selectedTransferDetail.specs?.amenities}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="leh-detail-spec-card">
                      <div className="leh-detail-spec-icon">🧑‍✈️</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 fs-8">Chauffeur Quality</h6>
                        <p className="fs-9 text-secondary mb-0">{selectedTransferDetail.specs?.driver}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itinerary Route & Sightseeing Coverage */}
                <div className="card rounded-3 border p-4 mb-4 bg-light">
                  <h5 className="fw-bold text-dark mb-1">Trip Route & Itinerary Coverage</h5>
                  <p className="fs-8 text-secondary mb-3">
                    This vehicle covers your entire travel plan including airport pickups, intercity drives, and local sightseeing passes with zero kilometer limit inside the itinerary.
                  </p>
                  <div className="leh-detail-route-timeline">
                    {(selectedTransferDetail.itineraryCoverage || []).map((step, si) => (
                      <div key={si} className="leh-detail-route-step">
                        <div className="leh-detail-route-dot">{si + 1}</div>
                        <h6 className="fw-bold text-dark mb-1 fs-8">{step.day}: {step.title}</h6>
                        <p className="fs-9 text-secondary mb-0">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety & LehConnect Standards */}
                <div className="card rounded-3 border-0 bg-primary-subtle p-4">
                  <h6 className="fw-bold text-primary mb-2 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-shield-halved" ></i> LehConnect Vehicle Safety & Quality Guarantee
                  </h6>
                  <div className="row g-2">
                    {(selectedTransferDetail.safetyFeatures || []).map((feat, fi) => (
                      <div key={fi} className="col-md-6">
                        <div className="fs-9 text-dark d-flex align-items-center gap-2">
                          <i className="fa-solid fa-check text-primary flex-shrink-0"></i>
                          <span>{feat}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top px-4 py-3 bg-white d-flex align-items-center justify-content-between">
                <div>
                  {selectedTransferDetail.priceDiff === 0 ? (
                    <div>
                      <span className="fs-5 fw-bold text-dark">Included in Base Price</span>
                      <div className="fs-9 text-muted">No additional transfer charge</div>
                    </div>
                  ) : selectedTransferDetail.priceDiff < 0 ? (
                    <div>
                      <span className="fs-4 fw-black text-success">- ₹{Math.abs(selectedTransferDetail.priceDiff).toLocaleString()}</span>
                      <span className="fs-8 text-muted"> / Person (Save on package)</span>
                    </div>
                  ) : (
                    <div>
                      <span className="fs-4 fw-black text-dark">+ ₹{selectedTransferDetail.priceDiff.toLocaleString()}</span>
                      <span className="fs-8 text-muted"> / Person upgrade</span>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-3">
                  <button
                    onClick={() => setSelectedTransferDetail(null)}
                    className="btn btn-outline-secondary rounded-pill px-4 py-2 fs-8 fw-bold"
                  >
                    Back to Transfer Options
                  </button>

                  {selectedTransfer.id === selectedTransferDetail.id ? (
                    <button className="btn btn-primary rounded-pill px-5 py-2.5 fs-8 fw-bold" style={{ backgroundColor: '#0061ae' }} disabled>
                      ✓ CURRENTLY SELECTED
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedTransfer(selectedTransferDetail);
                        setSelectedTransferDetail(null);
                        setShowTransferModal(false);
                        toast.success(`Vehicle updated to ${selectedTransferDetail.name}!`);
                      }}
                      className="btn btn-primary rounded-pill px-5 py-2.5 fs-8 fw-bold shadow-sm"
                      style={{ backgroundColor: '#0061ae' }}
                    >
                      SELECT THIS TRANSFER
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. HOTEL VIEW DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedHotelDetail && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1070 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-3 px-md-4 py-3 bg-white d-flex align-items-start align-items-sm-center justify-content-between gap-2">
                <div className="d-flex align-items-start align-items-sm-center gap-2 gap-md-3 flex-grow-1" style={{ minWidth: 0 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedHotelDetail(null)}
                    className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1 mt-sm-0"
                    style={{ width: '36px', height: '36px' }}
                    title="Back to Hotel List"
                  >
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '13px' }}></i>
                  </button>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <h4 className="fw-bold text-dark mb-0 fs-5 text-break">{selectedHotelDetail.name}</h4>
                      <div className="text-warning fs-8 d-inline-flex align-items-center">
                        {Array.from({ length: selectedHotelDetail.rating || 5 }).map((_, i) => (
                          <i className="fa-solid fa-star" key={i}></i>
                        ))}
                      </div>
                    </div>
                    <div className="text-muted fs-8 d-flex align-items-center gap-1 text-break lh-sm">
                      <i className="fa-solid fa-location-dot text-danger flex-shrink-0"></i> {selectedHotelDetail.location}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close flex-shrink-0 ms-2 mt-1 mt-sm-0"
                  onClick={() => setSelectedHotelDetail(null)}
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 leh-modal-scrollable-body">
                {/* Gallery Showcase */}
                <div className="row g-3 mb-4">
                  <div className="col-md-8">
                    <img src={selectedHotelDetail.img}
                      alt={selectedHotelDetail.name}
                      className="img-fluid rounded-3 shadow-sm w-100"
                      style={{ height: '320px', objectFit: 'cover' }}
                    loading="lazy" decoding="async" />
                  </div>
                  <div className="col-md-4 d-flex flex-column gap-2">
                    {(selectedHotelDetail.thumbnails || []).slice(0, 3).map((th, thi) => (
                      <img key={thi}
                        src={th}
                        alt={`Thumb ${thi}`}
                        className="rounded-3 w-100 cursor-pointer shadow-xs object-fit-cover"
                        style={{ height: '98px' }}
                      loading="lazy" decoding="async" />
                    ))}
                  </div>
                </div>

                {/* Rating, AI Summary & Highlights */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="badge bg-primary px-3 py-1.5 rounded-pill fs-8 fw-bold" style={{ backgroundColor: '#0061ae' }}>
                    {selectedHotelDetail.userRating} / 5
                  </span>
                  <strong className="fs-7 text-primary">{selectedHotelDetail.userRatingLabel}</strong>
                  <span className="fs-8 text-muted">({selectedHotelDetail.reviewsCount} Verified Guest Reviews)</span>
                </div>

                <div className="leh-ai-summary-box mb-4">
                  <span className="fs-5 mt-0.5">🤖</span>
                  <div>
                    <strong className="d-block mb-1">LehConnect AI Property Summary:</strong>
                    {selectedHotelDetail.aiSummary}
                  </div>
                </div>

                {/* Room Details & Inclusions */}
                <div className="card rounded-3 border p-4 mb-4 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Included Room: {selectedHotelDetail.roomType}</h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fs-8 fw-bold">
                      ✓ {selectedHotelDetail.mealsIncluded}
                    </span>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2 fs-8 text-dark mb-2">
                        <i className="fa-solid fa-bed text-primary"></i> King Size Bed / Twin Beds Available
                      </div>
                      <div className="d-flex align-items-center gap-2 fs-8 text-dark mb-2">
                        <i className="fa-solid fa-wifi text-primary"></i> Complimentary High-Speed Wi-Fi
                      </div>
                      <div className="d-flex align-items-center gap-2 fs-8 text-dark mb-2">
                        <i className="fa-solid fa-utensils text-primary"></i> {selectedHotelDetail.complimentaryNote}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2 fs-8 text-dark mb-2">
                        <i className="fa-regular fa-clock text-primary"></i> Check-in: 02:00 PM | Check-out: 11:00 AM
                      </div>
                      <div className="d-flex align-items-center gap-2 fs-8 text-dark mb-2">
                        <i className="fa-solid fa-users text-primary"></i> 1 Room | 2 Adults (Extra bed available)
                      </div>
                      <div className="d-flex align-items-center gap-2 fs-8 text-dark mb-2">
                        <i className="fa-solid fa-circle-check text-success"></i> Express Contactless Check-in
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Amenities */}
                <h5 className="fw-bold text-dark mb-3">Popular Property Amenities</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 bg-white border rounded-3 text-center">
                      <i className="fa-solid fa-person-swimming text-primary fs-4 mb-2"></i>
                      <h6 className="fw-bold fs-9 mb-0 text-dark">Swimming Pool / Jacuzzi</h6>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 bg-white border rounded-3 text-center">
                      <i className="fa-solid fa-spa text-primary fs-4 mb-2"></i>
                      <h6 className="fw-bold fs-9 mb-0 text-dark">Ayurvedic Rejuvenation Spa</h6>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 bg-white border rounded-3 text-center">
                      <i className="fa-solid fa-utensils text-primary fs-4 mb-2"></i>
                      <h6 className="fw-bold fs-9 mb-0 text-dark">Multi-Cuisine Restaurant</h6>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 bg-white border rounded-3 text-center">
                      <i className="fa-solid fa-wifi text-primary fs-4 mb-2"></i>
                      <h6 className="fw-bold fs-9 mb-0 text-dark">Free High-Speed Wi-Fi</h6>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top px-4 py-3 bg-white d-flex align-items-center justify-content-between">
                <div>
                  {selectedHotelDetail.priceDiff === 0 ? (
                    <div>
                      <span className="fs-5 fw-bold text-dark">Included in Base Price</span>
                      <div className="fs-9 text-muted">No extra room tariff</div>
                    </div>
                  ) : (
                    <div>
                      <span className="fs-4 fw-black text-dark">+ ₹{selectedHotelDetail.priceDiff.toLocaleString()}</span>
                      <span className="fs-8 text-muted"> / Adult total upgrade</span>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-3">
                  <button
                    onClick={() => setSelectedHotelDetail(null)}
                    className="btn btn-outline-secondary rounded-pill px-4 py-2 fs-8 fw-bold"
                  >
                    Back to Hotel List
                  </button>

                  {selectedHotel.id === selectedHotelDetail.id ? (
                    <button className="btn btn-primary rounded-pill px-5 py-2.5 fs-8 fw-bold" style={{ backgroundColor: '#0061ae' }} disabled>
                      ✓ CURRENTLY SELECTED
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedHotel(selectedHotelDetail);
                        if (selectedHotelDetail.roomOptions && selectedHotelDetail.roomOptions[0]) {
                          setSelectedRoomUpgrade({ name: selectedHotelDetail.roomOptions[0].name, price: 0 });
                        }
                        setSelectedHotelDetail(null);
                        setShowHotelModal(false);
                        toast.success(`Hotel updated to ${selectedHotelDetail.name}!`);
                      }}
                      className="btn btn-primary rounded-pill px-5 py-2.5 fs-8 fw-bold shadow-sm"
                      style={{ backgroundColor: '#0061ae' }}
                    >
                      SELECT THIS HOTEL
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* CHANGE FLIGHT MODAL */}
      {/* ========================================================================= */}
      {showFlightModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-4 pt-4 pb-3 align-items-center">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Select / Change Flight</h4>
                  <div className="fs-7 text-dark fw-semibold">
                    {fromCity} ⇄ {basePkg.title} Roundtrip
                  </div>
                  <div className="fs-8 text-muted mt-0.5">
                    Departure Date: <b>{departDate}</b> • Confirmed 20-30kg check-in baggage & complimentary meals included
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowFlightModal(false)}></button>
              </div>

              {/* Sorting & Option Bar */}
              <div className="px-4 py-3 bg-light border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-8 fw-bold text-secondary">Sort By:</span>
                  <div className="btn-group btn-group-sm">
                    <button
                      onClick={() => setFlightSortBy('recommended')}
                      className={`btn ${flightSortBy === 'recommended' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-3 py-1 fs-8 fw-semibold`}
                      style={flightSortBy === 'recommended' ? { backgroundColor: '#0061ae', borderColor: '#0061ae' } : {}}
                    >
                      Recommended
                    </button>
                    <button
                      onClick={() => setFlightSortBy('price_asc')}
                      className={`btn ${flightSortBy === 'price_asc' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-3 py-1 fs-8 fw-semibold ms-1`}
                      style={flightSortBy === 'price_asc' ? { backgroundColor: '#0061ae', borderColor: '#0061ae' } : {}}
                    >
                      Cheapest First
                    </button>
                    <button
                      onClick={() => setFlightSortBy('duration')}
                      className={`btn ${flightSortBy === 'duration' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-3 py-1 fs-8 fw-semibold ms-1`}
                      style={flightSortBy === 'duration' ? { backgroundColor: '#0061ae', borderColor: '#0061ae' } : {}}
                    >
                      Fastest Duration
                    </button>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {includeFlights && (
                    <button
                      onClick={() => {
                        setIncludeFlights(false);
                        setShowFlightModal(false);
                        toast.success('Removed flights from package. Land package active.');
                      }}
                      className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 fs-8 fw-bold"
                    >
                      Book Without Flights (Save ₹{((selectedFlight?.basePrice || 0) + (selectedFlight?.priceDiff || 0)).toLocaleString()}/person)
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Body: Flight Cards */}
              <div className="modal-body p-4">
                <div className="d-flex flex-column gap-3">
                  {sortedFlightOptions.map((flt) => {
                    const isSelected = includeFlights && selectedFlight?.id === flt.id;
                    const diff = flt.priceDiff || 0;

                    return (
                      <div
                        key={flt.id}
                        className={`leh-hotel-card-modal ${isSelected ? 'selected' : ''}`}
                        style={{ border: isSelected ? '2px solid #0061ae' : '1px solid #e2e8f0', borderRadius: '16px' }}
                      >
                        {isSelected && (
                          <div className="leh-transfer-selected-badge">
                            <i className="fa-solid fa-check" style={{ fontSize: '9px' }}></i> SELECTED FLIGHT
                          </div>
                        )}

                        <div className="row g-3 align-items-center">
                          {/* Airline Info */}
                          <div className="col-lg-3 col-md-4">
                            <div className="d-flex align-items-center gap-2.5 mb-2">
                              <div
                                className="rounded-3 text-white fw-black d-flex align-items-center justify-content-center shadow-xs"
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  backgroundColor: flt.color || '#0061ae',
                                  fontSize: '15px'
                                }}
                              >
                                {flt.code}
                              </div>
                              <div>
                                <h6 className="fw-bold text-dark mb-0 fs-6">{flt.airline}</h6>
                                <small className="text-muted fs-9">{flt.flightNo}</small>
                              </div>
                            </div>

                            {flt.badge && (
                              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-0.5 rounded fs-9 fw-bold d-inline-block mb-1">
                                {flt.badge}
                              </span>
                            )}
                            <div className="fs-9 text-muted">
                              Roundtrip Airfare Included
                            </div>
                          </div>

                          {/* Flight Schedule Columns */}
                          <div className="col-lg-6 col-md-5 border-start border-end px-3">
                            {/* Onward Leg */}
                            <div className="mb-2.5 pb-2.5 border-bottom">
                              <div className="d-flex align-items-center justify-content-between fs-9 fw-bold text-secondary mb-1">
                                <span>ONWARD • {departDate}</span>
                                <span className="text-muted">{flt.onward.flightNumber}</span>
                              </div>
                              <div className="row align-items-center g-2 text-center text-md-start">
                                <div className="col-4">
                                  <div className="fw-black fs-6 text-dark">{flt.onward.departureTime}</div>
                                  <div className="fs-9 text-muted fw-bold">{flt.onward.departureCode}</div>
                                </div>
                                <div className="col-4 text-center">
                                  <div className="fs-9 text-muted fw-semibold">{flt.onward.duration}</div>
                                  <div className="d-flex align-items-center justify-content-center gap-1">
                                    <span style={{ width: '30%', height: '1px', backgroundColor: '#cbd5e1' }}></span>
                                    <i className="fa-solid fa-plane text-primary fs-9"></i>
                                    <span style={{ width: '30%', height: '1px', backgroundColor: '#cbd5e1' }}></span>
                                  </div>
                                  <div className="fs-9 text-secondary" style={{ fontSize: '10px' }}>{flt.onward.stops.split('(')[0]}</div>
                                </div>
                                <div className="col-4 text-end">
                                  <div className="fw-black fs-6 text-dark">{flt.onward.arrivalTime}</div>
                                  <div className="fs-9 text-muted fw-bold">{flt.onward.arrivalCode}</div>
                                </div>
                              </div>
                            </div>

                            {/* Return Leg */}
                            <div>
                              <div className="d-flex align-items-center justify-content-between fs-9 fw-bold text-secondary mb-1">
                                <span>RETURN FLIGHT</span>
                                <span className="text-muted">{flt.returnFlight.flightNumber}</span>
                              </div>
                              <div className="row align-items-center g-2 text-center text-md-start">
                                <div className="col-4">
                                  <div className="fw-black fs-6 text-dark">{flt.returnFlight.departureTime}</div>
                                  <div className="fs-9 text-muted fw-bold">{flt.returnFlight.departureCode}</div>
                                </div>
                                <div className="col-4 text-center">
                                  <div className="fs-9 text-muted fw-semibold">{flt.returnFlight.duration}</div>
                                  <div className="d-flex align-items-center justify-content-center gap-1">
                                    <span style={{ width: '30%', height: '1px', backgroundColor: '#cbd5e1' }}></span>
                                    <i className="fa-solid fa-plane text-success fs-9" style={{ transform: 'rotate(180deg)' }}></i>
                                    <span style={{ width: '30%', height: '1px', backgroundColor: '#cbd5e1' }}></span>
                                  </div>
                                  <div className="fs-9 text-secondary" style={{ fontSize: '10px' }}>{flt.returnFlight.stops.split('(')[0]}</div>
                                </div>
                                <div className="col-4 text-end">
                                  <div className="fw-black fs-6 text-dark">{flt.returnFlight.arrivalTime}</div>
                                  <div className="fs-9 text-muted fw-bold">{flt.returnFlight.arrivalCode}</div>
                                </div>
                              </div>
                            </div>

                            {/* Baggage & Meal Perks */}
                            <div className="d-flex flex-wrap gap-2 mt-2 pt-2 border-top fs-9 text-muted">
                              <span>🧳 {flt.baggage}</span>
                              <span>•</span>
                              <span>🍱 {flt.meals}</span>
                            </div>
                          </div>

                          {/* Price Difference & Action */}
                          <div className="col-lg-3 col-md-3 text-end d-flex flex-column justify-content-between align-items-end" style={{ minHeight: '130px' }}>
                            <div className="w-100 text-end">
                              <span className="badge bg-light text-secondary border px-2 py-0.5 fs-9">
                                {flt.refundPolicy}
                              </span>
                            </div>

                            <div className="my-auto text-end">
                              {diff === 0 ? (
                                <div>
                                  <span className="fs-7 fw-bold text-success d-block">Base Flight Option</span>
                                  <small className="text-muted fs-9">₹{flt.basePrice.toLocaleString()} / person</small>
                                </div>
                              ) : diff < 0 ? (
                                <div>
                                  <div className="fs-5 fw-black text-success">
                                    - ₹{Math.abs(diff).toLocaleString()}
                                  </div>
                                  <small className="text-muted fs-9">Save vs Base Flight</small>
                                </div>
                              ) : (
                                <div>
                                  <div className="fs-5 fw-black text-dark">
                                    + ₹{diff.toLocaleString()}
                                  </div>
                                  <small className="text-muted fs-9">/ Adult price upgrade</small>
                                </div>
                              )}
                            </div>

                            {isSelected ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-success rounded-pill px-4 py-1.5 fs-8 fw-bold"
                                disabled
                              >
                                ✓ CURRENT SELECTION
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFlight(flt);
                                  setIncludeFlights(true);
                                  setShowFlightModal(false);
                                  toast.success(`Flight updated to ${flt.airline}!`);
                                }}
                                className="leh-select-btn-outline"
                              >
                                SELECT FLIGHT
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top px-4 py-3 bg-white d-flex align-items-center justify-content-between">
                <div className="fs-8 text-secondary">
                  Showing <b>{sortedFlightOptions.length}</b> verified scheduled roundtrip flight options from <b>{fromCity}</b>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFlightModal(false)}
                  className="btn btn-outline-secondary rounded-pill px-4 py-2 fs-8 fw-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating "Customise my trip" Button */}
      <button 
        type="button" 
        onClick={() => setShowCustomiseModal(true)} 
        className="fixed-customise-trip-btn shadow-lg"
        title="Customise this trip with a holiday expert"
      >
        <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
        Customise my trip
      </button>

      {/* Customise Trip Modal Overlay */}
      {showCustomiseModal && (
        <div className="modal fade show d-block" tabIndex={-1} onClick={() => setShowCustomiseModal(false)} style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 100000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom bg-light px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                  <i className="fa-solid fa-wand-magic-sparkles text-primary"></i> Customise Your Trip
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowCustomiseModal(false)} />
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                toast.success(`Your customized trip request for "${basePkg.title}" has been received! Our destination expert will connect with you.`);
                setShowCustomiseModal(false);
              }} className="modal-body p-4 text-start">
                
                <div className="alert alert-primary border-0 rounded-3 fs-8 mb-4 py-2.5 px-3">
                  <b>✨ Tailor-Made Itinerary:</b> Want extra nights, specific airlines, luxury villa upgrades, or private sightseeing? Share your preferences below!
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Starting City</label>
                    <input
                      type="text"
                      className="form-control fs-8 customise-form-input"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Destination / Tour</label>
                    <input
                      type="text"
                      className="form-control fs-8 customise-form-input"
                      defaultValue={basePkg.title}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Preferred Departure Date</label>
                    <input
                      type="date"
                      className="form-control fs-8 customise-form-input"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Trip Duration</label>
                    <input
                      type="text"
                      className="form-control fs-8 customise-form-input"
                      defaultValue={basePkg.duration}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Total Travelers</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control fs-8 customise-form-input"
                        min={1}
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value, 10) || 1)}
                        required
                      />
                      <span className="input-group-text bg-white fs-8 text-muted">Adult(s)</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Your Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control fs-8 customise-form-input"
                      maxLength={10}
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fs-8 fw-bold text-secondary">Custom Requirements / Notes (Optional)</label>
                    <textarea
                      rows={3}
                      className="form-control fs-8 customise-form-input"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Add 2 extra nights, prefer direct flights, honeymoon cake & decor, vegetarian meals..."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary btn-sm fw-bold px-3 py-2 rounded-pill" onClick={() => setShowCustomiseModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm fw-bold px-4 py-2 rounded-pill"
                    style={{ backgroundColor: '#0061ae', borderColor: '#0061ae' }}
                  >
                    <i className="fa-solid fa-paper-plane me-1"></i> Submit Custom Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayDetails;

