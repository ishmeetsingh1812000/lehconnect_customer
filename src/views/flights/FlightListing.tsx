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
  flightKey?: string;
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
    cabin: fareClass?.CabinClass?.replaceAll("_", " ") || "Economy",
    name:
      fareClass?.Class_Desc ||
      (fare.productClass ? `Fare ${fare.productClass}` : "Standard Fare"),
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

  const [selectedFares, setSelectedFares] = useState<Record<string, string>>(
    {},
  );

  const [flightRulesData, setFlightRulesData] = useState<
    Record<string, string>
  >({});
  const [loadingFlightRules, setLoadingFlightRules] = useState<
    Record<string, boolean>
  >({});
  const [showFlightRules, setShowFlightRules] = useState<
    Record<string, boolean>
  >({});

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

  const fetchFlightFareRules = async (flightKey: string, fareId: string) => {
    const searchKey = flightSearch.searchKey || flightSearch.searchId || "";
    if (!fareId) return;

    if (flightRulesData[flightKey]) {
      setShowFlightRules((prev) => ({
        ...prev,
        [flightKey]: !prev[flightKey],
      }));
      return;
    }

    setLoadingFlightRules((prev) => ({ ...prev, [flightKey]: true }));
    try {
      const response = await fetch(
        "http://localhost:3001/v1/api/flights/fare-rule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchKey, flightKey, fareId }),
        },
      );
      const result = await response.json();
      const ruleDesc =
        result.success && result.data?.FareRules?.[0]?.FareRuleDesc;

      setFlightRulesData((prev) => ({
        ...prev,
        [flightKey]:
          ruleDesc ||
          '<p class="text-muted">No fare rules available for this flight.</p>',
      }));
      setShowFlightRules((prev) => ({ ...prev, [flightKey]: true }));
    } catch (err) {
      console.error("Failed to fetch fare rules", err);
      setFlightRulesData((prev) => ({
        ...prev,
        [flightKey]:
          '<p class="text-danger">Failed to load fare rules. Please try again later.</p>',
      }));
      setShowFlightRules((prev) => ({ ...prev, [flightKey]: true }));
    } finally {
      setLoadingFlightRules((prev) => ({ ...prev, [flightKey]: false }));
    }
  };

  return (
    <div
      className="container py-4"
      style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}
    >
      {/* Search Header Banner */}
      <div className="card shadow-sm border-0 p-3 p-md-4 mb-4 rounded-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary px-2 py-1 text-uppercase fs-9 fw-bold">
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
          </div>
          <div>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="btn btn-sm btn-outline-primary px-4 rounded-pill fw-semibold"
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
        </div>
      ) : (
        <div className="row g-4">
          {/* Filters Sidebar */}
          <div className="col-lg-3">
            <div
              className="card border-0 shadow-sm p-3 rounded-4 bg-white sticky-top"
              style={{ top: "20px" }}
            >
              <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark">
                Filters
              </h6>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Airlines
                </label>
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

              <div>
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Price Range
                </label>
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

          {/* Flight Cards Listing */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
              <h6 className="fw-bold text-secondary mb-0">
                Showing available flights
              </h6>
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
                  {tripFlights.map((flight, flightIndex) => {
                    const flightKey = String(
                      flight.flightKey ||
                        flight.flightId ||
                        flight.id ||
                        flightIndex,
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

                    const currentSelectedFareId =
                      selectedFares[flightKey] || fares[0]?.fareId || "";
                    const activeFare =
                      fares.find((f) => f.fareId === currentSelectedFareId) ||
                      fares[0];

                    return (
                      <article
                        className="card border-0 shadow-sm mb-3 rounded-4 overflow-hidden bg-white"
                        key={flightKey}
                      >
                        <div className="card-body p-4">
                          {/* Top Airline Info Row */}
                          <div className="d-flex align-items-center justify-content-between pb-3 border-bottom">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-primary"
                                style={{ width: 40, height: 40 }}
                              >
                                <i className="fa-solid fa-plane"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold text-dark mb-0">
                                  {flightName}
                                </h6>
                                <small className="text-muted">
                                  {flight.airlineCode || ""} -{" "}
                                  {flight.flightNumbers || flight.flightId}
                                </small>
                              </div>
                            </div>
                            <span className="badge bg-light text-secondary border fw-normal">
                              {flight.isLcc
                                ? "Low-cost Carrier"
                                : "Full Service"}
                            </span>
                          </div>

                          {/* Flight Schedule Row */}
                          {firstSegment && lastSegment && (
                            <div className="row align-items-center py-4 g-3">
                              <div className="col-4">
                                <h5 className="fw-bold text-dark mb-1">
                                  {formatDateTime(
                                    firstSegment.departureDateTime,
                                  ).split(" · ")[1] || "—"}
                                </h5>
                                <div className="fw-semibold text-secondary">
                                  {firstSegment.origin}
                                </div>
                                <small className="text-muted">
                                  {firstSegment.originCity}
                                </small>
                              </div>

                              <div className="col-4 text-center">
                                <small className="text-muted d-block mb-1">
                                  {firstSegment.duration || "Non-stop"}
                                </small>
                                <div className="position-relative d-flex align-items-center justify-content-center">
                                  <hr className="w-100 border-secondary opacity-25" />
                                  <i className="fa-solid fa-plane text-primary position-absolute bg-white px-2"></i>
                                </div>
                                <small className="text-success fw-semibold d-block mt-1">
                                  {flightSegments.length > 1
                                    ? `${flightSegments.length - 1} Stop(s)`
                                    : "Non-stop"}
                                </small>
                              </div>

                              <div className="col-4 text-end">
                                <h5 className="fw-bold text-dark mb-1">
                                  {formatDateTime(
                                    lastSegment.arrivalDateTime,
                                  ).split(" · ")[1] || "—"}
                                </h5>
                                <div className="fw-semibold text-secondary">
                                  {lastSegment.destination}
                                </div>
                                <small className="text-muted">
                                  {lastSegment.destinationCity}
                                </small>
                              </div>
                            </div>
                          )}

                          {/* MMT Style Fare Selector Tabs */}
                          <div className="bg-light p-3 rounded-3 mt-2">
                            <div className="small fw-bold text-uppercase text-secondary mb-2">
                              Select Fare Type
                            </div>

                            {fares.length > 0 ? (
                              <div className="row g-2">
                                {fares.map((fare, fareIdx) => {
                                  const fareId =
                                    fare.fareId || `fare_${fareIdx}`;
                                  const isSelected =
                                    currentSelectedFareId === fareId;
                                  const amt = getFareAmount(fare);
                                  const cur =
                                    fare.fareDetails?.[0]?.currency || "INR";
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
                                        className={`p-3 rounded-3 border bg-white h-100 d-flex flex-column justify-content-between transition-all ${
                                          isSelected
                                            ? "border-primary ring-1 ring-primary shadow-xs"
                                            : "border-light"
                                        }`}
                                        style={{
                                          cursor: "pointer",
                                          borderWidth: isSelected
                                            ? "2px"
                                            : "1px",
                                          borderColor: isSelected
                                            ? "#0d6efd"
                                            : "#dee2e6",
                                        }}
                                      >
                                        <div className="d-flex justify-content-between align-items-start">
                                          <div>
                                            <span
                                              className={`fw-bold fs-7 ${isSelected ? "text-primary" : "text-dark"}`}
                                            >
                                              {fc.name}
                                            </span>
                                            <div className="text-muted fs-9">
                                              {fc.cabin}
                                            </div>
                                          </div>
                                          <div className="form-check m-0">
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              checked={isSelected}
                                              onChange={() => {}}
                                            />
                                          </div>
                                        </div>
                                        <div className="mt-3 d-flex align-items-baseline justify-content-between">
                                          <span className="fw-bold text-dark fs-5">
                                            {formatCurrency(amt, cur)}
                                          </span>
                                          <span
                                            className={`badge fs-9 ${fare.refundable ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning-emphasis"}`}
                                          >
                                            {fare.refundable
                                              ? "Refundable"
                                              : "Non-Ref"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-muted small">
                                No fare options listed.
                              </div>
                            )}

                            {/* Active Fare Baggage & Rules Footer */}
                            {activeFare && (
                              <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2">
                                <div className="d-flex align-items-center gap-3 small text-secondary">
                                  <span>
                                    <i className="fa-solid fa-suitcase me-1 text-primary"></i>
                                    Check-in:{" "}
                                    <strong>
                                      {activeFare.fareDetails?.[0]?.freeBaggage
                                        ?.checkIn || "15 Kg"}
                                    </strong>
                                  </span>
                                  <span>·</span>
                                  <span>
                                    <i className="fa-solid fa-briefcase me-1 text-primary"></i>
                                    Cabin:{" "}
                                    <strong>
                                      {activeFare.fareDetails?.[0]?.freeBaggage
                                        ?.hand || "7 Kg"}
                                    </strong>
                                  </span>
                                </div>

                                <button
                                  className="btn btn-link btn-sm text-decoration-none p-0 fw-semibold text-primary"
                                  onClick={() =>
                                    fetchFlightFareRules(
                                      flightKey,
                                      currentSelectedFareId,
                                    )
                                  }
                                  disabled={loadingFlightRules[flightKey]}
                                >
                                  {loadingFlightRules[flightKey]
                                    ? "Loading Rules..."
                                    : showFlightRules[flightKey]
                                      ? "Hide Fare Rules"
                                      : "View Fare Rules ▾"}
                                </button>
                              </div>
                            )}

                            {/* Accordion Fare Rules Box */}
                            {showFlightRules[flightKey] &&
                              flightRulesData[flightKey] && (
                                <div
                                  className="mt-3 bg-white p-3 rounded-3 border text-secondary fs-8 shadow-xs"
                                  style={{
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: flightRulesData[flightKey],
                                  }}
                                />
                              )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightListing;
