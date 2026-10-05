'use client';

import React, { useState, useMemo } from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const HotelListing = () => {
  const navigate = useNavigate();
  const { searchParams, updateSearchParams, setCheckoutItem, wishlist, setWishlist } = useBooking();
  const hotelParams = searchParams?.hotels || { city: 'Leh', checkIn: '2026-09-12', checkOut: '2026-09-15', guests: '2 Guests, 1 Room', roomType: 'all' };

  // Search State in Top Strip
  const initialCity = (!hotelParams.city || hotelParams.city.toLowerCase() === 'lehconnect') ? 'Leh' : hotelParams.city;
  const [searchCity, setSearchCity] = useState(initialCity);
  const [searchCheckIn, setSearchCheckIn] = useState(hotelParams.checkIn || '2026-09-12');
  const [searchCheckOut, setSearchCheckOut] = useState(hotelParams.checkOut || '2026-09-15');
  const [searchGuests, setSearchGuests] = useState(2);
  const [searchRooms, setSearchRooms] = useState(1);

  // Sorting State
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'price_asc' | 'price_desc'

  // Filter States
  const [selectedStars, setSelectedStars] = useState([]); // [5, 4, 3]
  const [priceRange, setPriceRange] = useState(25000);
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('all');
  const [selectedLocalities, setSelectedLocalities] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [quickFilters, setQuickFilters] = useState({
    freeCancellation: false,
    breakfastIncluded: false,
    mountainView: false,
    fiveStar: false,
    topRated: false,
    doctorOnCall: false
  });

  // Modal / Room Selection Drawer State
  const [selectedHotelForModal, setSelectedHotelForModal] = useState(null);
  const [selectedRoomPlan, setSelectedRoomPlan] = useState('breakfast');

  // Active Hero Image per Hotel ID (for thumbnail hover/clicks)
  const [activeCardImages, setActiveCardImages] = useState({});

  // Mobile Filters Drawer Toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Comprehensive Authentic Ladakh Hotels Dataset
  const hotelsList = useMemo(() => [
    {
      id: 'htl-1',
      name: 'The Grand Dragon Ladakh',
      starRating: 5,
      category: '5-Star Luxury Resort',
      locality: 'Fort Road, Leh',
      distance: '1.2 km from Leh Main Bazaar • 3.8 km from Kushok Bakula Airport',
      userScore: 4.8,
      verdict: 'Excellent',
      reviewsCount: 1840,
      price: 9800,
      originalPrice: 13500,
      discount: '27% OFF',
      taxes: 1176,
      roomsLeft: 2,
      isAssured: true,
      heroImg: '/images/booking/hotel-grand-dragon-resort.webp',
      gallery: [
        '/images/booking/hotel-grand-dragon-resort.webp',
        '/images/booking/hotel-luxury-resort.webp',
        '/images/booking/hotel-deluxe-comfort.webp',
        '/images/booking/hotel-zen-ladakh.webp'
      ],
      roomType: 'Deluxe Mountain View Room | 340 sq.ft | 1 King Bed',
      propertyType: 'Luxury Resort',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast', 'free_cancel', 'parking'],
      highlights: [
        'Free Cancellation till 24 hrs prior to check-in',
        'Free Gourmet Breakfast & Welcome Kashmiri Kahwa Included',
        'Unobstructed Panoramic Views of Stok Kangri Himalayan Range',
        '24x7 In-House Centralized Oxygen Enrichment & Doctor on Call'
      ],
      roomOptions: [
        {
          id: 'rm-1',
          name: 'Deluxe Mountain View Room',
          size: '340 sq.ft',
          bed: '1 King Bed or 2 Twin Beds',
          view: 'Stok Kangri Mountain View',
          img: '/images/booking/hotel-grand-dragon-resort.webp',
          plans: [
            { id: 'ro', name: 'Room Only', price: 9800, perks: ['Free High-Speed Wi-Fi', 'Complimentary Oxygen Support'] },
            { id: 'bf', name: 'Room with Free Breakfast', price: 10600, perks: ['Free Buffet Breakfast', 'Free Cancellation', 'Welcome Drinks'] },
            { id: 'map', name: 'Breakfast + Dinner (Half Board)', price: 12400, perks: ['Buffet Breakfast & Multi-Cuisine Dinner', 'Airport Pickup Included'] }
          ]
        },
        {
          id: 'rm-2',
          name: 'Heritage Valley Suite',
          size: '520 sq.ft',
          bed: '1 Ultra King Bed + Living Area',
          view: '360° Valley & Glacier View',
          img: '/images/booking/hotel-luxury-resort.webp',
          plans: [
            { id: 'bf', name: 'Suite with All Meals & Perks', price: 15800, perks: ['All Meals Included', 'Butler Service', 'Private Balcony', 'Free Airport Transfers'] }
          ]
        }
      ]
    },
    {
      id: 'htl-2',
      name: 'Taj Lake Palace Leh',
      starRating: 5,
      category: '5-Star Heritage Palace Resort',
      locality: 'Pangong Lake Road, Leh',
      distance: '2.5 km from Leh Palace • 4.1 km from Shanti Stupa',
      userScore: 4.9,
      verdict: 'Superb',
      reviewsCount: 1420,
      price: 14500,
      originalPrice: 19000,
      discount: '24% OFF',
      taxes: 1740,
      roomsLeft: 3,
      isAssured: true,
      heroImg: '/images/booking/hotel-taj-palace.webp',
      gallery: [
        '/images/booking/hotel-taj-palace.webp',
        '/images/booking/hotel-luxury-resort.webp',
        '/images/booking/hotel-mountain-view.webp',
        '/images/booking/hotel-singge-palace.webp'
      ],
      roomType: 'Royal Palace Lake View Suite | 420 sq.ft | 1 King Bed',
      propertyType: 'Heritage Palace',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast', 'free_cancel', 'parking'],
      highlights: [
        'Complimentary High-Altitude Acclimatization Kit & Heated Rooms',
        'Free Lavish Royal Breakfast & High Tea Included',
        'Private Sunset Balcony overlooking Himalayan Glaciers',
        'Free Luxury Airport Transfer & Express Check-in'
      ],
      roomOptions: [
        {
          id: 'rm-3',
          name: 'Royal Palace Lake Suite',
          size: '420 sq.ft',
          bed: '1 King Bed',
          view: 'Lake & Glacier View',
          img: '/images/booking/hotel-taj-palace.webp',
          plans: [
            { id: 'bf', name: 'Royal Stays with Free Breakfast', price: 14500, perks: ['Free Breakfast', 'Heated Floors', 'Complimentary Minibar', 'Free Cancellation'] },
            { id: 'map', name: 'Royal Half Board (Breakfast + Dinner)', price: 17200, perks: ['Buffet Breakfast & Dinner', 'Private Butler Service', 'Airport Pick & Drop'] }
          ]
        }
      ]
    },
    {
      id: 'htl-3',
      name: 'The Oberoi Grand Nubra Resort',
      starRating: 5,
      category: 'Luxury Desert Camp & Suites',
      locality: 'Hunder, Nubra Valley',
      distance: '800m from Hunder Sand Dunes & Bactrian Camel Safari',
      userScore: 4.8,
      verdict: 'Excellent',
      reviewsCount: 960,
      price: 16200,
      originalPrice: 21500,
      discount: '25% OFF',
      taxes: 1944,
      roomsLeft: 1,
      isAssured: true,
      heroImg: '/images/booking/hotel-luxury-resort.webp',
      gallery: [
        '/images/booking/hotel-luxury-resort.webp',
        '/images/booking/hotel-deluxe-comfort.webp',
        '/images/booking/hotel-zen-ladakh.webp',
        '/images/booking/hotel-mountain-view.webp'
      ],
      roomType: 'Luxury Royal Desert Glamping Tent | 450 sq.ft',
      propertyType: 'Glamping Camp',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast', 'free_cancel'],
      highlights: [
        'Luxury Insulated Heated Tents amidst High Altitude Desert',
        'Complimentary Desert Stargazing Telescope Experience',
        'Free Multi-Cuisine Breakfast & Traditional Ladakhi Feast',
        'Doctor on Site with 24x7 Medical Oxygen Concentrators'
      ],
      roomOptions: [
        {
          id: 'rm-4',
          name: 'Royal Glamping Desert Tent',
          size: '450 sq.ft',
          bed: '1 Luxury King Bed',
          view: 'Nubra Dunes & Karakoram Range',
          img: '/images/booking/hotel-luxury-resort.webp',
          plans: [
            { id: 'bf', name: 'Glamping with Breakfast', price: 16200, perks: ['Free Breakfast', 'Stargazing Night Tour', 'Campfire Evening'] }
          ]
        }
      ]
    },
    {
      id: 'htl-4',
      name: 'The Zen Ladakh Wellness Resort',
      starRating: 5,
      category: '5-Star Eco-Wellness Resort',
      locality: 'Sheynam, Leh',
      distance: '1.5 km from Leh Airport • 2 km from Central Bazaar',
      userScore: 4.7,
      verdict: 'Excellent',
      reviewsCount: 1650,
      price: 12000,
      originalPrice: 15800,
      discount: '24% OFF',
      taxes: 1440,
      roomsLeft: 4,
      isAssured: true,
      heroImg: '/images/booking/hotel-zen-ladakh.webp',
      gallery: [
        '/images/booking/hotel-zen-ladakh.webp',
        '/images/booking/hotel-grand-dragon-resort.webp',
        '/images/booking/hotel-singge-palace.webp',
        '/images/booking/hotel-taj-palace.webp'
      ],
      roomType: 'Zen Premier Cottage | 360 sq.ft | Private Garden',
      propertyType: 'Luxury Resort',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast', 'free_cancel', 'parking'],
      highlights: [
        'Centrally Heated Eco-Cottages with Kashmiri Architecture',
        'All-Season Heated Indoor Swimming Pool & Himalayan Herbal Spa',
        'Free Breakfast Buffet & Organic Farm-to-Table Dining',
        'Full In-House Emergency Medical Unit & Altitude Care'
      ],
      roomOptions: [
        {
          id: 'rm-5',
          name: 'Zen Premier Valley Cottage',
          size: '360 sq.ft',
          bed: '1 King Bed',
          view: 'Apple Orchard & Mountain View',
          img: '/images/booking/hotel-zen-ladakh.webp',
          plans: [
            { id: 'bf', name: 'Zen Cottage with Breakfast', price: 12000, perks: ['Free Breakfast', 'Free Spa Access', 'Free Heated Pool'] }
          ]
        }
      ]
    },
    {
      id: 'htl-5',
      name: 'Hotel Singge Palace Leh',
      starRating: 4,
      category: '4-Star Heritage Boutique Hotel',
      locality: 'Fort Road, Leh',
      distance: '500m from Main Market • Walking distance to Old Town',
      userScore: 4.5,
      verdict: 'Very Good',
      reviewsCount: 1120,
      price: 6200,
      originalPrice: 8500,
      discount: '27% OFF',
      taxes: 744,
      roomsLeft: 5,
      isAssured: true,
      heroImg: '/images/booking/hotel-singge-palace.webp',
      gallery: [
        '/images/booking/hotel-singge-palace.webp',
        '/images/booking/hotel-budget-clean.webp',
        '/images/booking/hotel-deluxe-comfort.webp',
        '/images/booking/hotel-radisson-blu.webp'
      ],
      roomType: 'Heritage Deluxe Room | 280 sq.ft | 1 King Bed',
      propertyType: 'Heritage Boutique',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast', 'free_cancel'],
      highlights: [
        'Superb Location on Fort Road, 5 mins walk to shopping & cafes',
        'Free Continental & Indian Breakfast Buffet Included',
        'Wooden Handcrafted Ladakhi Decor with Modern Central Heating',
        'Medical O2 Cylinders available upon request'
      ],
      roomOptions: [
        {
          id: 'rm-6',
          name: 'Heritage Deluxe Room',
          size: '280 sq.ft',
          bed: '1 King Bed',
          view: 'Fort Road City View',
          img: '/images/booking/hotel-singge-palace.webp',
          plans: [
            { id: 'ro', name: 'Standard Room Only', price: 5600, perks: ['Free Wi-Fi', 'Heating'] },
            { id: 'bf', name: 'Room with Free Breakfast', price: 6200, perks: ['Free Breakfast Buffet', 'Free Cancellation'] }
          ]
        }
      ]
    },
    {
      id: 'htl-6',
      name: 'Radisson Blu Mountain Resort',
      starRating: 4,
      category: '4-Star Premium Mountain Valley Resort',
      locality: 'Indus Valley Road, Leh',
      distance: '3.2 km from Leh Center • Situated on Banks of Indus River',
      userScore: 4.6,
      verdict: 'Excellent',
      reviewsCount: 890,
      price: 8500,
      originalPrice: 11500,
      discount: '26% OFF',
      taxes: 1020,
      roomsLeft: 3,
      isAssured: true,
      heroImg: '/images/booking/hotel-radisson-blu.webp',
      gallery: [
        '/images/booking/hotel-radisson-blu.webp',
        '/images/booking/hotel-deluxe-comfort.webp',
        '/images/booking/hotel-luxury-resort.webp',
        '/images/booking/hotel-mountain-view.webp'
      ],
      roomType: 'Superior River View Room | 310 sq.ft',
      propertyType: 'Luxury Resort',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast', 'free_cancel', 'parking'],
      highlights: [
        'Direct Riverside Promenade along the historic Indus River',
        'Free Breakfast & 15% Discount on In-House Dining',
        'Central Heating, Geysers & Electric Blankets in every room',
        'Doctor on Call & Oxygen Kit Facility'
      ],
      roomOptions: [
        {
          id: 'rm-7',
          name: 'Superior River View Room',
          size: '310 sq.ft',
          bed: '1 King Bed or 2 Twins',
          view: 'Indus River & Mountain View',
          img: '/images/booking/hotel-radisson-blu.webp',
          plans: [
            { id: 'bf', name: 'River View with Breakfast', price: 8500, perks: ['Free Breakfast', 'River Promenade Access', 'Free Wi-Fi'] }
          ]
        }
      ]
    },
    {
      id: 'htl-7',
      name: 'Gomang Boutique Cultural Retreat',
      starRating: 4,
      category: '4-Star Boutique Cultural Hotel',
      locality: 'Changspa, Leh',
      distance: '1 km from Shanti Stupa • Peaceful Changspa Lane',
      userScore: 4.7,
      verdict: 'Excellent',
      reviewsCount: 740,
      price: 5400,
      originalPrice: 7200,
      discount: '25% OFF',
      taxes: 648,
      roomsLeft: 4,
      isAssured: false,
      heroImg: '/images/booking/hotel-deluxe-comfort.webp',
      gallery: [
        '/images/booking/hotel-deluxe-comfort.webp',
        '/images/booking/hotel-singge-palace.webp',
        '/images/booking/hotel-homestay-cozy.webp',
        '/images/booking/hotel-budget-clean.webp'
      ],
      roomType: 'Tibetan Cultural Room | 260 sq.ft | 1 Queen Bed',
      propertyType: 'Heritage Boutique',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast', 'free_cancel'],
      highlights: [
        'Tranquil location surrounded by willow trees and natural streams',
        'Complimentary Tibetan Herbal Tea & Organic Breakfast',
        'Extensive Himalayan Library and Meditation Hall',
        'Free Wi-Fi & Electric Bed Warmers'
      ],
      roomOptions: [
        {
          id: 'rm-8',
          name: 'Tibetan Cultural Deluxe',
          size: '260 sq.ft',
          bed: '1 Queen Bed',
          view: 'Garden & Mountain View',
          img: '/images/booking/hotel-deluxe-comfort.webp',
          plans: [
            { id: 'bf', name: 'Cultural Stay with Breakfast', price: 5400, perks: ['Free Organic Breakfast', 'Library & Meditation Hall'] }
          ]
        }
      ]
    },
    {
      id: 'htl-8',
      name: 'Himalayan View Cozy Homestay',
      starRating: 3,
      category: 'Himalayan Villa & Homestay',
      locality: 'Old Road, Leh',
      distance: '700m from Leh Market • Near Old Caravan Centre',
      userScore: 4.4,
      verdict: 'Very Good',
      reviewsCount: 520,
      price: 3500,
      originalPrice: 4800,
      discount: '27% OFF',
      taxes: 420,
      roomsLeft: 6,
      isAssured: false,
      heroImg: '/images/booking/hotel-mountain-view.webp',
      gallery: [
        '/images/booking/hotel-mountain-view.webp',
        '/images/booking/hotel-homestay-cozy.webp',
        '/images/booking/hotel-budget-clean.webp',
        '/images/booking/hotel-deluxe-comfort.webp'
      ],
      roomType: 'Traditional Ladakhi Room | 220 sq.ft | 1 Double Bed',
      propertyType: 'Homestay',
      amenities: ['wifi', 'heating', 'restaurant', 'medical', 'mountain_view', 'free_breakfast'],
      highlights: [
        'Warm, authentic Ladakhi family hospitality and home-cooked meals',
        'Rooftop Terrace with 360° View of Leh Palace & Shanti Stupa',
        'Fresh Farm Organic Breakfast with homemade Apricot Jam',
        'Oxygen Cylinder Support available 24/7'
      ],
      roomOptions: [
        {
          id: 'rm-9',
          name: 'Traditional Ladakhi Room',
          size: '220 sq.ft',
          bed: '1 Double Bed',
          view: 'Leh Palace View',
          img: '/images/booking/hotel-mountain-view.webp',
          plans: [
            { id: 'bf', name: 'Homestay with Home-Cooked Breakfast', price: 3500, perks: ['Homemade Organic Breakfast', 'Rooftop Access'] }
          ]
        }
      ]
    }
  ], []);

  // Update Top Search Bar
  const handleUpdateSearch = (e) => {
    e.preventDefault();
    updateSearchParams({
      hotels: {
        ...hotelParams,
        city: searchCity,
        checkIn: searchCheckIn,
        checkOut: searchCheckOut,
        guests: `${searchGuests} Guests, ${searchRooms} Room(s)`,
        rooms: searchRooms
      }
    });
    toast.success(`Search updated for ${searchCity || 'Ladakh'}!`);
  };

  // Toggle Wishlist
  const handleToggleWishlist = (hotelId) => {
    if (wishlist?.includes(hotelId)) {
      setWishlist(wishlist.filter(id => id !== hotelId));
      toast('Removed from saved stays', { icon: '🤍' });
    } else {
      setWishlist([...(wishlist || []), hotelId]);
      toast('Saved to wishlist!', { icon: '❤️' });
    }
  };

  // Toggle Quick Filter
  const toggleQuickFilter = (key) => {
    setQuickFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter and Sort Pipeline
  const processedHotels = useMemo(() => {
    let result = hotelsList.filter(hotel => {
      // Locality Filter:
      // When searchCity is 'Leh', 'all', 'LehConnect', or empty, ALL Ladakh properties show!
      // Only filter if user specifically chooses a sub-area like 'Nubra', 'Pangong', 'Changspa', etc.
      if (searchCity && searchCity !== 'all' && searchCity !== 'Leh' && searchCity.toLowerCase() !== 'lehconnect') {
        const term = searchCity.toLowerCase();
        const matchesCity = hotel.locality.toLowerCase().includes(term) ||
                            hotel.name.toLowerCase().includes(term);
        if (!matchesCity) return false;
      }

      // Sidebar Stars
      if (selectedStars.length > 0 && !selectedStars.includes(hotel.starRating)) {
        return false;
      }

      // Price Filter (Bracket or Range Slider)
      if (selectedPriceBracket === 'b1' && hotel.price > 5000) return false;
      if (selectedPriceBracket === 'b2' && (hotel.price < 5000 || hotel.price > 10000)) return false;
      if (selectedPriceBracket === 'b3' && (hotel.price < 10000 || hotel.price > 16000)) return false;
      if (selectedPriceBracket === 'b4' && hotel.price < 16000) return false;
      if ((selectedPriceBracket === 'all' || selectedPriceBracket === 'custom') && hotel.price > priceRange) return false;

      // Locality Sidebar
      if (selectedLocalities.length > 0) {
        const hasLocality = selectedLocalities.some(loc => hotel.locality.toLowerCase().includes(loc.toLowerCase()));
        if (!hasLocality) return false;
      }

      // Property Type Sidebar
      if (selectedPropertyTypes.length > 0) {
        const hasType = selectedPropertyTypes.some(t => hotel.propertyType.toLowerCase() === t.toLowerCase());
        if (!hasType) return false;
      }

      // Amenities Sidebar
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(a => hotel.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      // Quick Filters
      if (quickFilters.freeCancellation && !hotel.amenities.includes('free_cancel')) return false;
      if (quickFilters.breakfastIncluded && !hotel.amenities.includes('free_breakfast')) return false;
      if (quickFilters.mountainView && !hotel.amenities.includes('mountain_view')) return false;
      if (quickFilters.fiveStar && hotel.starRating !== 5) return false;
      if (quickFilters.topRated && hotel.userScore < 4.6) return false;
      if (quickFilters.doctorOnCall && !hotel.amenities.includes('medical')) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.userScore - a.userScore);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Popularity (default)
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [hotelsList, searchCity, selectedStars, priceRange, selectedPriceBracket, selectedLocalities, selectedPropertyTypes, selectedAmenities, quickFilters, sortBy]);

  // Handle Book or Open Room Modal
  const handleOpenRoomModal = (hotel) => {
    setSelectedHotelForModal(hotel);
    setSelectedRoomPlan('breakfast');
  };

  const handleProceedToCheckout = (hotel, selectedRoom, plan) => {
    const finalPrice = plan?.price || hotel.price;
    setCheckoutItem({
      type: 'hotel',
      itemId: hotel.id,
      title: hotel.name,
      roomName: selectedRoom?.name || hotel.roomType,
      planName: plan?.name || 'Standard Plan',
      price: finalPrice * searchRooms,
      location: hotel.locality,
      checkIn: searchCheckIn,
      checkOut: searchCheckOut,
      guests: `${searchGuests} Guests`,
      rooms: searchRooms
    });
    setSelectedHotelForModal(null);
    navigate(ROUTES.HOTEL_CHECKOUT);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedStars([]);
    setPriceRange(25000);
    setSelectedPriceBracket('all');
    setSelectedLocalities([]);
    setSelectedPropertyTypes([]);
    setSelectedAmenities([]);
    setQuickFilters({
      freeCancellation: false,
      breakfastIncluded: false,
      mountainView: false,
      fiveStar: false,
      topRated: false,
      doctorOnCall: false
    });
    setSearchCity('Leh');
    toast.success('All filters reset');
  };

  return (
    <div className="lehconnect-hotel-listing-page bg-light min-vh-100" style={{ paddingBottom: '60px' }}>
      
      {/* 1. LehConnect Sticky Top Search Strip */}
      <section className="lehconnect-hotel-search-strip">
        <div className="container">
          <form onSubmit={handleUpdateSearch} className="lehconnect-search-strip-inner">
            
            {/* Destination Input */}
            <div className="lehconnect-search-input-box">
              <span className="lehconnect-search-label">
                <i className="fa-solid fa-location-dot me-1" style={{ color: "#008cff" }}></i> City / Area in Ladakh
              </span>
              <select 
                value={searchCity} 
                onChange={(e) => setSearchCity(e.target.value)}
                className="fw-bold"
              >
                <option value="Leh">Leh, Ladakh</option>
                <option value="Nubra">Nubra Valley (Hunder / Diskit)</option>
                <option value="Pangong">Pangong Tso Lake</option>
                <option value="Changspa">Changspa, Upper Leh</option>
                <option value="Sheynam">Sheynam, Leh</option>
                <option value="">All Ladakh Stays</option>
              </select>
            </div>

            {/* Check-In Date */}
            <div className="lehconnect-search-input-box">
              <span className="lehconnect-search-label">
                <i className="fa-solid fa-calendar-days me-1" style={{ color: "#008cff" }}></i> Check-In Date
              </span>
              <input 
                type="date" 
                value={searchCheckIn} 
                onChange={(e) => setSearchCheckIn(e.target.value)} 
              />
            </div>

            {/* Check-Out Date */}
            <div className="lehconnect-search-input-box">
              <span className="lehconnect-search-label">
                <i className="fa-solid fa-calendar-days me-1" style={{ color: "#008cff" }}></i> Check-Out Date
              </span>
              <input 
                type="date" 
                value={searchCheckOut} 
                onChange={(e) => setSearchCheckOut(e.target.value)} 
              />
            </div>

            {/* Rooms & Guests */}
            <div className="lehconnect-search-input-box">
              <span className="lehconnect-search-label">
                <i className="fa-solid fa-user-group me-1" style={{ color: "#008cff" }}></i> Rooms & Guests
              </span>
              <div className="d-flex align-items-center gap-2">
                <select 
                  value={searchRooms} 
                  onChange={(e) => setSearchRooms(parseInt(e.target.value))}
                  style={{ width: 'auto' }}
                >
                  <option value={1}>1 Room</option>
                  <option value={2}>2 Rooms</option>
                  <option value={3}>3 Rooms</option>
                </select>
                <span className="text-muted">,</span>
                <select 
                  value={searchGuests} 
                  onChange={(e) => setSearchGuests(parseInt(e.target.value))}
                  style={{ width: 'auto' }}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
              </div>
            </div>

            {/* Update Search CTA */}
            <button type="submit" className="lehconnect-search-update-btn">
              Search Hotels
            </button>

          </form>
        </div>
      </section>

      {/* Main Container */}
      <div className="container py-3">
        
        {/* Results Meta Header */}
        <div className="lehconnect-hotel-header-meta">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
            <div>
              <h2 className="lehconnect-hotel-heading-title">
                Showing {processedHotels.length} Properties in {searchCity === 'LehConnect' || !searchCity ? 'Leh, Ladakh' : searchCity}
              </h2>
              <p className="text-muted fs-8 mb-0">
                Prices shown include standard room rate for {searchRooms} Room(s), {searchGuests} Guest(s) per night
              </p>
            </div>
            
            {/* Mobile Filter Trigger Button */}
            <div className="d-lg-none">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)} 
                className="btn btn-outline-primary rounded-pill btn-sm d-flex align-items-center gap-2 fw-bold"
              >
                <i className="fa-solid fa-sliders me-1"></i> {showMobileFilters ? 'Close Filters' : 'Filters & Sort'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Horizontal Sort Bar & Quick Filters */}
        <div className="lehconnect-hotel-sort-bar">
          
          {/* Sort Tabs */}
          <div className="lehconnect-sort-tabs-wrapper">
            <span className="lehconnect-sort-label">Sort By:</span>
            
            <button 
              onClick={() => setSortBy('popular')}
              className={`lehconnect-sort-tab-btn ${sortBy === 'popular' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-fire me-1" style={{ fontSize: "12px" }}></i> Popular (Recommended)
            </button>

            <button 
              onClick={() => setSortBy('rating')}
              className={`lehconnect-sort-tab-btn ${sortBy === 'rating' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-star me-1" style={{ fontSize: "12px" }}></i> User Rating (Highest First)
            </button>

            <button 
              onClick={() => setSortBy('price_asc')}
              className={`lehconnect-sort-tab-btn ${sortBy === 'price_asc' ? 'active' : ''}`}
            >
              Price (Lowest First)
            </button>

            <button 
              onClick={() => setSortBy('price_desc')}
              className={`lehconnect-sort-tab-btn ${sortBy === 'price_desc' ? 'active' : ''}`}
            >
              Price (Highest First)
            </button>
          </div>

          {/* Quick Pill Filter Chips */}
          <div className="lehconnect-quick-chips-row">
            <span className="fs-8 fw-bold text-muted text-uppercase me-1">Quick Filters:</span>

            <button 
              onClick={() => toggleQuickFilter('freeCancellation')}
              className={`lehconnect-quick-chip ${quickFilters.freeCancellation ? 'active' : ''}`}
            >
              <i className="fa-solid fa-check me-1" style={{ fontSize: "10px" }}></i> Free Cancellation
            </button>

            <button 
              onClick={() => toggleQuickFilter('breakfastIncluded')}
              className={`lehconnect-quick-chip ${quickFilters.breakfastIncluded ? 'active' : ''}`}
            >
              <i className="fa-solid fa-mug-saucer me-1" style={{ fontSize: "11px" }}></i> Breakfast Included
            </button>

            <button 
              onClick={() => toggleQuickFilter('mountainView')}
              className={`lehconnect-quick-chip ${quickFilters.mountainView ? 'active' : ''}`}
            >
              <i className="fa-solid fa-mountain me-1" style={{ fontSize: "11px" }}></i> Mountain View
            </button>

            <button 
              onClick={() => toggleQuickFilter('fiveStar')}
              className={`lehconnect-quick-chip ${quickFilters.fiveStar ? 'active' : ''}`}
            >
              ⭐⭐⭐⭐⭐ 5 Star Stays
            </button>

            <button 
              onClick={() => toggleQuickFilter('topRated')}
              className={`lehconnect-quick-chip ${quickFilters.topRated ? 'active' : ''}`}
            >
              🏆 4.5+ Rated
            </button>

            <button 
              onClick={() => toggleQuickFilter('doctorOnCall')}
              className={`lehconnect-quick-chip ${quickFilters.doctorOnCall ? 'active' : ''}`}
            >
              <i className="fa-solid fa-user-shield me-1" style={{ fontSize: "11px" }}></i> O2 & Medical Kit
            </button>
          </div>

        </div>

        {/* 3. Main Body: Left Sidebar Filters + Right Hotel Listings */}
        <div className="row g-3">
          
          {/* Left Refinement Sidebar (Visible on Desktop or when toggled on Mobile) */}
          <div className={`col-lg-3 ${showMobileFilters ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="lehconnect-filter-sidebar-box">
              
              {/* Sidebar Header */}
              <div className="lehconnect-filter-header">
                <h5>Select Filters</h5>
                <button onClick={handleResetFilters} className="lehconnect-clear-all-btn">
                  Clear All
                </button>
              </div>

              {/* Price Per Night Filter */}
              <div className="lehconnect-filter-group">
                <div className="lehconnect-filter-title">
                  <span>Price per night</span>
                  <span className="text-primary fw-bold">Up to ₹{priceRange.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  className="form-range" 
                  min="3000" 
                  max="25000" 
                  step="1000" 
                  value={priceRange} 
                  onChange={(e) => {
                    setPriceRange(parseInt(e.target.value));
                    setSelectedPriceBracket('custom');
                  }}
                />
                <div className="d-flex justify-content-between fs-8 text-muted mt-1">
                  <span>₹3,000</span>
                  <span>₹25,000+</span>
                </div>

                {/* Quick Price Buckets */}
                <div className="mt-3 d-flex flex-column gap-1">
                  {[
                    { id: 'all', label: 'All Budgets (Any Price)', max: 25000 },
                    { id: 'b1', label: 'Under ₹5,000', max: 5000 },
                    { id: 'b2', label: '₹5,000 - ₹10,000', max: 10000 },
                    { id: 'b3', label: '₹10,000 - ₹16,000', max: 16000 },
                    { id: 'b4', label: 'Luxury Stays (₹16,000+)', max: 25000 }
                  ].map((bracket) => (
                    <label key={bracket.id} className="lehconnect-checkbox-item">
                      <div className="lehconnect-checkbox-label">
                        <input 
                          type="radio" 
                          name="priceBracket"
                          checked={selectedPriceBracket === bracket.id}
                          onChange={() => {
                            setSelectedPriceBracket(bracket.id);
                            setPriceRange(bracket.max);
                          }}
                          className="form-check-input me-2"
                        />
                        <span>{bracket.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Star Category Filter */}
              <div className="lehconnect-filter-group">
                <div className="lehconnect-filter-title">Star Category</div>
                {[5, 4, 3].map(stars => (
                  <label key={stars} className="lehconnect-checkbox-item">
                    <div className="lehconnect-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedStars.includes(stars)}
                        onChange={() => {
                          if (selectedStars.includes(stars)) {
                            setSelectedStars(selectedStars.filter(s => s !== stars));
                          } else {
                            setSelectedStars([...selectedStars, stars]);
                          }
                        }}
                        className="lehconnect-checkbox-input"
                      />
                      <span className="d-flex align-items-center gap-1">
                        {Array.from({ length: stars }).map((_, i) => (
                          <i key={i} className="fa-solid fa-star" style={{ color: "#f5a623", fontSize: "12px" }}></i>
                        ))}
                        <span className="ms-1 fw-bold">{stars} Star</span>
                      </span>
                    </div>
                    <span className="lehconnect-filter-count">
                      ({hotelsList.filter(h => h.starRating === stars).length})
                    </span>
                  </label>
                ))}
              </div>

              {/* User Rating Filter */}
              <div className="lehconnect-filter-group">
                <div className="lehconnect-filter-title">User Rating</div>
                {[
                  { label: '4.5 & above (Excellent)', score: 4.5 },
                  { label: '4.0 & above (Very Good)', score: 4.0 },
                  { label: '3.5 & above (Good)', score: 3.5 }
                ].map((item, idx) => (
                  <label key={idx} className="lehconnect-checkbox-item">
                    <div className="lehconnect-checkbox-label">
                      <input 
                        type="radio" 
                        name="userRatingFilter"
                        checked={quickFilters.topRated && item.score === 4.5}
                        onChange={() => toggleQuickFilter('topRated')}
                        className="form-check-input me-2"
                      />
                      <span>{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Locality in Ladakh */}
              <div className="lehconnect-filter-group">
                <div className="lehconnect-filter-title">Locality / Area</div>
                {[
                  { name: 'Fort Road, Leh', key: 'Fort Road' },
                  { name: 'Hunder, Nubra Valley', key: 'Nubra' },
                  { name: 'Pangong Lake Road', key: 'Pangong' },
                  { name: 'Changspa, Upper Leh', key: 'Changspa' },
                  { name: 'Sheynam, Leh', key: 'Sheynam' },
                  { name: 'Old Road, Leh', key: 'Old Road' }
                ].map((loc, idx) => (
                  <label key={idx} className="lehconnect-checkbox-item">
                    <div className="lehconnect-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedLocalities.includes(loc.key)}
                        onChange={() => {
                          if (selectedLocalities.includes(loc.key)) {
                            setSelectedLocalities(selectedLocalities.filter(l => l !== loc.key));
                          } else {
                            setSelectedLocalities([...selectedLocalities, loc.key]);
                          }
                        }}
                        className="lehconnect-checkbox-input"
                      />
                      <span>{loc.name}</span>
                    </div>
                    <span className="lehconnect-filter-count">
                      ({hotelsList.filter(h => h.locality.toLowerCase().includes(loc.key.toLowerCase())).length})
                    </span>
                  </label>
                ))}
              </div>

              {/* Property Type Filter */}
              <div className="lehconnect-filter-group">
                <div className="lehconnect-filter-title">Property Type</div>
                {[
                  { name: 'Luxury Resort', count: 3 },
                  { name: 'Heritage Boutique', count: 2 },
                  { name: 'Glamping Camp', count: 1 },
                  { name: 'Heritage Palace', count: 1 },
                  { name: 'Homestay', count: 1 }
                ].map((prop, idx) => (
                  <label key={idx} className="lehconnect-checkbox-item">
                    <div className="lehconnect-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedPropertyTypes.includes(prop.name)}
                        onChange={() => {
                          if (selectedPropertyTypes.includes(prop.name)) {
                            setSelectedPropertyTypes(selectedPropertyTypes.filter(p => p !== prop.name));
                          } else {
                            setSelectedPropertyTypes([...selectedPropertyTypes, prop.name]);
                          }
                        }}
                        className="lehconnect-checkbox-input"
                      />
                      <span>{prop.name}</span>
                    </div>
                    <span className="lehconnect-filter-count">({prop.count})</span>
                  </label>
                ))}
              </div>

              {/* Amenities Filter */}
              <div className="lehconnect-filter-group">
                <div className="lehconnect-filter-title">Amenities</div>
                {[
                  { key: 'free_breakfast', label: 'Free Breakfast Included' },
                  { key: 'free_cancel', label: 'Free Cancellation' },
                  { key: 'medical', label: 'Oxygen Kit & Medical Support' },
                  { key: 'mountain_view', label: 'Mountain / Valley View' },
                  { key: 'heating', label: 'Central Heating & Warmers' },
                  { key: 'wifi', label: 'Free High-Speed Wi-Fi' },
                  { key: 'restaurant', label: 'In-House Multi-Cuisine Restaurant' }
                ].map((amenity, idx) => (
                  <label key={idx} className="lehconnect-checkbox-item">
                    <div className="lehconnect-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedAmenities.includes(amenity.key)}
                        onChange={() => {
                          if (selectedAmenities.includes(amenity.key)) {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity.key));
                          } else {
                            setSelectedAmenities([...selectedAmenities, amenity.key]);
                          }
                        }}
                        className="lehconnect-checkbox-input"
                      />
                      <span>{amenity.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Mobile Apply Filters Action */}
              <div className="p-3 bg-light border-top d-lg-none text-center">
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm"
                >
                  View {processedHotels.length} Properties <i className="fa-solid fa-arrow-right ms-1"></i>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Hotel Listing Cards */}
          <div className="col-lg-9">
            
            {processedHotels.length === 0 ? (
              <div className="card p-5 border text-center rounded-3 shadow-sm bg-white border-light mt-2">
                <div className="fs-1 mb-2">🏨</div>
                <h4 className="fw-bold text-dark">No Ladakh Hotels Match Your Selected Filters</h4>
                <p className="text-secondary fs-8 mb-4">
                  Try adjusting your star preferences, budget range, or reset filters to see all available properties.
                </p>
                <button 
                  onClick={handleResetFilters} 
                  className="btn btn-primary rounded-pill px-4 py-2 mx-auto fw-bold fs-8 border-0"
                  style={{ background: 'linear-gradient(93deg, #53b2fe, #065af3)' }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              processedHotels.map((hotel) => {
                const currentActiveImg = activeCardImages[hotel.id] || hotel.heroImg;
                const isWishlisted = wishlist?.includes(hotel.id);

                return (
                  <div className="lehconnect-hotel-card" key={hotel.id}>
                    
                    {/* Column 1: Image Gallery & Badges */}
                    <div className="lehconnect-card-gallery-col">
                      <div className="lehconnect-hero-img-wrapper">
                        <img src={currentActiveImg} 
                          alt={hotel.name} 
                          className="lehconnect-hero-img" 
                        loading="lazy" decoding="async" />
                        
                        {/* Assured Badge */}
                        {hotel.isAssured && (
                          <div className="lehconnect-assured-badge">
                            <i className="fa-solid fa-shield-halved me-1" style={{ fontSize: "10px" }}></i> LehConnect Assured
                          </div>
                        )}

                        {/* Wishlist Heart */}
                        <button 
                          onClick={() => handleToggleWishlist(hotel.id)}
                          className={`lehconnect-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                          title="Save to Wishlist"
                        >
                          {isWishlisted ? <i className="fa-solid fa-heart" style={{ color: "#eb2026" }}></i> : <i className="fa-regular fa-heart"></i>}
                        </button>

                        {/* Photos Count */}
                        <div className="lehconnect-photo-count-pill">
                          📷 {hotel.gallery?.length || 4} Photos
                        </div>
                      </div>

                      {/* Mini Thumbnail Row (Clicking/Hovering swaps main hero image) */}
                      <div className="lehconnect-thumbnails-row">
                        {hotel.gallery?.map((thumb, idx) => (
                          <img 
                            key={idx}
                            src={thumb} 
                            alt={`${hotel.name} thumbnail ${idx + 1}`} 
                            className={`lehconnect-thumb-img ${currentActiveImg === thumb ? 'active' : ''}`}
                            onClick={() => setActiveCardImages(prev => ({ ...prev, [hotel.id]: thumb }))}
                            onMouseEnter={() => setActiveCardImages(prev => ({ ...prev, [hotel.id]: thumb }))}
                            loading="lazy"
                            decoding="async"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Details & Value Highlights */}
                    <div className="lehconnect-card-details-col text-start">
                      <div>
                        {/* Stars & Category */}
                        <div className="lehconnect-stars-tag-row">
                          <div className="lehconnect-star-icons">
                            {Array.from({ length: hotel.starRating }).map((_, i) => (
                              <i key={i} className="fa-solid fa-star"></i>
                            ))}
                          </div>
                          <span className="lehconnect-prop-category-tag">{hotel.category}</span>
                        </div>

                        {/* Hotel Name */}
                        <h3 
                          className="lehconnect-hotel-name-title"
                          onClick={() => handleOpenRoomModal(hotel)}
                        >
                          {hotel.name}
                        </h3>

                        {/* Location */}
                        <div className="lehconnect-hotel-location-text">
                          <i className="fa-solid fa-location-dot me-1" style={{ color: "#008cff", fontSize: "11px" }}></i>
                          <span>{hotel.distance}</span>
                        </div>

                        {/* Rating Pill */}
                        <div className="lehconnect-rating-row">
                          <div className="lehconnect-rating-score-box">
                            ★ {hotel.userScore}
                          </div>
                          <span className="lehconnect-rating-verdict-text">{hotel.verdict}</span>
                          <span className="lehconnect-rating-reviews-count">({hotel.reviewsCount} Ratings)</span>
                        </div>

                        {/* LehConnect Highlights */}
                        <div className="lehconnect-highlights-list">
                          {hotel.highlights.map((h, i) => (
                            <div key={i} className="lehconnect-highlight-item">
                              <i className="fa-solid fa-check me-1" style={{ color: "#2e7d32", fontSize: "10px" }}></i>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Room Type Bar */}
                      <div className="lehconnect-room-type-bar">
                        <i className="fa-solid fa-door-open me-2 text-primary"></i>
                        {hotel.roomType}
                      </div>
                    </div>

                    {/* Column 3: Price & CTA */}
                    <div className="lehconnect-card-price-col">
                      <div className="lehconnect-price-top-meta">
                        {/* Original Price & Discount */}
                        <div className="lehconnect-strikethrough-price-row">
                          <span className="lehconnect-original-price">₹{hotel.originalPrice?.toLocaleString()}</span>
                          <span className="lehconnect-discount-pill">{hotel.discount}</span>
                        </div>

                        {/* Current Bold Price */}
                        <div className="lehconnect-current-price-val">
                          ₹{hotel.price?.toLocaleString()}
                        </div>
                        
                        <div className="lehconnect-taxes-text">
                          + ₹{hotel.taxes} taxes & service fees
                        </div>
                        <div className="lehconnect-taxes-text fw-bold">
                          Per Night / {searchRooms} Room
                        </div>
                        <div className="lehconnect-emi-text">
                          EMI starts at ₹{Math.round(hotel.price / 12)}/month
                        </div>

                        {/* Urgency Badge */}
                        {hotel.roomsLeft <= 3 && (
                          <div className="lehconnect-urgency-badge">
                            🔥 Only {hotel.roomsLeft} rooms left at this price!
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div>
                        <button 
                          onClick={() => handleOpenRoomModal(hotel)}
                          className="lehconnect-select-room-btn"
                        >
                          SELECT ROOM <i className="fa-solid fa-chevron-right ms-1" style={{ fontSize: "11px" }}></i>
                        </button>
                        <div className="lehconnect-login-offer-text">
                          Login & use wallet to <span>save extra ₹500</span>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

      </div>

      {/* 4. LehConnect Interactive Room Selection Modal */}
      {selectedHotelForModal && (
        <div className="lehconnect-room-modal-backdrop" onClick={() => setSelectedHotelForModal(null)}>
          <div className="lehconnect-room-modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="lehconnect-room-modal-header">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div className="lehconnect-star-icons">
                    {Array.from({ length: selectedHotelForModal.starRating }).map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                  <span className="fs-8 text-muted fw-bold text-uppercase">{selectedHotelForModal.category}</span>
                </div>
                <h4 className="fw-bold text-dark mb-1">{selectedHotelForModal.name}</h4>
                <p className="text-muted fs-8 mb-0"><i className="fa-solid fa-location-dot me-1" style={{ color: "#008cff" }}></i> {selectedHotelForModal.locality}</p>
              </div>
              <button 
                onClick={() => setSelectedHotelForModal(null)} 
                className="lehconnect-room-modal-close-btn"
                title="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body: Available Room Types & Meal Plans */}
            <div className="lehconnect-room-modal-body">
              <h5 className="fw-bold text-dark mb-3">Available Room Options & Tariffs</h5>
              
              {selectedHotelForModal.roomOptions?.map((room) => (
                <div className="lehconnect-room-option-card selected" key={room.id}>
                  <div className="row g-3">
                    
                    {/* Room Thumbnail & Info */}
                    <div className="col-md-4">
                      <img src={room.img} 
                        alt={room.name} 
                        className="img-fluid rounded-3 w-100 object-fit-cover mb-2"
                        style={{ height: '140px' }}
                      loading="lazy" decoding="async" />
                      <h6 className="fw-bold text-dark mb-1">{room.name}</h6>
                      <div className="fs-8 text-muted mb-1">📐 {room.size} | 🛏️ {room.bed}</div>
                      <div className="fs-8 text-success fw-bold">🏔️ {room.view}</div>
                    </div>

                    {/* Meal Plans */}
                    <div className="col-md-8">
                      <div className="d-flex flex-column gap-2">
                        {room.plans?.map((plan) => (
                          <div 
                            key={plan.id}
                            onClick={() => setSelectedRoomPlan(plan.id)}
                            className={`lehconnect-plan-option-box ${selectedRoomPlan === plan.id ? 'active' : ''}`}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="fw-bold text-dark fs-7 d-flex align-items-center gap-2">
                                <input 
                                  type="radio" 
                                  name="roomPlan" 
                                  checked={selectedRoomPlan === plan.id}
                                  onChange={() => setSelectedRoomPlan(plan.id)}
                                  className="form-check-input"
                                />
                                {plan.name}
                              </div>
                              <div className="text-end">
                                <span className="fs-5 fw-bold text-dark">₹{plan.price.toLocaleString()}</span>
                                <span className="fs-8 text-muted d-block">/ night</span>
                              </div>
                            </div>
                            
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {plan.perks?.map((perk, pIdx) => (
                                <span key={pIdx} className="badge bg-light text-dark fs-8 border">
                                  ✓ {perk}
                                </span>
                              ))}
                            </div>

                            <div className="text-end mt-3">
                              <button 
                                onClick={() => handleProceedToCheckout(selectedHotelForModal, room, plan)}
                                className="btn btn-primary btn-sm rounded-pill px-4 fw-bold border-0"
                                style={{ background: 'linear-gradient(93deg, #53b2fe, #065af3)' }}
                              >
                                Book This Room <i className="fa-solid fa-arrow-right ms-1"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {/* Property Inclusions Banner */}
              <div className="bg-light p-3 rounded-3 border mt-3">
                <h6 className="fw-bold text-dark fs-8 mb-2">Exclusive Ladakh Acclimatization Inclusions</h6>
                <div className="row g-2 fs-8 text-secondary">
                  <div className="col-md-6">✓ Doctor on call with 24x7 Oxygen Cylinder Facility</div>
                  <div className="col-md-6">✓ Central Heating and electric mattress warmers included</div>
                  <div className="col-md-6">✓ Filtered mineral water & Kashmiri herbal tea in lobby</div>
                  <div className="col-md-6">✓ Free cancellation allowed up to 24 hours prior to check-in</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HotelListing;
