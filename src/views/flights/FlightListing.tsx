"use client";

import React, { useState } from "react";
import { useNavigate } from "../../hooks/useAppNavigation";
import { useBooking } from "../../context/BookingContext";
import { ROUTES } from "../../constants/routes";

type FlightSegment = {
  segmentId?: number;
  airlineCode?: string;
  airlineName?: string;
  flightNumber?: string;
  aircraftType?: string;
  origin?: string;
  originCity?: string;
  originTerminal?: string;
  destination?: string;
  destinationCity?: string;
  destinationTerminal?: string;
  departureDateTime?: string;
  arrivalDateTime?: string;
  duration?: string;
  stopOver?: string | null;
  returnFlight?: boolean;
};

type FlightFareDetail = {
  paxType?: number;
  currency?: string;
  basicAmount?: number;
  airportTaxAmount?: number;
  yqAmount?: number;
  gst?: number;
  serviceFeeAmount?: number;
  tradeMarkupAmount?: number;
  promoDiscount?: number;
  totalAmount?: number;
  fareClasses?: {
    CabinClass?: string;
    Class_Desc?: string;
  }[];
  freeBaggage?: {
    checkIn?: string;
    hand?: string;
  };
};

type FlightFare = {
  fareId?: string;
  fareType?: number;
  productClass?: string;
  refundable?: boolean;
  seatsAvailable?: string;
  lastFewSeats?: number | null;
  foodOnboard?: string;
  promptMessage?: string | null;
  warning?: string | null;
  fareDetails?: FlightFareDetail[];
};

type FlightSearchResult = {
  id?: string | number;
  flightId?: string;
  flightNumbers?: string;
  airlineCode?: string;
  isLcc?: boolean;
  hasMoreClass?: boolean;
  blockTicketAllowed?: boolean;
  segments?: FlightSegment[];
  fares?: FlightFare[];
};

type FlightTrip = {
  tripId?: number;
  flights?: FlightSearchResult[];
};

const formatDateTime = (value?: string) => {
  if (!value) return "Time unavailable";
  const usDateTime = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/,
  );
  const date = usDateTime
    ? new Date(
        Number(usDateTime[3]),
        Number(usDateTime[1]) - 1,
        Number(usDateTime[2]),
        Number(usDateTime[4]),
        Number(usDateTime[5]),
      )
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date
    .toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " ·");
};

const getFareAmount = (fare: FlightFare) =>
  (fare.fareDetails || []).reduce(
    (total, detail) => total + (Number(detail.totalAmount) || 0),
    0,
  );

const formatCurrency = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const getFareClass = (fare: FlightFare) => {
  const fareDetail = fare.fareDetails?.[0];
  const fareClass = fareDetail?.fareClasses?.[0];
  return {
    cabin:
      fareClass?.CabinClass?.replaceAll("_", " ") || "Cabin class unavailable",
    name:
      fareClass?.Class_Desc ||
      (fare.productClass ? `Fare ${fare.productClass}` : "Fare option"),
  };
};

const getTripTypeLabel = (tripType?: string) => {
  switch (tripType) {
    case "ONE_WAY":
    case "oneway":
      return "One way";
    case "ROUND_TRIP":
    case "roundtrip":
      return "Round trip";
    case "MULTI_CITY":
    case "multicity":
      return "Multi-city";
    default:
      return tripType || "Flight search";
  }
};

export const FlightListing = () => {
  const navigate = useNavigate();
  const { searchParams } = useBooking();
  const flightSearch = searchParams.flights;
  const [filterAirline, setFilterAirline] = useState("all");
  const [filterPriceRange, setFilterPriceRange] = useState("all");

  // Track selected fare ID per flight item
  const [selectedFares, setSelectedFares] = useState<Record<string, string>>(
    {},
  );

  const trips: FlightTrip[] = Array.isArray(flightSearch.tripDetails)
    ? flightSearch.tripDetails
    : [];
  const legacyResults: FlightSearchResult[] = Array.isArray(
    flightSearch.searchResults,
  )
    ? flightSearch.searchResults
    : [];
  const displayedTrips =
    trips.length > 0
      ? trips
      : legacyResults.length > 0
        ? [{ flights: legacyResults }]
        : [];

  const airlines = Array.from(
    new Set(
      displayedTrips
        .flatMap((trip) => trip.flights || [])
        .map((flight) => flight.airlineCode)
        .filter((code): code is string => Boolean(code)),
    ),
  );

  const segments = Array.isArray(flightSearch.segments)
    ? flightSearch.segments
    : [];
  const hasSearch = Boolean(flightSearch.searchId || displayedTrips.length);

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-3 p-md-4 mb-4 rounded-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="fa-solid fa-plane-departure text-primary"></i>
              <span className="badge bg-primary-subtle text-primary">
                {getTripTypeLabel(flightSearch.tripType)}
              </span>
              {flightSearch.travelType && (
                <span className="badge bg-light text-dark border">
                  {String(flightSearch.travelType).toLowerCase()}
                </span>
              )}
            </div>
            <div className="fw-bold fs-5 text-dark">
              {segments.length ? (
                segments.map((segment, index) => (
                  <React.Fragment
                    key={`${segment.origin}-${segment.destination}-${index}`}
                  >
                    {index > 0 && <span className="text-muted mx-2">·</span>}
                    <span>{segment.origin}</span>
                    <i className="fa-solid fa-arrow-right text-muted mx-2 fs-8"></i>
                    <span>{segment.destination}</span>
                  </React.Fragment>
                ))
              ) : (
                <>
                  {flightSearch.from || ""}
                  <i className="fa-solid fa-arrow-right text-muted mx-2 fs-8"></i>
                  {flightSearch.to || ""}
                </>
              )}
            </div>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {flightSearch.departDate && (
                <span className="badge bg-light text-secondary border fw-normal">
                  <i className="fa-regular fa-calendar me-1"></i>
                  {flightSearch.departDate}
                </span>
              )}
              {flightSearch.returnDate && (
                <span className="badge bg-light text-secondary border fw-normal">
                  <i className="fa-solid fa-rotate-left me-1"></i>
                  Return {flightSearch.returnDate}
                </span>
              )}
              <span className="badge bg-light text-secondary border fw-normal">
                <i className="fa-solid fa-user me-1"></i>
                {flightSearch.passengers} adult(s)
              </span>
              {flightSearch.travelClass && (
                <span className="badge bg-light text-secondary border fw-normal">
                  <i className="fa-solid fa-chair me-1"></i>
                  {flightSearch.travelClass}
                </span>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="btn btn-sm btn-outline-primary px-3 rounded-pill"
            >
              Modify Search
            </button>
          </div>
        </div>
      </div>

      {!hasSearch ? (
        <div className="card p-5 border text-center rounded-3 shadow-sm bg-white">
          <div className="text-muted fs-3 mb-2">
            <i className="fa-solid fa-plane-slash"></i>
          </div>
          <h5 className="fw-bold text-dark">
            Search for flights to see results
          </h5>
          <p className="text-secondary fs-8">
            Enter airport codes in the flight search form to find available
            flights.
          </p>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="btn btn-primary rounded-pill px-4 py-2 mt-2 mx-auto border-0 fw-bold fs-8"
          >
            Search Flights
          </button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="filter-sidebar">
              <h5 className="fw-bold mb-3 border-bottom pb-2 fs-6">
                Filter Flights
              </h5>

              {/* Airline Filter */}
              <div className="filter-section mb-3">
                <h6 className="filter-title">Airline</h6>
                <select
                  className="form-select form-select-sm"
                  value={filterAirline}
                  onChange={(event) => setFilterAirline(event.target.value)}
                >
                  <option value="all">All Airlines</option>
                  {airlines.map((airline) => (
                    <option key={airline} value={airline}>
                      {airline}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <h6 className="filter-title">Price Range</h6>
                <select
                  className="form-select form-select-sm"
                  value={filterPriceRange}
                  onChange={(event) => setFilterPriceRange(event.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="0-5000">Under ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000-20000">₹10,000 - ₹20,000</option>
                  <option value="20000-plus">Above ₹20,000</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Available Flights</h5>
              <span className="text-muted fs-8">
                {flightSearch.totalFlights ??
                  displayedTrips.reduce(
                    (total, trip) => total + (trip.flights?.length || 0),
                    0,
                  )}{" "}
                result(s)
              </span>
            </div>

            {displayedTrips.map((trip, tripIndex) => {
              const tripFlights = (trip.flights || []).filter((flight) => {
                const matchesAirline =
                  filterAirline === "all" ||
                  flight.airlineCode === filterAirline ||
                  flight.segments?.some(
                    (segment) => segment.airlineCode === filterAirline,
                  );

                let matchesPrice = true;
                if (filterPriceRange !== "all") {
                  const minFare = Math.min(
                    ...(flight.fares || []).map((fare) => getFareAmount(fare)),
                    Infinity,
                  );
                  if (minFare === Infinity) {
                    matchesPrice = false;
                  } else if (filterPriceRange === "0-5000") {
                    matchesPrice = minFare <= 5000;
                  } else if (filterPriceRange === "5000-10000") {
                    matchesPrice = minFare > 5000 && minFare <= 10000;
                  } else if (filterPriceRange === "10000-20000") {
                    matchesPrice = minFare > 10000 && minFare <= 20000;
                  } else if (filterPriceRange === "20000-plus") {
                    matchesPrice = minFare > 20000;
                  }
                }

                return matchesAirline && matchesPrice;
              });

              return (
                <section className="mb-4" key={trip.tripId ?? tripIndex}>
                  {displayedTrips.length > 1 && (
                    <h6 className="fw-bold text-dark mb-3">
                      Flight {tripIndex + 1}
                      {segments[tripIndex]
                        ? ` · ${segments[tripIndex].origin} to ${segments[tripIndex].destination}`
                        : ""}
                    </h6>
                  )}

                  {tripFlights.length === 0 ? (
                    <div className="card p-4 border text-center rounded-3 bg-white">
                      <span className="text-secondary fs-8">
                        No flights match your filter criteria.
                      </span>
                    </div>
                  ) : (
                    tripFlights.map((flight, flightIndex) => {
                      const flightKey = String(
                        flight.flightId || flight.id || flightIndex,
                      );
                      const flightSegments = flight.segments || [];
                      const flightName =
                        flightSegments[0]?.airlineName ||
                        flight.airlineCode ||
                        "Airline";
                      const fares = flight.fares || [];
                      const firstSegment = flightSegments[0];
                      const lastSegment =
                        flightSegments[flightSegments.length - 1];
                      const totalDuration = flightSegments.reduce(
                        (total, segment) => {
                          const [hours = 0, minutes = 0] = (
                            segment.duration || ""
                          )
                            .split(":")
                            .map(Number);
                          return total + hours * 60 + minutes;
                        },
                        0,
                      );

                      const currentSelectedFareId =
                        selectedFares[flightKey] || fares[0]?.fareId || "";
                      const activeFare =
                        fares.find((f) => f.fareId === currentSelectedFareId) ||
                        fares[0];

                      return (
                        <article
                          className="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden"
                          key={flightKey}
                        >
                          <div className="card-body p-0">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 px-md-4 py-3 border-bottom">
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                                  style={{ width: 48, height: 48 }}
                                >
                                  <i className="fa-solid fa-plane fs-5"></i>
                                </div>
                                <div>
                                  <h6 className="fw-bold text-dark mb-1">
                                    {flightName}
                                  </h6>
                                  <span className="text-muted fs-8">
                                    {flight.airlineCode || ""} ·{" "}
                                    {flight.flightNumbers ||
                                      flightSegments
                                        .map((segment) => segment.flightNumber)
                                        .filter(Boolean)
                                        .join(" / ") ||
                                      flight.flightId}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex flex-wrap align-items-center gap-2">
                                <span className="badge bg-light text-dark border">
                                  {flight.isLcc ? "Low-cost" : "Full service"}
                                </span>
                                {flight.blockTicketAllowed && (
                                  <span className="badge bg-success-subtle text-success">
                                    Ticket block available
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="p-3 p-md-4">
                              {firstSegment && lastSegment ? (
                                <>
                                  <div className="row align-items-center g-3 mb-4">
                                    <div className="col-5 col-md-4">
                                      <div className="fw-bold text-dark fs-5">
                                        {formatDateTime(
                                          firstSegment.departureDateTime,
                                        ).split(" · ")[1] || "—"}
                                      </div>
                                      <div className="fw-semibold text-dark">
                                        {firstSegment.origin || "—"}
                                      </div>
                                      <small className="text-muted">
                                        {firstSegment.originCity || ""}
                                      </small>
                                      {firstSegment.originTerminal && (
                                        <small className="text-muted d-block">
                                          Terminal {firstSegment.originTerminal}
                                        </small>
                                      )}
                                    </div>
                                    <div className="col-2 col-md-4 text-center">
                                      <small className="text-muted d-block">
                                        {totalDuration
                                          ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`
                                          : firstSegment.duration || "—"}
                                      </small>
                                      <div className="d-flex align-items-center gap-2 my-2">
                                        <span className="border-top flex-grow-1" />
                                        <i className="fa-solid fa-plane text-primary fs-8"></i>
                                        <span className="border-top flex-grow-1" />
                                      </div>
                                      <small className="text-muted d-block">
                                        {flightSegments.length > 1
                                          ? flightSegments
                                              .slice(0, -1)
                                              .map(
                                                (segment) =>
                                                  segment.destination,
                                              )
                                              .filter(Boolean)
                                              .join(" · ") || "Connecting"
                                          : "Non-stop"}
                                      </small>
                                    </div>
                                    <div className="col-5 col-md-4 text-end">
                                      <div className="fw-bold text-dark fs-5">
                                        {formatDateTime(
                                          lastSegment.arrivalDateTime,
                                        ).split(" · ")[1] || "—"}
                                      </div>
                                      <div className="fw-semibold text-dark">
                                        {lastSegment.destination || "—"}
                                      </div>
                                      <small className="text-muted">
                                        {lastSegment.destinationCity || ""}
                                      </small>
                                      {lastSegment.destinationTerminal && (
                                        <small className="text-muted d-block">
                                          Terminal{" "}
                                          {lastSegment.destinationTerminal}
                                        </small>
                                      )}
                                    </div>
                                    <div className="col-12">
                                      <div className="small text-muted border-top pt-3">
                                        {
                                          formatDateTime(
                                            firstSegment.departureDateTime,
                                          ).split(" · ")[0]
                                        }
                                        {firstSegment.aircraftType
                                          ? ` · Aircraft ${firstSegment.aircraftType}`
                                          : ""}
                                      </div>
                                    </div>
                                  </div>
                                  {flightSegments.length > 1 && (
                                    <div className="border rounded-3 p-3 mb-4 bg-light">
                                      <div className="small fw-bold text-secondary text-uppercase mb-2">
                                        Segment details
                                      </div>
                                      {flightSegments.map(
                                        (segment, segmentIndex) => (
                                          <div
                                            className={`d-flex flex-wrap justify-content-between gap-2 ${segmentIndex > 0 ? "border-top pt-2 mt-2" : ""}`}
                                            key={`${segment.segmentId ?? segmentIndex}-${segment.flightNumber ?? ""}`}
                                          >
                                            <span className="small text-dark">
                                              {segment.airlineName ||
                                                segment.airlineCode}{" "}
                                              {segment.flightNumber}
                                            </span>
                                            <span className="small text-muted">
                                              {segment.origin} →{" "}
                                              {segment.destination}
                                            </span>
                                            <span className="small text-muted">
                                              {segment.duration} ·{" "}
                                              {formatDateTime(
                                                segment.departureDateTime,
                                              )}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-muted fs-8 mb-3">
                                  Flight details:{" "}
                                  {flight.flightNumbers || flight.flightId}
                                </div>
                              )}

                              {/* Modern Interactive Fare Selector Cards */}
                              <div className="border-top pt-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                  <div>
                                    <h6 className="fw-bold text-dark mb-0">
                                      Select Fare Option
                                    </h6>
                                    <small className="text-muted">
                                      Choose your preferred tier for baggage and
                                      cancellation perks
                                    </small>
                                  </div>
                                  <span className="badge bg-light text-secondary border">
                                    {fares.length} Available
                                  </span>
                                </div>

                                {fares.length > 0 ? (
                                  <div className="row g-2 mb-3">
                                    {fares.map((fare, fareIdx) => {
                                      const fareId =
                                        fare.fareId || String(fareIdx);
                                      const isSelected =
                                        (selectedFares[flightKey] ||
                                          fares[0]?.fareId) === fareId;
                                      const amt = getFareAmount(fare);
                                      const cur =
                                        fare.fareDetails?.[0]?.currency ||
                                        "INR";
                                      const fc = getFareClass(fare);

                                      return (
                                        <div
                                          className="col-12 col-md-4"
                                          key={fareId}
                                        >
                                          <div
                                            onClick={() =>
                                              setSelectedFares((prev) => ({
                                                ...prev,
                                                [flightKey]: fareId,
                                              }))
                                            }
                                            className={`p-3 rounded-3 border transition-all cursor-pointer h-100 d-flex flex-column justify-content-between ${
                                              isSelected
                                                ? "border-primary bg-primary-subtle bg-opacity-10 shadow-sm"
                                                : "border-light bg-light hover-border-secondary"
                                            }`}
                                            style={{
                                              cursor: "pointer",
                                              borderWidth: isSelected
                                                ? "2px"
                                                : "1px",
                                            }}
                                          >
                                            <div>
                                              <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                                <span
                                                  className={`fw-bold fs-7 ${isSelected ? "text-primary" : "text-dark"}`}
                                                >
                                                  {fc.name}
                                                </span>
                                                <div className="form-check m-0">
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    checked={isSelected}
                                                    onChange={() => {}}
                                                  />
                                                </div>
                                              </div>
                                              <div className="text-muted fs-8 mb-2">
                                                {fc.cabin}
                                              </div>
                                            </div>
                                            <div>
                                              <div className="fw-bold text-dark fs-6">
                                                {formatCurrency(amt, cur)}
                                              </div>
                                              <div className="d-flex gap-1 mt-1 flex-wrap">
                                                <span
                                                  className={`badge fs-9 ${fare.refundable ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}
                                                >
                                                  {fare.refundable
                                                    ? "Refundable"
                                                    : "Non-ref"}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="alert alert-warning fs-8 mb-3">
                                    No fare options available.
                                  </div>
                                )}

                                {/* Expanded Breakdown for Active Fare */}
                                {activeFare &&
                                  (() => {
                                    const amount = getFareAmount(activeFare);
                                    const fareDetail =
                                      activeFare.fareDetails?.[0];
                                    const baggage = fareDetail?.freeBaggage;
                                    const currency =
                                      fareDetail?.currency || "INR";
                                    const baseAmount = (
                                      activeFare.fareDetails || []
                                    ).reduce(
                                      (total, detail) =>
                                        total +
                                        (Number(detail.basicAmount) || 0),
                                      0,
                                    );
                                    const taxes = (
                                      activeFare.fareDetails || []
                                    ).reduce(
                                      (total, detail) =>
                                        total +
                                        (Number(detail.airportTaxAmount) || 0) +
                                        (Number(detail.yqAmount) || 0) +
                                        (Number(detail.gst) || 0) +
                                        (Number(detail.serviceFeeAmount) || 0),
                                      0,
                                    );

                                    return (
                                      <div className="border rounded-3 p-3 bg-white shadow-xs">
                                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 pb-2 border-bottom">
                                          <div className="small fw-bold text-secondary text-uppercase">
                                            Fare Breakdown & Baggage Details
                                          </div>
                                          <span className="fw-bold text-primary fs-6">
                                            Total:{" "}
                                            {formatCurrency(amount, currency)}
                                          </span>
                                        </div>

                                        <div className="row g-3 small">
                                          <div className="col-sm-6">
                                            <div className="d-flex justify-content-between text-muted mb-1">
                                              <span>Base Fare</span>
                                              <span>
                                                {formatCurrency(
                                                  baseAmount,
                                                  currency,
                                                )}
                                              </span>
                                            </div>
                                            <div className="d-flex justify-content-between text-muted">
                                              <span>Taxes & Surcharges</span>
                                              <span>
                                                {formatCurrency(
                                                  taxes,
                                                  currency,
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="col-sm-6 border-start-sm">
                                            {baggage && (
                                              <div className="d-flex align-items-center gap-2 text-dark">
                                                <i className="fa-solid fa-suitcase text-primary"></i>
                                                <div>
                                                  <div>
                                                    Check-in:{" "}
                                                    <strong>
                                                      {baggage.checkIn || "—"}
                                                    </strong>
                                                  </div>
                                                  <div>
                                                    Cabin:{" "}
                                                    <strong>
                                                      {baggage.hand || "—"}
                                                    </strong>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {activeFare.promptMessage && (
                                          <div className="small text-info mt-2 pt-2 border-top">
                                            <i className="fa-solid fa-circle-info me-1"></i>
                                            {activeFare.promptMessage}
                                          </div>
                                        )}
                                        {activeFare.warning && (
                                          <div className="small text-warning-emphasis mt-2 pt-2 border-top">
                                            <i className="fa-solid fa-triangle-exclamation me-1"></i>
                                            {activeFare.warning}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}
                </section>
              );
            })}

            {displayedTrips.length === 0 && (
              <div className="card p-5 border text-center rounded-3 bg-white">
                <div className="text-muted fs-3 mb-2">
                  <i className="fa-solid fa-plane-slash"></i>
                </div>
                <h5 className="fw-bold text-dark">No flights found</h5>
                <p className="text-secondary fs-8 mb-0">
                  Try another route or change your search dates.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightListing;
