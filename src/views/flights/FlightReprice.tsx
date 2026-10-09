import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./FlightReprice.css";

type Segment = {
  airlineCode?: string;
  airlineName?: string;
  flightNumber?: string;
  origin?: string;
  originCity?: string;
  originTerminal?: string;
  destination?: string;
  destinationCity?: string;
  destinationTerminal?: string;
  departureDateTime?: string;
  arrivalDateTime?: string;
  duration?: string;
};

type FareClass = {
  CabinClass?: string;
  Class_Code?: string;
  Class_Desc?: string;
  FareBasis?: string;
};

type FareDetail = {
  paxType?: number;
  currency?: string;
  basicAmount?: number;
  airportTaxAmount?: number;
  totalAmount?: number;
  fareClasses?: FareClass[];
  freeBaggage?: {
    checkIn?: string;
    hand?: string;
  };
};

type Fare = {
  fareId?: string;
  productClass?: string;
  refundable?: boolean;
  fareDetails?: FareDetail[];
};

type Flight = {
  flightKey?: string;
  flightId?: string;
  airlineCode?: string;
  flightNumbers?: string;
  isLcc?: boolean;
  segments?: Segment[];
};

type CancellationCharge = {
  Applicablility?: number;
  DurationFrom?: number;
  DurationTo?: number;
  DurationTypeFrom?: number;
  DurationTypeTo?: number;
  Value?: string;
  ValueType?: number;
  Remarks?: string;
  PassengerType?: number;
  Return_Flight?: boolean;
};

type RepriceFareDetail = {
  Basic_Amount?: number;
  AirportTax_Amount?: number;
  Total_Amount?: number;
  Currency_Code?: string;
  PAX_Type?: number;
  GST?: number;
  YQ_Amount?: number;
  Service_Fee_Amount?: number;
  Trade_Markup_Amount?: number;
  Promo_Discount?: number;
  Free_Baggage?: {
    Check_In_Baggage?: string;
    Hand_Baggage?: string;
    DisplayRemarks?: string;
  };
  FareClasses?: FareClass[];
  AirportTaxes?: {
    Tax_Code?: string;
    Tax_Desc?: string;
    Tax_Amount?: number;
  }[];
  CancellationCharges?: CancellationCharge[];
  RescheduleCharges?: CancellationCharge[];
};

type RepricedFare = {
  Fare_Id?: string;
  FareType?: number;
  ProductClass?: string;
  Refundable?: boolean;
  Seats_Available?: string;
  LastFewSeats?: string;
  Food_onboard?: string;
  PromptMessage?: string;
  Warning?: string;
  FareDetails?: RepriceFareDetail[];
};

type RepricedFlight = {
  Airline_Code?: string;
  Origin?: string;
  Destination?: string;
  Flight_Numbers?: string;
  Flight_Key?: string;
  Flight_Id?: string;
  Repriced?: boolean;
  IsFareChange?: boolean;
  Block_Ticket_Allowed?: boolean;
  Cached?: boolean;
  IsLCC?: boolean;
  TravelDate?: string;
  Segments?: {
    Airline_Code?: string;
    Airline_Name?: string;
    Flight_Number?: string;
    Origin?: string;
    Origin_City?: string;
    Origin_Terminal?: string;
    Destination?: string;
    Destination_City?: string;
    Destination_Terminal?: string;
    Departure_DateTime?: string;
    Arrival_DateTime?: string;
    Duration?: string;
    Aircraft_Type?: string;
    Stop_Over?: string | null;
  }[];
  Fares?: RepricedFare[];
};

type RequiredPaxDetails = {
  Pax_type?: number;
  Title?: boolean;
  First_Name?: boolean;
  Last_Name?: boolean;
  DOB?: boolean;
  Gender?: boolean;
  Nationality?: boolean;
  Passport_Number?: boolean;
  Passport_Expiry?: boolean;
  Passport_Issuing_Country?: boolean;
  Age?: boolean;
  DefenceExpiryDate?: boolean;
  DefenceIssueDate?: boolean;
  DefenceServiceId?: boolean;
  IdProof_Number?: boolean;
  PanCard_No?: boolean;
  Student_Id?: boolean;
  Mandatory_SSRs?: unknown;
};

type RepriceResponse = {
  Flight?: RepricedFlight;
  Required_PAX_Details?: RequiredPaxDetails[];
  Frequent_Flyer_Accepted?: boolean;
};

type ApiBody = {
  success?: boolean;
  message?: string;
  details?: {
    supplierErrorDescription?: string;
  };
  data?: {
    AirRepriceResponses?: RepriceResponse[];
    Response_Header?: {
      Error_Code?: string;
      Error_Desc?: string;
      Error_InnerException?: string;
      Request_Id?: string;
      Status_Id?: string;
    };
  };
};

type Props = {
  flight: Flight;
  fare: Fare;
  searchKey: string;
  customerMobile?: string;
  onBack: () => void;
  onContinue?: (data: {
    flight: Flight;
    fare: Fare;
    repricedResponse: RepriceResponse;
  }) => void;
};

const API_BASE = "http://localhost:3001/v1/api";

const money = (amount = 0, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const parseDate = (value?: string): Date | null => {
  if (!value) return null;

  // Supplier format: MM/DD/YYYY HH:mm
  const match = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/,
  );

  let date: Date;

  if (match) {
    date = new Date(
      Number(match[3]),
      Number(match[1]) - 1,
      Number(match[2]),
      Number(match[4]),
      Number(match[5]),
    );
  } else {
    date = new Date(value);
  }

  return Number.isNaN(date.getTime()) ? null : date;
};

const dateLabel = (value?: string) => {
  const date = parseDate(value);

  if (!date) return value || "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const timeLabel = (value?: string) => {
  const date = parseDate(value);

  if (!date) return "—";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const durationLabel = (value?: string) => {
  if (!value) return "Duration unavailable";

  const match = value.match(/^(\d{1,3}):(\d{2})$/);

  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return (
    [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""]
      .filter(Boolean)
      .join(" ") || "0m"
  );
};

const sumFareDetails = (
  details: RepriceFareDetail[] | undefined,
  key: "Basic_Amount" | "AirportTax_Amount" | "Total_Amount",
) =>
  (details || []).reduce((sum, detail) => sum + (Number(detail[key]) || 0), 0);

const getListingAmount = (fare: Fare) =>
  (fare.fareDetails || []).reduce(
    (sum, detail) => sum + (Number(detail.totalAmount) || 0),
    0,
  );

const getErrorMessage = (body: ApiBody) =>
  body.message ||
  body.details?.supplierErrorDescription ||
  body.data?.Response_Header?.Error_Desc ||
  "Unable to verify this fare. Please try again.";

const passengerTypeLabel = (type?: number) => {
  switch (type) {
    case 0:
      return "Adult";
    case 1:
      return "Child";
    case 2:
      return "Infant";
    default:
      return `Passenger type ${type ?? "unknown"}`;
  }
};

const durationUnit = (type?: number) => {
  switch (type) {
    case 0:
      return "hours";
    case 1:
      return "days";
    default:
      return "units";
  }
};

const chargeLabel = (charge: CancellationCharge) => {
  const from = charge.DurationFrom;
  const to = charge.DurationTo;

  if (from == null || to == null) {
    return charge.Remarks || "Applicable cancellation period";
  }

  const unit = durationUnit(charge.DurationTypeFrom);

  if (from === to) return `${from} ${unit} before departure`;

  return `${from}–${to} ${unit} before departure`;
};

const chargeAmountLabel = (charge: CancellationCharge) => {
  if (charge.Value == null || charge.Value === "") {
    return charge.Remarks || "Check fare rules";
  }

  const amount = Number(charge.Value);

  if (!Number.isFinite(amount)) return charge.Value;

  // ValueType is supplier-defined. ValueType 1 commonly represents
  // a percentage, but confirm this mapping in your supplier's API docs.
  if (charge.ValueType === 1) return `${amount}%`;

  return money(amount);
};

export default function FlightReprice({
  flight,
  fare,
  searchKey,
  customerMobile = "919588829249",
  onBack,
  onContinue,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const [error, setError] = useState("");
  const [repricedResponse, setRepricedResponse] =
    useState<RepriceResponse | null>(null);
  const [acceptedNewFare, setAcceptedNewFare] = useState(false);

  const originalAmount = useMemo(() => getListingAmount(fare), [fare]);

  const originalCurrency = fare.fareDetails?.[0]?.currency || "INR";

  const supplierFlight = repricedResponse?.Flight;

  const supplierFare =
    supplierFlight?.Fares?.find((item) => item.Fare_Id === fare.fareId) ||
    supplierFlight?.Fares?.[0];

  const repricedDetails = supplierFare?.FareDetails || [];

  const newAmount = sumFareDetails(repricedDetails, "Total_Amount");

  const baseAmount = sumFareDetails(repricedDetails, "Basic_Amount");

  const airportTaxAmount = sumFareDetails(repricedDetails, "AirportTax_Amount");

  const currency =
    repricedDetails.find((detail) => detail.Currency_Code)?.Currency_Code ||
    originalCurrency;

  const fareChanged =
    Boolean(repricedResponse) &&
    (supplierFlight?.IsFareChange === true ||
      Math.abs(newAmount - originalAmount) > 0.01);

  const firstSegment = supplierFlight?.Segments?.[0];

  const lastSegment =
    supplierFlight?.Segments?.[(supplierFlight?.Segments?.length || 1) - 1];

  const airlineName =
    firstSegment?.Airline_Name ||
    flight.segments?.[0]?.airlineName ||
    flight.airlineCode ||
    "Airline";

  const baggage = repricedDetails[0]?.Free_Baggage;

  const requiredPaxDetails = repricedResponse?.Required_PAX_Details || [];

  const fetchReprice = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError("");
      setRepricedResponse(null);
      setAcceptedNewFare(false);

      if (!searchKey || !flight.flightKey || !fare.fareId) {
        setError(
          "Missing search key, flight key, or fare ID. Return to the results and select the flight again.",
        );
        setLoading(false);
        return;
      }

      try {
        const payload = {
          Search_Key: searchKey,
          AirRepriceRequests: [
            {
              Flight_Key: flight.flightKey,
              Fare_Id: fare.fareId,
            },
          ],
          Customer_Mobile: customerMobile,
          GST_Input: false,
          SinglePricing: true,
        };

        const response = await fetch(`${API_BASE}/flights/reprice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal,
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await response.text();

          throw new Error(
            `The reprice endpoint returned a non-JSON response (HTTP ${response.status}). Check your backend URL and route. ${text.slice(0, 120)}`,
          );
        }

        const body = (await response.json()) as ApiBody;

        if (!response.ok || !body.success) {
          throw new Error(getErrorMessage(body));
        }

        const responseHeader = body.data?.Response_Header;

        if (
          responseHeader?.Error_Code &&
          responseHeader.Error_Code !== "0000"
        ) {
          throw new Error(
            responseHeader.Error_Desc ||
              "The supplier could not reprice this flight.",
          );
        }

        const item = body.data?.AirRepriceResponses?.[0];

        if (!item?.Flight) {
          throw new Error(
            "The supplier response is missing AirRepriceResponses[0].Flight.",
          );
        }

        const returnedFare =
          item.Flight.Fares?.find((entry) => entry.Fare_Id === fare.fareId) ||
          item.Flight.Fares?.[0];

        if (!returnedFare?.FareDetails?.length) {
          throw new Error(
            "The supplier response does not contain fare details.",
          );
        }

        setRepricedResponse(item);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Unable to verify the fare.",
        );
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [searchKey, flight.flightKey, fare.fareId, customerMobile, retryKey],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchReprice(controller.signal);

    return () => controller.abort();
  }, [fetchReprice]);

  const handleContinue = () => {
    if (!repricedResponse || loading) return;

    if (fareChanged && !acceptedNewFare) return;

    if (!onContinue) {
      setError(
        "The fare is verified, but passenger-details navigation has not been connected yet.",
      );
      return;
    }

    // Use the supplier's latest flight and fare keys downstream.
    const updatedFlight: Flight = {
      ...flight,
      flightKey: supplierFlight?.Flight_Key || flight.flightKey,
      flightId: supplierFlight?.Flight_Id || flight.flightId,
      airlineCode: supplierFlight?.Airline_Code || flight.airlineCode,
      flightNumbers: supplierFlight?.Flight_Numbers || flight.flightNumbers,
      isLcc: supplierFlight?.IsLCC ?? flight.isLcc,
      segments:
        supplierFlight?.Segments?.map((segment) => ({
          airlineCode: segment.Airline_Code,
          airlineName: segment.Airline_Name,
          flightNumber: segment.Flight_Number,
          origin: segment.Origin,
          originCity: segment.Origin_City,
          originTerminal: segment.Origin_Terminal,
          destination: segment.Destination,
          destinationCity: segment.Destination_City,
          destinationTerminal: segment.Destination_Terminal,
          departureDateTime: segment.Departure_DateTime,
          arrivalDateTime: segment.Arrival_DateTime,
          duration: segment.Duration,
        })) || flight.segments,
    };

    const updatedFare: Fare = {
      ...fare,
      fareId: supplierFare?.Fare_Id || fare.fareId,
      productClass: supplierFare?.ProductClass || fare.productClass,
      refundable: supplierFare?.Refundable ?? fare.refundable,
      fareDetails: repricedDetails.map((detail) => ({
        paxType: detail.PAX_Type,
        currency: detail.Currency_Code || originalCurrency,
        basicAmount: detail.Basic_Amount,
        airportTaxAmount: detail.AirportTax_Amount,
        totalAmount: detail.Total_Amount,
        fareClasses: detail.FareClasses || [],
        freeBaggage: {
          checkIn: detail.Free_Baggage?.Check_In_Baggage,
          hand: detail.Free_Baggage?.Hand_Baggage,
        },
      })),
    };

    onContinue({
      flight: updatedFlight,
      fare: updatedFare,
      repricedResponse,
    });
  };

  return (
    <main className="fr-page">
      {" "}
      <header className="fr-header">
        {" "}
        <button className="fr-back" type="button" onClick={onBack}>
          ← Back to results{" "}
        </button>
        ```
        <div className="fr-brand">
          <span className="fr-brand-icon">✈</span>
          <span>Flight booking</span>
        </div>
        <span className="fr-secure">🔒 Secure booking</span>
      </header>
      <div className="fr-container">
        <nav className="fr-breadcrumb" aria-label="Booking progress">
          <span>Search</span>
          <span>›</span>
          <span className="fr-active">Review flight</span>
          <span>›</span>
          <span>Traveller details</span>
          <span>›</span>
          <span>Payment</span>
        </nav>

        <div className="fr-title-row">
          <div>
            <h1>Review your flight</h1>
            <p>Verify the latest fare and flight details before continuing.</p>
          </div>
          <span className="fr-step">STEP 2 OF 4</span>
        </div>

        {loading && (
          <section className="fr-status-card" aria-live="polite">
            <div className="fr-spinner" />
            <h2>Checking the latest fare…</h2>
            <p>
              We are verifying the flight, baggage allowance, availability, and
              price with the supplier.
            </p>
            <div className="fr-skeleton" />
            <div className="fr-skeleton fr-skeleton-short" />
          </section>
        )}

        {!loading && error && (
          <section className="fr-error-card" role="alert">
            <div className="fr-error-icon">!</div>
            <h2>We couldn't verify this fare</h2>
            <p>{error}</p>

            <div className="fr-actions">
              <button
                type="button"
                className="fr-button fr-button-light"
                onClick={onBack}
              >
                Back to results
              </button>

              <button
                type="button"
                className="fr-button fr-button-primary"
                onClick={() => setRetryKey((value) => value + 1)}
              >
                Retry verification
              </button>
            </div>
          </section>
        )}

        {!loading && !error && repricedResponse && (
          <>
            {fareChanged && (
              <section className="fr-price-alert" role="alert">
                <div className="fr-alert-icon">₹</div>

                <div>
                  <h3>
                    {newAmount > originalAmount
                      ? "The fare has increased"
                      : newAmount < originalAmount
                        ? "The fare has decreased"
                        : "The supplier reports a fare change"}
                  </h3>

                  <p>Listed fare: {money(originalAmount, originalCurrency)}</p>

                  <p>Updated fare: {money(newAmount, currency)}</p>

                  <label className="fr-accept">
                    <input
                      type="checkbox"
                      checked={acceptedNewFare}
                      onChange={(event) =>
                        setAcceptedNewFare(event.target.checked)
                      }
                    />
                    I have reviewed and accept the updated fare.
                  </label>
                </div>
              </section>
            )}

            <div className="fr-layout">
              <section className="fr-main">
                <article className="fr-card">
                  <div className="fr-card-heading">
                    <div className="fr-airline-logo">
                      {supplierFlight?.Airline_Code ||
                        flight.airlineCode ||
                        "✈"}
                    </div>

                    <div className="fr-airline-info">
                      <h2>{airlineName}</h2>
                      <p>
                        Flight{" "}
                        {firstSegment?.Flight_Number ||
                          flight.flightNumbers ||
                          "—"}
                        {" · "}
                        {repricedDetails[0]?.FareClasses?.[0]?.CabinClass ||
                          fare.fareDetails?.[0]?.fareClasses?.[0]?.CabinClass ||
                          "Economy"}
                      </p>
                    </div>

                    <span className="fr-verified">✓ Fare verified</span>
                  </div>

                  {(supplierFlight?.Segments || []).map((segment, index) => (
                    <div
                      className="fr-segment"
                      key={`${segment.Flight_Number || "segment"}-${index}`}
                    >
                      <div className="fr-route">
                        <div className="fr-airport">
                          <strong>
                            {timeLabel(segment.Departure_DateTime)}
                          </strong>
                          <b>{segment.Origin || "—"}</b>
                          <span>{segment.Origin_City || ""}</span>
                          {segment.Origin_Terminal && (
                            <small>Terminal {segment.Origin_Terminal}</small>
                          )}
                        </div>

                        <div className="fr-route-middle">
                          <span>{durationLabel(segment.Duration)}</span>
                          <div className="fr-route-line">
                            <i />
                          </div>
                          <span>
                            {segment.Airline_Code || ""}{" "}
                            {segment.Flight_Number || ""}
                          </span>
                        </div>

                        <div className="fr-airport fr-airport-right">
                          <strong>{timeLabel(segment.Arrival_DateTime)}</strong>
                          <b>{segment.Destination || "—"}</b>
                          <span>{segment.Destination_City || ""}</span>
                          {segment.Destination_Terminal && (
                            <small>
                              Terminal {segment.Destination_Terminal}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="fr-date">
                        {dateLabel(segment.Departure_DateTime)}
                        {" · "}
                        {dateLabel(segment.Arrival_DateTime)}
                      </div>
                    </div>
                  ))}
                </article>

                <article className="fr-card">
                  <div className="fr-section-title">
                    <span className="fr-section-icon">▣</span>
                    <div>
                      <h2>Baggage allowance</h2>
                      <p>Allowance for this fare</p>
                    </div>
                  </div>

                  <div className="fr-baggage-grid">
                    <div>
                      <span className="fr-baggage-icon">🧳</span>
                      <div>
                        <small>Check-in baggage</small>
                        <strong>
                          {baggage?.Check_In_Baggage || "Check airline rules"}
                        </strong>
                      </div>
                    </div>

                    <div>
                      <span className="fr-baggage-icon">🎒</span>
                      <div>
                        <small>Cabin baggage</small>
                        <strong>
                          {baggage?.Hand_Baggage || "Check airline rules"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {baggage?.DisplayRemarks && (
                    <p className="fr-muted">{baggage.DisplayRemarks}</p>
                  )}
                </article>

                <article className="fr-card">
                  <div className="fr-section-title">
                    <span className="fr-section-icon">↻</span>
                    <div>
                      <h2>Cancellation and rescheduling</h2>
                      <p>Supplier-provided fare conditions</p>
                    </div>
                  </div>

                  <div className="fr-policy-row">
                    <span>Refundability</span>
                    <strong
                      className={
                        supplierFare?.Refundable ? "fr-green" : "fr-orange"
                      }
                    >
                      {supplierFare?.Refundable
                        ? "Refundable fare"
                        : "Check cancellation conditions"}
                    </strong>
                  </div>

                  {repricedDetails.map((detail, detailIndex) => (
                    <React.Fragment key={`policy-${detailIndex}`}>
                      {(detail.CancellationCharges || []).length > 0 && (
                        <div className="fr-policy-group">
                          <h3>
                            Cancellation — {passengerTypeLabel(detail.PAX_Type)}
                          </h3>

                          {(detail.CancellationCharges || []).map(
                            (charge, index) => (
                              <div
                                className="fr-price-row"
                                key={`cancel-${detailIndex}-${index}`}
                              >
                                <span>
                                  {chargeLabel(charge)}
                                  {charge.Remarks ? ` — ${charge.Remarks}` : ""}
                                </span>
                                <span>{chargeAmountLabel(charge)}</span>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      {(detail.RescheduleCharges || []).length > 0 && (
                        <div className="fr-policy-group">
                          <h3>
                            Rescheduling — {passengerTypeLabel(detail.PAX_Type)}
                          </h3>

                          {(detail.RescheduleCharges || []).map(
                            (charge, index) => (
                              <div
                                className="fr-price-row"
                                key={`reschedule-${detailIndex}-${index}`}
                              >
                                <span>
                                  {chargeLabel(charge)}
                                  {charge.Remarks ? ` — ${charge.Remarks}` : ""}
                                </span>
                                <span>{chargeAmountLabel(charge)}</span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                  {!repricedDetails.some(
                    (detail) =>
                      (detail.CancellationCharges?.length || 0) > 0 ||
                      (detail.RescheduleCharges?.length || 0) > 0,
                  ) && (
                    <p className="fr-muted">
                      Detailed cancellation and rescheduling charges were not
                      returned. Review the airline fare rules before confirming.
                    </p>
                  )}
                </article>

                <article className="fr-card">
                  <div className="fr-section-title">
                    <span className="fr-section-icon">♙</span>
                    <div>
                      <h2>Traveller information requirements</h2>
                      <p>Fields marked as required by the supplier</p>
                    </div>
                  </div>

                  {requiredPaxDetails.length > 0 ? (
                    requiredPaxDetails.map((pax, index) => {
                      const requiredFields = [
                        ["Title", pax.Title],
                        ["First name", pax.First_Name],
                        ["Last name", pax.Last_Name],
                        ["Date of birth", pax.DOB],
                        ["Gender", pax.Gender],
                        ["Nationality", pax.Nationality],
                        ["Passport number", pax.Passport_Number],
                        ["Passport expiry", pax.Passport_Expiry],
                        [
                          "Passport issuing country",
                          pax.Passport_Issuing_Country,
                        ],
                        ["Age", pax.Age],
                        ["PAN card", pax.PanCard_No],
                        ["Identity proof number", pax.IdProof_Number],
                        ["Student ID", pax.Student_Id],
                        ["Defence service ID", pax.DefenceServiceId],
                        ["Defence issue date", pax.DefenceIssueDate],
                        ["Defence expiry date", pax.DefenceExpiryDate],
                      ] as const;

                      return (
                        <div
                          className="fr-pax-requirements"
                          key={`pax-${pax.Pax_type}-${index}`}
                        >
                          <h3>{passengerTypeLabel(pax.Pax_type)}</h3>

                          <div className="fr-requirement-list">
                            {requiredFields
                              .filter(([, required]) => required === true)
                              .map(([label]) => (
                                <span className="fr-requirement" key={label}>
                                  ✓ {label}
                                </span>
                              ))}
                          </div>

                          {pax.Mandatory_SSRs != null && (
                            <p className="fr-muted">
                              Additional mandatory services may be required by
                              the supplier.
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="fr-muted">
                      The supplier did not return specific passenger field
                      requirements.
                    </p>
                  )}
                </article>
              </section>

              <aside className="fr-sidebar">
                <article className="fr-card fr-summary">
                  <h2>Price details</h2>

                  <div className="fr-price-row">
                    <span>Base fare</span>
                    <span>{money(baseAmount, currency)}</span>
                  </div>

                  <div className="fr-price-row">
                    <span>Taxes and fees</span>
                    <span>{money(airportTaxAmount, currency)}</span>
                  </div>

                  <div className="fr-summary-total">
                    <div>
                      <span>Total displayed fare</span>
                      <strong>{money(newAmount, currency)}</strong>
                    </div>
                    <small>
                      Verify the final booking total for every traveller before
                      payment.
                    </small>
                  </div>

                  <button
                    type="button"
                    className="fr-button fr-button-primary fr-continue"
                    onClick={handleContinue}
                    disabled={fareChanged && !acceptedNewFare}
                  >
                    Continue to travellers →
                  </button>

                  {fareChanged && !acceptedNewFare && (
                    <p className="fr-disabled-note">
                      Accept the updated fare to continue.
                    </p>
                  )}

                  <div className="fr-secure-note">
                    🔒 Flight details verified with the supplier.
                  </div>
                </article>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
