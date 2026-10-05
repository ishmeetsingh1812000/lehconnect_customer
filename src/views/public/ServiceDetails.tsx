'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBooking } from '../../context/BookingContext';

const serviceData = {
  cabs: {
    serviceKey: 'cabs',
    title: "Taxi Booking",
    subtitle: "(Local / Outstation / One-way)",
    tagline: "Comfortable and well-maintained taxis for LehConnect & outstation journeys.",
    heroImg: "/images/services/cab-services-hero.webp",
    pricing: "Starts from ₹2,500/day",
    bookingRoute: "/cabs",
    badge: "COMFORT • SAFETY • RELIABILITY",
    subBadges: [
      { text: "Verified Drivers" },
      { text: "24/7 Support" },
      { text: "Sanitized Cabs" },
      { text: "Best Price Guarantee" }
    ],
    overviewText: "LehConnect offers a premium fleet of Sedans, SUVs, and MUVs tailored for rugged mountain terrains. Whether you need local airport transfers in Leh, sightseeing tours to Pangong Lake, or outstation journeys to Manali and Srinagar, our verified local drivers ensure a safe and memorable trip.",
    categories: [
      { name: "Sedan", desc: "Comfortable", img: "/images/fleet/cab-sedan-dzire.webp" },
      { name: "SUV", desc: "Spacious", img: "/images/fleet/cab-mahindra-xuv700.webp" },
      { name: "MUV", desc: "Group Travel", img: "/images/fleet/cab-toyota-innova.webp" },
      { name: "Tempo Traveller", desc: "Large Groups", img: "/images/fleet/cab-tempo-traveller.webp" }
    ],
    benefits: [
      { num: "01", icon: "fa-solid fa-mountain", title: "Mountain Experienced Drivers", desc: "Our drivers are locals who know the steep slopes and tricky terrains of Ladakh perfectly." },
      { num: "02", icon: "fa-solid fa-car", title: "Diverse Car Fleet", desc: "Choose from budget hatchbacks to premium SUVs like Scorpio-N, Innova Crysta, and Fortuner." },
      { num: "03", icon: "fa-solid fa-credit-card", title: "No Hidden Costs", desc: "Pricing includes fuel, state taxes, toll gates, and driver allowance upfront." },
      { num: "04", icon: "fa-solid fa-sliders", title: "Flexible & Customizable", desc: "Customize your itinerary and travel at your own pace with complete flexibility." }
    ],
    coreFeatures: [
      "AC/Non-AC vehicle selector options",
      "Carrier for heavy luggage bags",
      "24/7 helpline and backup vehicle assurance",
      "One-way drops to Srinagar and Manali",
      "Airport pickup & drop",
      "Inner line permit support for restricted areas"
    ],
    stats: {
      leftNum: "500+",
      leftText: "Verified Drivers",
      midNum: "10,000+",
      midText: "Happy Travelers",
      rightNum: "4.8",
      rightText: "Average Rating",
      img: "/images/common/scenic-mountain-valley.webp"
    },
    faqs: [
      { q: "Is AC available in cabs in Ladakh?", a: "Yes, AC is available on flat highway routes, but it is recommended to turn it off on steep mountain ascents to avoid engine strain." },
      { q: "Are driver charges included in the price?", a: "Yes! All prices listed include driver allowance, fuel, tolls, and parking fees." },
      { q: "Is fuel included in the package?", a: "Yes, fuel charges are completely included in the daily pricing package." },
      { q: "Can I customize my itinerary?", a: "Absolutely! You can customize your tour routes and add stopovers as you prefer." }
    ]
  },
  hotels: {
    serviceKey: 'hotels',
    title: "Hotel Booking",
    subtitle: "(Boutique Resorts / Homestays / Luxury)",
    tagline: "Easy hotel booking with verified stays, boutique resorts, and premium amenities.",
    heroImg: "/images/booking/hotel-luxury-resort.webp",
    pricing: "Starts from ₹1,800/night",
    bookingRoute: "/hotels",
    badge: "HEATING • OXYGEN • HYGIENE",
    subBadges: [
      { text: "Verified Rooms" },
      { text: "Oxygen Support" },
      { text: "Traditional Food" },
      { text: "Best View Guarantee" }
    ],
    overviewText: "From luxury boutique resorts in Leh to cozy lakeside homestays near Pangong Tso, LehConnect offers handpicked accommodations with verified high-altitude amenities like oxygen support, 24/7 central heating, and authentic Ladakhi hospitality.",
    categories: [
      { name: "Homestays", desc: "Cozy local vibes", img: "/images/booking/hotel-homestay-cozy.webp" },
      { name: "Budget Hotels", desc: "Clean & Affordable", img: "/images/booking/hotel-budget-clean.webp" },
      { name: "Deluxe Stays", desc: "Modern Comforts", img: "/images/booking/hotel-deluxe-comfort.webp" },
      { name: "Luxury Resorts", desc: "Elite Wilderness", img: "/images/booking/hotel-luxury-resort.webp" }
    ],
    benefits: [
      { num: "01", icon: "fa-solid fa-mountain", title: "Oxygen Assistance", desc: "Flagship hotels are equipped with oxygen cylinders and doctors on call for high-altitude acclimatization." },
      { num: "02", icon: "fa-solid fa-hotel", title: "Verified Clean Stays", desc: "Every hotel undergoes a rigorous quality check for heating, clean bedsheets, and warm blankets." },
      { num: "03", icon: "fa-solid fa-utensils", title: "Traditional Food", desc: "Enjoy locally sourced Ladakhi dishes alongside standard Indian and continental buffet options." },
      { num: "04", icon: "fa-solid fa-circle-check", title: "Hassle-free Booking", desc: "Instant reservation confirmation with safe online payments and easy modification support." }
    ],
    coreFeatures: [
      "Centralized heating system facilities",
      "Doctor on call and oxygen cylinder support",
      "Panoramic Himalayan mountain viewpoints",
      "Free high-speed WiFi networks in main lobbies",
      "24/7 hot water supply",
      "Complimentary breakfast options"
    ],
    stats: {
      leftNum: "200+",
      leftText: "Verified Stays",
      midNum: "15,000+",
      midText: "Happy Guests",
      rightNum: "4.7",
      rightText: "Average Rating",
      img: "/images/booking/hotel-luxury-resort.webp"
    },
    faqs: [
      { q: "Do hotels have running hot water 24/7?", a: "Most of our verified luxury and deluxe hotels provide hot water throughout the day. Budget homestays provide hot water during specific morning/evening hours." },
      { q: "Is oxygen assistance available at the hotels?", a: "Yes, all our partner properties in Leh, Nubra, and Pangong maintain oxygen equipment for guests." },
      { q: "Do you have parking facilities?", a: "Yes, all resorts and hotels have dedicated spaces for guest vehicles." },
      { q: "Is buffet breakfast included?", a: "Yes, standard deluxe bookings come with hot breakfast buffets included." }
    ]
  },
  flights: {
    serviceKey: 'flights',
    title: "Flight Booking",
    subtitle: "(Domestic Routes / International / Deals)",
    tagline: "Find, compare, and book domestic or international flights to LehConnect quickly.",
    heroImg: "/images/services/flight-services-hero.webp",
    pricing: "Starts from ₹4,500/seat",
    bookingRoute: "/flights",
    badge: "SPEED • SECURITY • EFFICIENCY",
    subBadges: [
      { text: "All Airlines Covered" },
      { text: "Instant E-Tickets" },
      { text: "Corporate Discounts" },
      { text: "24/7 Alert System" }
    ],
    overviewText: "Book flights to Leh Kushok Bakula Rimpochee Airport (IXL) from Delhi, Mumbai, Jammu, or Srinagar. Secure extra cashbacks and get real-time price drops alerts through our airline partners.",
    categories: [
      { name: "Economy", desc: "Budget Friendly", img: "/images/services/flight-economy-class.webp" },
      { name: "Premium Eco", desc: "More Legroom", img: "/images/flights/airline-indigo.webp" },
      { name: "Business Class", desc: "Premium Comfort", img: "/images/services/flight-business-class.webp" },
      { name: "Private Charter", desc: "Custom Routes", img: "/images/flights/airline-vistara.webp" }
    ],
    benefits: [
      { num: "01", icon: "fa-solid fa-plane", title: "Best Fare Guarantee", desc: "Compare multiple airlines (Air India, IndiGo, SpiceJet) to secure the lowest rates." },
      { num: "02", icon: "fa-solid fa-ticket", title: "Hassle-free Cancellation", desc: "Get direct support and quick refunds with our flexible cancellation packages." },
      { num: "03", icon: "fa-solid fa-bell", title: "High Altitude Flight Advice", desc: "Receive automated alerts about weather conditions and acclimatization checklists before boarding." },
      { num: "04", icon: "fa-solid fa-lock", title: "Safe & Secure Checkout", desc: "Multiple direct payment options with state of the art encryption gateway standards." }
    ],
    coreFeatures: [
      "IndiGo, Air India, and SpiceJet flight networks",
      "Real-time fare alerts and price-lock facility",
      "Special discounts on connecting routes to Leh (IXL)",
      "Instant e-ticket generation and WhatsApp delivery",
      "24/7 flight delay rescheduling assistance",
      "Complimentary baggage allowance upgrades on select routes"
    ],
    stats: {
      leftNum: "50K+",
      leftText: "Tickets Booked",
      midNum: "99.2%",
      midText: "On-time Support",
      rightNum: "4.9",
      rightText: "Customer Rating",
      img: "/images/services/flight-services-hero.webp"
    },
    faqs: [
      { q: "Which airlines operate direct flights to Leh?", a: "Air India, IndiGo, and SpiceJet operate daily direct flights to Leh (IXL) from Delhi, Mumbai, and Srinagar." },
      { q: "Can I reschedule my flight ticket?", a: "Yes, date changes and cancellations can be managed directly via your LehConnect dashboard under My Bookings." },
      { q: "Is baggage allowance included in the fare?", a: "Standard economy fares include 15kg check-in and 7kg cabin baggage. Extra baggage can be added during checkout." },
      { q: "What precautions should I take when landing in Leh?", a: "Rest for the first 24-48 hours to acclimatize properly to Leh's high altitude (3,500m) and stay hydrated." }
    ]
  },
  insurance: {
    serviceKey: 'insurance',
    title: "Travel Insurance",
    subtitle: "(High Altitude Medical / Trip Evacuation / Baggage)",
    tagline: "Comprehensive travel insurance covering high-altitude medical emergency and acute mountain sickness evacuation.",
    heroImg: "/images/services/insurance-services-hero.webp",
    pricing: "Starts from ₹199/trip",
    bookingRoute: "/dashboard",
    badge: "ALTITUDE • RESCUE • CASHLESS",
    subBadges: [
      { text: "AMS Emergency Cover" },
      { text: "Helicopter Evacuation" },
      { text: "Lost Baggage Recover" },
      { text: "Cashless Hospitals" }
    ],
    overviewText: "Mountain travel comes with unpredictable weather and altitude challenges. Protect your trip with LehConnect Comprehensive Travel Insurance covering medical emergencies, acute mountain sickness evacuations, trip delays, and lost baggage.",
    categories: [
      { name: "Single Trip", desc: "Individual Cover", img: "/images/banners/promo-flight-discount.webp" },
      { name: "Multi-Trip", desc: "Annual Coverage", img: "/images/banners/promo-flight-discount.webp" },
      { name: "Trek Guard", desc: "High Altitude Rescue", img: "/images/services/insurance-services-hero.webp" },
      { name: "Group Cover", desc: "Team Travel Plans", img: "/images/banners/promo-flight-discount.webp" }
    ],
    benefits: [
      { num: "01", icon: "fa-solid fa-hospital", title: "Altitude Illness Coverage", desc: "Includes medical expenses and emergency helicopter evacuation for Acute Mountain Sickness (AMS)." },
      { num: "02", icon: "fa-solid fa-briefcase", title: "Baggage & Delay Guard", desc: "Compensation for delayed flight transits or lost/stolen luggage during sightseeing trips." },
      { num: "03", icon: "fa-solid fa-credit-card", title: "Cashless Hospitalizations", desc: "Assurance of cashless emergency treatments in partner medical hospitals." },
      { num: "04", icon: "fa-solid fa-file-invoice", title: "Digital Policy Delivery", desc: "Instant policy verification document sent directly to your phone and email inbox." }
    ],
    coreFeatures: [
      "Helicopter rescue evacuation support",
      "Trip delay and stay cancellation covers",
      "Loss of documents (Passport/Aadhaar) insurance guards",
      "Instant quote calculator and digital policy delivery",
      "Coverage for trekking up to 5,500m",
      "24/7 global claim assistance support line"
    ],
    stats: {
      leftNum: "₹10L+",
      leftText: "Claims Settled",
      midNum: "99.8%",
      midText: "Claim Ratio",
      rightNum: "4.8",
      rightText: "Average Rating",
      img: "/images/services/insurance-services-hero.webp"
    },
    faqs: [
      { q: "Does the policy cover trekking above 3,000 meters?", a: "Yes, our specific mountain travel insurance covers emergency evacuations up to 5,500 meters altitude." },
      { q: "How do I file an insurance claim?", a: "You can file a claim directly from your LehConnect Dashboard under Active Bookings or call our 24/7 toll-free helpline." },
      { q: "Is cashless medical benefit active in Leh?", a: "Yes, we have tie-ups with major hospitals in Leh for instant cashless emergency claims." },
      { q: "What is the policy duration limit?", a: "Policies can be purchased from 1 day up to 180 days based on your travel schedule." }
    ]
  },
  holidays: {
    serviceKey: 'holidays',
    title: "Tour Packages",
    subtitle: "(Ladakh Guide / Bike Tours / Camping)",
    tagline: "Book amazing Himalayan tour packages for a comfortable, guide-assisted travel experience.",
    heroImg: "/images/common/scenic-himalayan-road.webp",
    pricing: "Starts from ₹12,999/person",
    bookingRoute: "/holidays",
    badge: "PERMITS • COMMUTE • COMFORT",
    subBadges: [
      { text: "Inner Line Permits" },
      { text: "Cozy Camping/Stays" },
      { text: "Verified Local Guides" },
      { text: "Oxygen Backups" }
    ],
    overviewText: "Explore the magic of Ladakh, Nubra Valley, Pangong Lake, and Zanskar with our pre-planned and customizable tour packages. Packages include accommodation, local cabs, permit processing, sightseeing entry tickets, and professional tour guides.",
    categories: [
      { name: "Family Packages", desc: "Comfortable Sightseeing", img: "/images/holidays/kashmir.webp" },
      { name: "Couple Packages", desc: "Romantic Escapes", img: "/images/holidays/goa.webp" },
      { name: "Group Tours", desc: "Adventure Expeditions", img: "/images/holidays/himachal.webp" },
      { name: "Bike Expeditions", desc: "Enfield Ride Tours", img: "/images/common/scenic-himalayan-road.webp" }
    ],
    benefits: [
      { num: "01", icon: "fa-solid fa-map-location-dot", title: "Inner Line Permits Included", desc: "We take care of all permit filings (Nubra, Pangong, Tso Moriri) before you arrive in Leh." },
      { num: "02", icon: "fa-solid fa-motorcycle", title: "Customizable Itineraries", desc: "Modify sightseeing stays, add camp nights, or choose bike tours according to your pace." },
      { num: "03", icon: "fa-solid fa-mountain", title: "Experienced Tour Guides", desc: "Travel with friendly local guides who share cultural insights and historical stories." },
      { num: "04", icon: "fa-solid fa-briefcase", title: "All Inclusive Combos", desc: "Covers local transport cabs, verified hotel/camp stays, entry tickets, and permits." }
    ],
    coreFeatures: [
      "Inner Line Permit (ILP) filing assistance",
      "Stay, transport, and sightseeing combos",
      "Custom bike expedition tour itineraries",
      "Complimentary oxygen backup in backup vehicles",
      "Bilingual local Ladakhi tour guides",
      "24/7 emergency tourist support helpline"
    ],
    stats: {
      leftNum: "50+",
      leftText: "Custom Packages",
      midNum: "8,000+",
      midText: "Guided Tours",
      rightNum: "4.9",
      rightText: "Average Rating",
      img: "/images/common/scenic-himalayan-road.webp"
    },
    faqs: [
      { q: "Are entry fees to monasteries included?", a: "Yes, all our standard packages include permit fees, green taxes, and monastery/monument entrance tickets." },
      { q: "Can we book a bike trip package?", a: "Absolutely! We customize bike expedition tours with Royal Enfield 500cc bikes, backup mechanics, and safety vehicles." },
      { q: "What is the best season for Ladakh tour packages?", a: "The best travel season is from mid-May through October when land routes are fully open and operational." },
      { q: "Is hot water available in luxury camps?", a: "Yes! Our partner luxury camps provide hot running water or hot water buckets daily." }
    ]
  }
};

export const ServiceDetails = ({ serviceId: propServiceId }) => {
  const params = useParams();
  const router = useRouter();
  const serviceId = propServiceId || params?.serviceId;
  const { setActiveTab } = useBooking();
  const [activeFaq, setActiveFaq] = React.useState(null);

  const data = serviceData[serviceId] || serviceData.cabs;

  const handleBookNow = () => {
    setActiveTab(serviceId);
    router.push(data.bookingRoute);
  };

  return (
    <div className="bg-light min-vh-100 pb-5">


      {/* Hero Section */}
      <div className="position-relative overflow-hidden text-white leh-style-auto-1222">
        <img src={data.heroImg} 
          alt="Hero Background" 
          className="position-absolute start-0 top-0 w-100 h-100 opacity-20 object-fit-cover leh-hero-blend-overlay"
        loading="lazy" decoding="async" />
        <div className="container position-relative leh-style-auto-1080">
          <div className="row g-4 align-items-center">
            
            {/* Left Column: Title & Subtitle */}
            <div className="col-lg-8 text-start">
              <span className="d-inline-block px-3 py-1 rounded-pill mb-3 fw-bold fs-9 text-uppercase tracking-wider leh-style-auto-1223">
                {data.badge}
              </span>
              <h1 className="fw-black text-white mb-2 leh-style-auto-1224">
                {data.title}
              </h1>
              <h3 className="fw-bold mb-3 leh-style-auto-1225">
                {data.subtitle}
              </h3>
              <p className="text-white-50 fs-6 mb-4 leh-style-auto-1226">
                {data.tagline}
              </p>

              {/* Sub Badges inline wrapper */}
              <div className="d-flex flex-wrap gap-2 mt-4">
                {data.subBadges.map((badge, idx) => (
                  <span key={idx} className="d-flex align-items-center gap-2 px-3 py-1_5 rounded-pill border fs-8 text-white-50 leh-style-auto-1227">
                    <i className="fa-solid fa-star text-warning fs-9 me-1"></i> {badge.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Estimated Cost Overlapping Card */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg p-4 bg-white text-dark text-start leh-style-auto-1228">
                <span className="text-muted fw-bold fs-9 text-uppercase tracking-wider">ESTIMATED COST</span>
                <span className="text-muted fs-8 mt-1">Starts from</span>
                <h2 className="fw-bold   my-1 leh-style-auto-1229">
                  {data.pricing.split('from ')[1] || data.pricing}
                </h2>
                <p className="text-muted fs-9 mb-4 leh-style-auto-1105">
                  Pricing depends on seasonal demands, permit taxes, and route specifications.
                </p>
                
                <button onClick={handleBookNow} className="btn w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm transition-all text-dark leh-style-auto-1230">
                  PROCEED TO BOOKING <span><i className="fa-solid fa-arrow-right ms-1"></i></span>
                </button>

                <div className="d-flex flex-column gap-3 mt-4 border-top pt-4">
                  <div className="d-flex align-items-center gap-2 text-muted fs-8">
                    <i className="fa-solid fa-shield-halved   fs-7"></i>
                    <span className="fw-semibold text-secondary">100% Safe & Secure Payments</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted fs-8">
                    <i className="fa-solid fa-map-location-dot   fs-7"></i>
                    <span className="fw-semibold text-secondary">Customizable Himalayan Itineraries</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Overview & Sub-categories Row */}
      <div className="container leh-style-auto-1231">
        <div className="bg-white rounded-4 shadow-sm border p-4">
          <div className="row g-4 align-items-center">
            
            {/* Left side: Overview Text */}
            <div className="col-lg-6 text-start">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center leh-style-auto-1232">
                  <i className="fa-regular fa-clipboard  "></i>
                </div>
                <h4 className="fw-bold text-dark mb-0">Overview</h4>
              </div>
              <p className="text-muted fs-7 mb-0 leh-style-auto-1113">
                {data.overviewText}
              </p>
            </div>

            {/* Right side: Categories Grids */}
            <div className="col-lg-6">
              <div className="row g-3">
                {data.categories.map((cat, idx) => (
                  <div className="col-6 col-sm-3 text-center" key={idx}>
                    <div className="p-2 border rounded-3 bg-light h-100 d-flex flex-column align-items-center justify-content-center">
                      <div className="overflow-hidden rounded-3 mb-2 leh-style-auto-1233">
                        <img src={cat.img} alt={cat.name} className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
                      </div>
                      <span className="fw-bold text-dark fs-8 d-block mb-0.5">{cat.name}</span>
                      <small className="text-muted fs-9 leh-style-auto-1086">{cat.desc}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Why Choose LehConnect? */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Why Choose LehConnect?</h2>
          </div>
          <div className="row g-4">
            {data.benefits.map((benefit, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card h-100 border-0 shadow-sm p-4 text-start position-relative card-hover-shadow leh-style-auto-1234">
                  {/* Step Number in Top Right */}
                  <span className="position-absolute end-0 top-0 p-3 text-muted fw-bold opacity-30 fs-7 leh-style-auto-1080">
                    {benefit.num}
                  </span>
                  
                  {/* Square Blue Icon Backdrop */}
                  <div className="rounded-3 d-flex align-items-center justify-content-center mb-4 leh-style-auto-1235">
                    <i className={benefit.icon}></i>
                  </div>
                  
                  <h5 className="fw-bold text-dark mb-2 fs-6">{benefit.title}</h5>
                  <p className="text-muted fs-8 mb-0 leh-style-auto-1102">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features & Details Section */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="row g-4">
            
            {/* Left Card: Core Features */}
            <div className="col-lg-4 text-start">
              <div className="p-4 text-white h-100 d-flex flex-column justify-content-between leh-style-auto-1236">
                <div>
                  <h4 className="fw-bold text-white mb-4">Core Features & Details</h4>
                  <ul className="list-unstyled ps-0 d-flex flex-column gap-3 mb-0">
                    {data.coreFeatures.map((feat, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-2.5 fs-8 text-white-50">
                        <i className="fa-solid fa-check text-success mt-0.5 me-2"></i>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Middle Card: Image & Stats */}
            <div className="col-lg-4">
              <div className="position-relative rounded-4 overflow-hidden shadow-sm h-100 leh-style-auto-1237">
                <img src={data.stats.img} 
                  alt="Scenic Ladakh Road" 
                  className="w-100 h-100 object-fit-cover" 
                loading="lazy" decoding="async" />
                <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center text-white leh-style-auto-1238">
                  <div className="text-center flex-grow-1 border-end border-secondary border-opacity-50">
                    <span className="fw-bold d-block fs-7 leh-style-auto-1239">{data.stats.leftNum}</span>
                    <span className="fs-9 opacity-75">{data.stats.leftText}</span>
                  </div>
                  <div className="text-center flex-grow-1 border-end border-secondary border-opacity-50">
                    <span className="fw-bold d-block fs-7 leh-style-auto-1239">{data.stats.midNum}</span>
                    <span className="fs-9 opacity-75">{data.stats.midText}</span>
                  </div>
                  <div className="text-center flex-grow-1">
                    <span className="fw-bold d-block fs-7 leh-style-auto-1239">{data.stats.rightNum} <i className="fa-solid fa-star text-warning leh-style-auto-1240"></i></span>
                    <span className="fs-9 opacity-75">{data.stats.rightText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Need a Custom Trip */}
            <div className="col-lg-4 text-start">
              <div className="p-4 text-white h-100 d-flex flex-column justify-content-between text-center leh-style-auto-1241">
                <div>
                  <h4 className="fw-bold text-white mb-2">Need a Custom Trip?</h4>
                  <p className="text-white-50 fs-8 px-2 mb-4">
                    Plan your perfect Ladakh journey with our travel experts.
                  </p>
                  
                  {/* Camping/camper van visual */}
                  <div className="my-4 d-flex justify-content-center">
                    <i className="fa-solid fa-mountain text-white opacity-40 me-3 leh-style-auto-1242"></i><i className="fa-solid fa-bus text-warning leh-style-auto-1242"></i>
                  </div>
                </div>

                <div>
                  <button onClick={() => router.push('/contact')} className="btn btn-light w-100 rounded-pill py-2.5 fw-bold   mb-3 shadow-sm border-0 leh-style-auto-1012">
                    <i className="fa-solid fa-phone me-1.5"></i> Contact Our Experts
                  </button>
                  <span className="d-block text-white-50 fs-8">
                    Call us: <strong className="text-white">+91 98765 43210</strong>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-5 bg-light border-top">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Frequently Asked Questions</h2>
          </div>
          <div className="row g-4">
            
            {/* Left Column FAQs */}
            <div className="col-md-6 text-start">
              <div className="d-flex flex-column gap-3">
                {data.faqs.slice(0, 2).map((faq, index) => (
                  <div className="bg-white border rounded-3 overflow-hidden shadow-sm" key={index}>
                    <button 
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className={`btn w-100 text-start d-flex justify-content-between align-items-center px-4 py-3 fw-semibold fs-7 leh-faq-btn ${activeFaq === index ? 'leh-faq-btn-active' : ''}`}
                    >
                      <span>{faq.q}</span>
                      <span>{activeFaq === index ? '▲' : '▼'}</span>
                    </button>
                    {activeFaq === index && (
                      <div className="p-4 bg-white text-muted fs-8 border-top leh-style-auto-1135">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column FAQs */}
            <div className="col-md-6 text-start">
              <div className="d-flex flex-column gap-3">
                {data.faqs.slice(2, 4).map((faq, index) => {
                  const actualIdx = index + 2;
                  return (
                    <div className="bg-white border rounded-3 overflow-hidden shadow-sm" key={actualIdx}>
                      <button 
                        onClick={() => setActiveFaq(activeFaq === actualIdx ? null : actualIdx)}
                        className={`btn w-100 text-start d-flex justify-content-between align-items-center px-4 py-3 fw-semibold fs-7 leh-faq-btn ${activeFaq === actualIdx ? 'leh-faq-btn-active' : ''}`}
                      >
                        <span>{faq.q}</span>
                        <span>{activeFaq === actualIdx ? '▲' : '▼'}</span>
                      </button>
                      {activeFaq === actualIdx && (
                        <div className="p-4 bg-white text-muted fs-8 border-top leh-style-auto-1135">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Trust Badges */}
      <section className="py-4 border-top bg-white">
        <div className="container">
          <div className="row g-3 row-cols-2 row-cols-lg-4 text-center justify-content-center align-items-center">
            <div className="col d-flex align-items-center justify-content-center gap-2 fs-8 text-muted fw-semibold">
              <i className="fa-solid fa-shield-halved   fs-6"></i>
              <span>100% Safe & Secure Payments</span>
            </div>
            <div className="col d-flex align-items-center justify-content-center gap-2 fs-8 text-muted fw-semibold border-start border-light">
              <i className="fa-solid fa-headset   fs-6"></i>
              <span>24/7 Customer Support</span>
            </div>
            <div className="col d-flex align-items-center justify-content-center gap-2 fs-8 text-muted fw-semibold border-start border-light">
              <i className="fa-solid fa-trophy   fs-6"></i>
              <span>Best Price Guarantee</span>
            </div>
            <div className="col d-flex align-items-center justify-content-center gap-2 fs-8 text-muted fw-semibold border-start border-light">
              <i className="fa-solid fa-users   fs-6"></i>
              <span>Trusted by 10,000+ Travelers</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetails;

