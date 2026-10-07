"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "../../hooks/useAppNavigation";
import { useBooking } from "../../context/BookingContext";
import { ROUTES } from "../../constants/routes";
import {
  createCabBooking,
  createCabBookingOrder,
  getCabBookingPreview,
  getDistance,
  verifyCabBookingPayment,
  getCoupons,
} from "../../APIs/api";
import toast from "react-hot-toast";

// Adjust if your responseData() wraps the payload differently
const unwrap = (body) => {
  if (body && body.success === false) {
    throw new Error(body.message || "Request failed");
  }
  return body?.results ?? body;
};

const extractCouponList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;

  for (const key of ["coupons", "rows", "items", "results", "data"]) {
    const list = extractCouponList(payload[key]);
    if (list) return list;
  }

  return null;
};

const getCouponCode = (coupon) =>
  coupon?.code ||
  coupon?.coupon_code ||
  coupon?.couponCode ||
  coupon?.promo_code ||
  coupon?.promoCode;

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const toYMD = (input) => {
  if (!input) return null;

  // Date object -> use local parts (toISOString() can shift the day because of timezone)
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    const y = input.getFullYear();
    const m = String(input.getMonth() + 1).padStart(2, "0");
    const d = String(input.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const s = String(input).trim();

  // Already YYYY-MM-DD, or ISO like 2026-10-06T10:00:00Z
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  // "22 Jul'26", "22 Jul 2026", "22 July 2026"
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const txt = s.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s*'?\s*(\d{2}|\d{4})$/);
  if (txt) {
    const mi = months.indexOf(txt[2].slice(0, 3).toLowerCase());
    if (mi !== -1) {
      const year = txt[3].length === 2 ? `20${txt[3]}` : txt[3];
      return `${year}-${String(mi + 1).padStart(2, "0")}-${txt[1].padStart(2, "0")}`;
    }
  }

  // "06/10/2026" or "06-10-2026" (assumed DD/MM/YYYY, the Indian format)
  const dmy = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (dmy)
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;

  return null;
};

export const CabCheckout = () => {
  const navigate = useNavigate();
  const {
    checkoutItem,
    user,
    addBooking,
    updateProfile,
  } = useBooking();

  // ---------- ALL HOOKS FIRST (before any early return) ----------
  const [activeStep, setActiveStep] = useState(1); // 1: Review, 2: Traveler Info + Pay
  const [isPaying, setIsPaying] = useState(false);
  const bookingRef = useRef(null); // reuse the PENDING booking if user retries

  const [travelerName, setTravelerName] = useState(user?.name ?? "");
  const [travelerPhone, setTravelerPhone] = useState(user?.phone ?? "");
  const [travelerEmail, setTravelerEmail] = useState(user?.email ?? "");
  const [pickupLandmark, setPickupLandmark] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // validated promo code string

  // Server fare preview state
  const [distanceKm, setDistanceKm] = useState(0);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponsLoadError, setCouponsLoadError] = useState("");
  const [applyingCode, setApplyingCode] = useState(null);

  const isHourly = !!(
    checkoutItem?.isHourly ||
    ["hourly", "local"].includes(checkoutItem?.tripType)
  );
  // vehicle token = itemId without the "-0-0" suffix
  const vehicleToken =
    checkoutItem?.vehicle_token ||
    String(checkoutItem?.itemId || "").replace(/-\d+-\d+$/, "");

  useEffect(() => {
    let cancelled = false;
    setCouponsLoading(true);

    (async () => {
      try {
        const res = await getCoupons();
        const data = unwrap(res);
        const list = extractCouponList(data);
        if (!cancelled) {
          setCoupons((list ?? []).filter((coupon) => getCouponCode(coupon)));
          setCouponsLoadError("");
        }
      } catch (err) {
        console.error("getCoupons failed", err);
        if (!cancelled) {
          setCoupons([]);
          setCouponsLoadError(
            err?.response?.data?.message ||
              err?.message ||
              "Could not load coupons from the server.",
          );
        }
      } finally {
        if (!cancelled) setCouponsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Resolve distance (km) once; needed by both the preview and the booking
  useEffect(() => {
    if (!checkoutItem) return;
    let cancelled = false;

    (async () => {
      let km = Number(checkoutItem.totalDistance) || 0;
      if (!km && isHourly) {
        km = parseInt(checkoutItem.packageDistance, 10) || 0; // "40 kms" -> 40
      }
      if (!km && !isHourly) {
        try {
          const d = await getDistance(checkoutItem.pickup, checkoutItem.drop);
          if (d?.distanceValue) km = Math.round(d.distanceValue / 1000);
        } catch (e) {
          console.error("getDistance failed", e);
        }
      }
      if (!cancelled) setDistanceKm(km);
    })();

    return () => {
      cancelled = true;
    };
  }, [checkoutItem, isHourly]);

  // Server-side fare preview. Re-runs when wallet toggle / promo / distance changes.
  useEffect(() => {
    if (!vehicleToken || !distanceKm) return;
    let cancelled = false;
    setPreviewLoading(true);

    (async () => {
      try {
        const res = await getCabBookingPreview(
          buildPreviewPayload(appliedPromo),
        );
        if (cancelled) return;
        setPreview(unwrap(res));
        setPreviewError(null);
      } catch (err) {
        if (cancelled) return;
        setPreview(null);
        setPreviewError(
          err?.response?.data?.message ||
            err?.message ||
            "Could not fetch fare. Please try again.",
        );
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [vehicleToken, distanceKm, useWallet, appliedPromo, user?.walletBalance]);

  // ---------- Early return AFTER hooks ----------
  if (!checkoutItem) {
    return (
      <div className="container py-5 text-center">
        <pre
          style={{
            fontSize: 11,
            background: "#fff3cd",
            padding: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(checkoutItem, null, 2)}
        </pre>
        <i
          className="fa-solid fa-circle-exclamation text-warning mb-3"
          style={{ fontSize: "45px" }}
        ></i>
        <h4>No Active Checkout Item Found</h4>
        <p>Please return to home page and search for cabs first.</p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="btn btn-primary rounded-pill mt-2 px-4 py-2 border-0 leh-style-auto-1060"
        >
          Go Home
        </button>
      </div>
    );
  }

  // ---------- Pricing (from server preview; falls back to listing price until loaded) ----------
  const fare = preview?.fare_summary;
  const basePrice = fare?.base_fare ?? checkoutItem.price;
  const discount = fare?.discount ?? 0;
  const walletBalance =
    preview?.wallet?.available_balance ?? user?.walletBalance ?? 0;
  const walletApplied = useWallet ? (preview?.wallet?.amount_used ?? 0) : 0;
  const grandTotal = preview?.payable_amount ?? checkoutItem.price;

  // Stepper: show step 3 (Payment) as active while Razorpay is open
  const progressStep = isPaying ? 3 : activeStep;

  // ---------- Coupons (validated by the server) ----------
  const applyCouponCode = async (rawCode) => {
    const code = String(rawCode || "").trim(); // no toUpperCase here
    if (!code || applyingCode) return;

    if (!vehicleToken || !distanceKm) {
      toast.error("Fare is not ready yet. Please try again in a moment.");
      return;
    }

    setApplyingCode(code);
    try {
      const res = await getCabBookingPreview(buildPreviewPayload(code));
      const data = unwrap(res);
      console.log("coupon preview", code, data?.promo); // see the real reason

      if (data?.promo?.applied) {
        setAppliedPromo(code);
        setCouponCode("");
        toast.success(
          `Coupon applied! You saved ₹${Number(data.fare_summary?.discount || 0).toLocaleString()}`,
        );
      } else {
        toast.error(data?.promo?.message || "Invalid Coupon Code.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not apply coupon.",
      );
    } finally {
      setApplyingCode(null);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCouponCode(couponCode);
  };

  const handleRemoveCoupon = () => {
    setAppliedPromo(null);
    setCouponCode("");
    toast.success("Coupon removed.");
  };

  // ---------- Booking / Payment ----------
  const finalizeBooking = ({ done, payment }) => {
    const serverBooking = done?.booking || {};

    const newBooking = {
      id:
        serverBooking.token || serverBooking.booking_token || serverBooking.id,
      type: "cab",
      title: checkoutItem.title,
      from: checkoutItem.pickup,
      to: checkoutItem.drop,
      date: checkoutItem.date,
      time: checkoutItem.time,
      price: basePrice,
      tripType:
        checkoutItem.tripType || (checkoutItem.isHourly ? "hourly" : "oneway"),
      isHourly,
      package: checkoutItem.packageLabel || checkoutItem.packageDuration,
      packageDuration: checkoutItem.packageDuration,
      packageDistance: checkoutItem.packageDistance,
      extraKmRate: checkoutItem.extraKmRate,
      extraHrRate: checkoutItem.extraHrRate,
      pickupLandmark: pickupLandmark || "Main City Center",
      paidAmount: payment?.razorpay_amount ?? grandTotal,
      walletDebited: payment?.wallet_amount_used ?? walletApplied,
      razorpayOrderId: serverBooking.razorpay_order_id || null,
      razorpayPaymentId: serverBooking.razorpay_payment_id || null,
      status: "confirmed",
    };

    // Server already debited the wallet in verify-payment; only sync the UI
    if (done?.wallet?.wallet_balance != null) {
      updateProfile({ walletBalance: done.wallet.wallet_balance });
    }

    addBooking(newBooking);
    toast.success("Booking Successful! Enjoy your luxury cab ride.");
    navigate(ROUTES.CAB_SUCCESS, { state: { booking: newBooking } });
  };

  const verifyPayment = async (payload) => {
    const res = await verifyCabBookingPayment(payload);
    return unwrap(res);
  };

  const handlePayment = async () => {
    if (isPaying) return;

    if (!travelerName || !travelerPhone || !travelerEmail) {
      toast.error("Please enter all traveler contact details.");
      return;
    }

    if (!preview || previewLoading) {
      toast.error("Fare is still being calculated. Please wait a moment.");
      return;
    }

    setIsPaying(true);
    try {
      // 1) Create the PENDING booking (reuse it if nothing changed since last try)
      const key = [
        vehicleToken,
        distanceKm,
        walletApplied,
        appliedPromo || "",
        travelerName,
        travelerPhone,
        travelerEmail,
        pickupLandmark,
      ].join("|");

      let created =
        bookingRef.current?.key === key ? bookingRef.current.data : null;

      if (!created) {
        console.log("Creating new cab booking with key", key, checkoutItem);

        if (!vehicleToken || !distanceKm) {
          toast.error(
            "Cab details are incomplete. Please search and select the cab again.",
          );
          setIsPaying(false);
          return;
        }

        const departureDate = toYMD(checkoutItem.date);
        const returnDate = toYMD(checkoutItem.returnDate);

        if (!departureDate) {
          toast.error("Invalid pickup date. Please select the date again.");
          setIsPaying(false);
          return;
        }

        const res = await createCabBooking({
          vehicle_token: vehicleToken,
          trip_type: isHourly
            ? "local"
            : ["roundtrip", "round_trip"].includes(checkoutItem.tripType)
              ? "round_trip"
              : "oneway",
          from_location: checkoutItem.pickup,
          to_location: isHourly ? null : checkoutItem.drop,
          departure_date: departureDate,
          return_date: returnDate || null,
          car_type: checkoutItem.category,
          contact: travelerPhone.replace(/\D/g, "").slice(-10),
          total_distance: distanceKm,
          wallet_amount: walletApplied,
          promo_code: appliedPromo,
          from_web: true,
          traveller_details: {
            name: travelerName,
            phone: travelerPhone,
            email: travelerEmail,
            pickup_landmark: pickupLandmark,
          },
        });
        created = unwrap(res);
        bookingRef.current = { key, data: created };
      }

      const { booking, payment } = created;
      console.log(
        "PREVIEW TOTAL:",
        preview?.fare_summary?.total_fare,
        "| preview payable:",
        preview?.payable_amount,
        "| distance sent:",
        created?.booking?.total_distance,
        "| payment obj:",
        payment,
      );

      const bookingToken =
        booking?.token ||
        booking?.booking_token ||
        booking?.bookingToken ||
        booking?.id;

      if (!bookingToken) {
        toast.error(
          `Booking token missing. Keys: ${Object.keys(booking || {}).join(", ")}`,
        );
        setIsPaying(false);
        return;
      }

      // 2a) Wallet covers the whole amount -> no Razorpay needed
      if (!payment.payment_required) {
        const done = await verifyPayment({
          booking_token: bookingToken,
          payment_type: "WALLET",
        });
        finalizeBooking({ done, payment });
        setIsPaying(false);
        return;
      }

      // 2b) Create the Razorpay order
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay SDK failed to load");

      const orderRes = await createCabBookingOrder({
        booking_token: bookingToken,
      });

      const orderData = unwrap(orderRes);

      if (orderData.payment_required === false) {
        const done = await verifyPayment({
          booking_token: bookingToken,
          payment_type: "WALLET",
        });

        finalizeBooking({ done, payment });
        setIsPaying(false);
        return;
      }

      const { razorpay } = orderData;

      // 3) Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: razorpay.key,
        order_id: razorpay.order_id,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Your Brand Name",
        description: checkoutItem.title,
        prefill: {
          name: travelerName,
          email: travelerEmail,
          contact: travelerPhone,
        },
        theme: { color: "#0d6efd" },
        handler: async (response) => {
          try {
            const done = await verifyPayment({
              booking_token: bookingToken,
              payment_type: payment.payment_type, // RAZORPAY or MIXED (from server)
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            finalizeBooking({ done, payment });
          } catch (e) {
            console.error(e);
            toast.error(
              `Payment received but verification failed. Contact support with payment ID ${response.razorpay_payment_id}`,
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            toast.error("Payment cancelled.");
          },
        },
      });

      rzp.on("payment.failed", (r) => {
        toast.error(r?.error?.description || "Payment failed.");
        setIsPaying(false);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not start payment. Please try again.",
      );
      setIsPaying(false);
    }
  };

  const handlePrimaryAction = () => {
    if (activeStep === 1) {
      setActiveStep(2);
      return;
    }
    handlePayment();
  };

  const buildPreviewPayload = (promo) => ({
    vehicle_token: vehicleToken,
    total_distance: distanceKm,
    wallet_amount: useWallet ? Number(user?.walletBalance ?? 0) : 0,
    ...(promo ? { promo_code: promo } : {}),
  });

  // ---------- Render ----------
  return (
    <div className="bg-light min-vh-100 pb-0">
      <div className="container">
        {/* Stepper progress bar */}
        <div className="bg-white border rounded-4 p-4 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center position-relative mx-auto leh-style-auto-1063">
            {/* Line background */}
            <div className="position-absolute start-0 end-0 bg-light leh-style-auto-1064" />
            <div
              className={`position-absolute start-0 bg-primary transition-all leh-checkout-progress-bar leh-checkout-progress-bar-step-${progressStep}`}
            />

            {/* Step 1 */}
            <div className="position-relative d-flex flex-column align-items-center leh-style-auto-1065">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center border-0 fw-bold leh-checkout-step-circle ${progressStep >= 1 ? (progressStep > 1 ? "leh-checkout-step-circle-completed" : "leh-checkout-step-circle-active") : ""} ${progressStep === 1 ? "leh-checkout-step-circle-focus" : ""}`}
              >
                {progressStep > 1 ? "✓" : "1"}
              </div>
              <div className="mt-2 text-center">
                <span className="fw-bold text-dark fs-8 d-block">
                  Review Details
                </span>
                <small className="text-muted fs-9 leh-style-auto-1062">
                  Check your trip
                </small>
              </div>
            </div>

            {/* Step 2 */}
            <div className="position-relative d-flex flex-column align-items-center leh-style-auto-1065">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center border-0 fw-bold leh-checkout-step-circle ${progressStep >= 2 ? (progressStep > 2 ? "leh-checkout-step-circle-completed" : "leh-checkout-step-circle-active") : ""} ${progressStep === 2 ? "leh-checkout-step-circle-focus" : ""}`}
              >
                {progressStep > 2 ? "✓" : "2"}
              </div>
              <div className="mt-2 text-center">
                <span className="fw-bold text-dark fs-8 d-block">
                  Traveler Info
                </span>
                <small className="text-muted fs-9 leh-style-auto-1062">
                  Enter traveler details
                </small>
              </div>
            </div>

            {/* Step 3 (shown active while Razorpay is open) */}
            <div className="position-relative d-flex flex-column align-items-center leh-style-auto-1065">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center border-0 fw-bold leh-checkout-step-circle ${progressStep >= 3 ? "leh-checkout-step-circle-active" : ""} ${progressStep === 3 ? "leh-checkout-step-circle-focus" : ""}`}
              >
                3
              </div>
              <div className="mt-2 text-center">
                <span className="fw-bold text-dark fs-8 d-block">Payment</span>
                <small className="text-muted fs-9 leh-style-auto-1062">
                  Pay securely with Razorpay
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          {/* Left Side Main Forms Box */}
          <div className="col-lg-8">
            <div className="card shadow-sm border rounded-4 p-4 bg-white mb-3 text-start">
              {activeStep === 1 && (
                <div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <h4 className="fw-bold text-dark mb-0">Review Your Ride</h4>
                    <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2.5 py-1 fw-bold fs-9 leh-style-auto-1066">
                      <i className="fa-solid fa-check text-success me-2"></i>{" "}
                      Safe & Secure Booking
                    </span>
                  </div>

                  {/* Cab Details row item */}
                  <div className="border rounded-3 p-3 bg-light mb-4">
                    <div className="row g-3 align-items-center">
                      <div className="col-md-3">
                        <div className="overflow-hidden rounded-3 border bg-white leh-style-auto-1067">
                          <img
                            src="/images/fleet/cab-toyota-fortuner.webp"
                            alt={checkoutItem.title}
                            className="w-100 h-100 object-fit-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold text-dark mb-0">
                            {checkoutItem.title}
                          </h6>
                          <span className="badge bg-primary text-uppercase fs-9">
                            {checkoutItem.category}
                          </span>
                        </div>
                        <p className="text-muted fs-9 mb-2 mt-0.5">
                          Provided by {checkoutItem.provider}
                        </p>
                        <div className="d-flex align-items-center gap-3 fs-9 text-secondary">
                          <span>
                            <i className="fa-solid fa-user-group me-1.5 text-secondary"></i>{" "}
                            {checkoutItem.passengers} Seats
                          </span>
                          <span>
                            <i className="fa-solid fa-suitcase-rolling me-1.5 text-secondary"></i>{" "}
                            {checkoutItem.luggage} Bags
                          </span>
                          <span>
                            <i className="fa-regular fa-snowflake me-1.5 text-info"></i>{" "}
                            AC
                          </span>
                        </div>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <span className="text-muted fs-9 d-block">
                          Total Fare
                        </span>
                        <h4 className="fw-bold text-dark my-0.5 leh-style-auto-1068">
                          ₹{Number(basePrice).toLocaleString()}
                        </h4>
                        <span className="text-muted fs-9">
                          All inclusive pricing ℹ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2x3 Grid Details Box */}
                  <div className="row g-3 mb-4">
                    {/* Pickup */}
                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 bg-white h-100 d-flex gap-2.5 text-start">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center   leh-style-auto-1069">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                          <small className="text-muted fw-bold fs-9 text-uppercase tracking-wider">
                            PICKUP LOCATION
                          </small>
                          <h6 className="fw-bold text-dark mb-0 mt-1 fs-7">
                            {checkoutItem.pickup}
                          </h6>
                          <small className="text-muted fs-9 mt-0.5 d-block">
                            Indira Gandhi International Airport, New Delhi
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Drop OR Hourly Package */}
                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 bg-white h-100 d-flex gap-2.5 text-start">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-danger leh-style-auto-1069">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                          <small className="text-muted fw-bold fs-9 text-uppercase tracking-wider">
                            {isHourly ? "RENTAL PACKAGE" : "DROP LOCATION"}
                          </small>
                          <h6 className="fw-bold text-dark mb-0 mt-1 fs-7">
                            {checkoutItem.drop}
                          </h6>
                          <small className="text-muted fs-9 mt-0.5 d-block">
                            {isHourly
                              ? `Includes ${checkoutItem.packageDuration || "4 hr"} & ${checkoutItem.packageDistance || "40 kms"} travel limit`
                              : "Agra, Uttar Pradesh"}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 bg-white h-100 d-flex gap-2.5 text-start">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center   leh-style-auto-1069">
                          <i className="fa-solid fa-calendar-days"></i>
                        </div>
                        <div>
                          <small className="text-muted fw-bold fs-9 text-uppercase tracking-wider">
                            PICKUP DATE & TIME
                          </small>
                          <h6 className="fw-bold text-dark mb-0 mt-1 fs-7">
                            {checkoutItem.date || "30 July 2026, Wednesday"}
                          </h6>
                          <span className="badge bg-primary fs-9 mt-1">
                            {checkoutItem.time || "09:00 AM"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 bg-white h-100 d-flex gap-2.5 text-start">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-info leh-style-auto-1069">
                          <i className="fa-solid fa-users"></i>
                        </div>
                        <div>
                          <small className="text-muted fw-bold fs-9 text-uppercase tracking-wider">
                            CAPACITY
                          </small>
                          <h6 className="fw-bold text-dark mb-0 mt-1 fs-7">
                            {checkoutItem.passengers} Passengers
                          </h6>
                          <small className="text-muted fs-9 mt-0.5 d-block">
                            {checkoutItem.luggage} Bags
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Ride Type */}
                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 bg-white h-100 d-flex gap-2.5 text-start">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center   leh-style-auto-1069">
                          <i className="fa-solid fa-car"></i>
                        </div>
                        <div>
                          <small className="text-muted fw-bold fs-9 text-uppercase tracking-wider">
                            RIDE TYPE
                          </small>
                          <h6 className="fw-bold text-dark mb-0 mt-1 fs-7">
                            {isHourly
                              ? "Local Hourly Rental"
                              : "Outstation Trip"}
                          </h6>
                          <span
                            className={`badge ${isHourly ? "bg-primary" : "bg-success"} fs-9 mt-1`}
                          >
                            {isHourly ? "Hourly Rental" : "Oneway"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Operator */}
                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 bg-white h-100 d-flex gap-2.5 text-start">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-warning leh-style-auto-1069">
                          <i className="fa-solid fa-building"></i>
                        </div>
                        <div>
                          <small className="text-muted fw-bold fs-9 text-uppercase tracking-wider">
                            OPERATOR
                          </small>
                          <h6 className="fw-bold text-dark mb-0 mt-1 fs-7">
                            {checkoutItem.provider}
                          </h6>
                          <small className="text-success fw-bold fs-9 mt-0.5 d-block">
                            ✓ Verified & Trusted Partner
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Rental Specific Inclusions & Overtime Terms Box */}
                  {isHourly && (
                    <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 mb-4 text-start">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="fa-solid fa-clock text-primary fs-6"></i>
                        <h6 className="fw-bold text-dark mb-0 fs-7">
                          Hourly Rental Inclusions & Overtime Policy
                        </h6>
                      </div>
                      <div className="row g-2 fs-8 text-secondary">
                        <div className="col-sm-6">
                          <strong>Included Distance:</strong>{" "}
                          {checkoutItem.packageDistance || "40 kms"}
                        </div>
                        <div className="col-sm-6">
                          <strong>Included Duration:</strong>{" "}
                          {checkoutItem.packageDuration || "4 hr"}
                        </div>
                        <div className="col-sm-6">
                          <strong>Extra Km Rate:</strong> ₹
                          {checkoutItem.extraKmRate || 13} / km (after package
                          distance)
                        </div>
                        <div className="col-sm-6">
                          <strong>Extra Hour Rate:</strong> ₹
                          {checkoutItem.extraHrRate || 120} / hr (after package
                          time)
                        </div>
                        <div className="col-12 mt-1">
                          <small className="text-muted d-block fs-9">
                            ✓ Chauffeur allowance and fuel charges are fully
                            included in package fare. Parking fees and tolls (if
                            encountered) are payable directly on actuals.
                          </small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trust guarantees columns */}
                  <div className="row g-2 border-top pt-4 text-muted fs-9">
                    <div className="col-sm-3 d-flex align-items-center gap-1.5 fw-semibold">
                      <i className="fa-solid fa-shield-halved text-success me-1.5"></i>{" "}
                      Verified Drivers
                    </div>
                    <div className="col-sm-3 d-flex align-items-center gap-1.5 fw-semibold">
                      <i className="fa-solid fa-trophy   me-2"></i> Best Price
                      Guarantee
                    </div>
                    <div className="col-sm-3 d-flex align-items-center gap-1.5 fw-semibold">
                      <i className="fa-solid fa-headset   me-2"></i> 24/7
                      Customer Support
                    </div>
                    <div className="col-sm-3 d-flex align-items-center gap-1.5 fw-semibold">
                      <i className="fa-solid fa-lock   me-2"></i> Safe & Secure
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <div className="d-flex align-items-center gap-2.5">
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center   leh-style-auto-1026">
                        <i className="fa-regular fa-user"></i>
                      </div>
                      <div>
                        <h4 className="fw-bold text-dark mb-0">
                          Traveler Contact Details
                        </h4>
                        <small className="text-muted fs-8">
                          Please provide the lead traveler details
                        </small>
                      </div>
                    </div>
                    <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2.5 py-1 fw-bold fs-9 leh-style-auto-1066">
                      <i className="fa-solid fa-check text-success me-2"></i>{" "}
                      Safe & Secure
                    </span>
                  </div>

                  <div className="row g-4">
                    {/* Lead Traveler Name */}
                    <div className="col-md-12">
                      <label className="form-label fw-semibold fs-8 text-secondary text-uppercase tracking-wider">
                        Lead Traveler Name
                      </label>
                      <div className="position-relative">
                        <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-muted">
                          <i className="fa-regular fa-user"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control py-2.5 fs-7 ps-5 pe-5 border leh-style-auto-1032"
                          value={travelerName}
                          onChange={(e) => setTravelerName(e.target.value)}
                          placeholder="Enter Full Name"
                          required
                        />
                        {travelerName && (
                          <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-success fw-bold">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold fs-8 text-secondary text-uppercase tracking-wider">
                        Phone Number
                      </label>
                      <div className="position-relative">
                        <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-muted">
                          <i className="fa-solid fa-phone"></i>
                        </span>
                        <input
                          type="tel"
                          className="form-control py-2.5 fs-7 ps-5 pe-5 border leh-style-auto-1032"
                          value={travelerPhone}
                          onChange={(e) => setTravelerPhone(e.target.value)}
                          placeholder="Contact Number"
                          required
                        />
                        {travelerPhone && (
                          <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-success fw-bold">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold fs-8 text-secondary text-uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="position-relative">
                        <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-muted">
                          <i className="fa-regular fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control py-2.5 fs-7 ps-5 pe-5 border leh-style-auto-1032"
                          value={travelerEmail}
                          onChange={(e) => setTravelerEmail(e.target.value)}
                          placeholder="Booking Confirmation Email"
                          required
                        />
                        {travelerEmail && (
                          <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-success fw-bold">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Exact Pickup Landmark */}
                    <div className="col-md-12">
                      <label className="form-label fw-semibold fs-8 text-secondary text-uppercase tracking-wider">
                        {isHourly
                          ? "Exact Pickup Address / Landmark (Where chauffeur should report)"
                          : "Pickup Address / Landmark"}
                      </label>
                      <div className="position-relative">
                        <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-muted">
                          <i className="fa-solid fa-map-pin"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control py-2.5 fs-7 ps-5 pe-5 border leh-style-auto-1032"
                          value={pickupLandmark}
                          onChange={(e) => setPickupLandmark(e.target.value)}
                          placeholder="e.g. Hotel Grand, Terminal 3 Gate 4, or House / Office Address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info Banner Alert */}
                  <div className="p-3 my-4 border-0 d-flex align-items-center gap-2.5 fs-8   leh-style-auto-1070">
                    <span>ℹ</span>
                    <span className="fw-semibold text-secondary">
                      We will use this information to share your booking details
                      and trip updates. Payment opens in a secure Razorpay
                      window (Cards, UPI, Net Banking, Wallets).
                    </span>
                  </div>

                  <div className="d-flex gap-2 justify-content-start mt-4">
                    <button
                      type="button"
                      disabled={isPaying}
                      onClick={() => setActiveStep(1)}
                      className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold fs-8 border"
                    >
                      <i className="fa-solid fa-arrow-left me-1"></i> Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Billing Cards */}
          <div className="col-lg-4 position-relative">
            <div className="sticky-payment-sidebar">
              {/* Promo Code Card */}
              <div className="card shadow-sm border rounded-4 p-3 mb-3 bg-white text-start">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 fs-7">
                  <i className="fa-solid fa-ticket text-primary me-1"></i> Apply
                  Promo Code
                </h6>

                {appliedPromo ? (
                  <div className="d-flex justify-content-between align-items-center border border-success p-2.5 rounded bg-success-subtle">
                    <div>
                      <span className="fw-bold text-success fs-8 d-block">
                        {appliedPromo} Applied
                      </span>
                      <small className="text-muted fs-9">
                        {preview?.promo?.message}
                      </small>
                    </div>
                    <button
                      type="button"
                      disabled={isPaying}
                      onClick={handleRemoveCoupon}
                      className="btn btn-sm btn-outline-danger border-0 fw-bold fs-9"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleApplyCoupon} className="input-group">
                      <input
                        type="text"
                        className="form-control fs-8 py-2.5 text-uppercase"
                        placeholder="Enter Code (e.g. LEHWELCOME)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={!!applyingCode || !couponCode.trim()}
                        className="btn btn-primary fs-8 fw-bold px-3 border-0 leh-style-auto-1060"
                      >
                        {applyingCode && applyingCode === couponCode.trim()
                          ? "..."
                          : "Apply"}
                      </button>
                    </form>

                    {/* Available coupons */}
                    {couponsLoading && (
                      <small className="text-muted fs-9 d-block mt-3">
                        Loading offers...
                      </small>
                    )}

                    {!couponsLoading && coupons.length > 0 && (
                      <div className="mt-3">
                        <small className="text-muted fw-bold fs-9 text-uppercase d-block mb-2">
                          Available Coupons
                        </small>
                        <div
                          className="d-flex flex-column gap-2"
                          style={{ maxHeight: 220, overflowY: "auto" }}
                        >
                          {coupons.map((c) => {
                            const code = getCouponCode(c);
                            const minAmount = Number(
                              c.min_order_amount ?? c.min_amount ?? 0,
                            );
                            const belowMin =
                              minAmount > 0 && Number(basePrice) < minAmount;
                            const isApplying = applyingCode === String(code);

                            return (
                              <div
                                key={c.id ?? code}
                                className="border border-dashed rounded-3 p-2 d-flex justify-content-between align-items-center gap-2"
                                style={{ opacity: belowMin ? 0.6 : 1 }}
                              >
                                <div className="flex-grow-1">
                                  <span className="fw-bold text-primary fs-8 d-block">
                                    {code}
                                  </span>
                                  <small className="text-muted fs-9 d-block">
                                    {c.title ||
                                      c.description ||
                                      "Special offer"}
                                  </small>
                                  {belowMin && (
                                    <small className="text-danger fs-9 d-block">
                                      Min. booking ₹{minAmount.toLocaleString()}
                                    </small>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  disabled={
                                    belowMin || !!applyingCode || isPaying
                                  }
                                  onClick={() => applyCouponCode(code)}
                                  className="btn btn-sm btn-outline-primary fw-bold fs-9 rounded-pill px-3"
                                >
                                  {isApplying ? "..." : "Apply"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!couponsLoading && coupons.length === 0 && (
                      <small className="text-muted fs-9 d-block mt-3">
                        {couponsLoadError ||
                          "No coupons available right now."}
                      </small>
                    )}
                  </>
                )}

                {appliedPromo && discount > 0 && (
                  <small className="text-success fw-bold d-block mt-2 fs-8">
                    <i className="fa-solid fa-check me-1.5"></i> Awesome! You
                    saved ₹{discount.toLocaleString()}
                  </small>
                )}
              </div>

              {/* Pay using Wallet Card */}
              <div className="card shadow-sm border rounded-4 p-3 mb-3 bg-white text-start">
                <div className="form-check d-flex align-items-center justify-content-between p-0">
                  <label
                    className="form-check-label d-flex align-items-center gap-2.5 fs-7 fw-semibold cursor-pointer"
                    htmlFor="walletPayCheckbox"
                  >
                    <i className="fa-solid fa-wallet text-primary"></i>
                    <div>
                      <span className="text-dark">Pay using Wallet</span>
                      <small className="text-muted fs-8 d-block mt-0.5">
                        Available Balance: ₹
                        {Number(walletBalance).toLocaleString()}
                      </small>
                    </div>
                  </label>
                  <div className="form-check form-switch p-0 mb-0">
                    <input
                      className="form-check-input ms-0 cursor-pointer leh-style-auto-1073"
                      type="checkbox"
                      role="switch"
                      id="walletPayCheckbox"
                      checked={useWallet}
                      disabled={isPaying}
                      onChange={() => setUseWallet(!useWallet)}
                    />
                  </div>
                </div>
              </div>

              {/* Fare Summary Breakdown Card */}
              <div className="card shadow-sm border rounded-4 p-3 bg-white text-start">
                <h6 className="fw-bold text-dark mb-3 fs-7 border-bottom pb-2">
                  Fare Summary
                </h6>

                <div className="d-flex justify-content-between fs-8 mb-2.5 text-secondary">
                  <span>Base Cab Fare</span>
                  <span className="fw-semibold">
                    ₹{Number(basePrice).toLocaleString()}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between fs-8 mb-2.5 text-success fw-bold">
                    <span>Discount ({appliedPromo})</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                )}

                {walletApplied > 0 && (
                  <div className="d-flex justify-content-between fs-8 mb-2.5   fw-bold">
                    <span>Wallet Debited</span>
                    <span>- ₹{walletApplied.toLocaleString()}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between fs-8 mb-2.5 text-secondary">
                  <span>Taxes & Fees</span>
                  <span>
                    {fare?.taxes_fees > 0
                      ? `₹${fare.taxes_fees.toLocaleString()}`
                      : "Included"}
                  </span>
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between fw-bold text-dark fs-6">
                  <span>Grand Total</span>
                  <span
                    className="fs-5 fw-black   leh-style-auto-1068"
                    style={{ opacity: previewLoading ? 0.5 : 1 }}
                  >
                    ₹{Number(grandTotal).toLocaleString()}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="p-2 mt-3 text-center border-0 text-success fw-semibold fs-8 leh-style-auto-1074">
                    <i className="fa-solid fa-check me-1.5"></i> You will save ₹
                    {discount.toLocaleString()} on this booking
                  </div>
                )}

                {previewError && (
                  <div className="alert alert-danger fs-8 py-2 mt-3 mb-0">
                    {previewError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    isPaying || previewLoading || (activeStep === 2 && !preview)
                  }
                  onClick={handlePrimaryAction}
                  className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold mt-4 border-0 d-flex align-items-center justify-content-center gap-1.5 leh-style-auto-1075"
                >
                  {activeStep === 1 ? (
                    <>
                      Confirm & Continue{" "}
                      <i className="fa-solid fa-arrow-right ms-1"></i>
                    </>
                  ) : isPaying ? (
                    "Processing..."
                  ) : previewLoading ? (
                    "Calculating fare..."
                  ) : grandTotal > 0 ? (
                    `Pay ₹${Number(grandTotal).toLocaleString()}`
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                <small className="text-muted fs-9 d-block text-center mt-2.5">
                  <i className="fa-solid fa-lock text-success me-1.5"></i> Your
                  transaction is 100% secure & safe
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Priority Banner */}
        <div className="p-3 mt-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3 text-start bg-white shadow-sm leh-style-auto-1076">
          <div className="d-flex align-items-center gap-3">
            <i className="fa-solid fa-shield-halved   fs-3"></i>
            <div>
              <h6 className="fw-bold text-dark mb-0 fs-7">
                Your safety is our priority
              </h6>
              <small className="text-muted leh-style-auto-1022">
                All our cabs are sanitized and drivers follow strict safety
                protocols.
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2.5 fs-9 text-muted fw-bold">
            <span className="badge bg-light text-secondary border px-2.5 py-1.5 leh-style-auto-1066">
              <i className="fa-solid fa-pump-medical   me-1.5"></i> Sanitized
              Cabs
            </span>
            <span className="badge bg-light text-secondary border px-2.5 py-1.5 leh-style-auto-1066">
              <i className="fa-solid fa-face-mask   me-1.5"></i> Mask Required
            </span>
            <span className="badge bg-light text-secondary border px-2.5 py-1.5 leh-style-auto-1066">
              <i className="fa-solid fa-temperature-half   me-1.5"></i> Temp.
              Check
            </span>
            <span className="badge bg-light text-secondary border px-2.5 py-1.5 leh-style-auto-1066">
              <i className="fa-solid fa-check   me-1.5"></i> Safe Travel
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Trust Bar */}
      <div className="bg-white border-top py-4 mt-5">
        <div className="container">
          <div className="row g-4 text-start">
            <div className="col-md-3 d-flex align-items-start gap-3">
              <i className="fa-solid fa-shield-halved   fs-5"></i>
              <div>
                <h6 className="fw-bold mb-0.5 fs-8 text-dark">
                  Verified Drivers
                </h6>
                <small className="text-muted d-block leh-style-auto-1077">
                  Background verified & experienced drivers
                </small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-start gap-3 border-start border-light">
              <i className="fa-solid fa-money-bill-1   fs-5"></i>
              <div>
                <h6 className="fw-bold mb-0.5 fs-8 text-dark">
                  Best Price Guarantee
                </h6>
                <small className="text-muted d-block leh-style-auto-1077">
                  Get the best prices always
                </small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-start gap-3 border-start border-light">
              <i className="fa-solid fa-headset   fs-5"></i>
              <div>
                <h6 className="fw-bold mb-0.5 fs-8 text-dark">
                  24/7 Customer Support
                </h6>
                <small className="text-muted d-block leh-style-auto-1077">
                  We are here to help you anytime
                </small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-start gap-3 border-start border-light">
              <span className="fs-5  ">
                <i className="fa-solid fa-credit-card"></i>
              </span>
              <div>
                <h6 className="fw-bold mb-0.5 fs-8 text-dark">
                  100% Safe Payments
                </h6>
                <small className="text-muted d-block leh-style-auto-1077">
                  Secure, encrypted & multiple payment options
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabCheckout;
