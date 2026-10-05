"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { ROUTES } from "../constants/routes";
import toast from "react-hot-toast";
import {
  submitCabEnquiry,
  submitHolidayEnquiry,
  submitFlightEnquiry,
  submitHotelEnquiry,
  submitTrainEnquiry,
  submitBusEnquiry,
  submitVisaEnquiry,
  submitInsuranceEnquiry,
  searchLocations,
  getCabPackages,
} from "../APIs/api";
import { generateSlug } from "../utils/stringUtils";

const LocationAutocomplete = ({
  value,
  onChange,
  placeholder,
  className,
  subtext,
  setSubtext,
}: any) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [rawRes, setRawRes] = useState(null);

  React.useEffect(() => {
    setQuery(value);
  }, [value]);

  const fetchLocations = async (q) => {
    if (!q) {
      setResults([]);
      setRawRes(null);
      return;
    }
    try {
      const res = await searchLocations(q);
      setRawRes(res);
      // console.log('Location API response:', res);

      let rows = [];
      if (res && res.data && res.data.rows) {
        rows = res.data.rows;
      } else if (res && res.results && res.results.rows) {
        rows = res.results.rows;
      } else if (res && res.rows) {
        rows = res.rows;
      } else if (Array.isArray(res)) {
        rows = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        rows = res.data;
      }
      setResults(rows);
    } catch (e) {
      console.error(e);
      setRawRes({ error: e.message });
    }
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (show) {
        fetchLocations(query);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, show]);

  const handleSelect = (loc) => {
    const cityName = loc.city || loc.country;
    const fullName = loc.state ? `${cityName}, ${loc.state}` : cityName;
    setQuery(fullName);
    onChange(fullName);
    if (setSubtext) {
      setSubtext(loc.state || "");
    }
    setShow(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        required
      />
      {show && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            zIndex: 9999,
            listStyle: "none",
            padding: 0,
            margin: 0,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "4px",
          }}
        >
          {results.length > 0 ? (
            results.map((loc) => (
              <li
                key={loc.id}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                  color: "black",
                  background: "white",
                }}
                onMouseDown={() => handleSelect(loc)}
              >
                <strong>{loc.city || loc.country}</strong>{" "}
                {loc.state ? `, ${loc.state}` : ""}
              </li>
            ))
          ) : query ? (
            <li
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                color: "#666",
                wordBreak: "break-all",
              }}
            >
              No results for "{query}".
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
};

export const BookingWidget = ({
  activeTab: externalActiveTab,
  onTabChange,
}: {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) => {
  const router = useRouter();
  const {
    searchParams,
    updateSearchParams,
    activeTab: contextActiveTab,
    setActiveTab: contextSetActiveTab,
    t,
  } = useBooking();
  const [internalActiveTab, setInternalActiveTab] = useState("cabs");
  const [isSearching, setIsSearching] = useState(false);

  const activeTab =
    externalActiveTab !== undefined
      ? externalActiveTab
      : contextActiveTab !== undefined
        ? contextActiveTab
        : internalActiveTab;

  const serviceRoutes = {
    cabs: "/cabs",
    holidays: "/holidays",
    flights: "/flights",
    hotels: "/hotels",
    train: "/train",
    bus: "/bus",
    visa: "/visa",
    insurance: "/insurance",
  };

  const setActiveTab = (tab: string) => {
    const target =
      serviceRoutes[tab as keyof typeof serviceRoutes] || `/${tab}`;
    if (onTabChange) {
      onTabChange(tab);
    } else if (contextSetActiveTab) {
      contextSetActiveTab(tab);
      router.push(target);
    } else {
      setInternalActiveTab(tab);
      router.push(target);
    }
  };

  // Mode state for cabs (enquiry vs booking)
  const [cabMode, setCabMode] = useState("booking"); // default to Booking
  const [hotelRoomsTab, setHotelRoomsTab] = useState("upTo4"); // 'upTo4' | 'groupDeals'
  const [flightTripTab, setFlightTripTab] = useState("oneway"); // 'oneway' | 'roundtrip' | 'multicity'
  const [holidayMode, setHolidayMode] = useState("booking"); // default to Booking
  const [busMode, setBusMode] = useState("booking"); // default to Booking
  const [trainMode, setTrainMode] = useState("booking"); // default to Booking

  // Mode state for other tabs (enquiry vs booking)
  const [hotelMode, setHotelMode] = useState("booking");
  const [flightMode, setFlightMode] = useState("booking");

  // Guests Selection dropdown state
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showHolidayGuests, setShowHolidayGuests] = useState(false);

  // States matching screenshots for Cabs
  const [hourlyPackagesList, setHourlyPackagesList] = useState([]);
  const [rentalPackage, setRentalPackage] = useState(null);

  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getCabPackages();
        const dataArr = res?.results || res?.data || res;
        if (Array.isArray(dataArr) && dataArr.length > 0) {
          const formatted = dataArr.map((p) => ({
            id: p.id ? p.id.toString() : Math.random().toString(),
            duration: p.duration,
            distance: p.distance,
            label: p.label,
            desc: p.desc,
            popular: p.popular,
          }));
          setHourlyPackagesList(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch cab packages:", err);
      }
    };
    fetchPackages();
  }, []);
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const pkgDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close package dropdown on outside click
  React.useEffect(() => {
    if (!showPackageDropdown) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        pkgDropdownRef.current &&
        !pkgDropdownRef.current.contains(e.target as Node)
      ) {
        setShowPackageDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showPackageDropdown]);

  const [pickupCity, setPickupCity] = useState("");
  const [pickupState, setPickupState] = useState("");
  const [dropCity, setDropCity] = useState("");
  const [dropState, setDropState] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | null>(
    () => new Date(),
  );
  const [departureCalendarDate, setDepartureCalendarDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const depDateText = departureDate
    ? `${departureDate.getDate()} ${departureDate.toLocaleString("en-US", { month: "short" })}'${String(departureDate.getFullYear()).slice(-2)}`
    : "";
  const depDayName = departureDate
    ? departureDate.toLocaleString("en-US", { weekday: "long" })
    : "";
  const [retDateText, setRetDateText] = useState("5 Jul'26");
  const [retDayName, setRetDayName] = useState("Sunday");
  const [pickupTimeVal, setPickupTimeVal] = useState("11:40PM");

  // States matching screenshots for Hotels
  const [hotelCity, setHotelCity] = useState("");
  const [hotelState, setHotelState] = useState("");
  const [checkInDateText, setCheckInDateText] = useState("10 Aug'26");
  const [checkInDayName, setCheckInDayName] = useState("Monday");
  const [checkOutDateText, setCheckOutDateText] = useState("15 Aug'26");
  const [checkOutDayName, setCheckOutDayName] = useState("Saturday");
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelGuests, setHotelGuests] = useState(2);
  const [priceRange, setPriceRange] = useState("₹0 - ₹1500");

  // States matching screenshots for Flights
  const [flightFromCity, setFlightFromCity] = useState("");
  const [flightFromState, setFlightFromState] = useState("");
  const [flightToCity, setFlightToCity] = useState("");
  const [flightToState, setFlightToState] = useState("");
  const [flightDepDate, setFlightDepDate] = useState("10 Aug'26");
  const [flightDepDay, setFlightDepDay] = useState("Monday");
  const [flightRetDate, setFlightRetDate] = useState("15 Aug'26");
  const [flightRetDay, setFlightRetDay] = useState("Saturday");
  const [flightTravellers, setFlightTravellers] = useState(1);
  const [flightClass, setFlightClass] = useState("Economy");
  const [flightFareType, setFlightFareType] = useState("Regular");

  // Multi-City flight rows state
  const [multiCityFlights, setMultiCityFlights] = useState([
    {
      fromCity: "Delhi",
      fromState: "Delhi, India",
      toCity: "Mumbai",
      toState: "Mumbai, India",
      date: "10 Aug'26",
      day: "Monday",
    },
    {
      fromCity: "Mumbai",
      fromState: "Mumbai, India",
      toCity: "Bengaluru",
      toState: "Bengaluru, India",
      date: "15 Aug'26",
      day: "Saturday",
    },
  ]);

  // States matching screenshots for Holidays
  const [holidayFromCity, setHolidayFromCity] = useState("");
  const [holidayToCity, setHolidayToCity] = useState("");
  const [holidayDepDate, setHolidayDepDate] = useState("20 Aug'26");
  const [holidayDepDay, setHolidayDepDay] = useState("Thursday");
  const [holidayRooms, setHolidayRooms] = useState(1);
  const [holidayGuests, setHolidayGuests] = useState(2);

  // States matching screenshots for Buses
  const [busFromCity, setBusFromCity] = useState("");
  const [busToCity, setBusToCity] = useState("");
  const [busJourneyDate, setBusJourneyDate] = useState("22 Jul'26");
  const [busJourneyDay, setBusJourneyDay] = useState("Wednesday");
  const [busType, setBusType] = useState("All Buses");
  const [busPassengers, setBusPassengers] = useState(1);

  // Bus Enquiry additional input states
  const [busFullName, setBusFullName] = useState("");
  const [busMobile, setBusMobile] = useState("");
  const [busEmail, setBusEmail] = useState("");
  const [busBoarding, setBusBoarding] = useState("");
  const [busSpecial, setBusSpecial] = useState("");

  // States matching screenshots for Trains
  const [trainFromStation, setTrainFromStation] = useState("");
  const [trainToStation, setTrainToStation] = useState("");
  const [trainJourneyDate, setTrainJourneyDate] = useState("22 Jul'26");
  const [trainJourneyDay, setTrainJourneyDay] = useState("Wednesday");
  const [trainTravelClass, setTrainTravelClass] = useState("All Classes");
  const [trainQuota, setTrainQuota] = useState("General");

  // Train Enquiry additional input states
  const [trainPassengerName, setTrainPassengerName] = useState("");
  const [trainMobileNum, setTrainMobileNum] = useState("");
  const [trainEmailId, setTrainEmailId] = useState("");
  const [trainPreferredExpress, setTrainPreferredExpress] = useState("");
  const [trainSpecialBerth, setTrainSpecialBerth] = useState("");

  // States matching screenshots for Visa
  const [visaCountry, setVisaCountry] = useState("");
  const [visaTypeSelected, setVisaTypeSelected] = useState("Select Visa Type");
  const [visaTravelDate, setVisaTravelDate] = useState("22 Jul'26");
  const [visaTravelDay, setVisaTravelDay] = useState("Wednesday");
  const [visaApplicants, setVisaApplicants] = useState(1);

  // Visa Enquiry additional input states
  const [visaFullName, setVisaFullName] = useState("");
  const [visaMobileNum, setVisaMobileNum] = useState("");
  const [visaEmailAddress, setVisaEmailAddress] = useState("");
  const [visaPassportNum, setVisaPassportNum] = useState("");
  const [visaPassportExpiryDate, setVisaPassportExpiryDate] =
    useState("22 Jul'36");
  const [visaPassportExpiryDay, setVisaPassportExpiryDay] = useState("Tuesday");
  const [visaCity, setVisaCity] = useState("");
  const [visaAdditionalRequirements, setVisaAdditionalRequirements] =
    useState("");

  // States matching screenshots for Insurance
  const [insRegNum, setInsRegNum] = useState("RJ14AB1234");
  const [insBrand, setInsBrand] = useState("Select Brand");
  const [insModel, setInsModel] = useState("Select Model");
  const [insFuelType, setInsFuelType] = useState("Petrol");
  const [insMfgYear, setInsMfgYear] = useState("2026");
  const [insExistingPolicy, setInsExistingPolicy] = useState("Yes");
  const [insExpiryDate, setInsExpiryDate] = useState("22 Jul'26");
  const [insExpiryDay, setInsExpiryDay] = useState("Wednesday");
  const [insMobile, setInsMobile] = useState("");
  const [insEmail, setInsEmail] = useState("");
  const [insFullName, setInsFullName] = useState("");

  // Custom unified Date-Time Picker Modal active state
  // Can be 'departure' | 'return' | 'time' | 'checkin' | 'checkout' | 'flightdep' | 'flightret' | 'holidaydep' | 'busdep' | 'traindep' | 'visatravel' | 'visapassport' | 'insexpiry' | string | null
  const [openPicker, setOpenPicker] = useState(null);

  // Custom Enquiry form phones
  const [cabPhone, setCabPhone] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [flightPhone, setFlightPhone] = useState("");
  const [holidayPhone, setHolidayPhone] = useState("");
  const [busPhone, setBusPhone] = useState("");
  const [trainPhone, setTrainPhone] = useState("");
  const [visaPhone, setVisaPhone] = useState("");

  const handleSwapCabsText = () => {
    const tempCity = pickupCity;
    const tempState = pickupState;
    setPickupCity(dropCity);
    setPickupState(dropState);
    setDropCity(tempCity);
    setDropState(tempState);
  };

  const handleSwapFlightsText = () => {
    const tempCity = flightFromCity;
    const tempState = flightFromState;
    setFlightFromCity(flightToCity);
    setFlightFromState(flightToState);
    setFlightToCity(tempCity);
    setFlightToState(tempState);
  };

  const handleSwapBusesText = () => {
    const temp = busFromCity;
    setBusFromCity(busToCity);
    setBusToCity(temp);
  };

  const handleSwapTrainsText = () => {
    const temp = trainFromStation;
    setTrainFromStation(trainToStation);
    setTrainToStation(temp);
  };

  // Convert 24-hour time string ("14:30") to AM/PM ("2:30PM")
  const handleTimeChange = (e) => {
    const rawTime = e.target.value;
    if (rawTime) {
      const [hoursStr, minutesStr] = rawTime.split(":");
      let hours = parseInt(hoursStr);
      const minutes = minutesStr;
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setPickupTimeVal(`${hours}:${minutes}${ampm}`);
    }
  };

  const getPickupTimeValidationError = () => {
    if (!departureDate) {
      return "Please select a departure date.";
    }

    const timeMatch = pickupTimeVal.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
    if (!timeMatch) {
      return "Please select a valid pickup time.";
    }

    const [, hourText, minuteText, period] = timeMatch;
    let hours = Number(hourText) % 12;
    if (period.toUpperCase() === "PM") hours += 12;
    const pickupDateTime = new Date(departureDate);
    pickupDateTime.setHours(hours, Number(minuteText), 0, 0);

    const now = new Date();
    if (pickupDateTime < now) {
      return "Pickup time cannot be in the past.";
    }

    const isToday =
      departureDate.getFullYear() === now.getFullYear() &&
      departureDate.getMonth() === now.getMonth() &&
      departureDate.getDate() === now.getDate();
    if (isToday && pickupDateTime.getTime() - now.getTime() < 60 * 60 * 1000) {
      return "Please select a pickup time at least 1 hour from now.";
    }

    return null;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "cabs" && cabMode === "booking") {
      const pickupTimeError = getPickupTimeValidationError();
      if (pickupTimeError) {
        toast.error(pickupTimeError);
        return;
      }
    }

    // Check if Enquiry mode is active
    if (activeTab === "cabs" && cabMode === "enquiry") {
      if (!cabPhone || cabPhone.length < 10) {
        toast.error("Please enter a valid 10-digit contact number.");
        return;
      }
      try {
        const parseDate = (dStr) => {
          if (!dStr) return null;
          const cleanStr = dStr.replace("'", " 20"); // "22 Jul'26" -> "22 Jul 2026"
          const d = new Date(cleanStr);
          return isNaN(d.getTime())
            ? new Date().toISOString()
            : d.toISOString();
        };

        let backendTripType = searchParams.cabs.tripType;
        if (backendTripType === "roundtrip") backendTripType = "round_trip";
        if (backendTripType === "hourly") backendTripType = "local";

        await submitCabEnquiry({
          trip_type: backendTripType,
          from_location: pickupCity,
          to_location: backendTripType === "local" ? "Local Trip" : dropCity,
          departure_date: parseDate(depDateText),
          return_date:
            backendTripType === "round_trip" ? parseDate(retDateText) : null,
          contact: cabPhone,
          from_web: true,
        });
        toast.success(
          `Cab Enquiry submitted successfully! Contact: ${cabPhone}`,
        );
        setCabPhone("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit cab enquiry. Please check the details.";
        toast.error(errorMsg);
        console.error("Enquiry API Error:", error.response?.data || error);
      }
      return;
    }
    if (activeTab === "hotels" && hotelMode === "enquiry") {
      if (!hotelPhone || hotelPhone.length < 10) {
        toast.error("Please enter a valid 10-digit contact number.");
        return;
      }
      try {
        const parseDate = (dStr) => {
          if (!dStr) return null;
          const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          const match = dStr.match(/^(\d+)\s+([A-Za-z]+)'(\d+)$/);
          if (match) {
            const day = parseInt(match[1]);
            const month = months[match[2]];
            const year = parseInt("20" + match[3]);
            if (month !== undefined)
              return new Date(year, month, day).toISOString();
          }
          const d = new Date(dStr);
          return isNaN(d.getTime()) ? null : d.toISOString();
        };
        await submitHotelEnquiry({
          area: hotelCity,
          check_in: parseDate(checkInDateText),
          check_out: parseDate(checkOutDateText),
          adults: hotelGuests,
          rooms: hotelRooms,
          contact: hotelPhone,
          from_web: true,
        });
        toast.success(
          `Hotel Enquiry submitted successfully! Contact: ${hotelPhone}`,
        );
        setHotelPhone("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit hotel enquiry. Please check the details.";
        toast.error(errorMsg);
      }
      return;
    }
    if (activeTab === "flights" && flightMode === "enquiry") {
      if (!flightPhone || flightPhone.length < 10) {
        toast.error("Please enter a valid 10-digit contact number.");
        return;
      }
      try {
        const parseDate = (dStr) => {
          if (!dStr) return null;
          const cleanStr = dStr.replace("'", " 20");
          const d = new Date(cleanStr);
          return isNaN(d.getTime())
            ? new Date().toISOString()
            : d.toISOString();
        };

        const payload = {
          trip_type:
            flightTripTab === "oneway"
              ? "one_way"
              : flightTripTab === "roundtrip"
                ? "round_trip"
                : "multi_city",
          from_location:
            flightTripTab !== "multicity" ? flightFromCity : undefined,
          to_location: flightTripTab !== "multicity" ? flightToCity : undefined,
          departure_date:
            flightTripTab !== "multicity"
              ? parseDate(flightDepDate)
              : undefined,
          return_date:
            flightTripTab === "roundtrip"
              ? parseDate(flightRetDate)
              : undefined,
          adults: Number(flightTravellers) || 1,
          class_type: flightClass,
          contact: flightPhone,
          from_web: true,
          segments:
            flightTripTab === "multicity"
              ? multiCityFlights.map((f) => ({
                  from_location: f.fromCity,
                  to_location: f.toCity,
                  departure_date: parseDate(f.date),
                }))
              : undefined,
        };

        await submitFlightEnquiry(payload);
        toast.success(
          `Flight Tickets Enquiry submitted successfully! Contact: ${flightPhone}`,
        );
        setFlightPhone("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit flight enquiry. Please check the details.";
        toast.error(errorMsg);
        console.error("Enquiry API Error:", error.response?.data || error);
      }
      return;
    }
    if (activeTab === "holidays" && holidayMode === "enquiry") {
      if (!holidayPhone || holidayPhone.length < 10) {
        toast.error("Please enter a valid 10-digit contact number.");
        return;
      }
      try {
        const parseDate = (dStr) => {
          if (!dStr) return null;
          const cleanStr = dStr.replace("'", " 20");
          const d = new Date(cleanStr);
          return isNaN(d.getTime())
            ? new Date().toISOString()
            : d.toISOString();
        };

        await submitHolidayEnquiry({
          from_city: holidayFromCity,
          to_city: holidayToCity,
          departure_date: parseDate(holidayDepDate),
          adults: holidayGuests,
          rooms: holidayRooms,
          contact: holidayPhone,
          from_web: true,
        });
        toast.success(
          `Holiday Package Enquiry submitted successfully! Contact: ${holidayPhone}`,
        );
        setHolidayPhone("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit holiday enquiry. Please check the details.";
        toast.error(errorMsg);
        console.error("Enquiry API Error:", error.response?.data || error);
      }
      return;
    }
    if (activeTab === "bus" && busMode === "enquiry") {
      if (!busFullName.trim()) {
        toast.error("Please enter full name.");
        return;
      }
      if (!busMobile || busMobile.length < 10) {
        toast.error("Please enter a valid 10-digit contact number.");
        return;
      }
      try {
        const parseDate = (dStr) => {
          if (!dStr) return null;
          const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          const match = dStr.match(/^(\d+)\s+([A-Za-z]+)'(\d+)$/);
          if (match) {
            const day = parseInt(match[1]);
            const month = months[match[2]];
            const year = parseInt("20" + match[3]);
            if (month !== undefined)
              return new Date(year, month, day).toISOString();
          }
          const d = new Date(dStr);
          return isNaN(d.getTime()) ? null : d.toISOString();
        };
        await submitBusEnquiry({
          full_name: busFullName,
          contact: busMobile,
          email: busEmail || undefined,
          from_city: busFromCity,
          to_city: busToCity,
          journey_date: parseDate(busJourneyDate),
          bus_type: busType || undefined,
          passengers: busPassengers,
          boarding_point: busBoarding || undefined,
          from_web: true,
        });
        toast.success(
          `Bus Enquiry submitted successfully! Contact: ${busMobile}`,
        );
        setBusMobile("");
        setBusFullName("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit bus enquiry. Please check the details.";
        toast.error(errorMsg);
      }
      return;
    }
    if (activeTab === "train" && trainMode === "enquiry") {
      if (!trainPassengerName.trim()) {
        toast.error("Please enter passenger name.");
        return;
      }
      if (!trainMobileNum || trainMobileNum.length < 10) {
        toast.error("Please enter a valid 10-digit contact number.");
        return;
      }
      try {
        const parseDate = (dStr) => {
          if (!dStr) return null;
          const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          const match = dStr.match(/^(\d+)\s+([A-Za-z]+)'(\d+)$/);
          if (match) {
            const day = parseInt(match[1]);
            const month = months[match[2]];
            const year = parseInt("20" + match[3]);
            if (month !== undefined)
              return new Date(year, month, day).toISOString();
          }
          const d = new Date(dStr);
          return isNaN(d.getTime()) ? null : d.toISOString();
        };
        await submitTrainEnquiry({
          full_name: trainPassengerName,
          contact: trainMobileNum,
          email: trainEmailId || undefined,
          from_station: trainFromStation,
          to_station: trainToStation,
          journey_date: parseDate(trainJourneyDate),
          class_type: trainTravelClass || undefined,
          quota: trainQuota || undefined,
          train_preference: trainPreferredExpress || undefined,
          special_requests: trainSpecialBerth || undefined,
          from_web: true,
        });
        toast.success(
          `Train Enquiry submitted successfully! Contact: ${trainMobileNum}`,
        );
        setTrainMobileNum("");
        setTrainPassengerName("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit train enquiry. Please check the details.";
        toast.error(errorMsg);
      }
      return;
    }
    if (activeTab === "visa") {
      if (visaCountry === "Select Country") {
        toast.error("Please select a destination country.");
        return;
      }
      if (visaTypeSelected === "Select Visa Type") {
        toast.error("Please select a visa type.");
        return;
      }
      if (!visaMobileNum || !/^[6-9]\d{9}$/.test(visaMobileNum)) {
        toast.error(
          "Please enter a valid 10-digit Indian contact number starting with 6-9.",
        );
        return;
      }
      try {
        const parseDate = (dStr) => {
          if (!dStr) return null;
          const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          const match = dStr.match(/^(\d+)\s+([A-Za-z]+)'(\d+)$/);
          if (match) {
            const day = parseInt(match[1]);
            const month = months[match[2]];
            const year = parseInt("20" + match[3]);
            if (month !== undefined)
              return new Date(year, month, day).toISOString();
          }
          const d = new Date(dStr);
          return isNaN(d.getTime()) ? null : d.toISOString();
        };
        await submitVisaEnquiry({
          destination_country: visaCountry,
          visa_type: visaTypeSelected,
          travel_date: parseDate(visaTravelDate),
          applicants: visaApplicants,
          full_name: visaFullName || undefined,
          contact: visaMobileNum,
          email: visaEmailAddress || undefined,
          passport_number: visaPassportNum || undefined,
          passport_expiry_date: parseDate(visaPassportExpiryDate),
          city: visaCity || undefined,
          additional_requirements: visaAdditionalRequirements || undefined,
          from_web: true,
        });
        toast.success(
          `Visa Enquiry submitted successfully! Contact: ${visaMobileNum}`,
        );
        setVisaMobileNum("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit visa enquiry. Please check the details.";
        toast.error(errorMsg);
      }
      return;
    }
    if (activeTab === "insurance") {
      if (!insMobile || !/^[6-9]\d{9}$/.test(insMobile)) {
        toast.error(
          "Please enter a valid 10-digit Indian contact number starting with 6-9.",
        );
        return;
      }
      try {
        await submitInsuranceEnquiry({
          car_number: insRegNum,
          full_name: insFullName || undefined,
          contact: insMobile,
          email: insEmail || undefined,
          existing_policy: insExistingPolicy === "Yes",
          from_web: true,
        });
        toast.success(
          `Insurance Enquiry submitted successfully! Contact: ${insMobile}`,
        );
        setInsMobile("");
        setInsFullName("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to submit insurance enquiry. Please check the details.";
        toast.error(errorMsg);
      }
      return;
    }

    // Save search inputs to global context before navigating
    setIsSearching(true);
    // Reset loader after a delay just in case navigation doesn't unmount component
    setTimeout(() => setIsSearching(false), 3000);
    if (activeTab === "cabs") {
      const isHourly = searchParams.cabs.tripType === "hourly";
      if (isHourly && !rentalPackage) {
        toast.error("Please select a package.");
        setIsSearching(false);
        return;
      }
      updateSearchParams("cabs", {
        pickup: pickupCity,
        drop: isHourly ? `Local Rental (${rentalPackage?.label})` : dropCity,
        date: depDateText,
        time: pickupTimeVal,
        tripType: isHourly ? "local" : searchParams.cabs.tripType || "oneway",
        package: rentalPackage?.id,
        packageDuration: rentalPackage?.duration,
        packageDistance: rentalPackage?.distance,
        packageLabel: rentalPackage?.label,
      });
      const pCity = pickupCity || "Jaipur";
      const dCity = isHourly ? "local" : dropCity || "Delhi";
      const pickupSlug = generateSlug(pCity);
      const dropSlug = generateSlug(dCity);
      const routeSlug = isHourly
        ? `${pickupSlug}-local-rental`
        : `${pickupSlug}-to-${dropSlug}`;

      const targetTripType = isHourly
        ? "local"
        : searchParams.cabs.tripType || "oneway";
      router.push(`/cabs/${routeSlug}?trip_type=${targetTripType}`);
    } else if (activeTab === "hotels") {
      updateSearchParams("hotels", {
        city: hotelCity,
        checkIn: checkInDateText,
        checkOut: checkOutDateText,
        guests: hotelGuests,
        rooms: hotelRooms,
      });
      router.push(`${ROUTES.HOTEL_SEARCH}`);
    } else if (activeTab === "flights") {
      updateSearchParams("flights", {
        from: flightFromCity,
        to: flightToCity,
        departureDate: flightDepDate,
        returnDate: flightRetDate,
        travellers: flightTravellers,
        cabinClass: flightClass,
        fareType: flightFareType,
      });
      router.push(`${ROUTES.FLIGHT_SEARCH}`);
    } else if (activeTab === "holidays") {
      updateSearchParams("holidays", {
        from: holidayFromCity,
        to: holidayToCity,
        departureDate: holidayDepDate,
        rooms: holidayRooms,
        guests: holidayGuests,
      });
      router.push(`${ROUTES.HOLIDAY_SEARCH}`);
    } else if (activeTab === "bus") {
      router.push(`${ROUTES.BUS_SEARCH}`);
    } else if (activeTab === "train") {
      router.push(`${ROUTES.TRAIN_ENQUIRY}`);
    } else if (activeTab === "insurance") {
      router.push(`${ROUTES.INSURANCE}`);
    } else if (activeTab === "visa") {
      router.push(`${ROUTES.VISA}`);
    }
  };

  // Helper arrays for Time Column selectors
  const hoursList = [
    "12",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
  ];
  const minutesList = [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "50",
    "55",
  ];
  const periodsList = ["AM", "PM"];

  // Extract selected values to highlight in scroll columns
  const getActiveHour = () => {
    const hh = pickupTimeVal.split(":")[0];
    return hh;
  };
  const getActiveMinute = () => {
    const mmVal = pickupTimeVal.split(":")[1];
    if (mmVal) {
      return mmVal.substring(0, 2);
    }
    return "00";
  };
  const getActivePeriod = () => {
    return pickupTimeVal.endsWith("PM") ? "PM" : "AM";
  };

  // Extract date number for active calendar highlighted box
  const getActiveDayNum = (type) => {
    let textVal = "";
    if (type === "departure") textVal = depDateText;
    else if (type === "return") textVal = retDateText;
    else if (type === "checkin") textVal = checkInDateText;
    else if (type === "checkout") textVal = checkOutDateText;
    else if (type === "flightdep") textVal = flightDepDate;
    else if (type === "flightret") textVal = flightRetDate;
    else if (type === "holidaydep") textVal = holidayDepDate;
    else if (type === "busdep") textVal = busJourneyDate;
    else if (type === "traindep") textVal = trainJourneyDate;
    else if (type === "visatravel") textVal = visaTravelDate;
    else if (type === "visapassport") textVal = visaPassportExpiryDate;
    else if (type === "insexpiry") textVal = insExpiryDate;
    else if (type.startsWith("multicity-dep-")) {
      const idx = parseInt(type.split("-")[2]);
      textVal = multiCityFlights[idx]?.date || "";
    }

    const num = parseInt(textVal.split(" ")[0]);
    return isNaN(num) ? 22 : num;
  };

  const getDepartureCalendarDays = (): (number | null)[] => {
    const year = departureCalendarDate.getFullYear();
    const month = departureCalendarDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstWeekday).fill(null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(day);
    }

    return days;
  };

  const isDepartureCalendarDaySelected = (day: number) =>
    departureDate !== null &&
    departureDate.getDate() === day &&
    departureDate.getMonth() === departureCalendarDate.getMonth() &&
    departureDate.getFullYear() === departureCalendarDate.getFullYear();

  const isDepartureCalendarDayInPast = (day: number) => {
    const calendarDay = new Date(
      departureCalendarDate.getFullYear(),
      departureCalendarDate.getMonth(),
      day,
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return calendarDay < today;
  };

  const selectDepartureCalendarDay = (day: number) => {
    if (isDepartureCalendarDayInPast(day)) return;

    setDepartureDate(
      new Date(
        departureCalendarDate.getFullYear(),
        departureCalendarDate.getMonth(),
        day,
      ),
    );
    setOpenPicker(null);
  };

  const selectTodayForDeparture = () => {
    const today = new Date();
    setDepartureDate(today);
    setDepartureCalendarDate(
      new Date(today.getFullYear(), today.getMonth(), 1),
    );
    setOpenPicker(null);
  };

  const selectHotelTabMode = (mode) => {
    setHotelRoomsTab(mode);
    if (mode === "groupDeals") {
      setHotelRooms(5);
      setHotelGuests(10);
    } else {
      setHotelRooms(1);
      setHotelGuests(2);
    }
  };

  // Multi City Helpers
  const addMultiCityRow = () => {
    if (multiCityFlights.length < 4) {
      setMultiCityFlights([
        ...multiCityFlights,
        {
          fromCity: "Bengaluru",
          fromState: "Karnataka, India",
          toCity: "Delhi",
          toState: "Delhi, India",
          date: "18 Aug'26",
          day: "Tuesday",
        },
      ]);
    } else {
      toast.error("You can add up to 4 flights for multi-city search.");
    }
  };

  const removeMultiCityRow = (indexToRemove) => {
    if (multiCityFlights.length > 2) {
      setMultiCityFlights(
        multiCityFlights.filter((_, idx) => idx !== indexToRemove),
      );
    }
  };

  const updateMultiCityFlight = (index, key, val) => {
    const updated = [...multiCityFlights];
    updated[index][key] = val;
    setMultiCityFlights(updated);
  };

  return (
    <div className="position-relative">
      {/* Invisible backdrop click catcher to close dropdowns */}
      {(openPicker ||
        showGuestDropdown ||
        showPriceDropdown ||
        showHolidayGuests ||
        showPackageDropdown) && (
        <div
          className="leh-style-auto-1001"
          onClick={() => {
            setOpenPicker(null);
            setShowGuestDropdown(false);
            setShowPriceDropdown(false);
            setShowHolidayGuests(false);
            setShowPackageDropdown(false);
          }}
        />
      )}

      {/* Main Booking Panel */}
      <div className="leh-booking-card">
        <form onSubmit={handleSearchSubmit}>
          {/* CABS TAB */}
          {activeTab === "cabs" && (
            <div>
              <div className="leh-service-toggle-container">
                <button
                  type="button"
                  onClick={() => setCabMode("enquiry")}
                  className={`leh-toggle-pill ${cabMode === "enquiry" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Cab Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setCabMode("booking")}
                  className={`leh-toggle-pill ${cabMode === "booking" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Cab Booking
                </button>
              </div>

              {/* Radio options capsule style */}
              <div
                className="leh-undercard-row justify-content-start mb-3 mt-0 gap-2"
                role="radiogroup"
                aria-label="Cab trip type"
              >
                <label
                  className={`leh-radio-pill ${searchParams.cabs.tripType === "oneway" ? "" : "leh-radio-pill-inactive"}`}
                  onClick={() =>
                    updateSearchParams("cabs", { tripType: "oneway" })
                  }
                  aria-label="One Way"
                >
                  <input
                    type="radio"
                    name="cabTripType"
                    checked={searchParams.cabs.tripType === "oneway"}
                    aria-label="One Way"
                    readOnly
                  />{" "}
                  One Way
                </label>
                <label
                  className={`leh-radio-pill ${searchParams.cabs.tripType === "roundtrip" ? "" : "leh-radio-pill-inactive"}`}
                  onClick={() =>
                    updateSearchParams("cabs", { tripType: "roundtrip" })
                  }
                  aria-label="Round Trip"
                >
                  <input
                    type="radio"
                    name="cabTripType"
                    checked={searchParams.cabs.tripType === "roundtrip"}
                    aria-label="Round Trip"
                    readOnly
                  />{" "}
                  Round Trip
                </label>
                <label
                  className={`leh-radio-pill local_class ${searchParams.cabs.tripType === "local" ? "" : "leh-radio-pill-inactive"}`}
                  onClick={() =>
                    updateSearchParams("cabs", { tripType: "local" })
                  }
                  aria-label="Local"
                >
                  <input
                    type="radio"
                    name="cabTripType"
                    checked={searchParams.cabs.tripType === "local"}
                    aria-label="Local"
                    readOnly
                  />{" "}
                  Local
                </label>
                <label
                  className={`leh-radio-pill hourly_rentals ${searchParams.cabs.tripType === "hourly" ? "" : "leh-radio-pill-inactive"}`}
                  onClick={() =>
                    updateSearchParams("cabs", { tripType: "hourly" })
                  }
                  aria-label="Hourly Rentals"
                >
                  <input
                    type="radio"
                    name="cabTripType"
                    checked={searchParams.cabs.tripType === "hourly"}
                    aria-label="Hourly Rentals"
                    readOnly
                  />{" "}
                  Local
                </label>
              </div>

              {/* Enquiry Mode or Booking Mode Card Grid */}
              <div className="leh-input-card-grid">
                {/* FROM CARD (Pickup) */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      {searchParams.cabs.tripType === "hourly"
                        ? "Pickup Location / City"
                        : "From"}
                    </span>
                  </div>
                  <div className="leh-inner-box">
                    <LocationAutocomplete
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      placeholder={
                        searchParams.cabs.tripType === "hourly"
                          ? "Enter Pickup City"
                          : "Enter City"
                      }
                      value={pickupCity}
                      onChange={setPickupCity}
                      subtext={pickupState}
                      setSubtext={setPickupState}
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    {pickupState || "India"}
                  </span>
                </div>

                {/* TO CARD OR SELECT PACKAGE (FOR HOURLY RENTALS) */}
                {searchParams.cabs.tripType === "hourly" ? (
                  <div className="position-relative" ref={pkgDropdownRef}>
                    {/* Card trigger */}
                    <div
                      className="leh-input-card cursor-pointer"
                      onClick={() => setShowPackageDropdown((prev) => !prev)}
                    >
                      <div className="leh-input-card-header d-flex justify-content-between align-items-center">
                        <span className="leh-input-card-label">
                          Select Package
                        </span>
                        {rentalPackage?.popular && (
                          <span className="badge bg-warning text-dark fs-10 px-1.5 py-0.5 fw-bold">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="leh-inner-box d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-dark">
                          {rentalPackage
                            ? rentalPackage.label
                            : "Select Package"}
                        </span>
                        <i className="fa-solid fa-chevron-down text-primary fs-8"></i>
                      </div>
                      <span className="leh-input-card-subtext text-truncate d-block">
                        {rentalPackage
                          ? rentalPackage.desc
                          : "Choose from available options"}
                      </span>
                    </div>

                    {/* Dropdown panel - sibling to card, inside the ref container */}
                    {showPackageDropdown && (
                      <div
                        className="position-absolute start-0 bg-white rounded-3 shadow-lg border p-3 text-start"
                        style={{
                          top: "100%",
                          marginTop: "8px",
                          width: "330px",
                          maxWidth: "92vw",
                          zIndex: 9999,
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                          <div>
                            <h6 className="fw-bold text-dark mb-0 fs-7">
                              Select Hourly Package
                            </h6>
                            <small className="text-muted fs-9">
                              Cab &amp; driver reserved for you
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-light rounded-circle p-1 border-0"
                            onClick={() => setShowPackageDropdown(false)}
                          >
                            ✕
                          </button>
                        </div>
                        <div
                          className="d-flex flex-column gap-2"
                          style={{ maxHeight: "280px", overflowY: "auto" }}
                        >
                          {hourlyPackagesList.map((pkg, index) => (
                            <div
                              key={`pkg-${index}`}
                              className={`p-2 rounded-3 border transition-all ${rentalPackage?.id === pkg.id ? "border-primary bg-primary bg-opacity-10" : "border-light"}`}
                              style={{ cursor: "pointer", userSelect: "none" }}
                              onMouseDown={(e) => {
                                e.preventDefault(); // prevent blur
                                setRentalPackage(pkg);
                                setShowPackageDropdown(false);
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-bold text-dark fs-7">
                                  {pkg.label}
                                </span>
                                {pkg.popular && (
                                  <span className="badge bg-warning text-dark fs-10 fw-bold px-1.5 py-0.5">
                                    MOST POPULAR
                                  </span>
                                )}
                              </div>
                              <small className="text-muted fs-9 d-block">
                                {pkg.desc}
                              </small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard TO CARD */
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">To</span>
                    </div>
                    <div className="leh-inner-box">
                      <LocationAutocomplete
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Enter City"
                        value={dropCity}
                        onChange={setDropCity}
                        subtext={dropState}
                        setSubtext={setDropState}
                      />
                    </div>
                    <span className="leh-input-card-subtext">{dropState}</span>
                  </div>
                )}

                {/* DEPARTURE CARD */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("departure")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Departure</span>
                  </div>
                  <div className="leh-inner-box">
                    <span className="fw-bold text-dark">{depDateText}</span>
                    <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                  </div>
                  <span className="leh-input-card-subtext">{depDayName}</span>

                  {/* CUSTOM DATE TIME PICKER FOR DEPARTURE */}
                  {openPicker === "departure" && (
                    <div
                      className="leh-datetime-picker"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left">
                        <div className="leh-datepicker-header">
                          <span>
                            {departureCalendarDate.toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                              onClick={() =>
                                setDepartureCalendarDate(
                                  (date) =>
                                    new Date(
                                      date.getFullYear(),
                                      date.getMonth() - 1,
                                      1,
                                    ),
                                )
                              }
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                              onClick={() =>
                                setDepartureCalendarDate(
                                  (date) =>
                                    new Date(
                                      date.getFullYear(),
                                      date.getMonth() + 1,
                                      1,
                                    ),
                                )
                              }
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          {getDepartureCalendarDays().map((day, idx) =>
                            day === null ? (
                              <span key={`empty-${idx}`}></span>
                            ) : (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${isDepartureCalendarDaySelected(day) ? "active" : ""} ${isDepartureCalendarDayInPast(day) ? "disabled" : ""}`}
                                aria-disabled={isDepartureCalendarDayInPast(
                                  day,
                                )}
                                onClick={() => selectDepartureCalendarDay(day)}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="leh-datepicker-footer">
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setDepartureDate(null);
                              setOpenPicker(null);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={selectTodayForDeparture}
                          >
                            Today
                          </button>
                        </div>
                      </div>

                      {/* Right: Scrollable Timepicker */}
                      <div className="leh-timepicker-right">
                        <div className="leh-time-column">
                          {hoursList.map((h) => (
                            <div
                              key={h}
                              className={`leh-time-cell ${h === getActiveHour() ? "active" : ""}`}
                              onClick={() => {
                                setPickupTimeVal(
                                  `${h}:${getActiveMinute()}${getActivePeriod()}`,
                                );
                              }}
                            >
                              {h}
                            </div>
                          ))}
                        </div>
                        <div className="leh-time-column">
                          {minutesList.map((m) => (
                            <div
                              key={m}
                              className={`leh-time-cell ${m === getActiveMinute() ? "active" : ""}`}
                              onClick={() => {
                                setPickupTimeVal(
                                  `${getActiveHour()}:${m}${getActivePeriod()}`,
                                );
                              }}
                            >
                              {m}
                            </div>
                          ))}
                        </div>
                        <div
                          className="leh-time-column leh-time-period-column"
                          aria-label="AM or PM"
                        >
                          {periodsList.map((p) => (
                            <div
                              key={p}
                              className={`leh-time-cell leh-time-period-cell ${p === getActivePeriod() ? "active" : ""}`}
                              onClick={() => {
                                setPickupTimeVal(
                                  `${getActiveHour()}:${getActiveMinute()}${p}`,
                                );
                              }}
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RETURN CARD (Only for Round Trip) */}
                {searchParams.cabs.tripType === "roundtrip" && (
                  <div
                    className="leh-input-card position-relative"
                    onClick={() => setOpenPicker("return")}
                  >
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">Return</span>
                    </div>
                    <div className="leh-inner-box">
                      <span className="fw-bold text-dark">{retDateText}</span>
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </div>
                    <span className="leh-input-card-subtext">{retDayName}</span>

                    {/* CUSTOM DATE TIME PICKER FOR RETURN */}
                    {openPicker === "return" && (
                      <div
                        className="leh-datetime-picker"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="leh-datepicker-left">
                          <div className="leh-datepicker-header">
                            <span>
                              {departureCalendarDate.toLocaleString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <div>
                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                                onClick={() =>
                                  setDepartureCalendarDate(
                                    (date) =>
                                      new Date(
                                        date.getFullYear(),
                                        date.getMonth() - 1,
                                        1,
                                      ),
                                  )
                                }
                              >
                                <i className="fa-solid fa-chevron-up"></i>
                              </button>
                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                                onClick={() =>
                                  setDepartureCalendarDate(
                                    (date) =>
                                      new Date(
                                        date.getFullYear(),
                                        date.getMonth() + 1,
                                        1,
                                      ),
                                  )
                                }
                              >
                                <i className="fa-solid fa-chevron-down"></i>
                              </button>
                            </div>
                          </div>
                          <div className="leh-calendar-grid-weekdays">
                            <span>Su</span>
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                          </div>
                          <div className="leh-calendar-grid-days">
                            <span></span>
                            <span></span>
                            <span></span>
                            {Array.from(
                              { length: 31 },
                              (_, idx) => idx + 1,
                            ).map((day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("return") ? "active" : ""}`}
                                onClick={() => {
                                  setRetDateText(`${day} Jul'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (3 + day - 1) % 7;
                                  setRetDayName(daysOfWeek[dayNameIndex]);
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                          <div className="leh-datepicker-footer">
                            <button
                              type="button"
                              className="leh-datepicker-footer-btn"
                              onClick={() => {
                                setRetDateText("");
                                setRetDayName("");
                                setOpenPicker(null);
                              }}
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-footer-btn"
                              onClick={() => {
                                setRetDateText("22 Jul'26");
                                setRetDayName("Wednesday");
                                setOpenPicker(null);
                              }}
                            >
                              Today
                            </button>
                          </div>
                        </div>

                        {/* Right: Scrollable Timepicker */}
                        <div className="leh-timepicker-right">
                          <div className="leh-time-column">
                            {hoursList.map((h) => (
                              <div
                                key={h}
                                className={`leh-time-cell ${h === getActiveHour() ? "active" : ""}`}
                                onClick={() => {
                                  setPickupTimeVal(
                                    `${h}:${getActiveMinute()}${getActivePeriod()}`,
                                  );
                                }}
                              >
                                {h}
                              </div>
                            ))}
                          </div>
                          <div className="leh-time-column">
                            {minutesList.map((m) => (
                              <div
                                key={m}
                                className={`leh-time-cell ${m === getActiveMinute() ? "active" : ""}`}
                                onClick={() => {
                                  setPickupTimeVal(
                                    `${getActiveHour()}:${m}${getActivePeriod()}`,
                                  );
                                }}
                              >
                                {m}
                              </div>
                            ))}
                          </div>
                          <div
                            className="leh-time-column leh-time-period-column"
                            aria-label="AM or PM"
                          >
                            {periodsList.map((p) => (
                              <div
                                key={p}
                                className={`leh-time-cell leh-time-period-cell ${p === getActivePeriod() ? "active" : ""}`}
                                onClick={() => {
                                  setPickupTimeVal(
                                    `${getActiveHour()}:${getActiveMinute()}${p}`,
                                  );
                                }}
                              >
                                {p}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PICKUP TIME CARD */}
                {cabMode === "booking" ? (
                  <div
                    className="leh-input-card position-relative"
                    onClick={() => setOpenPicker("time")}
                  >
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">Pickup Time</span>
                    </div>
                    <div className="leh-inner-box">
                      <span className="fw-bold text-dark">{pickupTimeVal}</span>
                      <i className="fa-regular fa-clock text-muted fs-7"></i>
                    </div>

                    {openPicker === "time" && (
                      <div
                        className="leh-datetime-picker leh-pickup-time-picker"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="leh-datepicker-left">
                          <div className="leh-datepicker-header">
                            <span>July 2026</span>
                            <div>
                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                              >
                                <i className="fa-solid fa-chevron-up"></i>
                              </button>
                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                              >
                                <i className="fa-solid fa-chevron-down"></i>
                              </button>
                            </div>
                          </div>
                          <div className="leh-calendar-grid-weekdays">
                            <span>Su</span>
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                          </div>
                          <div className="leh-calendar-grid-days">
                            {getDepartureCalendarDays().map((day, idx) =>
                              day === null ? (
                                <span key={`empty-${idx}`}></span>
                              ) : (
                                <span
                                  key={day}
                                  className={`leh-calendar-day-cell ${isDepartureCalendarDaySelected(day) ? "active" : ""} ${isDepartureCalendarDayInPast(day) ? "disabled" : ""}`}
                                  aria-disabled={isDepartureCalendarDayInPast(
                                    day,
                                  )}
                                  onClick={() =>
                                    selectDepartureCalendarDay(day)
                                  }
                                >
                                  {day}
                                </span>
                              ),
                            )}
                          </div>
                          <div className="leh-datepicker-footer">
                            <button
                              type="button"
                              className="leh-datepicker-footer-btn"
                              onClick={() => {
                                setDepartureDate(null);
                                setOpenPicker(null);
                              }}
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-footer-btn"
                              onClick={selectTodayForDeparture}
                            >
                              Today
                            </button>
                          </div>
                        </div>

                        <div className="leh-timepicker-right">
                          <div className="leh-time-column">
                            {hoursList.map((h) => (
                              <div
                                key={h}
                                className={`leh-time-cell ${h === getActiveHour() ? "active" : ""}`}
                                onClick={() => {
                                  setPickupTimeVal(
                                    `${h}:${getActiveMinute()}${getActivePeriod()}`,
                                  );
                                }}
                              >
                                {h}
                              </div>
                            ))}
                          </div>
                          <div className="leh-time-column">
                            {minutesList.map((m) => (
                              <div
                                key={m}
                                className={`leh-time-cell ${m === getActiveMinute() ? "active" : ""}`}
                                onClick={() => {
                                  setPickupTimeVal(
                                    `${getActiveHour()}:${m}${getActivePeriod()}`,
                                  );
                                }}
                              >
                                {m}
                              </div>
                            ))}
                          </div>
                          <div
                            className="leh-time-column leh-time-period-column"
                            aria-label="AM or PM"
                          >
                            {periodsList.map((p) => (
                              <div
                                key={p}
                                className={`leh-time-cell leh-time-period-cell ${p === getActivePeriod() ? "active" : ""}`}
                                onClick={() => {
                                  setPickupTimeVal(
                                    `${getActiveHour()}:${getActiveMinute()}${p}`,
                                  );
                                }}
                              >
                                {p}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">
                        Contact Number
                      </span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="tel"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Contact No."
                        value={cabPhone}
                        onChange={(e) =>
                          setCabPhone(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={10}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      Verification Contact
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HOTELS TAB - DYNAMICALLY SWITCHES BETWEEN UP TO 4 ROOMS AND GROUP DEALS */}
          {activeTab === "hotels" && (
            <div>
              {/* Hotel Sub-tabs Toggles */}
              <div className="leh-service-toggle-container">
                <button
                  type="button"
                  onClick={() => setHotelMode("enquiry")}
                  className={`leh-toggle-pill ${hotelMode === "enquiry" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Hotel Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setHotelMode("booking")}
                  className={`leh-toggle-pill ${hotelMode === "booking" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Hotel Booking
                </button>

                {hotelMode === "booking" && (
                  <>
                    <button
                      type="button"
                      onClick={() => selectHotelTabMode("upTo4")}
                      className={`leh-toggle-pill ${hotelRoomsTab === "upTo4" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                    >
                      Up to 4 Rooms
                    </button>
                    <button
                      type="button"
                      onClick={() => selectHotelTabMode("groupDeals")}
                      className={`leh-toggle-pill ${hotelRoomsTab === "groupDeals" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                    >
                      Group Deals
                    </button>
                    <span className="badge rounded-pill text-uppercase fs-8 fw-extrabold px-3 py-2 text-white ms-1 leh-style-auto-1003">
                      NEW
                    </span>
                  </>
                )}
              </div>

              {/* 5 Card Fields Grid for Standard / 4 Card Fields Grid for Group Deals */}
              <div className="leh-input-card-grid">
                {/* 1. City, Property Name Or Location Card */}
                <div className="leh-input-card leh-style-auto-1004">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      City, Property Name Or Location
                    </span>
                  </div>
                  <div className="leh-inner-box">
                    <input
                      type="text"
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      placeholder="Enter City"
                      value={hotelCity}
                      onChange={(e) => setHotelCity(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">{hotelState}</span>
                </div>

                {/* 2. Check-In Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("checkin")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Check-In</span>
                  </div>
                  <div className="leh-inner-box">
                    <span className="fw-bold text-dark">{checkInDateText}</span>
                    <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                  </div>
                  <span className="leh-input-card-subtext">
                    {checkInDayName}
                  </span>

                  {openPicker === "checkin" && (
                    <div
                      className="leh-datetime-picker leh-style-auto-1005"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left leh-style-auto-1006">
                        <div className="leh-datepicker-header">
                          <span>August 2026</span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          {Array.from({ length: 31 }, (_, idx) => idx + 1).map(
                            (day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("checkin") ? "active" : ""}`}
                                onClick={() => {
                                  setCheckInDateText(`${day} Aug'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (6 + day - 1) % 7;
                                  setCheckInDayName(daysOfWeek[dayNameIndex]);
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="leh-datepicker-footer">
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setCheckInDateText("");
                              setCheckInDayName("");
                              setOpenPicker(null);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setCheckInDateText("10 Aug'26");
                              setCheckInDayName("Monday");
                              setOpenPicker(null);
                            }}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Check-Out Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("checkout")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Check-Out</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Date{" "}
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </span>
                    <div className="leh-input-card-bold">
                      {checkOutDateText}
                    </div>
                  </div>
                  <span className="leh-input-card-subtext">
                    {checkOutDayName}
                  </span>

                  {openPicker === "checkout" && (
                    <div
                      className="leh-datetime-picker leh-style-auto-1005"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left leh-style-auto-1006">
                        <div className="leh-datepicker-header">
                          <span>August 2026</span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          {Array.from({ length: 31 }, (_, idx) => idx + 1).map(
                            (day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("checkout") ? "active" : ""}`}
                                onClick={() => {
                                  setCheckOutDateText(`${day} Aug'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  setCheckOutDayName(
                                    daysOfWeek[(6 + day - 1) % 7],
                                  );
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="leh-datepicker-footer">
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setCheckOutDateText("");
                              setCheckOutDayName("");
                              setOpenPicker(null);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setCheckOutDateText("15 Aug'26");
                              setCheckOutDayName("Saturday");
                              setOpenPicker(null);
                            }}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Number Card - only in Enquiry mode */}
                {hotelMode === "enquiry" && (
                  <div
                    className="leh-input-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">
                        Contact Number
                      </span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="tel"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Contact No."
                        value={hotelPhone}
                        onChange={(e) => setHotelPhone(e.target.value)}
                        maxLength={10}
                        onClick={(e) => e.stopPropagation()}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      Verification Contact
                    </span>
                  </div>
                )}

                {/* 4. Rooms & Guests Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => {
                    setShowGuestDropdown(!showGuestDropdown);
                    setShowPriceDropdown(false);
                  }}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Rooms & Guests</span>
                  </div>
                  <div className="leh-inner-box">
                    <span className="fw-bold text-dark leh-style-auto-1007">
                      {hotelRooms} Room {hotelGuests} Adults
                    </span>
                  </div>
                  <span className="leh-input-card-subtext">
                    Click to configure
                  </span>

                  {showGuestDropdown && (
                    <div
                      className="card position-absolute shadow-lg p-3 bg-white border border-secondary leh-style-auto-1008"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 fs-7">
                        Select Rooms & Guests
                      </h6>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fs-7 fw-semibold text-muted">
                          Rooms
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={
                              hotelRoomsTab === "groupDeals"
                                ? hotelRooms <= 5
                                : hotelRooms <= 1
                            }
                            onClick={() =>
                              setHotelRooms(
                                Math.max(
                                  hotelRoomsTab === "groupDeals" ? 5 : 1,
                                  hotelRooms - 1,
                                ),
                              )
                            }
                          >
                            <i className="fa-solid fa-minus fs-10"></i>
                          </button>
                          <span className="fw-bold fs-7">{hotelRooms}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={
                              hotelRoomsTab === "groupDeals"
                                ? hotelRooms >= 30
                                : hotelRooms >= 4
                            }
                            onClick={() =>
                              setHotelRooms(
                                Math.min(
                                  hotelRoomsTab === "groupDeals" ? 30 : 4,
                                  hotelRooms + 1,
                                ),
                              )
                            }
                          >
                            <i className="fa-solid fa-plus fs-10"></i>
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fs-7 fw-semibold text-muted">
                          Adults
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={
                              hotelRoomsTab === "groupDeals"
                                ? hotelGuests <= 10
                                : hotelGuests <= 1
                            }
                            onClick={() =>
                              setHotelGuests(
                                Math.max(
                                  hotelRoomsTab === "groupDeals" ? 10 : 1,
                                  hotelGuests - 1,
                                ),
                              )
                            }
                          >
                            <i className="fa-solid fa-minus fs-10"></i>
                          </button>
                          <span className="fw-bold fs-7">{hotelGuests}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={
                              hotelRoomsTab === "groupDeals"
                                ? hotelGuests >= 60
                                : hotelGuests >= 10
                            }
                            onClick={() =>
                              setHotelGuests(
                                Math.min(
                                  hotelRoomsTab === "groupDeals" ? 60 : 10,
                                  hotelGuests + 1,
                                ),
                              )
                            }
                          >
                            <i className="fa-solid fa-plus fs-10"></i>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowGuestDropdown(false)}
                        className="btn btn-primary btn-sm w-100 fw-bold py-2 mt-2 text-uppercase fs-8"
                      >
                        Apply selection
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Price Per Night Card (Only shown for Standard "Up to 4 Rooms") */}
                {hotelRoomsTab === "upTo4" && (
                  <div
                    className="leh-input-card position-relative"
                    onClick={() => {
                      setShowPriceDropdown(!showPriceDropdown);
                      setShowGuestDropdown(false);
                    }}
                  >
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">
                        Price Per Night
                      </span>
                      <span className="text-muted fs-8">▼</span>
                    </div>
                    <div>
                      <span className="leh-input-card-placeholder">
                        Select Range
                      </span>
                      <div className="leh-input-card-bold leh-style-auto-1010">
                        {priceRange}
                      </div>
                    </div>
                    <span className="leh-input-card-subtext">
                      Per room / night
                    </span>

                    {showPriceDropdown && (
                      <div
                        className="card position-absolute shadow-lg p-2 bg-white border border-secondary leh-style-auto-1011"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[
                          "₹0 - ₹1500",
                          "₹1500 - ₹3000",
                          "₹3000 - ₹5000",
                          "₹5000+",
                        ].map((range) => (
                          <button
                            key={range}
                            type="button"
                            className="btn btn-light btn-sm text-start w-100 py-2 border-0 mb-1 fw-bold text-dark leh-style-auto-1012"
                            onClick={() => {
                              setPriceRange(range);
                              setShowPriceDropdown(false);
                            }}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FLIGHTS TAB - SUPPORT ONE WAY, ROUND TRIP, AND MULTI CITY */}
          {activeTab === "flights" && (
            <div>
              {/* Flights Sub-tabs Toggles */}
              <div className="leh-service-toggle-container">
                <button
                  type="button"
                  onClick={() => setFlightMode("enquiry")}
                  className={`leh-toggle-pill ${flightMode === "enquiry" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Flight Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setFlightMode("booking")}
                  className={`leh-toggle-pill ${flightMode === "booking" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Flight Booking
                </button>

                {flightMode === "booking" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setFlightTripTab("oneway")}
                      className={`leh-toggle-pill ${flightTripTab === "oneway" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                    >
                      One Way
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlightTripTab("roundtrip")}
                      className={`leh-toggle-pill ${flightTripTab === "roundtrip" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                    >
                      Round Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlightTripTab("multicity")}
                      className={`leh-toggle-pill ${flightTripTab === "multicity" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                    >
                      Multi City
                    </button>
                  </>
                )}
              </div>

              {/* RENDER FLIGHTS BASED ON TRIP TAB */}
              {flightMode === "enquiry" ? (
                /* ENQUIRY FORM - Simple fields */
                <div className="leh-input-card-grid">
                  {/* From Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">From</span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="text"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Enter City or Airport"
                        value={flightFromCity}
                        onChange={(e) => setFlightFromCity(e.target.value)}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      {flightFromState}
                    </span>
                  </div>

                  {/* To Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">To</span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="text"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Enter City or Airport"
                        value={flightToCity}
                        onChange={(e) => setFlightToCity(e.target.value)}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      {flightToState}
                    </span>
                  </div>

                  {/* Travel Date Card */}
                  <div
                    className="leh-input-card position-relative"
                    onClick={() => setOpenPicker("flightdep")}
                  >
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">Travel Date</span>
                    </div>
                    <div className="leh-inner-box">
                      <span className="fw-bold text-dark">{flightDepDate}</span>
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </div>
                    <span className="leh-input-card-subtext">
                      {flightDepDay}
                    </span>
                    {openPicker === "flightdep" && (
                      <div
                        className="leh-datetime-picker leh-style-auto-1005"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="leh-datepicker-left leh-style-auto-1006">
                          <div className="leh-datepicker-header">
                            <span>August 2026</span>
                          </div>
                          <div className="leh-calendar-grid-weekdays">
                            <span>Su</span>
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                          </div>
                          <div className="leh-calendar-grid-days">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <span
                                  key={day}
                                  className={`leh-calendar-day-cell ${day === getActiveDayNum("flightdep") ? "active" : ""}`}
                                  onClick={() => {
                                    setFlightDepDate(`${day} Aug'26`);
                                    const daysOfWeek = [
                                      "Sunday",
                                      "Monday",
                                      "Tuesday",
                                      "Wednesday",
                                      "Thursday",
                                      "Friday",
                                      "Saturday",
                                    ];
                                    setFlightDepDay(
                                      daysOfWeek[(6 + day - 1) % 7],
                                    );
                                    setOpenPicker(null);
                                  }}
                                >
                                  {day}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Travellers Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">Travellers</span>
                    </div>
                    <div className="leh-inner-box">
                      <select
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        value={flightTravellers}
                        onChange={(e) =>
                          setFlightTravellers(parseInt(e.target.value))
                        }
                      >
                        <option value="1">1 Traveller</option>
                        <option value="2">2 Travellers</option>
                        <option value="3">3 Travellers</option>
                        <option value="4">4 Travellers</option>
                        <option value="5">5+ Travellers</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Number Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">
                        Contact Number
                      </span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="tel"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Enter Contact No."
                        value={flightPhone}
                        onChange={(e) =>
                          setFlightPhone(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={10}
                        onClick={(e) => e.stopPropagation()}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      Verification Contact
                    </span>
                  </div>
                </div>
              ) : flightTripTab === "multicity" ? (
                <div>
                  {/* Multi-City flight rows list */}
                  {multiCityFlights.map((flight, idx) => (
                    <div key={idx} className="leh-multicity-row">
                      {/* From Card */}
                      <div className="leh-input-card leh-style-auto-1013">
                        <div className="leh-input-card-header">
                          <span className="leh-input-card-label">From</span>
                          {idx >= 2 && (
                            <button
                              type="button"
                              className="border-0 bg-transparent text-danger p-0"
                              onClick={() => removeMultiCityRow(idx)}
                              title="Delete route"
                            >
                              <i className="fa-solid fa-xmark fs-9"></i>
                            </button>
                          )}
                        </div>
                        <div className="leh-inner-box">
                          <input
                            type="text"
                            className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                            placeholder="Enter City or Airport"
                            value={flight.fromCity}
                            onChange={(e) =>
                              updateMultiCityFlight(
                                idx,
                                "fromCity",
                                e.target.value,
                              )
                            }
                            required
                          />
                        </div>
                        <span className="leh-input-card-subtext">
                          {flight.fromState}
                        </span>
                      </div>

                      {/* To Card */}
                      <div className="leh-input-card leh-style-auto-1013">
                        <div className="leh-input-card-header">
                          <span className="leh-input-card-label">To</span>
                        </div>
                        <div className="leh-inner-box">
                          <input
                            type="text"
                            className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                            placeholder="Enter City or Airport"
                            value={flight.toCity}
                            onChange={(e) =>
                              updateMultiCityFlight(
                                idx,
                                "toCity",
                                e.target.value,
                              )
                            }
                            required
                          />
                        </div>
                        <span className="leh-input-card-subtext">
                          {flight.toState}
                        </span>
                      </div>

                      {/* Departure Card */}
                      <div
                        className="leh-input-card position-relative leh-style-auto-1013"
                        onClick={() => setOpenPicker(`multicity-dep-${idx}`)}
                      >
                        <div className="leh-input-card-header">
                          <span className="leh-input-card-label">
                            Departure
                          </span>
                        </div>
                        <div className="leh-inner-box">
                          <span className="fw-bold text-dark">
                            {flight.date}
                          </span>
                          <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                        </div>
                        <span className="leh-input-card-subtext">
                          {flight.day}
                        </span>

                        {openPicker === `multicity-dep-${idx}` && (
                          <div
                            className="leh-datetime-picker leh-style-auto-1005"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="leh-datepicker-left leh-style-auto-1006">
                              <div className="leh-datepicker-header">
                                <span>August 2026</span>
                                <div>
                                  <button
                                    type="button"
                                    className="leh-datepicker-arrow-btn"
                                  >
                                    <i className="fa-solid fa-chevron-up"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="leh-datepicker-arrow-btn"
                                  >
                                    <i className="fa-solid fa-chevron-down"></i>
                                  </button>
                                </div>
                              </div>
                              <div className="leh-calendar-grid-weekdays">
                                <span>Su</span>
                                <span>Mo</span>
                                <span>Tu</span>
                                <span>We</span>
                                <span>Th</span>
                                <span>Fr</span>
                                <span>Sa</span>
                              </div>
                              <div className="leh-calendar-grid-days">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                {Array.from(
                                  { length: 31 },
                                  (_, i) => i + 1,
                                ).map((day) => (
                                  <span
                                    key={day}
                                    className={`leh-calendar-day-cell ${day === getActiveDayNum(`multicity-dep-${idx}`) ? "active" : ""}`}
                                    onClick={() => {
                                      const daysOfWeek = [
                                        "Sunday",
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                      ];
                                      const dayNameIndex = (6 + day - 1) % 7;
                                      updateMultiCityFlight(
                                        idx,
                                        "date",
                                        `${day} Aug'26`,
                                      );
                                      updateMultiCityFlight(
                                        idx,
                                        "day",
                                        daysOfWeek[dayNameIndex],
                                      );
                                      setOpenPicker(null);
                                    }}
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add City Button */}
                  <button
                    type="button"
                    className="leh-add-city-btn"
                    onClick={addMultiCityRow}
                  >
                    +Add Another City
                  </button>

                  {/* Footer options block for Travellers and Cabin Class */}
                  <div className="leh-multicity-footer-grid">
                    {/* Travellers card */}
                    <div className="leh-input-card leh-style-auto-1014">
                      <div className="leh-input-card-header">
                        <span className="leh-input-card-label">Travellers</span>
                      </div>
                      <div className="leh-inner-box leh-style-auto-1015">
                        <select
                          className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                          value={flightTravellers}
                          onChange={(e) =>
                            setFlightTravellers(parseInt(e.target.value))
                          }
                        >
                          <option value="1">1 Traveller</option>
                          <option value="2">2 Travellers</option>
                          <option value="3">3 Travellers</option>
                          <option value="4">4 Travellers</option>
                          <option value="5">5+ Travellers</option>
                        </select>
                      </div>
                    </div>

                    {/* Cabin Class card */}
                    <div className="leh-input-card leh-style-auto-1014">
                      <div className="leh-input-card-header">
                        <span className="leh-input-card-label">
                          Cabin Class
                        </span>
                      </div>
                      <div className="leh-inner-box leh-style-auto-1015">
                        <select
                          className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                          value={flightClass}
                          onChange={(e) => setFlightClass(e.target.value)}
                        >
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">
                            Premium Economy
                          </option>
                          <option value="Business">Business</option>
                          <option value="First Class">First Class</option>
                        </select>
                      </div>
                    </div>
                    {flightMode === "enquiry" && (
                      <div className="leh-input-card leh-style-auto-1014">
                        <div className="leh-input-card-header">
                          <span className="leh-input-card-label">
                            Contact Number
                          </span>
                        </div>
                        <div className="leh-inner-box leh-style-auto-1015">
                          <input
                            type="tel"
                            className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                            placeholder="Contact No."
                            value={flightPhone}
                            onChange={(e) =>
                              setFlightPhone(e.target.value.replace(/\D/g, ""))
                            }
                            maxLength={10}
                            onClick={(e) => e.stopPropagation()}
                            required
                          />
                        </div>
                        <span className="leh-input-card-subtext">
                          Verification Contact
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ONE WAY OR ROUND TRIP CARDS GRID */
                <div className="leh-input-card-grid">
                  {/* 1. From Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">From</span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="text"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Enter City or Airport"
                        value={flightFromCity}
                        onChange={(e) => setFlightFromCity(e.target.value)}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      {flightFromState}
                    </span>
                  </div>

                  {/* 2. To Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">To</span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="text"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Enter City or Airport"
                        value={flightToCity}
                        onChange={(e) => setFlightToCity(e.target.value)}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      {flightToState}
                    </span>
                  </div>

                  {/* 3. Departure Card */}
                  <div
                    className="leh-input-card position-relative"
                    onClick={() => setOpenPicker("flightdep")}
                  >
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">Departure</span>
                    </div>
                    <div className="leh-inner-box">
                      <span className="fw-bold text-dark">{flightDepDate}</span>
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </div>
                    <span className="leh-input-card-subtext">
                      {flightDepDay}
                    </span>

                    {openPicker === "flightdep" && (
                      <div
                        className="leh-datetime-picker leh-style-auto-1005"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="leh-datepicker-left leh-style-auto-1006">
                          <div className="leh-datepicker-header">
                            <span>August 2026</span>
                            <div>
                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                              >
                                <i className="fa-solid fa-chevron-up"></i>
                              </button>

                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                              >
                                <i className="fa-solid fa-chevron-down"></i>
                              </button>
                            </div>
                          </div>

                          <div className="leh-calendar-grid-weekdays">
                            <span>Su</span>
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                          </div>

                          <div className="leh-calendar-grid-days">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                            {Array.from(
                              { length: 31 },
                              (_, idx) => idx + 1,
                            ).map((day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${
                                  day === getActiveDayNum("flightdep")
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setFlightDepDate(`${day} Aug'26`);

                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];

                                  const dayNameIndex = (6 + day - 1) % 7;

                                  setFlightDepDay(daysOfWeek[dayNameIndex]);

                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ))}
                          </div>

                          <div className="leh-datepicker-footer">
                            <button
                              type="button"
                              className="leh-datepicker-footer-btn"
                              onClick={() => {
                                setFlightDepDate("");
                                setFlightDepDay("");
                                setOpenPicker(null);
                              }}
                            >
                              Clear
                            </button>

                            <button
                              type="button"
                              className="leh-datepicker-footer-btn"
                              onClick={() => {
                                setFlightDepDate("10 Aug'26");
                                setFlightDepDay("Monday");
                                setOpenPicker(null);
                              }}
                            >
                              Today
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* IMPORTANT: Close Departure Card */}
                  </div>

                  {/* 4. Return Card (Visible in Round Trip) */}
                  {flightTripTab === "roundtrip" && (
                    <div
                      className="leh-input-card position-relative"
                      onClick={() => setOpenPicker("flightret")}
                    >
                      <div className="leh-input-card-header">
                        <span className="leh-input-card-label">Return</span>
                      </div>
                      <div className="leh-inner-box">
                        <span className="fw-bold text-dark">
                          {flightRetDate}
                        </span>
                        <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                      </div>
                      <span className="leh-input-card-subtext">
                        {flightRetDay}
                      </span>

                      {openPicker === "flightret" && (
                        <div
                          className="leh-datetime-picker leh-style-auto-1005"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="leh-datepicker-left leh-style-auto-1006">
                            <div className="leh-datepicker-header">
                              <span>August 2026</span>
                              <div>
                                <button
                                  type="button"
                                  className="leh-datepicker-arrow-btn"
                                >
                                  <i className="fa-solid fa-chevron-up"></i>
                                </button>
                                <button
                                  type="button"
                                  className="leh-datepicker-arrow-btn"
                                >
                                  <i className="fa-solid fa-chevron-down"></i>
                                </button>
                              </div>
                            </div>
                            <div className="leh-calendar-grid-weekdays">
                              <span>Su</span>
                              <span>Mo</span>
                              <span>Tu</span>
                              <span>We</span>
                              <span>Th</span>
                              <span>Fr</span>
                              <span>Sa</span>
                            </div>
                            <div className="leh-calendar-grid-days">
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(
                                (day) => (
                                  <span
                                    key={day}
                                    className={`leh-calendar-day-cell ${day === getActiveDayNum("flightret") ? "active" : ""}`}
                                    onClick={() => {
                                      setFlightRetDate(`${day} Aug'26`);
                                      const daysOfWeek = [
                                        "Sunday",
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                      ];
                                      const dayNameIndex = (6 + day - 1) % 7;
                                      setFlightRetDay(daysOfWeek[dayNameIndex]);
                                      setOpenPicker(null);
                                    }}
                                  >
                                    {day}
                                  </span>
                                ),
                              )}
                            </div>
                            <div className="leh-datepicker-footer">
                              <button
                                type="button"
                                className="leh-datepicker-footer-btn"
                                onClick={() => {
                                  setFlightRetDate("");
                                  setFlightRetDay("");
                                  setOpenPicker(null);
                                }}
                              >
                                Clear
                              </button>
                              <button
                                type="button"
                                className="leh-datepicker-footer-btn"
                                onClick={() => {
                                  setFlightRetDate("15 Aug'26");
                                  setFlightRetDay("Saturday");
                                  setOpenPicker(null);
                                }}
                              >
                                Today
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. Travellers Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">Travellers</span>
                    </div>
                    <div className="leh-inner-box">
                      <select
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        value={flightTravellers}
                        onChange={(e) =>
                          setFlightTravellers(parseInt(e.target.value))
                        }
                      >
                        <option value="1">1 Traveller</option>
                        <option value="2">2 Travellers</option>
                        <option value="3">3 Travellers</option>
                        <option value="4">4 Travellers</option>
                        <option value="5">5+ Travellers</option>
                      </select>
                    </div>
                    <span className="leh-input-card-subtext">
                      Click to change
                    </span>
                  </div>

                  {/* 6. Cabin Class Card */}
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">Cabin Class</span>
                    </div>
                    <div className="leh-inner-box">
                      <select
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        value={flightClass}
                        onChange={(e) => setFlightClass(e.target.value)}
                      >
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business</option>
                        <option value="First Class">First Class</option>
                      </select>
                    </div>
                    <span className="leh-input-card-subtext">
                      Class selection
                    </span>
                  </div>
                </div>
              )}

              {/* Select Fare Type Row at the bottom */}
              <div className="leh-undercard-row justify-content-start mt-3 gap-2 align-items-center">
                <span className="fw-extrabold text-muted me-2 leh-style-auto-1016">
                  Select Fare Type :
                </span>
                {[
                  "Regular",
                  "Student",
                  "Senior Citizen",
                  "Armed Forces",
                  "Doctor & Nurse",
                ].map((type) => (
                  <span
                    key={type}
                    className="leh-radio-pill ${flightFareType === type ? '' : 'leh-radio-pill-inactive'} leh-style-auto-1017"
                    onClick={() => setFlightFareType(type)}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* HOLIDAYS TAB */}
          {activeTab === "holidays" && (
            <div>
              {/* Holidays Sub-tabs Toggles */}
              <div className="leh-service-toggle-container">
                <button
                  type="button"
                  onClick={() => setHolidayMode("enquiry")}
                  className={`leh-toggle-pill ${holidayMode === "enquiry" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Holidays Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setHolidayMode("booking")}
                  className={`leh-toggle-pill ${holidayMode === "booking" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Holidays Booking
                </button>
              </div>

              {/* 4 Cards Grid for Booking Mode / 5 Cards Grid for Enquiry Mode */}
              <div className="leh-input-card-grid">
                {/* 1. From City Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">From City</span>
                  </div>
                  <div className="leh-inner-box">
                    <input
                      type="text"
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      placeholder="Enter City"
                      value={holidayFromCity}
                      onChange={(e) => setHolidayFromCity(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Select departure city
                  </span>
                </div>

                {/* 2. To City/Country/Category Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      To City/Country/Category
                    </span>
                  </div>
                  <div className="leh-inner-box">
                    <input
                      type="text"
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      placeholder="Destination"
                      value={holidayToCity}
                      onChange={(e) => setHolidayToCity(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Choose holiday location
                  </span>
                </div>

                {/* 3. Departure Date Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("holidaydep")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Departure Date</span>
                  </div>
                  <div className="leh-inner-box">
                    <span className="fw-bold text-dark">{holidayDepDate}</span>
                    <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                  </div>
                  <span className="leh-input-card-subtext">
                    {holidayDepDay}
                  </span>

                  {openPicker === "holidaydep" && (
                    <div
                      className="leh-datetime-picker leh-style-auto-1005"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left leh-style-auto-1006">
                        <div className="leh-datepicker-header">
                          <span>August 2026</span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          {Array.from({ length: 31 }, (_, idx) => idx + 1).map(
                            (day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("holidaydep") ? "active" : ""}`}
                                onClick={() => {
                                  setHolidayDepDate(`${day} Aug'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (6 + day - 1) % 7;
                                  setHolidayDepDay(daysOfWeek[dayNameIndex]);
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="leh-datepicker-footer">
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setHolidayDepDate("");
                              setHolidayDepDay("");
                              setOpenPicker(null);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setHolidayDepDate("20 Aug'26");
                              setHolidayDepDay("Thursday");
                              setOpenPicker(null);
                            }}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Rooms & Guests Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setShowHolidayGuests(!showHolidayGuests)}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Rooms & Guests</span>
                  </div>
                  <div className="leh-inner-box">
                    <span className="fw-bold text-dark leh-style-auto-1018">
                      {holidayRooms} Room {holidayGuests} Guests
                    </span>
                  </div>
                  <span className="leh-input-card-subtext">
                    Click to configure
                  </span>

                  {showHolidayGuests && (
                    <div
                      className="card position-absolute shadow-lg p-3 bg-white border border-secondary leh-style-auto-1019"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 fs-7">
                        Select Stays Config
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fs-7 fw-semibold text-muted">
                          Rooms
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={holidayRooms <= 1}
                            onClick={() =>
                              setHolidayRooms(Math.max(1, holidayRooms - 1))
                            }
                          >
                            <i className="fa-solid fa-minus fs-10"></i>
                          </button>
                          <span className="fw-bold fs-7">{holidayRooms}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={holidayRooms >= 5}
                            onClick={() =>
                              setHolidayRooms(Math.min(5, holidayRooms + 1))
                            }
                          >
                            <i className="fa-solid fa-plus fs-10"></i>
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fs-7 fw-semibold text-muted">
                          Guests
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={holidayGuests <= 1}
                            onClick={() =>
                              setHolidayGuests(Math.max(1, holidayGuests - 1))
                            }
                          >
                            <i className="fa-solid fa-minus fs-10"></i>
                          </button>
                          <span className="fw-bold fs-7">{holidayGuests}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light border p-1 rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1009"
                            disabled={holidayGuests >= 15}
                            onClick={() =>
                              setHolidayGuests(Math.min(15, holidayGuests + 1))
                            }
                          >
                            <i className="fa-solid fa-plus fs-10"></i>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowHolidayGuests(false)}
                        className="btn btn-primary btn-sm w-100 fw-bold py-2 mt-2 text-uppercase fs-8"
                      >
                        Apply Config
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Contact Number Card (Only visible when Holidays Enquiry is active) */}
                {holidayMode === "enquiry" && (
                  <div className="leh-input-card">
                    <div className="leh-input-card-header">
                      <span className="leh-input-card-label">
                        Contact Number
                      </span>
                    </div>
                    <div className="leh-inner-box">
                      <input
                        type="tel"
                        className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                        placeholder="Contact No."
                        value={holidayPhone}
                        onChange={(e) =>
                          setHolidayPhone(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={10}
                        required
                      />
                    </div>
                    <span className="leh-input-card-subtext">
                      Verification Contact
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BUSES TAB */}
          {activeTab === "bus" && (
            <div>
              {/* Bus Sub-tabs Toggles */}
              <div className="leh-service-toggle-container">
                <button
                  type="button"
                  onClick={() => setBusMode("enquiry")}
                  className={`leh-toggle-pill ${busMode === "enquiry" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Bus Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setBusMode("booking")}
                  className={`leh-toggle-pill ${busMode === "booking" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Bus Booking
                </button>
              </div>

              {/* 5 Standalone Cards layout */}
              <div className="leh-input-card-grid">
                {/* 1. From City Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">From City</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Enter City
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 p-0 leh-input-card-bold bg-transparent leh-style-auto-1020"
                      value={busFromCity}
                      onChange={(e) => setBusFromCity(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">Departure city</span>
                </div>

                {/* 2. To City Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">To City</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Enter City
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 p-0 leh-input-card-bold bg-transparent leh-style-auto-1020"
                      value={busToCity}
                      onChange={(e) => setBusToCity(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Destination city
                  </span>
                </div>

                {/* 3. Journey Date Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("busdep")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Journey Date</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Date{" "}
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </span>
                    <div className="leh-input-card-bold">{busJourneyDate}</div>
                  </div>
                  <span className="leh-input-card-subtext">
                    {busJourneyDay}
                  </span>

                  {openPicker === "busdep" && (
                    <div
                      className="leh-datetime-picker leh-style-auto-1005"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left leh-style-auto-1006">
                        <div className="leh-datepicker-header">
                          <span>July 2026</span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          <span></span>
                          <span></span>
                          <span></span>
                          {Array.from({ length: 31 }, (_, idx) => idx + 1).map(
                            (day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("busdep") ? "active" : ""}`}
                                onClick={() => {
                                  setBusJourneyDate(`${day} Jul'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (3 + day - 1) % 7;
                                  setBusJourneyDay(daysOfWeek[dayNameIndex]);
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="leh-datepicker-footer">
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setBusJourneyDate("");
                              setBusJourneyDay("");
                              setOpenPicker(null);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setBusJourneyDate("22 Jul'26");
                              setBusJourneyDay("Wednesday");
                              setOpenPicker(null);
                            }}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Bus Type Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Bus Type</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={busType}
                      onChange={(e) => setBusType(e.target.value)}
                    >
                      <option value="All Buses">All Buses</option>
                      <option value="AC Sleeper">AC Sleeper</option>
                      <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                      <option value="AC Seater">AC Seater</option>
                      <option value="Luxury Mercedes">Luxury Mercedes</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Seat / Coach choice
                  </span>
                </div>

                {/* 5. Passengers Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Passengers</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={busPassengers}
                      onChange={(e) =>
                        setBusPassengers(parseInt(e.target.value))
                      }
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                      <option value="5">5 Passengers</option>
                      <option value="6">6 Passengers</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Count selection
                  </span>
                </div>
              </div>

              {/* Extra Bus Enquiry Fields (Visible only in Enquiry Mode) */}
              {busMode === "enquiry" && (
                <div className="mt-4 p-3 border rounded bg-light">
                  <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">
                    Bus Enquiry Additional Details
                  </h6>

                  {/* Row 1: Full Name, Mobile, Email */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-4 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Full Name"
                        value={busFullName}
                        onChange={(e) => setBusFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="9876543210"
                        value={busMobile}
                        onChange={(e) =>
                          setBusMobile(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="col-md-4 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="example@gmail.com"
                        value={busEmail}
                        onChange={(e) => setBusEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Boarding Point, Special Requirements */}
                  <div className="row g-3">
                    <div className="col-md-6 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Boarding Point (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Boarding Point"
                        value={busBoarding}
                        onChange={(e) => setBusBoarding(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Special Requirements
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sleeper / Window Seat / Ladies Seat"
                        value={busSpecial}
                        onChange={(e) => setBusSpecial(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRAINS TAB */}
          {activeTab === "train" && (
            <div>
              {/* Train Sub-tabs Toggles */}
              <div className="leh-service-toggle-container">
                <button
                  type="button"
                  onClick={() => setTrainMode("enquiry")}
                  className={`leh-toggle-pill ${trainMode === "enquiry" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Train Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setTrainMode("booking")}
                  className={`leh-toggle-pill ${trainMode === "booking" ? "leh-toggle-pill-active" : "leh-toggle-pill-inactive"}`}
                >
                  Train Booking
                </button>
              </div>

              {/* 5 Standalone Cards layout */}
              <div className="leh-input-card-grid">
                {/* 1. From Station Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">From Station</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Enter Station
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 p-0 leh-input-card-bold bg-transparent leh-style-auto-1020"
                      value={trainFromStation}
                      onChange={(e) => setTrainFromStation(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Origin board station
                  </span>
                </div>

                {/* 2. To Station Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">To Station</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Enter Station
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 p-0 leh-input-card-bold bg-transparent leh-style-auto-1020"
                      value={trainToStation}
                      onChange={(e) => setTrainToStation(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Destination station
                  </span>
                </div>

                {/* 3. Journey Date Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("traindep")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Journey Date</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Date{" "}
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </span>
                    <div className="leh-input-card-bold">
                      {trainJourneyDate}
                    </div>
                  </div>
                  <span className="leh-input-card-subtext">
                    {trainJourneyDay}
                  </span>

                  {openPicker === "traindep" && (
                    <div
                      className="leh-datetime-picker leh-style-auto-1005"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left leh-style-auto-1006">
                        <div className="leh-datepicker-header">
                          <span>July 2026</span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          <span></span>
                          <span></span>
                          <span></span>
                          {Array.from({ length: 31 }, (_, idx) => idx + 1).map(
                            (day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("traindep") ? "active" : ""}`}
                                onClick={() => {
                                  setTrainJourneyDate(`${day} Jul'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (3 + day - 1) % 7;
                                  setTrainJourneyDay(daysOfWeek[dayNameIndex]);
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="leh-datepicker-footer">
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setTrainJourneyDate("");
                              setTrainJourneyDay("");
                              setOpenPicker(null);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="leh-datepicker-footer-btn"
                            onClick={() => {
                              setTrainJourneyDate("22 Jul'26");
                              setTrainJourneyDay("Wednesday");
                              setOpenPicker(null);
                            }}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Travel Class Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Travel Class</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={trainTravelClass}
                      onChange={(e) => setTrainTravelClass(e.target.value)}
                    >
                      <option value="All Classes">All Classes</option>
                      <option value="Sleeper Class (SL)">
                        Sleeper Class (SL)
                      </option>
                      <option value="Third AC (3A)">Third AC (3A)</option>
                      <option value="Second AC (2A)">Second AC (2A)</option>
                      <option value="First AC (1A)">First AC (1A)</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Class of travel
                  </span>
                </div>

                {/* 5. Quota Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Quota</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={trainQuota}
                      onChange={(e) => setTrainQuota(e.target.value)}
                    >
                      <option value="General">General</option>
                      <option value="Ladies">Ladies</option>
                      <option value="Tatkal">Tatkal</option>
                      <option value="Senior Citizen">Senior Citizen</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Quota reservation
                  </span>
                </div>
              </div>

              {/* Extra Train Enquiry Fields (Visible only in Enquiry Mode) */}
              {trainMode === "enquiry" && (
                <div className="mt-4 p-3 border rounded bg-light">
                  <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">
                    Train Enquiry Additional Details
                  </h6>

                  {/* Row 1: Passenger Name, Mobile, Email */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-4 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Passenger Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Full Name"
                        value={trainPassengerName}
                        onChange={(e) => setTrainPassengerName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="9876543210"
                        value={trainMobileNum}
                        onChange={(e) =>
                          setTrainMobileNum(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="col-md-4 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="example@gmail.com"
                        value={trainEmailId}
                        onChange={(e) => setTrainEmailId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Preferred Train, Special Requirement */}
                  <div className="row g-3">
                    <div className="col-md-6 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Preferred Train (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rajdhani Express"
                        value={trainPreferredExpress}
                        onChange={(e) =>
                          setTrainPreferredExpress(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 text-start">
                      <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                        Special Requirement
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Lower Berth / Wheelchair / Other"
                        value={trainSpecialBerth}
                        onChange={(e) => setTrainSpecialBerth(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISA TAB */}
          {activeTab === "visa" && (
            <div>
              {/* Top 4 separate cards grid */}
              <div className="leh-input-card-grid">
                {/* 1. Destination Country Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      Destination Country
                    </span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <LocationAutocomplete
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      placeholder="Search Country"
                      value={visaCountry}
                      onChange={setVisaCountry}
                    />
                  </div>
                  <span className="leh-input-card-subtext">Visa location</span>
                </div>

                {/* 2. Visa Type Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Visa Type</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={visaTypeSelected}
                      onChange={(e) => setVisaTypeSelected(e.target.value)}
                    >
                      <option value="Select Visa Type">Select Visa Type</option>
                      <option value="Tourist Visa">Tourist Visa</option>
                      <option value="Business Visa">Business Visa</option>
                      <option value="Student Visa">Student Visa</option>
                      <option value="Transit Visa">Transit Visa</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Type of visa needed
                  </span>
                </div>

                {/* 3. Expected Travel Date Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("visatravel")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      Expected Travel Date
                    </span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Date{" "}
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </span>
                    <div className="leh-input-card-bold">{visaTravelDate}</div>
                  </div>
                  <span className="leh-input-card-subtext">
                    {visaTravelDay}
                  </span>

                  {openPicker === "visatravel" && (
                    <div
                      className="leh-datetime-picker leh-style-auto-1005"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left leh-style-auto-1006">
                        <div className="leh-datepicker-header">
                          <span>July 2026</span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          <span></span>
                          <span></span>
                          <span></span>
                          {Array.from({ length: 31 }, (_, idx) => idx + 1).map(
                            (day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("visatravel") ? "active" : ""}`}
                                onClick={() => {
                                  setVisaTravelDate(`${day} Jul'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (3 + day - 1) % 7;
                                  setVisaTravelDay(daysOfWeek[dayNameIndex]);
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Number of Applicants Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      Number of Applicants
                    </span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={visaApplicants}
                      onChange={(e) =>
                        setVisaApplicants(parseInt(e.target.value))
                      }
                    >
                      <option value="1">1 Applicant</option>
                      <option value="2">2 Applicants</option>
                      <option value="3">3 Applicants</option>
                      <option value="4">4 Applicants</option>
                      <option value="5">5+ Applicants</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Total travellers count
                  </span>
                </div>
              </div>

              {/* Bottom Visa Enquiry Form Fields */}
              <div className="mt-4 p-3 border rounded bg-light">
                <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">
                  Visa Enquiry Form
                </h6>

                {/* Row 1: Full Name, Mobile, Email */}
                <div className="row g-3 mb-3">
                  <div className="col-md-4 text-start">
                    <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Full Name"
                      value={visaFullName}
                      onChange={(e) => setVisaFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 text-start">
                    <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 9876543210"
                      value={visaMobileNum}
                      onChange={(e) =>
                        setVisaMobileNum(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="col-md-4 text-start">
                    <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="example@gmail.com"
                      value={visaEmailAddress}
                      onChange={(e) => setVisaEmailAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Passport Number, Passport Expiry Date, City */}
                <div className="row g-3 mb-3">
                  <div className="col-md-4 text-start">
                    <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Passport Number"
                      value={visaPassportNum}
                      onChange={(e) => setVisaPassportNum(e.target.value)}
                      required
                    />
                  </div>
                  <div
                    className="col-md-4 text-start position-relative"
                    onClick={() => setOpenPicker("visapassport")}
                  >
                    <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                      Passport Expiry Date
                    </label>
                    <div className="form-control bg-white d-flex justify-content-between align-items-center cursor-pointer">
                      <span>{visaPassportExpiryDate}</span>
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </div>

                    {openPicker === "visapassport" && (
                      <div
                        className="leh-datetime-picker leh-style-auto-1023"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="leh-datepicker-left leh-style-auto-1006">
                          <div className="leh-datepicker-header">
                            <span>July 2036</span>
                            <div>
                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                              >
                                <i className="fa-solid fa-chevron-up"></i>
                              </button>
                              <button
                                type="button"
                                className="leh-datepicker-arrow-btn"
                              >
                                <i className="fa-solid fa-chevron-down"></i>
                              </button>
                            </div>
                          </div>
                          <div className="leh-calendar-grid-weekdays">
                            <span>Su</span>
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                          </div>
                          <div className="leh-calendar-grid-days">
                            <span></span>
                            <span></span>
                            {Array.from(
                              { length: 31 },
                              (_, idx) => idx + 1,
                            ).map((day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("visapassport") ? "active" : ""}`}
                                onClick={() => {
                                  setVisaPassportExpiryDate(`${day} Jul'36`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (2 + day - 1) % 7;
                                  setVisaPassportExpiryDay(
                                    daysOfWeek[dayNameIndex],
                                  );
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 text-start">
                    <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your City"
                      value={visaCity}
                      onChange={(e) => setVisaCity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Additional Requirements */}
                <div className="text-start">
                  <label className="form-label fw-bold text-secondary mb-1 leh-style-auto-1022">
                    Additional Requirements
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Write your visa enquiry or special requirements..."
                    value={visaAdditionalRequirements}
                    onChange={(e) =>
                      setVisaAdditionalRequirements(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* INSURANCE TAB - ONLY ENQUIRY MODE (NO TOGGLES) */}
          {activeTab === "insurance" && (
            <div>
              {/* Row 1: Vehicle Details (5 Cards) */}
              <div className="leh-input-card-grid mb-3">
                {/* 1. Car Registration Number Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      Car Registration Number
                    </span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      RJ14AB1234
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 p-0 leh-input-card-bold bg-transparent leh-style-auto-1020"
                      value={insRegNum}
                      onChange={(e) => setInsRegNum(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Registration code
                  </span>
                </div>

                {/* 2. Car Brand Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Car Brand</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={insBrand}
                      onChange={(e) => setInsBrand(e.target.value)}
                    >
                      <option value="Select Brand">Select Brand</option>
                      <option value="Maruti Suzuki">Maruti Suzuki</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Tata Motors">Tata Motors</option>
                      <option value="Mahindra">Mahindra</option>
                      <option value="Honda">Honda</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">Vehicle maker</span>
                </div>

                {/* 3. Car Model Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Car Model</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={insModel}
                      onChange={(e) => setInsModel(e.target.value)}
                    >
                      <option value="Select Model">Select Model</option>
                      <option value="Swift">Swift</option>
                      <option value="i20">i20</option>
                      <option value="Nexon">Nexon</option>
                      <option value="Thar">Thar</option>
                      <option value="City">City</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Vehicle model type
                  </span>
                </div>

                {/* 4. Fuel Type Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Fuel Type</span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={insFuelType}
                      onChange={(e) => setInsFuelType(e.target.value)}
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Engine fuel category
                  </span>
                </div>

                {/* 5. Manufacturing Year Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      Manufacturing Year
                    </span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={insMfgYear}
                      onChange={(e) => setInsMfgYear(e.target.value)}
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">Year built</span>
                </div>
              </div>

              {/* Row 2: Policy & Contact Details */}
              <div className="leh-input-card-grid mb-4">
                {/* 5.5 Full Name Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Full Name</span>
                  </div>
                  <div className="leh-inner-box">
                    <input
                      type="text"
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      placeholder="e.g. John Doe"
                      value={insFullName}
                      onChange={(e) => setInsFullName(e.target.value)}
                    />
                  </div>
                  <span className="leh-input-card-subtext">Owner's Name</span>
                </div>

                {/* 6. Existing Policy Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      Existing Policy
                    </span>
                  </div>
                  <div className="leh-inner-box leh-style-auto-1021">
                    <select
                      className="border-0 p-0 fw-bold text-dark bg-transparent w-100 leh-style-auto-1002"
                      value={insExistingPolicy}
                      onChange={(e) => setInsExistingPolicy(e.target.value)}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <span className="leh-input-card-subtext">
                    Previous cover status
                  </span>
                </div>

                {/* 7. Policy Expiry Date Card */}
                <div
                  className="leh-input-card position-relative"
                  onClick={() => setOpenPicker("insexpiry")}
                >
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">
                      Policy Expiry Date
                    </span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      Date{" "}
                      <i className="fa-regular fa-calendar-days text-muted fs-7"></i>
                    </span>
                    <div className="leh-input-card-bold">{insExpiryDate}</div>
                  </div>
                  <span className="leh-input-card-subtext">{insExpiryDay}</span>

                  {openPicker === "insexpiry" && (
                    <div
                      className="leh-datetime-picker leh-style-auto-1005"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="leh-datepicker-left leh-style-auto-1006">
                        <div className="leh-datepicker-header">
                          <span>July 2026</span>
                          <div>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              className="leh-datepicker-arrow-btn"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        </div>
                        <div className="leh-calendar-grid-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="leh-calendar-grid-days">
                          <span></span>
                          <span></span>
                          <span></span>
                          {Array.from({ length: 31 }, (_, idx) => idx + 1).map(
                            (day) => (
                              <span
                                key={day}
                                className={`leh-calendar-day-cell ${day === getActiveDayNum("insexpiry") ? "active" : ""}`}
                                onClick={() => {
                                  setInsExpiryDate(`${day} Jul'26`);
                                  const daysOfWeek = [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ];
                                  const dayNameIndex = (3 + day - 1) % 7;
                                  setInsExpiryDay(daysOfWeek[dayNameIndex]);
                                  setOpenPicker(null);
                                }}
                              >
                                {day}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. Mobile Number Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Mobile Number</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      9876543210
                    </span>
                    <input
                      type="tel"
                      className="form-control border-0 p-0 leh-input-card-bold bg-transparent leh-style-auto-1020"
                      value={insMobile}
                      onChange={(e) =>
                        setInsMobile(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={10}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Verification Contact
                  </span>
                </div>

                {/* 9. Email Address Card */}
                <div className="leh-input-card">
                  <div className="leh-input-card-header">
                    <span className="leh-input-card-label">Email Address</span>
                  </div>
                  <div>
                    <span className="leh-input-card-placeholder">
                      example@gmail.com
                    </span>
                    <input
                      type="email"
                      className="form-control border-0 p-0 leh-input-card-bold bg-transparent leh-style-auto-1020"
                      value={insEmail}
                      onChange={(e) => setInsEmail(e.target.value)}
                      required
                    />
                  </div>
                  <span className="leh-input-card-subtext">
                    Notification Email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            type="submit"
            className="leh-search-btn-floating"
            disabled={isSearching}
          >
            {isSearching ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : activeTab === "cabs" && cabMode === "enquiry" ? (
              "Submit Enquiry"
            ) : activeTab === "hotels" && hotelMode === "enquiry" ? (
              "Submit Enquiry"
            ) : activeTab === "flights" && flightMode === "enquiry" ? (
              "Submit Enquiry"
            ) : activeTab === "holidays" && holidayMode === "enquiry" ? (
              "Submit Enquiry"
            ) : activeTab === "bus" && busMode === "enquiry" ? (
              "Submit Enquiry"
            ) : activeTab === "train" && trainMode === "enquiry" ? (
              "Submit Enquiry"
            ) : activeTab === "visa" ? (
              "Submit Visa Enquiry"
            ) : activeTab === "insurance" ? (
              "Submit Insurance Enquiry"
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
