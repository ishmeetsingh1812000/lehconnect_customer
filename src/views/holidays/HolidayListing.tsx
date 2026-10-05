'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNavigate } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { PACKAGES_DATA, DESTINATIONS } from '../../constants/packagesData';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const HolidayListing = () => {
  const navigate = useNavigate();
  const nextSearchParams = useSearchParams();
  const { searchParams, updateSearchParams } = useBooking();
  const [showCustomiseModal, setShowCustomiseModal] = useState(false);

  // Search discovery states
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('all'); // 'all' or specific destination ID
  const [travelMonth, setTravelMonth] = useState('August 2026');
  const [guestsCount, setGuestsCount] = useState(2);

  // Toggle search form expansion
  const [showModifySearch, setShowModifySearch] = useState(false);

  // Sorting and filtering states (Theme tabs: 'all', 'honeymoon', 'beach', 'lastminute')
  const [activeTheme, setActiveTheme] = useState('all');
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    honeymoon: 0,
    beach: 0,
    lastminute: 0
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [budgetLimit, setBudgetLimit] = useState(350000);
  const [durationFilter, setDurationFilter] = useState('all');
  const [starRatingFilter, setStarRatingFilter] = useState('all'); // 'all', '5star', '4star', '3star'
  const [flightInclusionFilter, setFlightInclusionFilter] = useState('all'); // 'all', 'withFlights', 'noFlights'
  const [taxiInclusionFilter, setTaxiInclusionFilter] = useState('all'); // 'all', 'withTaxi', 'noTaxi'

  // Accordion states
  const [openFaq, setOpenFaq] = useState(null);

  // Search trigger
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Initialize search parameters from URL query if present (e.g. ?dest=Goa&depCity=Jaipur&theme=honeymoon)
  useEffect(() => {
    if (!nextSearchParams) return;
    const dest = nextSearchParams.get('dest') || nextSearchParams.get('destination') || nextSearchParams.get('searchDep');
    const from = nextSearchParams.get('depCity') || nextSearchParams.get('from');
    const theme = nextSearchParams.get('theme');

    if (dest) {
      const destLower = dest.toLowerCase().trim();
      const matched = DESTINATIONS.find(d => d.id.toLowerCase() === destLower || d.name.toLowerCase() === destLower);
      if (matched) {
        setToCity(matched.id);
      } else if (PACKAGES_DATA[destLower]) {
        setToCity(destLower);
      }
    }

    if (from) {
      setFromCity(from);
    }

    if (theme) {
      const themeLower = theme.toLowerCase().trim();
      if (['all', 'honeymoon', 'beach', 'lastminute'].includes(themeLower)) {
        setActiveTheme(themeLower);
      }
    }
  }, [nextSearchParams]);

  // Carousel scroll action helper
  const handleScrollCarousel = (id, direction) => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Recently Viewed Packages
  const recentlyViewedData = [
    {
      id: "pkg-goa-1",
      title: "All-Inclusive 4N Holiday",
      subtitle: "4N Goa",
      details: "15 Sep 26 • 2 Travellers",
      price: "₹8,846",
      badge: "4N/5D",
      img: "/images/holidays/photo-1507525428034-b723cf961d3e.webp",
      action: "VIEW",
      footer: "Viewed by You"
    },
    {
      id: "pkg-goa-2",
      title: "Super Saver Goa",
      subtitle: "3N Goa",
      details: "15 Sep 26 • 2 Travellers",
      price: "₹6,558",
      badge: "3N/4D",
      img: "/images/holidays/goa.webp",
      action: "REVIEW & PAY",
      footer: "One step away!"
    },
    {
      id: "pkg-goa-3",
      title: "Hard Rock Hotel Goa Calangute",
      subtitle: "3N Goa",
      details: "18 Sep 26 • 4 Travellers",
      price: "₹5,614",
      badge: "3N/4D",
      img: "/images/holidays/fortune-hotel.webp",
      action: "VIEW",
      footer: "Viewed by You"
    },
    {
      id: "pkg-goa-4",
      title: "All Inclusive Romantic Goa",
      subtitle: "7N Goa",
      details: "15 Sep 26 • 2 Travellers",
      price: "₹12,009",
      badge: "7N/8D",
      img: "/images/holidays/photo-1512453979798-5ea266f8880c.webp",
      action: "VIEW",
      footer: "Viewed by You"
    }
  ];

  // Up to Rs 10,000 off!
  const offersData = [
    { name: "Thailand", img: "/images/holidays/thailand.webp" },
    { name: "Goa", img: "/images/holidays/goa.webp" },
    { name: "Maldives", img: "/images/holidays/maldives.webp" },
    { name: "Kerala", img: "/images/holidays/kerala.webp" },
    { name: "Coorg & Ooty", img: "/images/holidays/coorg.webp" },
    { name: "Rajasthan", img: "/images/holidays/rajasthan.webp" },
    { name: "Himachal", img: "/images/holidays/himachal.webp" },
    { name: "Andaman", img: "/images/holidays/andaman.webp" }
  ];

  // Last-Minute Escape Sale!
  const lastMinuteData = [
    { name: "South India", img: "/images/holidays/south-india.webp" },
    { name: "Kerala", img: "/images/holidays/kerala.webp" },
    { name: "Kashmir", img: "/images/holidays/kashmir.webp" },
    { name: "Shimla & Manali", img: "/images/holidays/himachal.webp" },
    { name: "Goa", img: "/images/holidays/goa.webp" },
    { name: "Sikkim & Darjeeling", img: "/images/holidays/northeastindia.webp" },
    { name: "Thailand", img: "/images/holidays/thailand.webp" },
    { name: "Andaman", img: "/images/holidays/andaman.webp" }
  ];

  // Spiritual Escapes
  const spiritualData = [
    { name: "Char Dham", img: "/images/holidays/chardham.webp" },
    { name: "Varanasi & Ayodhya", img: "/images/holidays/varanasi.webp" },
    { name: "Puri", img: "/images/holidays/puri.webp" },
    { name: "Madurai & Rameshwaram", img: "/images/holidays/madurai.webp" },
    { name: "Dwarka & Somnath", img: "/images/holidays/chardham.webp" },
    { name: "Ujjain", img: "/images/holidays/ujjain.webp" },
    { name: "Tirupati", img: "/images/holidays/tirupati.webp" },
    { name: "Shirdi", img: "/images/holidays/shirdi.webp" }
  ];

  // International Destinations
  const internationalData = [
    { name: "Thailand", price: "Starting at ₹48,400 Per person", img: "/images/holidays/thailand.webp" },
    { name: "Maldives", price: "Starting at ₹11,300 Per person", img: "/images/holidays/maldives.webp" },
    { name: "Laos", price: "Starting at ₹22,700 Per person", img: "/images/holidays/laos.webp" },
    { name: "Bali", price: "Starting at ₹13,500 Per person", img: "/images/holidays/bali.webp" },
    { name: "Vietnam", price: "Starting at ₹10,100 Per person", img: "/images/holidays/vietnam.webp" },
    { name: "Europe", price: "Starting at ₹2,93,200 Per person", img: "/images/holidays/europe.webp" },
    { name: "Singapore", price: "Starting at ₹38,900 Per person", img: "/images/holidays/singapore.webp" }
  ];

  // Packages list state
  const [filteredPackages, setFilteredPackages] = useState([]);

  // Helper to match a package against theme category tabs
  const matchTheme = (pkg, theme) => {
    if (!theme || theme === 'all') return true;
    const title = (pkg.title || '').toLowerCase();
    const itinerary = (pkg.itinerary || '').toLowerCase();
    const promo = (pkg.promoText || '').toLowerCase();
    const themes = pkg.themes || [];
    const pkgId = (pkg.id || '').toLowerCase();

    if (theme === 'honeymoon') {
      return (
        themes.includes('honeymoon') ||
        title.includes('honeymoon') ||
        title.includes('romantic') ||
        title.includes('couple') ||
        title.includes('candlelight') ||
        title.includes('pool villa') ||
        title.includes('escape') ||
        itinerary.includes('villa') ||
        itinerary.includes('sunset cruise')
      );
    }

    if (theme === 'beach') {
      return (
        themes.includes('beach') ||
        ['goa', 'mld', 'maldives', 'tha', 'thailand', 'krl', 'kerala', 'bali', 'andaman'].some(d => pkgId.includes(d)) ||
        title.includes('beach') ||
        title.includes('island') ||
        title.includes('overwater') ||
        title.includes('resort') ||
        title.includes('coastal') ||
        title.includes('shores') ||
        title.includes('ocean') ||
        title.includes('sea') ||
        title.includes('calangute') ||
        title.includes('baga') ||
        title.includes('phuket') ||
        title.includes('krabi') ||
        itinerary.includes('beach') ||
        itinerary.includes('island') ||
        itinerary.includes('bungalow')
      );
    }

    if (theme === 'lastminute') {
      return (
        themes.includes('lastminute') ||
        promo.includes('monsoon') ||
        promo.includes('sale') ||
        promo.includes('last minute') ||
        promo.includes('saver') ||
        promo.includes('special') ||
        title.includes('saver') ||
        title.includes('escape') ||
        Boolean(pkg.saveAmount)
      );
    }

    return true;
  };

  useEffect(() => {
    let list = [];
    const destKey = (toCity || 'all').toLowerCase().trim();
    if (destKey === 'all') {
      Object.keys(PACKAGES_DATA).forEach(key => {
        if (key !== 'explore') {
          list = [...list, ...PACKAGES_DATA[key]];
        }
      });
    } else {
      list = PACKAGES_DATA[destKey] || [];
    }

    // Filter by budget
    list = list.filter(pkg => {
      const price = parseInt(pkg.actualPrice.replace(/,/g, ''), 10);
      return price <= budgetLimit;
    });

    // Filter by duration
    if (durationFilter !== 'all') {
      list = list.filter(pkg => {
        const days = parseInt(pkg.duration.split(' ')[0], 10);
        if (durationFilter === 'short') return days <= 5;
        if (durationFilter === 'medium') return days > 5 && days <= 8;
        if (durationFilter === 'long') return days > 8;
        return true;
      });
    }

    // Filter by star rating
    if (starRatingFilter !== 'all') {
      list = list.filter(pkg => {
        if (starRatingFilter === '5star') return pkg.rating >= 4.8;
        if (starRatingFilter === '4star') return pkg.rating >= 4.5 && pkg.rating < 4.8;
        if (starRatingFilter === '3star') return pkg.rating < 4.5;
        return true;
      });
    }

    // Filter by flight inclusion
    if (flightInclusionFilter !== 'all') {
      list = list.filter(pkg => {
        const title = pkg.title.toLowerCase();
        const hasFlight = title.includes('flight') || title.includes('explore') || pkg.id.includes('sin') || pkg.id.includes('mld') || pkg.id.includes('goa');
        if (flightInclusionFilter === 'withFlights') return hasFlight;
        if (flightInclusionFilter === 'noFlights') return !hasFlight;
        return true;
      });
    }

    // Filter by taxi inclusion
    if (taxiInclusionFilter !== 'all') {
      list = list.filter(pkg => {
        const hasTaxi = pkg.itinerary.toLowerCase().includes('transfers') || 
                        pkg.itinerary.toLowerCase().includes('cab') ||
                        pkg.itinerary.toLowerCase().includes('sedan') ||
                        pkg.itinerary.toLowerCase().includes('chauffeur') ||
                        pkg.title.toLowerCase().includes('safari') ||
                        pkg.id.includes('raj') || pkg.id.includes('nei') || pkg.id.includes('eur') || pkg.id.includes('goa');
        if (taxiInclusionFilter === 'withTaxi') return hasTaxi;
        if (taxiInclusionFilter === 'noTaxi') return !hasTaxi;
        return true;
      });
    }

    // Calculate dynamic counts for the 4 theme tabs across matching packages before activeTheme filter
    setTabCounts({
      all: list.length,
      honeymoon: list.filter(pkg => matchTheme(pkg, 'honeymoon')).length,
      beach: list.filter(pkg => matchTheme(pkg, 'beach')).length,
      lastminute: list.filter(pkg => matchTheme(pkg, 'lastminute')).length
    });

    // Filter by activeTheme category tab
    if (activeTheme !== 'all') {
      list = list.filter(pkg => matchTheme(pkg, activeTheme));
    }

    // Sort list
    list.sort((a, b) => {
      const priceA = parseInt(a.actualPrice.replace(/,/g, ''), 10);
      const priceB = parseInt(b.actualPrice.replace(/,/g, ''), 10);
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default recommended sorting
    });

    setFilteredPackages(list);
  }, [toCity, activeTheme, sortBy, budgetLimit, durationFilter, starRatingFilter, flightInclusionFilter, taxiInclusionFilter, searchTrigger]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchParams('holidays', {
      destination: toCity,
      guests: guestsCount
    });
    setSearchTrigger(prev => prev + 1);
    setShowModifySearch(false);
  };

  const selectDestination = (destId) => {
    setToCity(destId);
    setSearchTrigger(prev => prev + 1);
    const element = document.getElementById('package-listing-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectTheme = (themeId) => {
    setActiveTheme(themeId);
    setSearchTrigger(prev => prev + 1);
    const element = document.getElementById('package-listing-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setToCity('all');
    setActiveTheme('all');
    setSortBy('recommended');
    setBudgetLimit(350000);
    setDurationFilter('all');
    setStarRatingFilter('all');
    setFlightInclusionFilter('all');
    setTaxiInclusionFilter('all');
    setFromCity('Delhi');
    setGuestsCount(2);
    setSearchTrigger(prev => prev + 1);
  };

  const popularDestinations = [
    { id: 'maldives', name: 'Maldives', subtitle: 'Island Luxury Resorts', img: '/images/holidays/photo-1514282401047-d79a71a590e8.webp' },
    { id: 'europe', name: 'Europe', subtitle: 'Historic Castles & Alps', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
    { id: 'japan', name: 'Japan', subtitle: 'Cherry Blossoms & Temples', img: '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp' },
    { id: 'dubai', name: 'Dubai', subtitle: 'Desert Safaris & Skyscrapers', img: '/images/holidays/photo-1512453979798-5ea266f8880c.webp' },
    { id: 'thailand', name: 'Thailand', subtitle: 'Tropical Beaches & Pagodas', img: '/images/holidays/photo-1537996194471-e657df975ab4.webp' },
    { id: 'rajasthan', name: 'Rajasthan', subtitle: 'Royal Palaces & Desert Camps', img: '/images/holidays/photo-1599661046289-e31897846e41.webp' }
  ];

  const holidayThemeTabs = [
    { id: 'all', label: 'All Packages', icon: 'fa-solid fa-suitcase-rolling', count: tabCounts.all, color: '#0061ae' },
    { id: 'honeymoon', label: 'Honeymoon', icon: 'fa-solid fa-heart', count: tabCounts.honeymoon, color: '#e91e63' },
    { id: 'beach', label: 'Beach Side Stays', icon: 'fa-solid fa-umbrella-beach', count: tabCounts.beach, color: '#0288d1' },
    { id: 'lastminute', label: 'Last Minute Deals', icon: 'fa-solid fa-bolt', count: tabCounts.lastminute, color: '#f57c00' }
  ];

  const faqsList = [
    {
      q: "How can I customize a holiday package on LehConnect?",
      a: "LehConnect provides fully flexible dynamic itineraries. Once you select a holiday package, you can request custom changes such as selecting preferred flights, upgrading to premium luxury hotels, adding local guided sightseeing, or choosing private transfers by speaking to our holiday experts."
    },
    {
      q: "Are flights included in the package cost?",
      a: "Yes, standard roundtrip flights from your selected starting city are included in most of our tour packages. However, you have the option to exclude flights during customization if you wish to book your own transport."
    },
    {
      q: "What payment and cancellation options are available?",
      a: "You can book holiday packages by paying a small deposit. For cancellations, refunds are processed according to the cancellation policy selected. Typically, bookings cancelled 30 days before departure are eligible for a full refund."
    },
    {
      q: "Do the packages include tour guides?",
      a: "Yes, our curated holiday packages include certified English-speaking local guides for historical monument visits and sightseeing, ensuring an enriched travel experience."
    },
    {
      q: "Is travel insurance included in LehConnect holiday packages?",
      a: "Yes, comprehensive travel insurance is bundled with all international tour packages to cover medical emergencies, trip delays, and baggage losses."
    }
  ];

  // Helper to translate toCity to readable destination text
  const getDestinationName = () => {
    if (!toCity || toCity === 'all') return 'India & International';
    const found = DESTINATIONS.find(d => d.id.toLowerCase() === toCity.toLowerCase());
    return found ? found.name : (toCity.charAt(0).toUpperCase() + toCity.slice(1));
  };

  return (
    <div className="min-vh-100 pb-5 text-start" style={{ backgroundColor: '#f2f2f2', fontFamily: "'Poppins', sans-serif" }}>
      
      
      {/* LehConnect-Style Collapsed Search Summary Header Bar */}
      <div className="bg-white border-bottom shadow-sm py-3 text-start position-sticky top-0 z-3 pkg-border-light" >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            
            {/* Search Recap Details */}
            <div className="d-flex align-items-center gap-4 flex-wrap">
              <div>
                <span className="text-muted d-block uppercase font-weight-bold pkg-label-xs" >FROM CITY</span>
                <strong className="text-dark fs-8">{fromCity}</strong>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: '#e7e7e7' }} />
              <div>
                <span className="text-muted d-block uppercase font-weight-bold pkg-label-xs" >DESTINATION</span>
                <strong className="text-dark fs-8">{getDestinationName()}</strong>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: '#e7e7e7' }} />
              <div>
                <span className="text-muted d-block uppercase font-weight-bold pkg-label-xs" >TRAVEL MONTH</span>
                <strong className="text-dark fs-8">{travelMonth}</strong>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: '#e7e7e7' }} />
              <div>
                <span className="text-muted d-block uppercase font-weight-bold pkg-label-xs" >TRAVELERS</span>
                <strong className="text-dark fs-8">{guestsCount} Traveler(s)</strong>
              </div>
            </div>

            {/* Modify Button */}
            <button 
              onClick={() => setShowModifySearch(!showModifySearch)}
              className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 pkg-search-input"
            >
              <i className="fa-solid fa-magnifying-glass me-1" style={{ fontSize: "11px" }}></i> {showModifySearch ? 'Hide Search' : 'Modify Search'}
            </button>

          </div>
        </div>
      </div>

      {/* Expandable Modify Search Panel */}
      {showModifySearch && (
        <div className="bg-white border-bottom py-4 pkg-border-light" >
          <div className="container">
            <div className="card p-0 border rounded-3 overflow-hidden pkg-border-light" >
              <form onSubmit={handleSearchSubmit}>
                <div className="d-flex flex-wrap flex-md-nowrap align-items-stretch">
                  
                  {/* From */}
                  <div className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light pkg-min-w-180" >
                    <span className="text-muted fw-bold d-block text-uppercase mb-1 pkg-label-xs" >FROM CITY</span>
                    <select 
                      className="form-select border-0 p-0 fw-black text-dark fs-8 bg-transparent cursor-pointer"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                    >
                      <option value="Delhi">Delhi (DEL)</option>
                      <option value="Mumbai">Mumbai (BOM)</option>
                      <option value="Bangalore">Bangalore (BLR)</option>
                      <option value="Jaipur">Jaipur (JAI)</option>
                      <option value="Leh">Leh (IXL)</option>
                    </select>
                  </div>

                  {/* To */}
                  <div className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light pkg-min-w-200" >
                    <span className="text-muted fw-bold d-block text-uppercase mb-1 pkg-label-xs" >DESTINATION</span>
                    <select 
                      className="form-select border-0 p-0 fw-black text-dark fs-8 bg-transparent cursor-pointer"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                    >
                      <option value="all">All Destinations</option>
                      {DESTINATIONS.slice(1).map(dest => (
                        <option value={dest.id} key={dest.id}>{dest.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Month */}
                  <div className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light pkg-min-w-180" >
                    <span className="text-muted fw-bold d-block text-uppercase mb-1 pkg-label-xs" >TRAVEL MONTH</span>
                    <select 
                      className="form-select border-0 p-0 fw-black text-dark fs-8 bg-transparent cursor-pointer"
                      value={travelMonth}
                      onChange={(e) => setTravelMonth(e.target.value)}
                    >
                      <option value="August 2026">August 2026</option>
                      <option value="September 2026">September 2026</option>
                      <option value="October 2026">October 2026</option>
                      <option value="November 2026">November 2026</option>
                      <option value="December 2026">December 2026</option>
                    </select>
                  </div>

                  {/* Guests */}
                  <div className="flex-grow-1 p-3 border-end text-start cursor-pointer hover-bg-light pkg-min-w-130" >
                    <span className="text-muted fw-bold d-block text-uppercase mb-1 pkg-label-xs" >TRAVELERS</span>
                    <select 
                      className="form-select border-0 p-0 fw-black text-dark fs-8 bg-transparent cursor-pointer"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                    >
                      <option value={1}>1 Traveler</option>
                      <option value={2}>2 Travelers</option>
                      <option value={3}>3 Travelers</option>
                      <option value={4}>4 Travelers</option>
                      <option value={5}>5+ Travelers</option>
                    </select>
                  </div>

                  {/* Apply Search Button */}
                  <div className="d-flex align-items-center justify-content-center px-4 pkg-bg-white" >
                    <button 
                      type="submit" 
                      className="btn fw-black text-white text-uppercase px-4 py-2.5 rounded-pill shadow-sm"
                      style={{ 
                        backgroundColor: '#0061ae', 
                        border: '0', 
                        fontSize: '13px', 
                        letterSpacing: '0.5px'
                      }}
                    >
                      APPLY
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="container py-5">
        


        {/* 5. Main Listings & Filters Grid */}
        <div className="row g-4 pt-4" id="package-listing-section">
          
          {/* Left Sidebar Filters */}
          <div className="col-lg-3">
            <div className="bg-white p-4 border rounded-3 shadow-sm text-start pkg-border-light" >
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2.5 mb-3.5">
                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2 pkg-fs-15" >
                  <i className="fa-solid fa-sliders text-primary me-1" style={{ fontSize: "13px" }}></i> Filter Results
                </h5>
                <button 
                  onClick={resetFilters}
                  className="btn btn-sm btn-link p-0 text-decoration-none fs-8   fw-bold"
                >
                  Reset All
                </button>
              </div>

              {/* Sorting Block */}
              <div className="filter-section border-bottom pb-3.5 mb-3.5 text-start">
                <h6 className="fw-bold mb-2.5 text-dark pkg-fs-13" >Sort Packages By</h6>
                <select 
                  className="form-select form-select-sm fs-8 py-2 border rounded-3 pkg-outline-none" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Price Budget Block */}
              <div className="filter-section border-bottom pb-3.5 mb-3.5 text-start">
                <h6 className="fw-bold mb-1.5 text-dark pkg-fs-13" >Max Price Limit</h6>
                <div className="d-flex justify-content-between text-muted mb-1.5 pkg-fs-11" >
                  <span>₹30,000</span>
                  <span>₹3,50,000</span>
                </div>
                <input 
                  type="range" 
                  className="form-range" 
                  min="30000" 
                  max="350000" 
                  step="10000" 
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(parseInt(e.target.value, 10))}
                />
                <div className="fw-bold   fs-8 mt-2">₹{budgetLimit.toLocaleString()} / person</div>
              </div>

              {/* Duration Filter Block */}
              <div className="filter-section border-bottom pb-3.5 mb-3.5 text-start">
                <h6 className="fw-bold mb-2.5 text-dark pkg-fs-13" >Duration (Days)</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { id: 'all', label: 'All Durations' },
                    { id: 'short', label: 'Up to 5 Days' },
                    { id: 'medium', label: '6 to 8 Days' },
                    { id: 'long', label: '9+ Days' }
                  ].map(dur => (
                    <label className="d-flex align-items-center gap-2 fs-8 text-secondary cursor-pointer" key={dur.id}>
                      <input 
                        type="radio" 
                        name="durationGroup" 
                        checked={durationFilter === dur.id} 
                        onChange={() => setDurationFilter(dur.id)}
                        className="form-check-input"
                      />
                      <span>{dur.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hotel Star Rating Filter Block */}
              <div className="filter-section border-bottom pb-3.5 mb-3.5 text-start">
                <h6 className="fw-bold mb-2.5 text-dark pkg-fs-13" >Hotel Star Rating</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { id: 'all', label: 'All Ratings' },
                    { id: '5star', label: '4.8 ★ & Above (5 Star)' },
                    { id: '4star', label: '4.5 ★ to 4.7 ★ (4 Star)' },
                    { id: '3star', label: 'Below 4.5 ★ (3 Star)' }
                  ].map(star => (
                    <label className="d-flex align-items-center gap-2 fs-8 text-secondary cursor-pointer" key={star.id}>
                      <input 
                        type="radio" 
                        name="starRatingGroup" 
                        checked={starRatingFilter === star.id} 
                        onChange={() => setStarRatingFilter(star.id)}
                        className="form-check-input"
                      />
                      <span>{star.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Flight Inclusion Filter Block */}
              <div className="filter-section border-bottom pb-3.5 mb-3.5 text-start">
                <h6 className="fw-bold mb-2.5 text-dark pkg-fs-13" >Flight Inclusions</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { id: 'all', label: 'All Packages' },
                    { id: 'withFlights', label: 'Flights Included' },
                    { id: 'noFlights', label: 'Land Only (No Flights)' }
                  ].map(flt => (
                    <label className="d-flex align-items-center gap-2 fs-8 text-secondary cursor-pointer" key={flt.id}>
                      <input 
                        type="radio" 
                        name="flightInclusionGroup" 
                        checked={flightInclusionFilter === flt.id} 
                        onChange={() => setFlightInclusionFilter(flt.id)}
                        className="form-check-input"
                      />
                      <span>{flt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Taxi/Cab Inclusion Filter Block */}
              <div className="filter-section text-start mb-2">
                <h6 className="fw-bold mb-2.5 text-dark pkg-fs-13" >Cab/Taxi Inclusions</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { id: 'all', label: 'All Packages' },
                    { id: 'withTaxi', label: 'Taxi/Cab Included' },
                    { id: 'noTaxi', label: 'Without Taxi' }
                  ].map(cab => (
                    <label className="d-flex align-items-center gap-2 fs-8 text-secondary cursor-pointer" key={cab.id}>
                      <input 
                        type="radio" 
                        name="taxiInclusionGroup" 
                        checked={taxiInclusionFilter === cab.id} 
                        onChange={() => setTaxiInclusionFilter(cab.id)}
                        className="form-check-input"
                      />
                      <span>{cab.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Holiday Package Listings */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0 pkg-fs-16" >
                {filteredPackages.length} Holiday Packages for {getDestinationName()} Found
              </h5>
            </div>

            {/* LehConnect Holiday Themes Tab Bar */}
            <div className="bg-white border rounded-3 shadow-sm p-3 mb-4 text-start pkg-border-light">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2 pb-1.5 border-bottom">
                <span className="text-uppercase text-muted fw-bold pkg-label-xs" style={{ letterSpacing: '0.5px' }}>
                  EXPLORE BY THEME
                </span>
                <span className="text-secondary fs-8 fw-semibold">
                  Showing {filteredPackages.length} {activeTheme === 'all' ? 'total' : holidayThemeTabs.find(t => t.id === activeTheme)?.label} packages
                </span>
              </div>

              <div 
                className="d-flex flex-nowrap overflow-x-auto gap-2 py-1 holiday-theme-tabs-scroll"
                style={{ 
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {holidayThemeTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTheme === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => selectTheme(tab.id)}
                      className={`btn d-flex align-items-center gap-2 rounded-pill px-3 py-2 text-nowrap border flex-shrink-0 ${
                        isActive
                          ? 'btn-primary text-white shadow-sm border-0 fw-bold'
                          : 'btn-light bg-white text-dark border-secondary-subtle fw-semibold hover-bg-light'
                      }`}
                      style={{
                        backgroundColor: isActive ? '#0061ae' : '#ffffff',
                        borderColor: isActive ? '#0061ae' : '#e0e0e0',
                        fontSize: '12.5px',
                        lineHeight: '1.2',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${tab.color}15`,
                          color: isActive ? '#ffffff' : tab.color,
                          fontSize: '11px'
                        }}
                      >
                        <i className={tab.icon}></i>
                      </span>
                      <span>{tab.label}</span>
                      <span
                        className={`badge rounded-pill ${
                          isActive ? 'bg-white text-primary' : 'bg-light text-secondary border'
                        }`}
                        style={{ fontSize: '10px', padding: '3px 7px' }}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredPackages.length === 0 ? (
              <div className="card p-5 border text-center rounded-3 shadow-sm bg-white pkg-border-light" >
                <div className="text-muted fs-3 mb-2">🏝</div>
                <h5 className="fw-bold text-dark">
                  {activeTheme !== 'all' 
                    ? `No ${holidayThemeTabs.find(t => t.id === activeTheme)?.label} Found for ${getDestinationName()}`
                    : 'No Packages Match Filters'
                  }
                </h5>
                <p className="text-secondary fs-8">
                  {activeTheme !== 'all'
                    ? `Try selecting "All Packages" or reset your filter criteria to see more packages.`
                    : 'Try expanding your budget limits or resetting filters.'
                  }
                </p>
                <div className="d-flex justify-content-center flex-wrap gap-2 mt-2">
                  {activeTheme !== 'all' && (
                    <button onClick={() => selectTheme('all')} className="btn btn-outline-primary rounded-pill px-4 py-2 border fw-bold fs-8">
                      View All {getDestinationName()} Packages
                    </button>
                  )}
                  <button onClick={resetFilters} className="btn btn-primary rounded-pill px-4 py-2 border-0 fw-bold fs-8">
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3.5">
                {filteredPackages.map(pkg => {
                  const price = parseInt(pkg.actualPrice.replace(/,/g, ''), 10);
                  const titleLower = pkg.title.toLowerCase();
                  const itineraryLower = pkg.itinerary.toLowerCase();
                  
                  const hasFlight = titleLower.includes('flight') || titleLower.includes('explore') || pkg.id.includes('sin') || pkg.id.includes('mld');
                  const hasTaxi = itineraryLower.includes('transfers') || 
                                  itineraryLower.includes('cab') ||
                                  itineraryLower.includes('sedan') ||
                                  itineraryLower.includes('chauffeur') ||
                                  titleLower.includes('safari') ||
                                  pkg.id.includes('raj') || pkg.id.includes('nei') || pkg.id.includes('eur');

                  return (
                    <div 
                      key={pkg.id} 
                      onClick={() => navigate(`/holidays/${pkg.id}`)}
                      className="card border rounded-3 p-3 shadow-sm bg-white text-start card-hover-shadow cursor-pointer overflow-hidden pkg-border-light"
                    >
                      <div className="d-flex flex-column flex-md-row gap-3">
                        
                        {/* Image Frame */}
                        <div className="position-relative flex-shrink-0 mx-auto mx-md-0">
                          {pkg.promoText && (
                            <span className="position-absolute start-0 top-0 badge bg-danger text-white fw-bold px-2.5 py-1.5 fs-9 rounded-0 z-1 pkg-badge-br-8" >
                              {pkg.promoText}
                            </span>
                          )}
                          <div className="pkg-card-img-container rounded-2 overflow-hidden">
                            <img src={pkg.images[0] || '/images/holidays/photo-1529963183134-61a90db47eaf.webp'} alt={pkg.title} className="w-100 h-100 object-fit-cover hover-scale" loading="lazy" decoding="async" />
                          </div>
                        </div>

                        {/* Middle Info Column */}
                        <div className="pkg-card-info-col d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex align-items-center gap-1.5 mb-2">
                              <span className="bg-success text-white px-2 py-0.5 rounded fs-9 fw-bold d-flex align-items-center gap-1">
                                <i className="fa-solid fa-star me-1" style={{ fontSize: "9px" }}></i> {pkg.rating}
                              </span>
                              <span className="text-secondary fs-9">({pkg.reviews} reviews)</span>
                            </div>

                            <h5 className="fw-bold text-dark mb-2 text-start pkg-title-text" >{pkg.title}</h5>
                            <span className="text-muted fs-8 d-block mb-3.5"><i className="fa-regular fa-clock me-1.5"></i> {pkg.duration}</span>
                            
                            {/* LehConnect-Style Inclusion Timeline representation */}
                            <div className="d-flex align-items-center gap-3 text-secondary mb-3 pkg-fs-12" >
                              {hasFlight && <span className="d-flex align-items-center gap-1.5" title="Roundtrip Flight Included"><i className="fa-solid fa-plane text-primary"></i> Flight</span>}
                              <span className="d-flex align-items-center gap-1.5" title="Premium Stays"><i className="fa-solid fa-hotel text-success"></i> Stays</span>
                              {hasTaxi && <span className="d-flex align-items-center gap-1.5" title="Cab/Taxi Transfers Included"><i className="fa-solid fa-car text-warning"></i> Transfer/Taxi</span>}
                              <span className="d-flex align-items-center gap-1.5" title="Sightseeings"><i className="fa-solid fa-suitcase text-info"></i> Tours</span>
                            </div>
                          </div>

                          {/* Visual Route representation */}
                          <div className="p-2 rounded text-secondary mt-auto d-flex align-items-center gap-1.5 pkg-footer-summary" >
                            <strong className="flex-shrink-0">Itinerary:</strong> 
                            <span className="text-truncate">{fromCity} ➔ {pkg.itinerary.replace(/ • /g, ' ➔ ')}</span>
                          </div>
                        </div>

                        {/* Right Pricing Column */}
                        <div className="pkg-card-price-col text-md-end d-flex flex-column justify-content-between border-start border-light ps-md-3.5 pt-2">
                          <div className="mb-3">
                            <span className="badge bg-light text-secondary border fs-9 mb-2">Customizable</span>
                            {pkg.saveAmount && (
                              <div className="text-success fw-bold pkg-fs-12" >Save ₹{pkg.saveAmount}</div>
                            )}
                            <div className="d-flex align-items-center justify-content-md-end gap-1.5 mt-1">
                              <span className="text-muted text-decoration-line-through fs-8">₹{pkg.originalPrice}</span>
                              <span className="fw-black text-dark fs-4">₹{pkg.actualPrice}</span>
                            </div>
                            <div className="text-muted fs-9">per person</div>
                          </div>
                          
                          <button 
                            type="button" 
                            className="btn w-100 rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-1.5 border-0 text-white pkg-btn-blue-grad"
                          >
                            Explore Package
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed Packages */}
        <div className="leh-carousel-section mt-5">
          <div className="leh-carousel-header">
            <div>
              <h4 className="leh-carousel-title text-start">Recently Viewed Packages</h4>
            </div>
            <div className="leh-scroll-btn-group">
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-recently-viewed', 'left')}><i className="fa-solid fa-chevron-left"></i></button>
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-recently-viewed', 'right')}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="leh-carousel-container" id="carousel-recently-viewed">
            {recentlyViewedData.map((pkg, idx) => (
              <div className="leh-viewed-card" key={idx} onClick={() => navigate(`/holidays/${pkg.id}`)}>
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ maxWidth: '170px' }}>
                      <span className="text-muted d-block uppercase" style={{ fontSize: '10px', fontWeight: 'bold' }}>{pkg.title}</span>
                      <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>{pkg.subtitle}</h6>
                      <span className="text-secondary" style={{ fontSize: '10px' }}>{pkg.details}</span>
                    </div>
                    <div className="position-relative" style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={pkg.img} alt={pkg.subtitle} className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
                      <span className="position-absolute bottom-0 start-0 end-0 bg-primary text-white text-center fw-bold" style={{ fontSize: '8px', padding: '1px 0' }}>{pkg.badge}</span>
                    </div>
                  </div>
                  <div className="border-top pt-2 mt-2">
                    <span className="fw-black text-dark fs-5">{pkg.price}</span>
                    <span className="text-muted" style={{ fontSize: '10px' }}> /person</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-3" style={{ margin: '-16px -16px -16px -16px', padding: '12px 16px', backgroundColor: '#f5f9ff', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                  <span className="text-secondary fw-bold" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: pkg.action === 'VIEW' ? '#999999' : '#ff9900', display: 'inline-block' }}></span>
                    {pkg.footer}
                  </span>
                  <button type="button" className="btn btn-link p-0 text-decoration-none fw-bold text-brand-primary border-0 bg-transparent" style={{ fontSize: '12px' }}>
                    {pkg.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offers Carousel */}
        <div className="leh-carousel-section">
          <div className="leh-carousel-header">
            <div className="text-start">
              <h4 className="leh-carousel-title mb-1">Up to Rs 10,000 off!</h4>
              <p className="leh-carousel-subtitle">Use Coupon Code: <strong>LEHESCAPE</strong></p>
            </div>
            <div className="leh-scroll-btn-group">
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-offers', 'left')}><i className="fa-solid fa-chevron-left"></i></button>
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-offers', 'right')}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="leh-carousel-container" id="carousel-offers">
            {offersData.map((item, idx) => (
              <div 
                className="leh-dest-overlay-card" 
                key={idx} 
                onClick={() => { 
                  const targetDest = item.name.toLowerCase() === 'goa' ? 'goa' : 'all';
                  setToCity(targetDest); 
                  setSearchTrigger(prev => prev + 1); 
                  const el = document.getElementById('package-listing-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={item.img} alt={item.name} className="leh-dest-overlay-img" loading="lazy" decoding="async" />
                <div className="leh-dest-gradient"></div>
                <h5 className="leh-dest-name-overlay">{item.name}</h5>
              </div>
            ))}
          </div>
        </div>

        {/* Last-Minute Escape Sale Carousel */}
        <div className="leh-carousel-section">
          <div className="leh-carousel-header">
            <div className="text-start">
              <h4 className="leh-carousel-title mb-1">Last-Minute Escape Sale!</h4>
              <p className="leh-carousel-subtitle">Book your spontaneous getaway. Use code: <strong>LASTMINUTE</strong></p>
            </div>
            <div className="leh-scroll-btn-group">
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-last-minute', 'left')}><i className="fa-solid fa-chevron-left"></i></button>
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-last-minute', 'right')}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="leh-carousel-container" id="carousel-last-minute">
            {lastMinuteData.map((item, idx) => (
              <div 
                className="leh-dest-overlay-card" 
                key={idx} 
                onClick={() => { 
                  const targetDest = item.name.toLowerCase() === 'goa' ? 'goa' : 'all';
                  setToCity(targetDest); 
                  setActiveTheme('lastminute');
                  setSearchTrigger(prev => prev + 1); 
                  const el = document.getElementById('package-listing-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={item.img} alt={item.name} className="leh-dest-overlay-img" loading="lazy" decoding="async" />
                <div className="leh-dest-gradient"></div>
                <h5 className="leh-dest-name-overlay">{item.name}</h5>
              </div>
            ))}
          </div>
        </div>

        {/* Spiritual Escapes Carousel */}
        <div className="leh-carousel-section">
          <div className="leh-carousel-header">
            <div className="text-start">
              <h4 className="leh-carousel-title mb-1">Spiritual Escapes at Lowest prices!</h4>
              <p className="leh-carousel-subtitle">Explore Pilgrimage packages</p>
            </div>
            <div className="leh-scroll-btn-group">
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-spiritual', 'left')}><i className="fa-solid fa-chevron-left"></i></button>
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-spiritual', 'right')}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="leh-carousel-container" id="carousel-spiritual">
            {spiritualData.map((item, idx) => (
              <div className="leh-dest-overlay-card" key={idx} onClick={() => { setToCity('all'); setSearchTrigger(prev => prev + 1); }}>
                <img src={item.img} alt={item.name} className="leh-dest-overlay-img" loading="lazy" decoding="async" />
                <div className="leh-dest-gradient"></div>
                <h5 className="leh-dest-name-overlay">{item.name}</h5>
              </div>
            ))}
          </div>
        </div>

        {/* International Destinations Carousel */}
        <div className="leh-carousel-section">
          <div className="leh-carousel-header">
            <div className="text-start">
              <h4 className="leh-carousel-title mb-1">International Destinations</h4>
              <p className="leh-carousel-subtitle">From Bucket List to Boarding Pass!</p>
            </div>
            <div className="leh-scroll-btn-group">
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-international', 'left')}><i className="fa-solid fa-chevron-left"></i></button>
              <button type="button" className="leh-scroll-btn" onClick={() => handleScrollCarousel('carousel-international', 'right')}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="leh-carousel-container" id="carousel-international">
            {internationalData.map((item, idx) => (
              <div className="leh-intl-card" key={idx} onClick={() => { setToCity('all'); setSearchTrigger(prev => prev + 1); }}>
                <div className="leh-intl-img-frame">
                  <img src={item.img} alt={item.name} className="leh-dest-overlay-img" loading="lazy" decoding="async" />
                  <div className="leh-dest-gradient"></div>
                </div>
                <h5 className="leh-intl-name">{item.name}</h5>
                <span className="leh-intl-price">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Destination Guides & Informational Content */}
        <section className="mt-5 border-top pt-5">
          <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3 text-start pkg-border-1-light" >
            <h4 className="fw-bold text-dark mb-3 pkg-fs-20" >Holiday Destination Advisory &amp; Booking Guide</h4>
            <p className="text-secondary fs-8">
              Booking a holiday package on LehConnect is designed to be smooth and flexible. With our customizable itineraries, you can plan trip duration, pick the best hotels, flights, and private transfers that suit your travel schedule.
            </p>
            <div className="row g-4 mt-1">
              <div className="col-md-6 text-start">
                <h6 className="fw-bold text-dark mb-2"><i className="fa-solid fa-circle-info text-primary me-2"></i> When is the Best Time to Travel?</h6>
                <p className="text-secondary fs-8 mb-0">
                  - <strong>Maldives:</strong> Best experienced between November and April for clear water and white sands.<br />
                  - <strong>Europe:</strong> Travel during May to September to enjoy sunny weather and cultural festivals.<br />
                  - <strong>Japan:</strong> Famous for cherry blossom blooms in March/April and winter skiing in January.<br />
                  - <strong>Rajasthan &amp; Dubai:</strong> Highly recommended from October to March for cool, pleasant outdoor temperatures.
                </p>
              </div>
              <div className="col-md-6 text-start">
                <h6 className="fw-bold text-dark mb-2"><i className="fa-solid fa-check text-success me-2"></i> What is Included in My Package?</h6>
                <p className="text-secondary fs-8 mb-0">
                  All LehConnect packages are structured to cover essential elements of hassle-free travel: premium hotel accommodation, return flight tickets, local guided sightseeing transfers, breakfast/meals, and travel insurance. Additional activities can be customized during the review page.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQs Accordions Section */}
        <section className="mb-4 text-start">
          <h4 className="fw-bold text-dark mb-3.5 pkg-fs-20" >Frequently Asked Questions for Holiday Bookings</h4>
          <div className="d-flex flex-column gap-2">
            {faqsList.map((item, index) => (
              <div className="card shadow-sm rounded-3 overflow-hidden bg-white pkg-border-1-light" key={index} >
                <button 
                  className="btn btn-link w-100 text-start text-decoration-none fw-bold text-dark p-3d-flex justify-content-between align-items-center border-0 bg-transparent fs-7 pkg-accordion-header"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  type="button"
                >
                  <span>Q: {item.q}</span>
                  <span className="text-secondary">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <div className="border-top p-3bg-light text-secondary fs-8">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 8. Bottom Footer Directory Links */}
        <section className="mt-5 border-top pt-5">
          <div className="card border-0 p-0 mb-4 bg-transparent text-start">
            <h4 className="fw-bold text-dark mb-4 border-bottom pb-2">LehConnect Curation Directory Links</h4>
            <div className="row g-4">
              {[
                {
                  title: "Honeymoon Packages",
                  links: [
                    { text: "Maldives Honeymoon Package", url: "/holidays/pkg-mld-1" },
                    { text: "Europe Romantic Trails Tour", url: "/holidays/pkg-eur-3" },
                    { text: "Scenic Norway Aurora Escape", url: "/holidays/pkg-nor-1" },
                    { text: "Pristine Kerala Backwaters Special", url: "/holidays" }
                  ]
                },
                {
                  title: "Family Tour Packages",
                  links: [
                    { text: "Classic Japan Heritage Explorer", url: "/holidays/pkg-jap-1" },
                    { text: "Dubai Theme Parks & Safari Combo", url: "/holidays/pkg-dxb-2" },
                    { text: "Royal Rajasthan Forts & Heritage Tour", url: "/holidays/pkg-raj-1" },
                    { text: "Singapore Sentosa Island Escape", url: "/holidays/pkg-sin-1" }
                  ]
                },
                {
                  title: "Adventure & Wildlife Packages",
                  links: [
                    { text: "Iceland Southern Shores Adventure", url: "/holidays/pkg-eur-2" },
                    { text: "Norway Fjords & Tromso Expedition", url: "/holidays/pkg-nor-2" },
                    { text: "Desert Camping in Jaisalmer Sam Dunes", url: "/holidays/pkg-raj-2" },
                    { text: "Meghalaya Cherrapunji Hills Exploration", url: "/holidays/pkg-nei-1" }
                  ]
                },
                {
                  title: "Trending Hill Station Packages",
                  links: [
                    { text: "Meghalaya & Shillong Hills Wonders Tour", url: "/holidays/pkg-nei-1" },
                    { text: "Sikkim & Darjeeling Tea Gardens Escape", url: "/holidays/pkg-nei-2" },
                    { text: "Japan Hokkaido Winter Snow Festival", url: "/holidays/pkg-jap-2" },
                    { text: "Scenic Himachal Kullu Manali Package", url: "/holidays" }
                  ]
                }
              ].map((category, index) => (
                <div className="col-md-6 col-lg-3" key={index}>
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-2.5 pkg-fs-rem-85" >{category.title}</h6>
                  <ul className="list-unstyled d-flex flex-column gap-2 cab-fs-rem-78" >
                    {category.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <a href={link.url} className="text-secondary hover-text-primary text-decoration-none d-block text-truncate">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      

      {/* Floating "Customise my trip" Button */}
      <button 
        type="button" 
        onClick={() => setShowCustomiseModal(true)} 
        className="fixed-customise-trip-btn"
      >
        <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
        Customise my trip
      </button>

      {/* Customise Trip Modal Overlay */}
      {showCustomiseModal && (
        <div className="modal fade show d-block" tabIndex={-1} onClick={() => setShowCustomiseModal(false)} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100000 }}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom bg-light px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                  <i className="fa-solid fa-wand-magic-sparkles text-brand-primary"></i> Customise Your Trip
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowCustomiseModal(false)} />
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                toast.success('Your custom trip request has been submitted! Our holiday expert will call you shortly.');
                setShowCustomiseModal(false);
              }} className="modal-body p-4 text-start">
                
                <p className="text-muted fs-8 mb-4">Tell us what you are looking for, and our destination planners will build your perfect custom itinerary.</p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Starting From</label>
                    <input type="text" className="form-control fs-8 customise-form-input" placeholder="e.g. New Delhi" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Going To</label>
                    <input type="text" className="form-control fs-8 customise-form-input" placeholder="e.g. Himachal Pradesh" required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Starting Date</label>
                    <input type="date" className="form-control fs-8 customise-form-input" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Duration (Nights)</label>
                    <input type="number" className="form-control fs-8 customise-form-input" min={1} placeholder="e.g. 5" required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">No. of Travellers</label>
                    <input type="number" className="form-control fs-8 customise-form-input" min={1} placeholder="e.g. 2" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-8 fw-bold text-secondary">Your Mobile Number</label>
                    <input type="tel" className="form-control fs-8 customise-form-input" maxLength={10} placeholder="e.g. 9876543210" required />
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary btn-sm fw-bold px-3 py-2" onClick={() => setShowCustomiseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm fw-bold px-4 py-2" style={{ backgroundColor: '#7b2cbf', borderColor: '#7b2cbf' }}>
                    Submit Request
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

export default HolidayListing;

