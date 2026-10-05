"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "../../hooks/useAppNavigation";
import { useBooking } from "../../context/BookingContext";
import { ROUTES } from "../../constants/routes";
import {
  topRoutesFromJaipur,
  topRoutesToDelhi,
} from "../../constants/routesData";
import { interlinksData } from "../../constants/interlinksData";
import { searchCabs, getDistance, getPopularCabRoutes } from "../../APIs/api";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export const CabListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchParams, setCheckoutItem, updateSearchParams } = useBooking();
  const { pickup, drop, date, time, tripType } = searchParams.cabs || {};

  const hourlyPackages = [
    {
      id: "4_40",
      duration: "4 hr",
      distance: "40 kms",
      label: "4 hrs (40 kms)",
      multiplier: 1.0,
      popular: true,
    },
    {
      id: "8_80",
      duration: "8 hr",
      distance: "80 kms",
      label: "8 hrs (80 kms)",
      multiplier: 1.75,
      popular: true,
    },
    {
      id: "12_120",
      duration: "12 hr",
      distance: "120 kms",
      label: "12 hrs (120 kms)",
      multiplier: 2.5,
    },
  ];

  const nextSearchParams = useSearchParams();
  const urlTripType = nextSearchParams ? nextSearchParams.get("trip_type") : null;

  let defaultPickup = pickup;
  let defaultDrop = drop;
  let defaultTripType = urlTripType || tripType || "oneway";

  if (!defaultPickup || !defaultDrop) {
    const pathname = location.pathname || "";
    const matchSlug = pathname.match(/\/cabs\/([^/]+)/);
    if (
      matchSlug &&
      matchSlug[1] &&
      matchSlug[1] !== "checkout" &&
      matchSlug[1] !== "success"
    ) {
      const slug = matchSlug[1];
      const formatCity = (str: string) =>
        str
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      if (slug.includes("-hourly-rental")) {
        defaultPickup = formatCity(slug.replace("-hourly-rental", ""));
        defaultDrop = "Local Rental";
        defaultTripType = "hourly";
      } else if (slug.includes("-to-")) {
        const parts = slug.split("-to-");
        defaultPickup = formatCity(parts[0]);
        defaultDrop = formatCity(parts[1]);
        defaultTripType = urlTripType || "oneway";
      }
    }
  }

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [currentTripType, setCurrentTripType] = useState(defaultTripType);
  const [activePackage, setActivePackage] = useState(
    searchParams.cabs?.package || "4_40",
  );
  const isHourly = currentTripType === "hourly";
  const currentPkg =
    hourlyPackages.find((p) => p.id === activePackage) || hourlyPackages[0];

  const [showModifySearch, setShowModifySearch] = useState(false);
  const [pickupLoc, setPickupLoc] = useState(defaultPickup || "");
  const [dropLoc, setDropLoc] = useState(defaultDrop || "");
  const [dateVal, setDateVal] = useState(date || getTomorrow());
  const [timeVal, setTimeVal] = useState(time || "10:00 AM");

  const shortPickup = pickupLoc ? pickupLoc.split(",")[0] : "";
  const shortDrop = dropLoc ? dropLoc.split(",")[0] : "";

  // Retrieve category filter from navigation state if present
  const initialFilter = location.state?.filterType || "all";
  const [filterType, setFilterType] = useState(initialFilter);
  const [filterPrice, setFilterPrice] = useState(10000); // Max budget
  const [sortBy, setSortBy] = useState("recommended");

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [openPopQuestion, setOpenPopQuestion] = useState(null);

  const [tripDistance, setTripDistance] = useState("311 kms");
  const [tripDuration, setTripDuration] = useState("4 hrs 30 mins");

  const [isLoading, setIsLoading] = useState(false);
  const [cabsList, setCabsList] = useState([]);

  const [dynamicFromRoutes, setDynamicFromRoutes] = useState([]);
  const [dynamicToRoutes, setDynamicToRoutes] = useState([]);

  useEffect(() => {
    const fetchCabs = async () => {
      setIsLoading(true);
      try {
        let dist = 311;

        if (!isHourly && pickupLoc && dropLoc) {
          const distData = await getDistance(pickupLoc, dropLoc);
          if (distData) {
            setTripDistance(distData.distanceText);
            setTripDuration(distData.durationText);
            dist = Math.round(distData.distanceValue / 1000);
          }
        }

        let mappedTripType = currentTripType;
        if (mappedTripType === "oneway") mappedTripType = "ONE_WAY";
        if (mappedTripType === "roundtrip") mappedTripType = "ROUND_TRIP";
        if (mappedTripType === "hourly") mappedTripType = "LOCAL";

        const parseDate = (dStr) => {
          if (!dStr) return new Date().toISOString();
          const cleanStr = dStr.replace("'", " 20");
          const d = new Date(cleanStr);
          return isNaN(d.getTime())
            ? new Date().toISOString()
            : d.toISOString();
        };

        const pathname =
          typeof window !== "undefined" ? window.location.pathname : "";
        const matchSlug = pathname.match(/\/cabs\/([^/]+)/);
        const slug =
          matchSlug &&
          matchSlug[1] &&
          matchSlug[1] !== "checkout" &&
          matchSlug[1] !== "success"
            ? matchSlug[1]
            : "";

        const payload = {
          trip_type: mappedTripType,
          from_location: pickupLoc,
          to_location: dropLoc,
          departure_date: parseDate(dateVal),
          total_distance: dist > 0 ? dist : 1,
          slug: slug,
        };

        const res = await searchCabs(payload);
        if (res?.results && Array.isArray(res.results)) {
          let allVehicles = [];
          res.results.forEach((routeObj, routeIdx) => {
            if (
              routeObj.vehicle_cards &&
              Array.isArray(routeObj.vehicle_cards)
            ) {
              routeObj.vehicle_cards.forEach((card, i) => {
                if (card.trip_type && card.trip_type !== mappedTripType) {
                  return; // Skip vehicles that do not match the selected trip type
                }
                const v = card.vehicle_details || {};
                allVehicles.push({
                  id: `${card.vehicle_token || v.token || v.id || "cab-api"}-${routeIdx}-${i}`,
                  name: v.name || v.type || "Cab",
                  category: (v.type || "sedan").toLowerCase(),
                  passengers: v.seater || v.capacity || 4,
                  luggage: v.luggage || 2,
                  price: (() => {
                    if (card.rate_amount) {
                      const rate = parseFloat(card.rate_amount) || 0;
                      const extra = parseFloat(card.extra_fare) || 0;
                      return card.rate_type === "KM"
                        ? rate * (dist > 0 ? dist : 1)
                        : rate;
                    }
                    return (
                      card.price || v.estimated_amount || v.price || v.rate || 0
                    );
                  })(),
                  hourlyPrice: v.hourly_rate || 1250,
                  extraKmRate: v.avg_per_km || v.extra_km_rate || 13,
                  extraHrRate: v.extra_hr_rate || 120,
                  rating: v.rating || 4.5,
                  reviews: v.reviews || Math.floor(Math.random() * 100),
                  ac: v.ac !== false,
                  provider: v.provider || "Lehconnect Partner",
                  img:
                    v.image1 || v.image || "/images/fleet/cab-sedan-dzire.webp",
                  isPopular: v.is_popular || false,
                  tags: v.tags
                    ? typeof v.tags === "string"
                      ? JSON.parse(v.tags)
                      : v.tags
                    : ["AC", "Clean & Comfortable"],
                });
              });
            }
          });
          setCabsList(allVehicles);
        } else {
          setCabsList([]);
        }

        // Fetch dynamic popular routes
        try {
          const popRoutes = await getPopularCabRoutes(pickupLoc, dropLoc);
          if (popRoutes) {
            if (
              popRoutes.topRoutesFromPickup &&
              popRoutes.topRoutesFromPickup.length > 0
            ) {
              setDynamicFromRoutes(popRoutes.topRoutesFromPickup);
            } else {
              setDynamicFromRoutes([]);
            }
            if (
              popRoutes.topRoutesToDrop &&
              popRoutes.topRoutesToDrop.length > 0
            ) {
              setDynamicToRoutes(popRoutes.topRoutesToDrop);
            } else {
              setDynamicToRoutes([]);
            }
          }
        } catch (err) {
          console.error("Failed to fetch popular routes:", err);
        }
      } catch (err) {
        console.error("Failed to search cabs:", err);
        setCabsList([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (pickupLoc && dropLoc) {
      fetchCabs();
    }
  }, [currentTripType, pickupLoc, dropLoc, dateVal]);

  // Filtering Logic
  const filteredCabs = cabsList
    .filter((cab) => filterType === "all" || cab.category === filterType)
    .filter((cab) => {
      const displayPrice = isHourly
        ? Math.round(cab.hourlyPrice * currentPkg.multiplier)
        : cab.price;
      return displayPrice <= filterPrice;
    })
    .sort((a, b) => {
      const priceA = isHourly
        ? Math.round(a.hourlyPrice * currentPkg.multiplier)
        : a.price;
      const priceB = isHourly
        ? Math.round(b.hourlyPrice * currentPkg.multiplier)
        : b.price;
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // recommended default
    });

  const handleBook = (cab) => {
    const computedPrice = isHourly
      ? Math.round(cab.hourlyPrice * currentPkg.multiplier)
      : cab.price;
    setCheckoutItem({
      type: "cab",
      itemId: cab.id,
      title: cab.name,
      category: cab.category,
      price: computedPrice,
      pickup: pickupLoc,
      drop: isHourly ? `Local Rental (${currentPkg.label})` : dropLoc,
      date: dateVal,
      time: timeVal,
      tripType: isHourly ? "hourly" : currentTripType,
      isHourly: isHourly,
      packageId: currentPkg.id,
      packageDuration: currentPkg.duration,
      packageDistance: currentPkg.distance,
      packageLabel: currentPkg.label,
      extraKmRate: cab.extraKmRate,
      extraHrRate: cab.extraHrRate,
      passengers: cab.passengers,
      luggage: cab.luggage,
      provider: cab.provider,
      img: cab.img,
    });
    navigate(ROUTES.CAB_CHECKOUT);
  };

  const handleRouteBook = (item) => {
    const parts = item.route.replace(" Cabs", "").split(" to ");
    const startCity = parts[0] || "Jaipur";
    const endCity = parts[1] || "Ajmer";

    updateSearchParams("cabs", {
      pickup: startCity,
      drop: endCity,
      date: dateVal,
      time: timeVal,
    });

    setCheckoutItem({
      type: "cab",
      itemId: `route-cab-${item.category.toLowerCase()}`,
      title: `${item.category.charAt(0) + item.category.slice(1).toLowerCase()} Cab`,
      category: item.category.toLowerCase(),
      price: item.price,
      pickup: startCity,
      drop: endCity,
      date: dateVal,
      time: timeVal,
      passengers: item.category.toLowerCase() === "suv" ? 6 : 4,
      luggage: item.category.toLowerCase() === "suv" ? 3 : 2,
      provider: "Lehconnect Partner",
    });

    navigate(ROUTES.CAB_CHECKOUT);
  };

  const getCategoryBadgeStyle = (cat) => {
    if (cat === "sedan")
      return { bg: "#0055ff", color: "#fff", label: "SEDAN" };
    if (cat === "muv") return { bg: "#805ad5", color: "#fff", label: "MUV" };
    if (cat === "hatchback")
      return { bg: "#38a169", color: "#fff", label: "HATCHBACK" };
    if (cat === "suv") return { bg: "#dd6b20", color: "#fff", label: "SUV" };
    return { bg: "#4a5568", color: "#fff", label: cat.toUpperCase() };
  };

  const seoSections = [
    {
      title: "Booking Your Cab Made Easy",
      subtitle: "A simple guide to booking your cab from Jaipur to Delhi",
      content: (
        <div>
          <p>
            Booking your cab with Lehconnect for your journey from Jaipur to
            Delhi is straightforward and user-friendly. You can choose from
            various trip types, including one-way, round-trip, and multi-city
            bookings, making it easy to plan your travel according to your
            needs.
          </p>
          <div className="table-responsive my-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Trip Type</th>
                  <th>Description</th>
                  <th>How to Book</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>One-Way</td>
                  <td>Travel from Jaipur to Delhi without a return trip.</td>
                  <td>Select the one-way option during booking.</td>
                </tr>
                <tr>
                  <td>Round-Trip</td>
                  <td>Travel from Jaipur to Delhi and back.</td>
                  <td>
                    Choose the round-trip option and specify your return
                    details.
                  </td>
                </tr>
                <tr>
                  <td>Multi-City</td>
                  <td>Visit multiple destinations in one booking.</td>
                  <td>
                    Use the multi-city option to add stops during your journey.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Make sure to check the available payment options, which include
            credit cards, debit cards, net banking, and digital wallets. You can
            also modify your booking details for free up to one hour before your
            scheduled departure.
          </p>
          <p>
            For promotional discounts, apply the coupon code{" "}
            <strong>CABTRIP</strong> during the booking process to enjoy savings
            on your fare.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "How can I book a round trip cab from Jaipur to Delhi?",
          a: "To book a round trip cab from Jaipur to Delhi, simply select the round-trip option during the booking process and enter your departure and return details. Lehconnect makes it easy to manage your travel plans.",
        },
        {
          q: "What payment options are available when booking a cab from Jaipur to Delhi?",
          a: "When booking a cab from Jaipur to Delhi, you can choose from various payment options including credit cards, debit cards, net banking, and digital wallets. Lehconnect provides flexible payment methods to suit your preferences.",
        },
        {
          q: "Can I modify my booking details for my trip from Jaipur to Delhi?",
          a: "Yes, you can request free modifications to your travel dates, pickup/drop locations, and vehicle types up to one hour before your departure. This ensures that your plans can be adjusted easily with Lehconnect.",
        },
      ],
    },
    {
      title: "Sightseeing and Local Tours",
      subtitle: "Explore attractions during your cab journey",
      content: (
        <div>
          <p>
            When you book a round-trip cab with Lehconnect from Jaipur to Delhi,
            sightseeing is included within the designated kilometer limits at
            your destination. You can also request local sightseeing at your
            source during the review stage of your booking.
          </p>
          <p>
            However, for one-way trips from Jaipur to Delhi, sightseeing is not
            permitted as this is a direct transfer. Any custom stops must be
            explicitly added at the time of booking.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "Does the round trip cab booking from Jaipur to Delhi include sightseeing?",
          a: "Yes, when you book a round trip cab with Lehconnect from Jaipur to Delhi, sightseeing is included within the designated kilometer limits at your destination.",
        },
        {
          q: "Can I stop the vehicle during my one-way cab journey from Jaipur to Delhi for sightseeing?",
          a: "No, sightseeing is not allowed during one-way trips from Jaipur to Delhi, as these are direct transfers. Although you can add required stops to book multi-city cab options.",
        },
        {
          q: "Will the driver take us for sightseeing at any places during our round trip from Jaipur to Delhi?",
          a: "Yes, during your round trip with Lehconnect, the driver can take you for sightseeing at your destination, provided it fits within the designated kilometer limits.",
        },
      ],
    },
    {
      title: "Choosing the Right Cab Type",
      subtitle: "Find the perfect cab for your journey from Jaipur to Delhi.",
      content: (
        <div>
          <p>
            When planning your journey from Jaipur to Delhi, selecting the right
            cab type is essential to ensure a comfortable and convenient travel
            experience. Lehconnect Cabs offers a variety of options tailored to
            different group sizes and luggage needs.
          </p>
          <div className="table-responsive my-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Cab Type</th>
                  <th>Seat Capacity</th>
                  <th>Fuel Types Available</th>
                  <th>Boot Space (Bags)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hatchback</td>
                  <td>4</td>
                  <td>Diesel</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>Sedan</td>
                  <td>4</td>
                  <td>CNG, Diesel, Electric</td>
                  <td>2–3</td>
                </tr>
                <tr>
                  <td>SUV</td>
                  <td>6</td>
                  <td>CNG, Diesel</td>
                  <td>2–3</td>
                </tr>
                <tr>
                  <td>Compact SUV</td>
                  <td>4</td>
                  <td>Electric</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Electric SUV</td>
                  <td>4</td>
                  <td>Electric</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Tempo Traveller</td>
                  <td>12</td>
                  <td>Diesel</td>
                  <td>8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>
              Note: Roof carrier availability may vary by cab type, so please
              check the cab card during booking for specific options.
            </strong>
          </p>
        </div>
      ),
      faqs: [
        {
          q: "Which cab should I choose for my one-way trip from Jaipur to Delhi?",
          a: "The best cab for your trip from Jaipur to Delhi depends on your group size and luggage needs. Lehconnect offers various options, including Hatchbacks, Sedans, SUVs, and more, to accommodate different requirements.",
        },
        {
          q: "Are there suitable cab options for 4 passengers traveling from Jaipur to Delhi?",
          a: "Yes, Lehconnect has a range of cab options suitable for 4 passengers traveling from Jaipur to Delhi. You can choose from Hatchbacks, Sedans, SUVs, or even a Tempo Traveller for larger groups.",
        },
      ],
    },
    {
      title: "What’s Included in Your Fare",
      subtitle:
        "Understand the components of your cab fare from Jaipur to Delhi",
      content: (
        <div>
          <p>
            When you book a cab with Lehconnect for your journey from Jaipur to
            Delhi, several components are included in your fare. This ensures
            transparency and helps you understand what you are paying for.
          </p>
          <div className="table-responsive my-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fare Component</th>
                  <th>What It Covers</th>
                  <th>When It Applies</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Toll Charges</td>
                  <td>All applicable toll charges for your route</td>
                  <td>Included in the fare for one-way and round trips</td>
                </tr>
                <tr>
                  <td>Parking Fees</td>
                  <td>Parking fees at the pickup and drop-off locations</td>
                  <td>Included in the fare</td>
                </tr>
                <tr>
                  <td>Driver Allowance</td>
                  <td>Driver's allowance for meals and accommodation</td>
                  <td>Applicable for round trips</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For additional services, you can opt for extras such as expressway
            route selection, driver language preference, and roof carriers for
            extra luggage capacity, each available for a nominal fee.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "Are toll charges included in the fare for my one-way cab from Jaipur to Delhi?",
          a: "Yes, toll charges are included in the fare for your one-way cab journey from Jaipur to Delhi with Lehconnect.",
        },
        {
          q: "What is included in the total fare for the round trip cab from Jaipur to Delhi?",
          a: "The total fare for your round trip cab from Jaipur to Delhi with Lehconnect includes toll charges, parking fees, and driver allowances.",
        },
        {
          q: "Are parking fees included in the cab booking from Jaipur to Delhi?",
          a: "Yes, parking fees are included in the fare for your cab booking from Jaipur to Delhi with Lehconnect.",
        },
      ],
    },
    {
      title: "Waiting Time Policies Explained",
      subtitle:
        "Understand the waiting time policies for your cab booking, including grace periods and potential charges for delays during your trip from Jaipur to Delhi.",
      content: (
        <div>
          <p>
            At Lehconnect, we strive to provide clear and transparent policies
            regarding waiting times for your cab booking. Understanding these
            policies can help you plan your journey from Jaipur to Delhi
            effectively.
          </p>
          <div className="table-responsive my-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Policy Area</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Free Waiting at Pickup</td>
                  <td>
                    A complimentary free waiting window of 30 to 45 minutes is
                    provided at pickup, depending on the cab category selected.
                  </td>
                </tr>
                <tr>
                  <td>Charges After Grace Period</td>
                  <td>
                    Beyond the free grace period, applicable waiting charges
                    accrue in 30 to 60 minute slabs based on vehicle type,
                    driver availability, and vendor fare rules.
                  </td>
                </tr>
                <tr>
                  <td>No-Charge Waiting at En-Route Stops</td>
                  <td>
                    Waiting at en-route stops does not incur additional charges,
                    allowing you to take breaks without worry.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Note: Prolonged pickup delays exceeding the maximum allowed waiting
            limit may result in driver release and trip cancellation without
            refund.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "Will the cab wait if I am delayed at pickup for my one-way cab from Jaipur to Delhi?",
          a: "Yes, Lehconnect provides a complimentary waiting window of 30 to 45 minutes at pickup, depending on the cab category selected.",
        },
        {
          q: "Are there waiting charges for the one-way cab from Jaipur to Delhi?",
          a: "Yes, waiting charges may apply beyond the free waiting period, accruing in 30 to 60 minute slabs based on vehicle type and driver availability, as per Lehconnect's policies.",
        },
        {
          q: "Is there a time limit for the rest stop during my one-way cab journey from Jaipur to Delhi?",
          a: "While there is no specific time limit for rest stops, Lehconnect encourages you to be mindful of the overall trip duration to avoid any additional waiting charges.",
        },
      ],
    },
    {
      title: "Driver Quality and Professionalism",
      subtitle: "Understanding Your Driver's Role and Standards",
      content: (
        <div>
          <p>
            When you book with Lehconnect Cabs, you can expect a high standard
            of driver quality and professionalism. Your driver and vehicle
            details will be shared up to 30 minutes before your scheduled
            departure time, allowing you to verify the information before
            boarding.
          </p>
          <div className="table-responsive my-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Policy Area</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Driver Allowance</td>
                  <td>
                    Driver allowance for food and accommodation is included in
                    the fare, and drivers make their own arrangements, so no
                    extra payment is required.
                  </td>
                </tr>
                <tr>
                  <td>Driver Verification</td>
                  <td>
                    Verify your vehicle details before boarding; if a different
                    cab or driver arrives, do not board and contact customer
                    support immediately for assistance.
                  </td>
                </tr>
                <tr>
                  <td>Language Preference</td>
                  <td>
                    While booking, you can request a driver who speaks your
                    preferred language for better communication.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Lehconnect is committed to providing verified drivers, ensuring a
            reliable and professional travel experience for all passengers.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "Are outstation cab drivers entitled to food and accommodation expenses during trips from Jaipur to Delhi?",
          a: "Yes, outstation cab drivers have their food and accommodation expenses covered as part of the fare, so no extra payment is required for these arrangements when you travel with Lehconnect.",
        },
        {
          q: "Can I request an English-speaking driver for my cab booking?",
          a: "Absolutely! You can request a driver who speaks English when booking your cab with Lehconnect, ensuring better communication during your journey.",
        },
        {
          q: "Will the same driver stay with me throughout my round-trip cab booking from Jaipur to Delhi?",
          a: "Yes, when you book a round-trip cab with Lehconnect, the same driver will stay with you throughout the entire journey, providing a consistent and reliable travel experience.",
        },
      ],
    },
    {
      title: "Night Travel Charges and Policies",
      subtitle: "Understanding Night Charges for Your Cab Journey",
      content: (
        <div>
          <p>
            When you book a cab with Lehconnect for travel between Jaipur and
            Delhi, it's important to be aware of the night travel charges that
            may apply. Night charges are applicable for cab bookings when the
            vehicle is used between 10:00 PM and 6:00 AM. These charges account
            for overnight driver allowances and the operational costs associated
            with late-hour travel.
          </p>
          <div className="table-responsive my-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Policy Area</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Night Charge Timing</td>
                  <td>Applicable from 10:00 PM to 6:00 AM</td>
                </tr>
                <tr>
                  <td>Applicability</td>
                  <td>
                    Round trip and multi-city bookings incur extra charges
                  </td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>
                    Included in fare for one-way; paid directly to driver for
                    round trips
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For more detailed information regarding specific rates, please refer
            to the final trip selection during your booking process.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "What are the night charges for cab bookings?",
          a: "Night charges apply when the vehicle is used between 10:00 PM and 6:00 AM, and these charges are included in the overall fare for one-way trips. For round trips, additional fees will be paid directly to the driver, so it's best to check the details during your booking with Lehconnect.",
        },
        {
          q: "When are night charges applicable for cabs from Jaipur to Delhi?",
          a: "Night charges are applicable for cab bookings from Jaipur to Delhi when the travel occurs between 10:00 PM and 6:00 AM. Lehconnect ensures that you are informed about these charges during your booking process.",
        },
      ],
    },
    {
      title: "Group Travel Options",
      subtitle: "Explore the available cab options for group travel.",
      content: (
        <div>
          <p>
            When planning a group trip, Lehconnect Cabs offers a variety of
            options to accommodate your needs. Whether you're traveling with
            family, friends, or colleagues, our cabs are designed to provide
            comfort and convenience for larger groups.
          </p>
          <div className="table-responsive my-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Cab Type</th>
                  <th>Seat Capacity</th>
                  <th>Fuel Types Available</th>
                  <th>Boot Space (Bags)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SUV</td>
                  <td>6</td>
                  <td>CNG, Diesel</td>
                  <td>2–3</td>
                </tr>
                <tr>
                  <td>Tempo Traveller</td>
                  <td>12</td>
                  <td>Diesel</td>
                  <td>8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Each vehicle type comes with standard inclusions such as state
            taxes, parking fees, and a uniformed driver to ensure a hassle-free
            experience. For larger groups, the Tempo Traveller is particularly
            suitable, offering ample seating and luggage capacity.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "What options do you have for a group of 12 travelers from Jaipur to Delhi?",
          a: "For a group of 12 travelers, Lehconnect recommends booking a Tempo Traveller, which comfortably accommodates your group while providing sufficient luggage space.",
        },
        {
          q: "Can I book an SUV for 6 adults traveling from Jaipur to Delhi?",
          a: "Yes, you can book an SUV through Lehconnect Cabs for 6 adults, ensuring a comfortable journey with enough space for luggage.",
        },
        {
          q: "What is the luggage capacity for a Tempo Traveller when traveling from Jaipur to Delhi?",
          a: "The Tempo Traveller can accommodate up to 8 bags, making it an excellent choice for group travel with substantial luggage on Lehconnect.",
        },
      ],
    },
  ];

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="container">
        {/* LehConnect-Style Collapsed Search Summary Header Bar */}
        <div
          className="bg-white border border-bottom shadow-sm py-3 text-start mb-4 rounded-3"
          style={{ borderColor: "#e7e7e7" }}
        >
          <div className="container">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              {/* Search Recap Details */}
              <div className="d-flex align-items-center gap-4 flex-wrap">
                <div>
                  <div className="d-flex align-items-center gap-1.5 mb-1">
                    <span
                      className={`badge ${isHourly ? "bg-primary" : "bg-secondary"} px-2 py-0.5 text-uppercase fw-bold fs-10`}
                    >
                      {isHourly
                        ? "Hourly Rental"
                        : currentTripType === "roundtrip"
                          ? "Round Trip"
                          : currentTripType === "local"
                            ? "Local"
                            : "One Way"}
                    </span>
                    <span
                      className="text-muted text-uppercase font-weight-bold"
                      style={{ fontSize: "10px", letterSpacing: "0.5px" }}
                    >
                      PICKUP LOCATION
                    </span>
                  </div>
                  <strong className="text-dark fs-8">
                    {pickupLoc || pickup || "Delhi Airport (DEL)"}
                  </strong>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "24px",
                    backgroundColor: "#e7e7e7",
                  }}
                />

                <div>
                  <span
                    className="text-muted d-block uppercase font-weight-bold"
                    style={{ fontSize: "10px", letterSpacing: "0.5px" }}
                  >
                    {isHourly ? "RENTAL PACKAGE" : "DROP LOCATION"}
                  </span>
                  <strong className="text-dark fs-8">
                    {isHourly
                      ? `${currentPkg.label} (${currentPkg.duration} | ${currentPkg.distance})`
                      : dropLoc || drop || "Agra Fort"}
                  </strong>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "24px",
                    backgroundColor: "#e7e7e7",
                  }}
                />

                <div>
                  <span
                    className="text-muted d-block uppercase font-weight-bold"
                    style={{ fontSize: "10px", letterSpacing: "0.5px" }}
                  >
                    JOURNEY DATE
                  </span>
                  <strong className="text-dark fs-8">
                    {dateVal || date || "2026-07-30"}
                  </strong>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "24px",
                    backgroundColor: "#e7e7e7",
                  }}
                />

                <div>
                  <span
                    className="text-muted d-block uppercase font-weight-bold"
                    style={{ fontSize: "10px", letterSpacing: "0.5px" }}
                  >
                    PICKUP TIME
                  </span>
                  <strong className="text-dark fs-8">
                    {timeVal || time || "09:00 AM"}
                  </strong>
                </div>
              </div>

              {/* Modify Button */}
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                style={{
                  fontSize: "12px",
                  borderColor: "#0061ae",
                  color: "#0061ae",
                }}
              >
                <i
                  className="fa-solid fa-magnifying-glass me-1"
                  style={{ fontSize: "11px" }}
                ></i>{" "}
                Modify Search
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Modify Search Panel */}
        {showModifySearch && (
          <div
            className="bg-white border rounded-3 shadow-sm p-4 mb-4 text-start"
            style={{ borderColor: "#e7e7e7" }}
          >
            <div className="d-flex gap-2 mb-3 pb-2 border-bottom flex-wrap">
              {[
                { id: "oneway", label: "One Way" },
                { id: "roundtrip", label: "Round Trip" },
                { id: "local", label: "Local" },
                { id: "hourly", label: "Hourly Rentals" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCurrentTripType(t.id)}
                  className={`btn btn-sm rounded-pill px-3 py-1 fs-8 fw-semibold ${currentTripType === t.id ? "btn-primary text-white" : "btn-outline-secondary"}`}
                  style={
                    currentTripType === t.id
                      ? { backgroundColor: "#0061ae", borderColor: "#0061ae" }
                      : {}
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div
              className="card p-0 border rounded-3 overflow-hidden"
              style={{ borderColor: "#e7e7e7" }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateSearchParams("cabs", {
                    pickup: pickupLoc,
                    drop: isHourly
                      ? `Local Rental (${currentPkg.label})`
                      : dropLoc,
                    date: dateVal,
                    time: timeVal,
                    tripType: currentTripType,
                    package: activePackage,
                    packageDuration: currentPkg.duration,
                    packageDistance: currentPkg.distance,
                    packageLabel: currentPkg.label,
                  });
                  setShowModifySearch(false);
                  toast.success("Cab search parameters updated!");
                }}
              >
                <div className="d-flex flex-wrap flex-md-nowrap align-items-stretch">
                  {/* Pickup */}
                  <div
                    className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light"
                    style={{
                      minWidth: "180px",
                      borderRight: "1px solid #e7e7e7",
                    }}
                  >
                    <span
                      className="text-muted fw-bold d-block text-uppercase mb-1"
                      style={{ fontSize: "10px" }}
                    >
                      PICKUP LOCATION
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 p-0 fw-bold text-dark fs-8 bg-transparent"
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      required
                    />
                  </div>

                  {/* Drop OR Package */}
                  {isHourly ? (
                    <div
                      className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light"
                      style={{
                        minWidth: "200px",
                        borderRight: "1px solid #e7e7e7",
                      }}
                    >
                      <span
                        className="text-muted fw-bold d-block text-uppercase mb-1"
                        style={{ fontSize: "10px" }}
                      >
                        RENTAL PACKAGE
                      </span>
                      <select
                        className="form-select border-0 p-0 fw-bold text-dark fs-8 bg-transparent shadow-none"
                        value={activePackage}
                        onChange={(e) => setActivePackage(e.target.value)}
                      >
                        {hourlyPackages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.label} {pkg.popular ? "★ (Popular)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div
                      className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light"
                      style={{
                        minWidth: "180px",
                        borderRight: "1px solid #e7e7e7",
                      }}
                    >
                      <span
                        className="text-muted fw-bold d-block text-uppercase mb-1"
                        style={{ fontSize: "10px" }}
                      >
                        DROP LOCATION
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 p-0 fw-bold text-dark fs-8 bg-transparent"
                        value={dropLoc}
                        onChange={(e) => setDropLoc(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Date */}
                  <div
                    className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light"
                    style={{
                      minWidth: "150px",
                      borderRight: "1px solid #e7e7e7",
                    }}
                  >
                    <span
                      className="text-muted fw-bold d-block text-uppercase mb-1"
                      style={{ fontSize: "10px" }}
                    >
                      JOURNEY DATE
                    </span>
                    <input
                      type="date"
                      className="form-control border-0 p-0 fw-bold text-dark fs-8 bg-transparent"
                      value={dateVal}
                      onChange={(e) => setDateVal(e.target.value)}
                      required
                    />
                  </div>

                  {/* Time */}
                  <div
                    className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light"
                    style={{
                      minWidth: "120px",
                      borderRight: "1px solid #e7e7e7",
                    }}
                  >
                    <span
                      className="text-muted fw-bold d-block text-uppercase mb-1"
                      style={{ fontSize: "10px" }}
                    >
                      PICKUP TIME
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 p-0 fw-bold text-dark fs-8 bg-transparent"
                      value={timeVal}
                      onChange={(e) => setTimeVal(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary px-5 fw-bold text-uppercase d-flex align-items-center justify-content-center text-white border-0 rounded-0"
                    style={{
                      backgroundColor: "#0061ae",
                      minHeight: "60px",
                      fontSize: "13px",
                    }}
                  >
                    UPDATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hourly Rental Package Quick-Filter Tabs/Chips (when tripType is hourly) */}
        {isHourly && (
          <div
            className="bg-white border rounded-3 p-3 mb-4 shadow-sm text-start"
            style={{ borderColor: "#e7e7e7" }}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <div>
                <span className="badge bg-primary text-uppercase px-2.5 py-1 fs-9 fw-bold me-2">
                  HOURLY PACKAGES
                </span>
                <strong className="text-dark fs-7">
                  Select Duration & Kms for Your Local Tour
                </strong>
              </div>
              <small className="text-muted fs-9">
                Chauffeur & cab reserved exclusively for your city travel
              </small>
            </div>
            <div
              className="d-flex gap-2 overflow-x-auto pb-1 pt-1"
              style={{ scrollbarWidth: "thin" }}
            >
              {hourlyPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setActivePackage(pkg.id);
                    updateSearchParams("cabs", {
                      ...searchParams.cabs,
                      package: pkg.id,
                      packageDuration: pkg.duration,
                      packageDistance: pkg.distance,
                      packageLabel: pkg.label,
                    });
                    toast.success(`Switched to ${pkg.label}`);
                  }}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fs-8 text-nowrap fw-semibold d-flex align-items-center gap-1.5 transition-all ${activePackage === pkg.id ? "btn-primary text-white shadow-sm" : "btn-outline-secondary"}`}
                  style={
                    activePackage === pkg.id
                      ? { backgroundColor: "#0061ae", borderColor: "#0061ae" }
                      : {}
                  }
                >
                  <span>{pkg.label}</span>
                  {pkg.popular && (
                    <span
                      className={`badge ${activePackage === pkg.id ? "bg-warning text-dark" : "bg-secondary text-white"} fs-10 px-1.5 py-0.5`}
                    >
                      POPULAR
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="bg-white border rounded-3 p-3 mb-4 shadow-sm">
          <div className="row g-3 text-start justify-content-center align-items-center">
            <div className="col-md-3 d-flex align-items-center gap-3">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold leh-style-auto-1085">
                <i className="fa-regular fa-user"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0 fs-8 text-dark">
                  Verified Drivers
                </h6>
                <small className="text-muted leh-style-auto-1086">
                  Background Verified
                </small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-center gap-3 border-start border-light">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold leh-style-auto-1085">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0 fs-8 text-dark">Safe & Secure</h6>
                <small className="text-muted leh-style-auto-1086">
                  Your safety is our priority
                </small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-center gap-3 border-start border-light">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold leh-style-auto-1085">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0 fs-8 text-dark">
                  Best Price Guarantee
                </h6>
                <small className="text-muted leh-style-auto-1086">
                  Get the best prices always
                </small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-center gap-3 border-start border-light">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold leh-style-auto-1085">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0 fs-8 text-dark">24/7 Support</h6>
                <small className="text-muted leh-style-auto-1086">
                  We are here to help
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {/* Left Sidebar Filters */}
          <div className="col-lg-3">
            <div className="filter-sidebar bg-white p-3 rounded-4 border shadow-sm">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6 text-dark">
                  <i className="fa-solid fa-car   me-1.5"></i> Filter Cabs
                </h5>
                <button
                  onClick={() => {
                    setFilterType("all");
                    setFilterPrice(10000);
                    setSortBy("recommended");
                  }}
                  className="btn btn-sm btn-link p-0 text-decoration-none fs-8   fw-bold"
                >
                  Reset All
                </button>
              </div>

              {/* Vehicle Type Accordion Block */}
              <div className="filter-section border-bottom pb-3 mb-3 text-start">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0 fs-7 text-dark">Vehicle Type</h6>
                </div>
                <div className="d-flex flex-column gap-2 mt-2">
                  {[
                    { val: "all", label: "All Vehicles" },
                    { val: "sedan", label: "Sedans" },
                    { val: "suv", label: "SUVs" },
                    { val: "muv", label: "MUVs" },
                    { val: "hatchback", label: "Hatchbacks" },
                  ].map((cat) => (
                    <label
                      className="d-flex align-items-center gap-2 fs-8 cursor-pointer text-secondary"
                      key={cat.val}
                    >
                      <input
                        type="radio"
                        name="vehicleCat"
                        checked={filterType === cat.val}
                        onChange={() => setFilterType(cat.val)}
                        className="form-check-input"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Slider Block */}
              <div className="filter-section border-bottom pb-3 mb-3 text-start">
                <h6 className="fw-bold mb-2 fs-7 text-dark">Max Budget</h6>
                <div className="d-flex justify-content-between fs-8 text-muted mb-1">
                  <span>₹0</span>
                  <span>₹10,000</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="10000"
                  step="500"
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(parseInt(e.target.value))}
                />
                <div className="fw-semibold   fs-8 mt-1">
                  ₹{filterPrice.toLocaleString()}
                </div>
              </div>

              {/* Amenities Block */}
              <div className="filter-section border-bottom pb-3 mb-3 text-start">
                <h6 className="fw-bold mb-2 fs-7 text-dark">Amenities</h6>
                <div className="d-flex flex-column gap-2">
                  <label className="d-flex align-items-center gap-2 fs-8 cursor-pointer text-secondary">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="form-check-input"
                    />
                    <span>AC</span>
                  </label>
                  <label className="d-flex align-items-center gap-2 fs-8 cursor-pointer text-secondary">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="form-check-input"
                    />
                    <span>Driver Allowance Included</span>
                  </label>
                  <label className="d-flex align-items-center gap-2 fs-8 cursor-pointer text-secondary">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="form-check-input"
                    />
                    <span>Toll & Taxes Included</span>
                  </label>
                  <label className="d-flex align-items-center gap-2 fs-8 cursor-pointer text-secondary">
                    <input type="checkbox" className="form-check-input" />
                    <span>Extra Luggage Space</span>
                  </label>
                </div>
              </div>

              {/* Sort By Block */}
              <div className="filter-section text-start mb-4">
                <h6 className="fw-bold mb-2 fs-7 text-dark">Sort By</h6>
                <select
                  className="form-select form-select-sm fs-8"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Planning a Round Trip? sidebar banner */}
              <div className="p-3 text-white text-center position-relative overflow-hidden leh-style-auto-1087">
                <div className="position-relative leh-style-auto-1080">
                  <h6 className="fw-bold text-white mb-2 fs-7">
                    Planning a Round Trip?
                  </h6>
                  <p className="text-white-50 fs-9 px-2 mb-3">
                    Get special discounts on round trip bookings.
                  </p>

                  <div className="my-3 d-flex justify-content-center">
                    <img
                      src="/images/home/cab-driving-scenic.webp"
                      alt="Round Trip Cab"
                      className="leh-style-auto-1088"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-warning btn-sm w-100 rounded-pill py-2 fw-bold text-dark border-0 leh-style-auto-1089"
                  >
                    Explore Round Trip{" "}
                    <span>
                      <i className="fa-solid fa-arrow-right ms-1"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Listing Cards */}
          <div className="col-lg-9">
            {/* SEO Header Section */}
            <div className="bg-white border rounded-4 p-4 mb-4 text-start shadow-sm">
              <h1 className="fw-bold text-dark fs-4 mb-2">
                {isHourly
                  ? `${pickupLoc || pickup || "City"} Hourly Rental Cabs, Use "CABTRIP" for Upto Rs 500 Off`
                  : `${pickupLoc || pickup || "Jaipur"} To ${dropLoc || drop || "Delhi"} Cabs, Use "CABTRIP" Upto Rs 500 Off`}
              </h1>
              <p className="text-secondary fw-semibold mb-3">
                {isHourly
                  ? `Hourly Rental Package: ${currentPkg.label} (${currentPkg.duration} | ${currentPkg.distance} included)`
                  : `${pickupLoc || pickup || "Jaipur"} to ${dropLoc || drop || "Delhi"} one way distance ${tripDistance} | One way duration ${tripDuration}`}
              </p>
              <p className="text-secondary small mb-0">
                {isHourly
                  ? `Book a private chauffeured cab on flexible hourly rental packages in ${pickupLoc || pickup || "your city"}. Perfect for multi-stop meetings, shopping excursions, city sightseeing, or events. Keep the same car and verified driver for the duration of your trip with transparent extra km and extra hour pricing.`
                  : `${pickupLoc || pickup || "Jaipur"} to ${dropLoc || drop || "Delhi"} is a popular route booked at Lehconnect. Driving distance is ${tripDistance} and generally it takes ${tripDuration} to complete the trip. Book your cab with Lehconnect which offers a wide range of cab selection starting from ₹2,294. Choose from Sedans, SUVs, Hatchbacks, or Tempo Travellers. Enjoy flexibility to modify/cancel up to 1 hour before pickup, 24x7 customer care support, and custom add-ons like roof carriers and newer models. Apply the code CABTRIP on your first booking and save up to ₹500.`}
              </p>
            </div>

            <div className="text-start mb-3 d-flex justify-content-between align-items-center">
              <h6 className="text-dark fw-bold mb-0">
                {isLoading
                  ? "Searching for Cabs..."
                  : `${filteredCabs.length} Cab options found`}
              </h6>
              {isHourly && (
                <span className="badge bg-light text-primary border border-primary border-opacity-25 px-2.5 py-1 fs-9 fw-semibold">
                  Package: {currentPkg.label}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="card border-0 p-5 text-center shadow-sm rounded-4 bg-white d-flex align-items-center justify-content-center">
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-bold text-dark mt-3">
                  Fetching best cab options...
                </h5>
              </div>
            ) : filteredCabs.length === 0 ? (
              <div className="card border-0 p-5 text-center shadow-sm rounded-4 bg-white">
                <i
                  className="fa-solid fa-car text-muted mx-auto mb-3"
                  style={{ fontSize: "40px" }}
                ></i>
                <h5 className="fw-bold text-dark">No Cabs Match Filters</h5>
                <p className="text-muted fs-8">
                  Try increasing your budget range or choosing another vehicle
                  type.
                </p>
                <button
                  onClick={() => {
                    setFilterType("all");
                    setFilterPrice(10000);
                  }}
                  className="btn btn-primary rounded-pill px-4 py-2 mt-2 mx-auto border-0 fw-bold fs-8"
                  style={{ backgroundColor: "#0061ae" }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredCabs.map((cab) => {
                const displayPrice = isHourly
                  ? Math.round(cab.hourlyPrice * currentPkg.multiplier)
                  : cab.price;
                return (
                  <div
                    className="bg-white border rounded-4 p-3 mb-3 text-start shadow-sm card-hover-shadow"
                    key={cab.id}
                  >
                    <div className="row g-3 align-items-center">
                      {/* Car Image & Category pill */}
                      <div className="col-md-3 text-center position-relative">
                        {cab.isPopular && (
                          <span className="position-absolute start-0 top-0 badge bg-warning text-dark fw-bold px-2.5 py-1 leh-style-auto-1090">
                            POPULAR
                          </span>
                        )}
                        <div className="overflow-hidden rounded-3 mb-2 leh-style-auto-1091">
                          <img
                            src={cab.img}
                            alt={cab.name}
                            className="w-100 h-100 object-fit-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        {(() => {
                          const badge = getCategoryBadgeStyle(cab.category);
                          return (
                            <span
                              className={`badge fw-bold text-uppercase px-3 py-1_5 fs-9 leh-cab-badge leh-cab-badge-${cab.category} ${["sedan", "muv", "hatchback", "suv"].includes(cab.category) ? "" : "leh-cab-badge-default"}`}
                            >
                              {badge.label}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Middle Info Column */}
                      <div className="col-md-5">
                        <h5 className="fw-bold text-dark mb-1">{cab.name}</h5>
                        <p className="text-muted fs-8 mb-2">
                          Provided by {cab.provider}
                        </p>

                        {/* Package inclusion banner if hourly */}
                        {isHourly && (
                          <div className="mb-2">
                            <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 px-2.5 py-1 fs-9 fw-bold">
                              <i className="fa-regular fa-clock me-1"></i>{" "}
                              Includes {currentPkg.duration} &{" "}
                              {currentPkg.distance}
                            </span>
                          </div>
                        )}

                        {/* Specs Row */}
                        <div className="d-flex align-items-center gap-3 fs-8 text-secondary mb-2">
                          <span className="d-flex align-items-center gap-1">
                            <i className="fa-solid fa-user-group text-secondary me-1.5"></i>{" "}
                            {cab.passengers} Seats
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <i className="fa-solid fa-suitcase-rolling text-secondary me-1.5"></i>{" "}
                            {cab.luggage} Bags
                          </span>
                          {cab.ac && (
                            <span className="d-flex align-items-center gap-1">
                              <i className="fa-regular fa-snowflake text-info me-1.5"></i>{" "}
                              AC
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="d-flex align-items-center gap-1 mb-3">
                          <span className="text-warning d-flex align-items-center gap-0.5 fs-8 fw-bold">
                            <i className="fa-solid fa-star text-warning me-1"></i>{" "}
                            {cab.rating}
                          </span>
                          <span className="text-muted fs-8">
                            ({cab.reviews} ratings)
                          </span>
                        </div>

                        {/* Feature pill tags */}
                        <div className="d-flex flex-wrap gap-1.5">
                          {cab.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-secondary fw-semibold border px-2.5 py-1.5 fs-9 leh-style-auto-1066"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Pricing & checkout buttons */}
                      <div className="col-md-4 text-md-end border-start border-light ps-md-4">
                        <div className="text-muted fs-9">
                          {isHourly
                            ? `Hourly Fare (${currentPkg.duration}) ℹ`
                            : currentTripType === "roundtrip"
                              ? "Round Trip Fare ℹ"
                              : "Oneway Fare ℹ"}
                        </div>
                        <div className="fs-3 fw-black text-dark my-1 leh-style-auto-1029">
                          ₹{displayPrice.toLocaleString()}
                        </div>

                        {isHourly ? (
                          <>
                            <div className="text-success fs-9 fw-bold mb-1">
                              <i className="fa-solid fa-gas-pump me-1"></i> Fuel
                              & Chauffeur Included
                            </div>
                            <div className="text-muted fs-9 mb-3">
                              Extra: ₹{cab.extraKmRate}/km • ₹{cab.extraHrRate}
                              /hr
                            </div>
                          </>
                        ) : (
                          <div className="text-success fs-8 fw-bold mb-3">
                            Tolls & Taxes Included
                          </div>
                        )}

                        <button
                          onClick={() => handleBook(cab)}
                          className="btn btn-primary w-100 rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-1.5 border-0 leh-style-auto-1092"
                        >
                          {isHourly ? "Book Hourly Rental" : "Book Cab Now"}{" "}
                          <span>
                            <i className="fa-solid fa-arrow-right ms-1"></i>
                          </span>
                        </button>

                        <button
                          onClick={() => navigate(`/services/cabs`)}
                          className="btn btn-link w-100 text-center text-decoration-none text-secondary fs-8 mt-2 p-0 fw-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed SEO Sections (Full Width below Listings & Filters) */}
        {!isHourly && (
          <div className="mt-5 border-top pt-5">
            {/* Ratings & Reviews Box */}
            <div className="card border-0 shadow-sm p-4 mb-4 bg-white text-start rounded-4">
              <h4 className="fw-bold text-dark mb-3">
                What Travellers Say About Jaipur to Delhi Cabs on Lehconnect
              </h4>
              <div className="row g-4 align-items-center">
                <div className="col-md-4 text-center border-end pe-md-4">
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <div className="bg-success text-white rounded p-3 fw-bold fs-3">
                      4.2
                    </div>
                    <div className="text-start">
                      <h6 className="fw-bold mb-0 text-dark">Very Good</h6>
                      <small className="text-muted">
                        Rated by 2000+ travellers
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 ps-md-4">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold text-secondary">
                        Driver Rating
                      </span>
                      <span className="fw-bold text-dark">4.4 / 5</span>
                    </div>
                    <div className="progress cab-progress-h">
                      <div
                        className="progress-bar bg-success cab-progress-w-88"
                        role="progressbar"
                        aria-valuenow={88}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold text-secondary">
                        Cab Rating
                      </span>
                      <span className="fw-bold text-dark">4.4 / 5</span>
                    </div>
                    <div className="progress cab-progress-h">
                      <div
                        className="progress-bar bg-success cab-progress-w-88"
                        role="progressbar"
                        aria-valuenow={88}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <h6 className="fw-bold text-dark mb-2">
                  What people are saying about us?
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Safe Driving",
                    "Polite Behaviour",
                    "On Time",
                    "Clean Interiors",
                    "Good Navigation Skills",
                    "Well Dressed",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-secondary border px-3 py-2 rounded-pill fs-8 fw-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Book with Us */}
            <div className="mb-4 text-start">
              <h4 className="fw-bold text-dark mb-3">Why Book with Us</h4>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card p-3 border shadow-sm h-100 bg-white rounded-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="  fs-3">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          Pay to driver
                        </h6>
                        <small className="text-secondary d-block">
                          Pay 20% now &amp; rest to driver or pay full amount
                          online.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3 border shadow-sm h-100 bg-white rounded-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="  fs-3">
                        <i className="fa-solid fa-percent"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          No hidden prices
                        </h6>
                        <small className="text-secondary d-block">
                          Inclusive of GST, state taxes and tolls.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3 border shadow-sm h-100 bg-white rounded-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="  fs-3">
                        <i className="fa-solid fa-bolt"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          No surge pricing, no waiting
                        </h6>
                        <small className="text-secondary d-block">
                          Same rate regardless of cab availability, no queues.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Book a Taxi */}
            <div className="card border p-4 mb-4 bg-white text-start shadow-sm rounded-4">
              <h4 className="fw-bold text-dark mb-3">
                How to Book a Taxi from {pickupLoc || pickup || "Jaipur"} to{" "}
                {dropLoc || drop || "Delhi"} on Lehconnect?
              </h4>
              <p className="text-secondary">
                Planning a trip from{" "}
                <strong>
                  {pickupLoc || pickup || "Jaipur"} to{" "}
                  {dropLoc || drop || "Delhi"}
                </strong>
                ? Booking a taxi on Lehconnect is super simple and gives you
                peace of mind. No long queues, no last-minute hassles—just a
                smooth booking and a comfortable ride.
              </p>
              <p className="text-secondary">
                Here's how you can book your {pickupLoc || pickup || "Jaipur"}{" "}
                to {dropLoc || drop || "Delhi"} cab:
              </p>
              <ol className="text-secondary ps-3 d-flex flex-column gap-2 mb-0">
                <li>
                  <strong>Open the Lehconnect app or website:</strong> Visit
                  Lehconnect cabs on your phone or computer.
                </li>
                <li>
                  <strong>Fill in your travel details:</strong> Choose{" "}
                  <strong>{pickupLoc || pickup || "Jaipur"}</strong> as your
                  starting point and{" "}
                  <strong>{dropLoc || drop || "Delhi"}</strong> as where you
                  want to go. Select your travel date and time.
                </li>
                <li>
                  <strong>See all cab options:</strong> You'll find many
                  choices—like hatchbacks, sedans, SUVs, or even big Tempo
                  Travellers.
                </li>
                <li>
                  <strong>Choose your vehicle type:</strong> Pick the cab type
                  that fits your group size and budget.
                </li>
                <li>
                  <strong>Select add-ons:</strong> Add options like newer models
                  or roof-carrier if needed.
                </li>
                <li>
                  <strong>Enter passenger details:</strong> Fill in driver
                  information and contact details.
                </li>
                <li>
                  <strong>Make a payment:</strong> Choose between paying a small
                  booking advance or the full fare online.
                </li>
              </ol>
            </div>

            {/* Route Information Table */}
            <div className="card border p-4 mb-4 bg-white text-start shadow-sm rounded-4">
              <h4 className="fw-bold text-dark mb-3">
                Information about {pickupLoc || pickup || "Jaipur"} to{" "}
                {dropLoc || drop || "Delhi"} Route
              </h4>
              <div className="table-responsive">
                <table className="table table-striped table-bordered mb-0 align-middle">
                  <tbody>
                    <tr>
                      <td className="fw-bold text-dark w-50">Route</td>
                      <td className="text-secondary">
                        {pickupLoc || pickup || "Jaipur"} to{" "}
                        {dropLoc || drop || "Delhi"} Cabs
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark">Time Duration</td>
                      <td className="text-secondary">{tripDuration}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark">Distance</td>
                      <td className="text-secondary">{tripDistance}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark">Extra km fare</td>
                      <td className="text-secondary">₹ 14/km</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark">Car Types</td>
                      <td className="text-secondary">
                        Hatchback, Sedan, SUV, Tempo Traveller
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark">Fuel Types</td>
                      <td className="text-secondary">
                        Electric, Diesel, Petrol, CNG
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark">Models</td>
                      <td className="text-secondary">
                        Dzire, Etios, Xcent, Xylo, Ertiga, Innova
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Cab Routes from Pickup */}
            {dynamicFromRoutes.length > 0 && (
              <div className="card border p-4 mb-4 bg-white text-start shadow-sm rounded-4">
                <h4 className="fw-bold text-dark mb-3">
                  Top Cab Routes from {shortPickup || "Jaipur"}
                </h4>
                <div className="row g-3">
                  {dynamicFromRoutes.map((item, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                      <div className="card p-3 border h-100 shadow-sm bg-light hover-shadow d-flex flex-column">
                        <div className="fw-bold text-dark mb-1">
                          {item.route}
                        </div>
                        <div className="text-secondary small mb-2">
                          {item.category} | {item.distance || "250"} Km |{" "}
                          {Math.floor((item.duration || 300) / 60)}h{" "}
                          {(item.duration || 300) % 60}m
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                          <span className="fw-bold   small">
                            ₹
                            {item.price
                              ? item.price.toLocaleString()
                              : item.rate_amount
                                ? item.rate_amount.toLocaleString()
                                : "2,500"}{" "}
                            onwards
                          </span>
                          <button
                            onClick={() => handleRouteBook(item)}
                            className="btn btn-xs btn-outline-primary rounded-pill px-2.5 py-1 small cab-fs-rem-75"
                          >
                            Book Cab
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Cab Routes to Drop */}
            {dynamicToRoutes.length > 0 && (
              <div className="card border p-4 mb-4 bg-white text-start shadow-sm rounded-4">
                <h4 className="fw-bold text-dark mb-3">
                  Top Cab Routes to {shortDrop || "Delhi"}
                </h4>
                <div className="row g-3">
                  {dynamicToRoutes.map((item, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                      <div className="card p-3 border h-100 shadow-sm bg-light hover-shadow d-flex flex-column">
                        <div className="fw-bold text-dark mb-1">
                          {item.route}
                        </div>
                        <div className="text-secondary small mb-2">
                          {item.category} | {item.distance || "250"} Km |{" "}
                          {Math.floor((item.duration || 300) / 60)}h{" "}
                          {(item.duration || 300) % 60}m
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                          <span className="fw-bold   small">
                            ₹
                            {item.price
                              ? item.price.toLocaleString()
                              : item.rate_amount
                                ? item.rate_amount.toLocaleString()
                                : "2,500"}{" "}
                            onwards
                          </span>
                          <button
                            onClick={() => handleRouteBook(item)}
                            className="btn btn-xs btn-outline-primary rounded-pill px-2.5 py-1 small cab-fs-rem-75"
                          >
                            Book Cab
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8 Accordion SEO sections */}
            <div className="mb-4 text-start">
              <h4 className="fw-bold text-dark mb-3">
                Jaipur to Delhi Cab Booking Guide on Lehconnect
              </h4>
              <div
                className="accordion d-flex flex-column gap-2"
                id="seoAccordions"
              >
                {seoSections.map((sec, idx) => (
                  <div
                    className="accordion-item border rounded-3 overflow-hidden shadow-sm"
                    key={idx}
                  >
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button fw-bold text-dark bg-white fs-6 ${openAccordion === idx ? "" : "collapsed"}`}
                        type="button"
                        onClick={() =>
                          setOpenAccordion(openAccordion === idx ? null : idx)
                        }
                      >
                        {sec.title}
                      </button>
                    </h2>
                    {openAccordion === idx && (
                      <div className="accordion-collapse collapse show bg-white">
                        <div className="accordion-body border-top text-secondary small">
                          {sec.content}
                          {sec.faqs && sec.faqs.length > 0 && (
                            <div className="mt-4 border-top pt-3">
                              <h6 className="fw-bold text-dark mb-3">
                                FAQs — {sec.title}
                              </h6>
                              <div className="d-flex flex-column gap-3">
                                {sec.faqs.map((faq, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="border-bottom pb-2"
                                  >
                                    <div className="fw-bold text-dark mb-1">
                                      Q: {faq.q}
                                    </div>
                                    <div className="text-secondary">
                                      {faq.a}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Route FAQs */}
            <div className="card border p-4 mb-4 bg-white text-start shadow-sm rounded-4">
              <h4 className="fw-bold text-dark mb-3">
                Frequently Asked Questions for Jaipur to Delhi Cab Booking
              </h4>
              <div className="d-flex flex-column gap-3">
                {[
                  {
                    q: "How many types of cabs are available in Jaipur?",
                    a: "There are around 3 types of cabs available in Jaipur, namely Hatchback, Sedan, SUV. Lehconnect also offers larger multi-utility vehicles (MUVs) and Tempo Travellers for groups.",
                  },
                  {
                    q: "Which is the most economical cab available in Jaipur?",
                    a: "Hatchback is currently the most economical cab option available in Jaipur for travel to Delhi.",
                  },
                  {
                    q: "What are the cab booking options available in Jaipur?",
                    a: "Lehconnect offers various outstation booking options including one-way cab transfers, round trips, and multi-city route packages, as well as airport transfers and local hourly rentals.",
                  },
                  {
                    q: "What are the payment options for booking a cab on Lehconnect?",
                    a: "You can pay using credit cards, debit cards, net banking, UPI, and mobile wallets. You can choose to pay the full amount online or pay a 20% advance now and the remaining balance directly to the driver.",
                  },
                  {
                    q: "Does the payment include all road trip expenses like toll charges, parking charges etc.?",
                    a: "Yes, your booking amount is fully inclusive of state taxes, GST, and all standard highway toll charges.",
                  },
                  {
                    q: "Do I need to carry any ID proof to avail cab services on Lehconnect?",
                    a: "Yes, you are required to carry a valid government-issued ID proof (such as Aadhaar, Driving License, Voter ID, or Passport) to present to the driver before starting the trip.",
                  },
                  {
                    q: "How much is a taxi from Jaipur to Delhi?",
                    a: "The starting fare for a taxi from Jaipur to Delhi is ₹2,294 (excluding optional add-ons).",
                  },
                  {
                    q: "How long does it take to go from Jaipur to Delhi by Cab?",
                    a: "The driving time is approximately 4 hours and 30 minutes to cover a distance of 311 Km.",
                  },
                  {
                    q: "What is the minimum cab fare from Jaipur to Delhi?",
                    a: "The minimum cab fare for a one-way Hatchback is ₹2,294.",
                  },
                  {
                    q: "What is the maximum cab fare from Jaipur to Delhi?",
                    a: "The maximum fare depends on the vehicle type, with premium SUVs or Tempo Travellers costing up to ₹8,500.",
                  },
                  {
                    q: "What are the options available for Jaipur to Delhi Cabs?",
                    a: "You can choose from standard Hatchbacks (like Swift/Indica), Sedans (like Dzire/Etios), SUVs (like Ertiga/Xylo), premium SUVs (like Innova Crysta/XUV700), or Tempo Travellers.",
                  },
                ].map((item, index) => (
                  <div key={index} className="border-bottom pb-2">
                    <button
                      className="btn btn-link w-100 text-start text-decoration-none fw-bold text-dark p-0 d-flex justify-content-between align-items-center cab-white-space-normal"
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                    >
                      <span>Q: {item.q}</span>
                      <span>{openFaq === index ? "−" : "+"}</span>
                    </button>
                    {openFaq === index && (
                      <div className="mt-2 text-secondary ps-3 small">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Questions */}
            <div className="card border p-4 mb-4 bg-white text-start shadow-sm rounded-4">
              <h4 className="fw-bold text-dark mb-3">
                Popular Questions About Traveling from Jaipur to Delhi
              </h4>
              <div className="d-flex flex-column gap-3">
                {[
                  {
                    q: "Does driver know local language?",
                    a: "Yes, Lehconnect's drivers are fluent in local languages (Hindi/Rajasthani) and many can also communicate in basic English. You can also specify driver language preference when booking.",
                  },
                  {
                    q: "How much toll from Jaipur to Delhi?",
                    a: "Toll charges are completely included in the Lehconnect booking price, so you don't need to pay anything extra at toll booths.",
                  },
                  {
                    q: "What weather on Jaipur to Delhi route?",
                    a: "The route experiences hot summers, moderate monsoon rains, and pleasant winter weather. A fully air-conditioned cab makes travel comfortable in all seasons.",
                  },
                  {
                    q: "Where to park at Radisson Blu Jaipur?",
                    a: "Safe and secure parking is available at Radisson Blu Jaipur for guests and visitors, managed by the hotel's valet and security team.",
                  },
                ].map((item, index) => (
                  <div key={index} className="border-bottom pb-2">
                    <button
                      className="btn btn-link w-100 text-start text-decoration-none fw-bold text-dark p-0 d-flex justify-content-between align-items-center cab-white-space-normal"
                      onClick={() =>
                        setOpenPopQuestion(
                          openPopQuestion === index ? null : index,
                        )
                      }
                    >
                      <span>Q: {item.q}</span>
                      <span>{openPopQuestion === index ? "−" : "+"}</span>
                    </button>
                    {openPopQuestion === index && (
                      <div className="mt-2 text-secondary ps-3 small">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Link Directory Section */}
            <div className="card border-0 p-0 mb-4 bg-transparent text-start">
              <h4 className="fw-bold text-dark mb-4 border-bottom pb-2">
                Lehconnect Cab Services Route & City Directory
              </h4>
              <div className="row g-3">
                {interlinksData.map((category, index) => (
                  <div className="col-md-6 col-lg-4 col-xl-3" key={index}>
                    <div className="card p-3 border shadow-sm bg-white cab-h-240">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-2 cab-category-header">
                        {category.title}
                      </h6>
                      <div className="pe-1 cab-category-list-container">
                        <ul className="list-unstyled d-flex flex-column gap-1.5 mb-0 cab-fs-rem-78">
                          {category.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover-text-primary text-decoration-none d-block text-truncate"
                              >
                                {link.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 100% Safe & Secure Trust Banner */}
            <div className="p-3 mt-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3 text-start leh-style-auto-1093 bg-white rounded-4 shadow-sm border">
              <div className="d-flex align-items-center gap-2.5">
                <i className="fa-solid fa-lock text-success fs-4"></i>
                <div>
                  <h6 className="fw-bold text-dark mb-0 fs-8">
                    100% Safe & Secure Booking
                  </h6>
                  <small className="text-muted leh-style-auto-1077">
                    All payments are secure and encrypted. Your information is
                    safe with us.
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 fs-9 text-muted fw-bold">
                <span className="badge bg-white text-secondary border px-2 py-1.5">
                  VISA
                </span>
                <span className="badge bg-white text-secondary border px-2 py-1.5">
                  MasterCard
                </span>
                <span className="badge bg-white text-secondary border px-2 py-1.5">
                  UPI
                </span>
                <span className="badge bg-white text-secondary border px-2 py-1.5">
                  RuPay
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CabListing;
