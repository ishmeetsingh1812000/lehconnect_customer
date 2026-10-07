import {
  OfferItem,
  RecentlyViewedPackage,
  HolidayDestinationItem,
  ServiceItem,
  CarCategoryItem,
  HowItWorksStep,
  LuxuryCarItem,
  TestimonialItem,
  BlogPostItem,
  FaqItem,
  CarFleetDetail,
  AboutUsStats,
} from "./types";

// ==========================================
// 1. PROMOTIONAL OFFERS & COUPONS (EDITABLE)
// ==========================================
export const offersDataList: OfferItem[] = [
  {
    code: "LEHWELCOME",
    category: "all",
    title: "LehConnect Special Offer",
    desc: "Flat 15% off up to ₹2,000 on your first booking choice.",
    exp: "DOMESTIC TRANSITS",
    img: "/images/gallery/gallery-scenic-ladakh-thumb.webp",
  },
  {
    code: "CABSPECIAL",
    category: "cabs",
    title: "Outstation Cab Discount",
    desc: "Get flat 10% off on premium outstation one-way cabs.",
    exp: "CAB COMMUTES",
    img: "/images/home/cab-driving-scenic.webp",
  },
  {
    code: "HOTELSTAYS",
    category: "hotels",
    title: "Luxury Hotel Cashback",
    desc: "Book any 5-star hotel and get ₹1,500 direct cashback.",
    exp: "HOTEL STAYS",
    img: "/images/booking/hotel-grand-dragon-resort.webp",
  },
  {
    code: "FLIGHTS100",
    category: "flights",
    title: "Flights Promo Discount",
    desc: "Get flat ₹800 off on domestic flight departures.",
    exp: "FLIGHT TICKETS",
    img: "/images/offers/offer-flight.webp",
  },
  {
    code: "HOLIDAY2026",
    category: "holidays",
    title: "Holidays Explorer Package",
    desc: "Save up to ₹5,000 on curated LehConnect packages.",
    exp: "HOLIDAY DEALS",
    img: "/images/holidays/kashmir.webp",
  },
  {
    code: "BUSESCAPE",
    category: "bus",
    title: "Bus Transit Cashback",
    desc: "Flat ₹150 off on volvo and sleeper luxury coach bookings.",
    exp: "BUS TRANSIT",
    img: "/images/banners/promo-bus-cashback.webp",
  },
  {
    code: "TRAINSAVER",
    category: "train",
    title: "Train Route Savings",
    desc: "Zero gateway booking fees on all premium train seats.",
    exp: "TRAIN JOURNEY",
    img: "/images/banners/promo-train-route.webp",
  },
  {
    code: "VISAPRO",
    category: "visa",
    title: "Visa Processing Discount",
    desc: "Flat 20% off on assistance services for international visa filings.",
    exp: "VISA SERVICE",
    img: "/images/banners/promo-visa-processing.webp",
  },
  {
    code: "INSURESAFE",
    category: "insurance",
    title: "Premium Secure Cover",
    desc: "Get ₹500 discount on comprehensive travel health covers.",
    exp: "TRAVEL INSURE",
    img: "/images/banners/promo-flight-discount.webp",
  },
];

// ==========================================
// 2. HOLIDAY TAB COLLECTIONS (EDITABLE)
// ==========================================
export const recentlyViewedData: RecentlyViewedPackage[] = [
  {
    id: "pkg-goa-1",
    title: "All-Inclusive 4N Holiday",
    subtitle: "4N Goa",
    details: "15 Sep 26 • 2 Travellers",
    price: "₹8,846",
    badge: "4N/5D",
    img: "/images/holidays/goa.webp",
    action: "VIEW",
    footer: "Viewed by You",
  },
  {
    id: "pkg-goa-2",
    title: "Super Saver Goa",
    subtitle: "3N Goa",
    details: "15 Sep 26 • 2 Travellers",
    price: "₹6,558",
    badge: "3N/4D",
    img: "/images/holidays/photo-1512453979798-5ea266f8880c.webp",
    action: "REVIEW & PAY",
    footer: "One step away!",
  },
  {
    id: "pkg-goa-3",
    title: "Hard Rock Hotel Goa Calangute",
    subtitle: "3N Goa",
    details: "18 Sep 26 • 4 Travellers",
    price: "₹5,614",
    badge: "3N/4D",
    img: "/images/holidays/photo-1507525428034-b723cf961d3e.webp",
    action: "VIEW",
    footer: "Viewed by You",
  },
  {
    id: "pkg-goa-4",
    title: "All Inclusive Romantic Goa",
    subtitle: "7N Goa",
    details: "15 Sep 26 • 2 Travellers",
    price: "₹12,009",
    badge: "7N/8D",
    img: "/images/holidays/photo-1507525428034-b723cf961d3e.webp",
    action: "VIEW",
    footer: "Viewed by You",
  },
];

export const holidayOffersData: HolidayDestinationItem[] = [
  { name: "Thailand", img: "/images/holidays/thailand.webp" },
  { name: "Goa", img: "/images/holidays/goa.webp" },
  { name: "Maldives", img: "/images/holidays/maldives.webp" },
  { name: "Kerala", img: "/images/holidays/kerala.webp" },
  { name: "Coorg & Ooty", img: "/images/holidays/coorg.webp" },
  { name: "Rajasthan", img: "/images/holidays/rajasthan.webp" },
  { name: "Himachal", img: "/images/holidays/himachal.webp" },
  { name: "Andaman", img: "/images/holidays/andaman.webp" },
];

export const lastMinuteEscapeData: HolidayDestinationItem[] = [
  { name: "South India", img: "/images/holidays/south-india.webp" },
  { name: "Kerala", img: "/images/holidays/kerala.webp" },
  { name: "Kashmir", img: "/images/holidays/kashmir.webp" },
  { name: "Shimla & Manali", img: "/images/holidays/himachal.webp" },
  { name: "Goa", img: "/images/holidays/goa.webp" },
  { name: "Sikkim & Darjeeling", img: "/images/holidays/northeastindia.webp" },
  { name: "Thailand", img: "/images/holidays/thailand.webp" },
  { name: "Andaman", img: "/images/holidays/andaman.webp" },
];

export const spiritualEscapesData: HolidayDestinationItem[] = [
  { name: "Char Dham", img: "/images/holidays/chardham.webp" },
  { name: "Varanasi & Ayodhya", img: "/images/holidays/varanasi.webp" },
  { name: "Puri", img: "/images/holidays/puri.webp" },
  { name: "Madurai & Rameshwaram", img: "/images/holidays/madurai.webp" },
  { name: "Dwarka & Somnath", img: "/images/holidays/chardham.webp" },
  { name: "Ujjain", img: "/images/holidays/ujjain.webp" },
  { name: "Tirupati", img: "/images/holidays/tirupati.webp" },
  { name: "Shirdi", img: "/images/holidays/shirdi.webp" },
];

export const internationalDestinationsData: HolidayDestinationItem[] = [
  {
    name: "Thailand",
    price: "Starting at ₹48,400 Per person",
    img: "/images/holidays/thailand.webp",
  },
  {
    name: "Maldives",
    price: "Starting at ₹11,300 Per person",
    img: "/images/holidays/maldives.webp",
  },
  {
    name: "Laos",
    price: "Starting at ₹22,700 Per person",
    img: "/images/holidays/laos.webp",
  },
  {
    name: "Bali",
    price: "Starting at ₹13,500 Per person",
    img: "/images/holidays/bali.webp",
  },
  {
    name: "Vietnam",
    price: "Starting at ₹10,100 Per person",
    img: "/images/holidays/vietnam.webp",
  },
  {
    name: "Europe",
    price: "Starting at ₹2,93,200 Per person",
    img: "/images/holidays/europe.webp",
  },
  {
    name: "Singapore",
    price: "Starting at ₹38,900 Per person",
    img: "/images/holidays/singapore.webp",
  },
];

// ==========================================
// 3. ABOUT US DATA & STATS (EDITABLE)
// ==========================================
export const aboutUsContent = {
  tag: "ABOUT US",
  titlePrefix: "Leh",
  titleHighlight: "Connect",
  titleSuffix: " - Trusted Travel Partner in India",
  para1:
    "LehConnect is a premium travel and cab booking platform committed to making every journey smooth, safe, and memorable. As a trusted name in the Indian travel industry, we provide reliable transportation, comfortable stays, and customized travel solutions at competitive prices.",
  para2:
    "Whether you're planning a relaxing holiday, a business trip, or an adventure getaway, LehConnect offers complete travel assistance under one roof — including local taxi services, luxury car rentals, hotel bookings, flight assistance, and personalized tour packages across India.",
  image: "/images/home/cab-driving-scenic.webp",
  imageAlt: "Taxi Cab",
  stats: {
    ridesTarget: 2000,
    customersTarget: 950,
    citiesTarget: 50,
    ridesLabel: "Rides Completed",
    customersLabel: "Happy Customers",
    citiesLabel: "Cities Covered",
  } as AboutUsStats,
};

// ==========================================
// 4. OUR SERVICES (EDITABLE)
// ==========================================
export const servicesData: ServiceItem[] = [
  {
    id: "cabs",
    title: "Taxi Booking (Local / Outstation / One-way)",
    desc: "Comfortable and well-maintained taxis for local sightseeing, airport transfers, and outstation journeys.",
    img: "/images/about/about-taxi-features.webp",
    linkText: "Details",
  },
  {
    id: "hotels",
    title: "Hotel Booking",
    desc: "Easy hotel booking with verified stays, premium amenities, affordable rates, and a smooth experience.",
    img: "/images/booking/hotel-luxury-resort.webp",
    linkText: "Details",
  },
  {
    id: "flights",
    title: "Flight Booking",
    desc: "Find, compare, and book domestic or international flights quickly with great deals and smooth service.",
    img: "/images/services/flight-services-hero.webp",
    linkText: "Details",
  },
  {
    id: "insurance",
    title: "Travel Insurance",
    desc: "Secure your journeys with comprehensive insurance covers, hassle-free claim support, and health security plans.",
    img: "/images/services/insurance-services-hero.webp",
    linkText: "Details",
  },
  {
    id: "holidays",
    title: "Tour Packages",
    desc: "Book amazing Himalayan tour packages for a comfortable, guide-assisted, and hassle-free travel experience.",
    img: "/images/common/scenic-himalayan-road.webp",
    linkText: "Details",
  },
];

// ==========================================
// 5. CAR TYPES & CATEGORIES (EDITABLE)
// ==========================================
export const carCategoriesData: CarCategoryItem[] = [
  {
    name: "Sedan",
    subtitle: "Comfortable daily commute",
    img: "/images/fleet/cab-sedan-dzire.webp",
    filterType: "sedan",
  },
  {
    name: "SUV",
    subtitle: "Spacious offroad traveler",
    img: "/images/fleet/cab-mahindra-xuv700.webp",
    filterType: "suv",
  },
  {
    name: "MUV",
    subtitle: "Multi-utility family carrier",
    img: "/images/fleet/cab-toyota-innova.webp",
    filterType: "muv",
  },
  {
    name: "Hatchback",
    subtitle: "Budget-friendly compact rides",
    img: "/images/fleet/cab-hyundai-i20.webp",
    filterType: "hatchback",
  },
  {
    name: "Group Traveller",
    subtitle: "Multi-passenger tour coaches",
    img: "/images/fleet/cab-tempo-traveller.webp",
    filterType: "suv",
  },
  {
    name: "Luxury Executive",
    subtitle: "VIP premium comfort classes",
    img: "/images/fleet/cab-bmw-luxury.webp",
    filterType: "sedan",
  },
];

// ==========================================
// 6. HOW IT WORKS STEPS (EDITABLE)
// ==========================================
export const howItWorksSteps: HowItWorksStep[] = [
  {
    stepNumber: "01",
    titlePrefix: "Choose",
    titleSuffix: "a Car",
    desc: "Explore our wide range of well-maintained cars and select the perfect one for your journey.",
    icon: "fa-solid fa-car",
  },
  {
    stepNumber: "02",
    titlePrefix: "Come",
    titleSuffix: "In Contact",
    desc: "Our travel experts will connect with you instantly to understand your needs and confirm the details.",
    icon: "fa-solid fa-phone-volume",
  },
  {
    stepNumber: "03",
    titlePrefix: "Enjoy",
    titleSuffix: "Driving",
    desc: "Get the keys, hit the road and enjoy a comfortable, safe and memorable journey with us.",
    icon: "fa-solid fa-road",
  },
];

// ==========================================
// 7. LUXURY FLEET CARS (EDITABLE)
// ==========================================
export const luxuryFleetData: LuxuryCarItem[] = [
  {
    name: "BMW Series",
    subtitle: "Premium Executive Comfort",
    img: "/images/fleet/cab-bmw-luxury.webp",
    filterType: "sedan",
  },
  {
    name: "Audi Elite",
    subtitle: "Dynamic Sport Drive",
    img: "/images/fleet/cab-audi-luxury.webp",
    filterType: "sedan",
  },
  {
    name: "Mercedes-Benz",
    subtitle: "Ultimate Luxury Status",
    img: "/images/fleet/cab-mercedes-luxury.webp",
    filterType: "sedan",
  },
  {
    name: "Porsche Carrera",
    subtitle: "Classic Sport Elegance",
    img: "/images/fleet/cab-porsche-luxury.webp",
    filterType: "sedan",
  },
  {
    name: "Range Rover Vogue",
    subtitle: "Luxury Terrain Master",
    img: "/images/fleet/cab-range-rover.webp",
    filterType: "suv",
  },
  {
    name: "Jaguar F-Type",
    subtitle: "Premium Sport Roar",
    img: "/images/fleet/cab-jaguar-luxury.webp",
    filterType: "sedan",
  },
];

// ==========================================
// 8. APP DOWNLOAD BANNER (EDITABLE)
// ==========================================
export const appDownloadContent = {
  title: "Lehconnect User Friendly App Available",
  desc: "Book cabs, hotels, and tour packages anytime, anywhere with our easy-to-use mobile app. Enjoy quick bookings, real-time updates, and secure payments.",
  googlePlayLink: "#",
  appStoreLink: "#",
  qrLabel: "Scan QR Code",
};

// ==========================================
// 9. CLIENT TESTIMONIALS (EDITABLE)
// ==========================================
export const testimonialsData: TestimonialItem[] = [
  {
    id: 1,
    name: "Dan Martin",
    role: "Verified Customer",
    comment:
      "LehConnect cab booking service was incredible. The driver was highly experienced, prompt, and the SUV was extremely neat and comfortable.",
    rating: 5,
    img: "/images/testimonials/testimonial-client-dan.webp",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Family Traveler",
    comment:
      "We booked our Ladakh tour package through LehConnect. Every detail of our hotel stays and transits was managed perfectly. Highly recommended!",
    rating: 5,
    img: "/images/testimonials/testimonial-client-sarah.webp",
  },
  {
    id: 3,
    name: "Rohan Shah",
    role: "Corporate Traveler",
    comment:
      "Zero cancellation hassles and direct customer support. They assisted us with visa guidance and hotel recommendations within minutes.",
    rating: 5,
    img: "/images/testimonials/testimonial-client-rohan.webp",
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Solo Backpacker",
    comment:
      "Extremely pleased with the airport drop service. Prompt communication, neat vehicle, and polite guide support.",
    rating: 5,
    img: "/images/testimonials/testimonial-client-priya.webp",
  },
  {
    id: 5,
    name: "David Miller",
    role: "Family Explorer",
    comment:
      "We rented a self-drive SUV for 4 days. Zero glitches, transparent billing, and highly recommended for mountain travels.",
    rating: 5,
    img: "/images/testimonials/testimonial-client-david.webp",
  },
];

// ==========================================
// 10. BLOG POSTS (EDITABLE)
// ==========================================
export const blogPostsData: BlogPostItem[] = [
  {
    id: 1,
    date: "Dec 01, 2025",
    title: "Exploring Leh: A Guide for Luxury Car Renters",
    excerpt:
      "Learn how to choose the right premium SUV to drive comfortably through Ladakh's highest mountain passes...",
    img: "/images/home/cab-driving-scenic.webp",
    slug: "exploring-lehconnect-a-guide-for-luxury-car-renters",
  },
  {
    id: 2,
    date: "Nov 18, 2025",
    title: "Top 5 Luxury Retreats in Ladakh You Must Experience",
    excerpt:
      "Discover hotel stores offering mountain-view bedrooms, premium spas, and traditional Ladakhi cuisine hospitality...",
    img: "/images/booking/hotel-luxury-resort.webp",
    slug: "top-5-luxury-retreats-in-lehconnect-you-must-experience",
  },
  {
    id: 3,
    date: "Nov 05, 2025",
    title: "Hassle-Free Flight Bookings to LehConnect",
    excerpt:
      "How to get flat cashbacks on flights and avoid baggage fees with the right promo cards on LehConnect...",
    img: "/images/common/scenic-himalayan-road.webp",
    slug: "hassle-free-flight-bookings-to-lehconnect",
  },
  {
    id: 4,
    date: "Oct 25, 2025",
    title: "Leh to Nubra Valley: The Ultimate Checklist",
    excerpt:
      "A complete safety guide on packing checklist, high altitude acclimation, and permits for Nubra Valley.",
    img: "/images/fleet/cab-tempo-traveller.webp",
    slug: "lehconnect-to-nubra-valley-road-trip-checklist",
  },
  {
    id: 5,
    date: "Oct 10, 2025",
    title: "Acclimatization Tips for First-Time Ladakh Travelers",
    excerpt:
      "How to avoid acute mountain sickness and plan your LehConnect stay itinerary correctly with comfort.",
    img: "/images/common/scenic-himalayan-road.webp",
    slug: "acclimatization-tips-for-first-time-lehconnect-travelers",
  },
];

// ==========================================
// 11. INSTAGRAM FEED PHOTOS (EDITABLE)
// ==========================================
export const instaPhotos: string[] = [
  "/images/home/cab-driving-scenic.webp",
  "/images/booking/hotel-luxury-resort.webp",
  "/images/services/flight-services-hero.webp",
  "/images/common/scenic-himalayan-road.webp",
  "/images/fleet/cab-mahindra-xuv700.webp",
  "/images/booking/hotel-homestay-cozy.webp",
  "/images/common/scenic-mountain-valley.webp",
  "/images/gallery/gallery-river-valley.webp",
];

// ==========================================
// 12. FREQUENTLY ASKED QUESTIONS (EDITABLE)
// ==========================================
export const faqsData: FaqItem[] = [
  {
    q: "What is Leh Connect?",
    a: "Leh Connect is a B2B and B2C travel network platform where you can get services like Taxi Booking, Hotel Booking, Flight Tickets, Tour Packages and Travel Insurance in one app.",
  },
  {
    q: " Is registration on Leh Connect free?",
    a: "Yes, basic registration on Leh Connect is completely free. You can simply download the app and create your account.",
  },
  {
    q: "Will Leh Connect work across India?",
    a: "Leh Connect aims to provide service across India, starting with major cities and gradually expanding to all states.",
  },
  {
    q: "Do I get referral income on Leh Connect?",
    a: "Yes, Leh Connect has referral program available through which you can earn extra money by adding your friends and vendors.",
  },
  {
    q: "Does Leh Connect offer 24/7 support?",
    a: "Yes, Leh Connect provides 24/7 customer support for users and vendors.",
  },
  {
    q: "How do I book an outstation cab on LehConnect?",
    a: "Choose the Cabs tab in the overlapping search widget, select your pickup location, drop destination, date, and pickup time. Click Search, choose from our list of verified sedans or SUVs, and complete the reservation payment.",
  },
  {
    q: "Can I cancel my booking and get a refund?",
    a: "Yes! You can cancel bookings directly from your Dashboard under My Bookings. Refund eligibility depends on the cancellation timeline. Please review our Cancellation & Refund policies in the footer for full details.",
  },
];

// ==========================================
// 13. CAR FLEET SPECIFICATIONS (EDITABLE)
// ==========================================
export const carFleetData: Record<string, CarFleetDetail[]> = {
  sedan: [
    {
      name: "Maruti Suzuki Dzire",
      img: "/images/fleet/cab-sedan-dzire.webp",
      ac: "AC",
      seats: "5 Seater",
      transmission: "Manual",
      luggage: "2 Bags",
      features: [
        "GPS Navigation",
        "Roof Carrier Available",
        "Airbags",
        "Bluetooth",
      ],
    },
    {
      name: "Hyundai Verna",
      img: "/images/fleet/cab-hyundai-verna.webp",
      ac: "AC",
      seats: "5 Seater",
      transmission: "Automatic",
      luggage: "3 Bags",
      features: ["GPS Navigation", "Sunroof", "Premium Audio", "Airbags"],
    },
    {
      name: "Honda City",
      img: "/images/fleet/cab-honda-city.webp",
      ac: "AC",
      seats: "5 Seater",
      transmission: "Manual",
      luggage: "3 Bags",
      features: ["GPS Navigation", "Airbags", "Leather Seats", "Rear Camera"],
    },
  ],
  suv: [
    {
      name: "Toyota Fortuner",
      img: "/images/fleet/cab-toyota-fortuner.webp",
      ac: "AC",
      seats: "7 Seater",
      transmission: "Automatic (4x4)",
      luggage: "5 Bags",
      features: [
        "All-Wheel Drive",
        "GPS Navigation",
        "High Ground Clearance",
        "Leather Seats",
      ],
    },
    {
      name: "Mahindra Scorpio-N",
      img: "/images/fleet/cab-mahindra-scorpio-n.webp",
      ac: "AC",
      seats: "7 Seater",
      transmission: "Manual",
      luggage: "4 Bags",
      features: [
        "Rugged Offroader",
        "Roof Carrier",
        "Airbags",
        "Touchscreen Infotainment",
      ],
    },
    {
      name: "Mahindra Thar",
      img: "/images/fleet/cab-mahindra-thar.webp",
      ac: "AC",
      seats: "4 Seater",
      transmission: "Manual (4x4)",
      luggage: "2 Bags",
      features: [
        "Convertible Soft-top",
        "High Clearance",
        "Rugged Tires",
        "GPS",
      ],
    },
  ],
  muv: [
    {
      name: "Toyota Innova Crysta",
      img: "/images/fleet/cab-toyota-innova.webp",
      ac: "AC",
      seats: "7 Seater",
      transmission: "Automatic",
      luggage: "5 Bags",
      features: [
        "Captain Seats",
        "GPS Navigation",
        "Extra Luggage Carrier",
        "Airbags",
      ],
    },
    {
      name: "Maruti Suzuki Ertiga",
      img: "/images/fleet/cab-maruti-ertiga.webp",
      ac: "AC",
      seats: "7 Seater",
      transmission: "Manual",
      luggage: "3 Bags",
      features: [
        "Budget Friendly",
        "GPS Navigation",
        "Rear AC Vents",
        "Bluetooth",
      ],
    },
    {
      name: "Kia Carens",
      img: "/images/fleet/cab-kia-carens.webp",
      ac: "AC",
      seats: "7 Seater",
      transmission: "Automatic",
      luggage: "4 Bags",
      features: [
        "Premium Cabin",
        "Ambient Lighting",
        "Air Purifier",
        "6 Airbags",
      ],
    },
  ],
};
