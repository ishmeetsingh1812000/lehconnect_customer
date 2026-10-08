'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCustomerProfile } from '../APIs/api';

const defaultBookingState = {
  user: {
    name: 'Vikram Singh',
    email: 'vikram.singh@lehconnect.com',
    phone: '+91 98765 43210',
    walletBalance: 15450,
    avatar: '/images/blog/author-sonam.webp',
    address: {
      street: 'Flat 402, Himalayan Heights, Fort Road',
      city: 'Leh',
      state: 'Ladakh (UT)',
      pincode: '194101',
      country: 'India'
    },
    savedTravellers: [
      { id: 1, name: 'Aarav Singh', age: 28, gender: 'Male', idType: 'Aadhaar', idNumber: 'XXXX-XXXX-1234' },
      { id: 2, name: 'Priya Singh', age: 26, gender: 'Female', idType: 'Passport', idNumber: 'Z1234567' }
    ]
  },
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  searchParams: {
    cabs: { pickup: '', drop: '', date: '', returnDate: '', tripType: 'oneway', cabType: 'all', time: '', package: '4_40', packageDuration: '4 hr', packageDistance: '40 kms' },
    hotels: { city: 'Leh', checkIn: '2026-08-15', checkOut: '2026-08-18', guests: '2 Adults, 1 Room', roomType: 'all' },
    flights: { from: 'Delhi (DEL)', to: 'Leh (IXL)', departDate: '2026-08-15', returnDate: '', tripType: 'oneway', class: 'Economy', travellers: 1 },
    holidays: { destination: 'all', duration: 'all', budget: 350000, theme: 'all' },
    bus: { from: 'Delhi', to: 'Manali', date: '2026-08-15' },
    train: { pnr: '2456789012' },
    insurance: { destination: 'Worldwide', duration: 14, age: 28 },
    visa: { country: 'Schengen (Europe)', visaType: 'Tourist' }
  },
  updateSearchParams: () => {},
  checkoutItem: null,
  setCheckoutItem: () => {},
  bookings: [],
  addBooking: () => ({ id: 'LC-CAB-1234' }),
  cancelBooking: () => {},
  tickets: [],
  addSupportTicket: () => 'TCK-101',
  notifications: [],
  toggleNotificationRead: () => {},
  wishlist: [],
  setWishlist: () => {},
  coupons: [],
  updateProfile: () => {},
  activeTab: 'cabs',
  setActiveTab: () => {},
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  isLoginModalOpen: false,
  setIsLoginModalOpen: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {}
};

const BookingContext = createContext<any>(defaultBookingState);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  return ctx || defaultBookingState;
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  // Authentication Mock State
  const [user, setUser] = useState({
    name: 'Vikram Singh',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@lehconnect.com',
    phone: '+91 98765 43210',
    walletBalance: 15450,
    avatar: '/images/blog/author-sonam.webp',
    address: {
      street: 'Flat 402, Himalayan Heights, Fort Road',
      city: 'Leh',
      state: 'Ladakh (UT)',
      pincode: '194101',
      country: 'India'
    },
    savedAddresses: [
      {
        id: 1,
        type: 'Home',
        street: 'Flat 402, Himalayan Heights, Fort Road',
        city: 'Leh',
        state: 'Ladakh (UT)',
        pincode: '194101',
        country: 'India',
        isDefault: true
      }
    ],
    savedTravellers: [
      { id: 1, name: 'Aarav Singh', age: 28, gender: 'Male', idType: 'Aadhaar', idNumber: 'XXXX-XXXX-1234' },
      { id: 2, name: 'Priya Singh', age: 26, gender: 'Female', idType: 'Passport', idNumber: 'Z1234567' }
    ]
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('customerToken');
      if (token) setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => setIsLoggedIn(false);
    window.addEventListener('customer-session-expired', handleSessionExpired);
    return () =>
      window.removeEventListener(
        'customer-session-expired',
        handleSessionExpired
      );
  }, []);
  const [activeTab, setActiveTab] = useState('cabs');
  const [language, setLanguage] = useState('en');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'true') {
        setIsLoginModalOpen(true);
      }
    }
  }, []);

  const translations = {
    en: {
      home: 'Home',
      taxi_booking: 'Taxi Booking',
      services: 'Services',
      holiday_package: 'Holiday Package',
      about_us: 'About Us',
      partner: 'Partner',
      help: 'Contact Us',
      login: 'Login',
      dashboard: 'My Dashboard',
      hero_title: 'Book Flights, Hotels, Cabs & Holidays',
      hero_subtitle: 'Simple, reliable, and premium travel bookings across the Himalayas',
      cabs: 'Cabs',
      hotels: 'Hotels',
      flights: 'Flights',
      holidays: 'Holidays',
      bus: 'Buses',
      train: 'Trains',
      visa: 'Visa',
      insurance: 'Insurance',
      offers: 'Offers',
      partners: 'Experience Flying with our Airline Partners',
      flagship: 'Flagship Hotel Stores on LehConnect',
      download_app: 'Download App Now!',
      handpicked: 'Handpicked Collections for You',
      wonders: 'Unlock Lesser-Known Wonders of India',
      faqs: 'Frequently Asked Questions',
      from: 'From',
      to: 'To',
      depart: 'Departure Date',
      guests: 'Guests & Rooms',
      search: 'Search',
      book_now: 'BOOK NOW'
    },
    hi: {
      home: 'होम',
      taxi_booking: 'टैक्सी बुकिंग',
      services: 'सेवाएं',
      holiday_package: 'हॉलिडे पैकेज',
      about_us: 'हमारे बारे में',
      partner: 'पार्टनर',
      help: 'संपर्क करें',
      login: 'लॉगिन',
      dashboard: 'मेरा डैशबोर्ड',
      hero_title: 'फ्लाइट, होटल, कैब और छुट्टियां बुक करें',
      hero_subtitle: 'हिमालय में सरल, विश्वसनीय और प्रीमियम यात्रा बुकिंग',
      cabs: 'कैब',
      hotels: 'होटल',
      flights: 'उड़ानें',
      holidays: 'छुट्टियां',
      bus: 'बसें',
      train: 'ट्रेनें',
      visa: 'वीज़ा',
      insurance: 'बीमा',
      offers: 'ऑफ़र और छूट',
      partners: 'हमारे एयरलाइन पार्टनर्स के साथ उड़ान का अनुभव लें',
      flagship: 'लेहकनेक्ट पर फ्लैगशिप होटल स्टोर्स',
      download_app: 'अब ऐप डाउनलोड करें!',
      handpicked: 'आपके लिए चुनिंदा कलेक्शन',
      wonders: 'भारत के अनछुए आश्चर्यों को जानें',
      faqs: 'अक्सर पूछे जाने वाले प्रश्न',
      from: 'कहाँ से',
      to: 'कहाँ तक',
      depart: 'प्रस्थान तिथि',
      guests: 'अतिथि और कमरे',
      search: 'खोजें',
      book_now: 'अभी बुक करें'
    },
    lad: {
      home: 'Khang',
      taxi_booking: 'Taxi Booking',
      services: 'Shabs-tog',
      holiday_package: 'Holiday Package',
      partner: 'Rokrog',
      help: 'Contact Us',
      login: 'Nang-zhugs',
      dashboard: 'Nye-Dashboard',
      hero_title: 'Flights, Hotels, Cabs & Holidays Book Tang',
      hero_subtitle: 'La-dwags nang khul-ka skyod-yas tshad-dan-po',
      cabs: 'Taxi',
      hotels: 'Khang-lha',
      flights: 'Nam-gru',
      holidays: 'Spro-skyod',
      bus: 'Bus',
      train: 'Train',
      visa: 'Visa',
      insurance: 'Insurance',
      offers: 'Phan-thogs',
      partners: 'Et-mos yod-khan Airline Partners',
      flagship: 'LehConnect ka Khang-lha tshad-dan-po',
      download_app: 'App Download Tang!',
      handpicked: 'Khyod-rang-la ldem-po sgrig-yod',
      wonders: 'Gya-gar gyi zhing-kham mi-shes-pa phye tang',
      faqs: 'Dri-ba khag',
      from: 'Gar-ne',
      to: 'Gar-la',
      depart: 'Za-tshes',
      guests: 'Mi-mi & Khang-pa',
      search: 'Tsal',
      book_now: 'Book Tang'
    }
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  // Search Parameters State
  const [searchParams, setSearchParams] = useState({
    cabs: { pickup: '', drop: '', date: '', time: '', type: 'outstation', tripType: 'oneway', package: '4_40', packageDuration: '4 hr', packageDistance: '40 kms' },
    hotels: { city: 'Leh', checkIn: '2026-08-10', checkOut: '2026-08-15', guests: 2, rooms: 1 },
    flights: { from: 'Delhi (DEL)', to: 'Leh (IXL)', departDate: '2026-08-10', returnDate: '', tripType: 'oneway', passengers: 1, travelClass: 'Economy' },
    holidays: { destination: 'Ladakh Explorer Pack', duration: '6 Days', guests: 2 },
    bus: { from: 'Manali', to: 'Leh', date: '2026-07-28' },
    train: { pnr: '2345678901', from: 'Delhi', to: 'Kalka', date: '2026-07-25', trainNum: '12011' },
    insurance: { destination: 'Worldwide', duration: '15 Days', age: '28' },
    visa: { country: 'Schengen (Europe)', visaType: 'Tourist' }
  });

  // Selected Booking Details State (Checkout storage)
  const [checkoutItem, setCheckoutItem] = useState(null);

  // Active bookings list with localStorage fallback
  const initialBookings = [
    {
      id: 'LEH-HLD-882194',
      type: 'holiday',
      title: 'Scenic Kerala - Backwaters & Hills Delight',
      fromCity: 'New Delhi',
      date: '2026-09-11',
      duration: '4 Nights / 5 Days',
      guestsCount: 2,
      adults: 2,
      children: 0,
      rooms: 1,
      selectedRoom: 'Deluxe Valley View Room',
      hotelName: 'The Leaf Munnar Resort',
      transferType: 'Sedan - AC (Dzire / Etios)',
      travelers: [
        { title: 'Mr', firstName: 'Vikram', lastName: 'Singh', age: '29', gender: 'Male', idType: 'Aadhaar', idNumber: 'XXXX-XXXX-1234' },
        { title: 'Mrs', firstName: 'Priya', lastName: 'Singh', age: '27', gender: 'Female', idType: 'Passport', idNumber: 'Z1234567' }
      ],
      contact: { email: 'vikram.singh@lehconnect.com', phone: '+91 98765 43210', specialRequest: 'Vegetarian Meals' },
      addOns: { insurance: true, visa: false, vip: false },
      pricing: {
        basePackageTotal: 37998,
        totalAddons: 398,
        discount: 5000,
        gstTax: 1670,
        grandTotal: 35066,
        paidNow: 35066,
        remainingDue: 0,
        walletDeduction: 0,
        paymentType: 'full',
        paymentMethod: 'upi'
      },
      price: 35066,
      paidAmount: 35066,
      status: 'confirmed',
      bookingDate: '09/09/2026'
    },
    {
      id: 'LC-CAB-9871',
      type: 'cab',
      title: 'Outstation Sedan (Dzire or equivalent)',
      from: 'Delhi Airport',
      to: 'Agra Fort',
      date: '2026-07-30',
      time: '09:00 AM',
      price: 4500,
      status: 'confirmed',
      driver: { name: 'Ramesh Kumar', phone: '+91 99887 76655', rating: 4.8, vehicleNo: 'DL 1YB 4321' }
    },
    {
      id: 'LC-CAB-HR-4402',
      type: 'cab',
      title: 'Local Hourly Rental - Sedan (Dzire or equivalent)',
      from: 'Leh City Center',
      to: 'Local City Rental (4 hr / 40 kms)',
      date: '2026-08-05',
      time: '10:00 AM',
      tripType: 'hourly',
      isHourly: true,
      package: '4 hr / 40 kms',
      packageDuration: '4 hr',
      packageDistance: '40 kms',
      extraKmRate: 14,
      extraHrRate: 150,
      pickupLandmark: 'Main Bazaar, Leh',
      price: 1850,
      paidAmount: 1850,
      status: 'confirmed',
      driver: { name: 'Tsering Dorjay', phone: '+91 94191 23456', rating: 4.9, vehicleNo: 'LA 02 A 5566' }
    },
    {
      id: 'LC-HTL-1024',
      type: 'hotel',
      title: 'The Grand Dragon Ladakh',
      city: 'Leh',
      checkIn: '2026-08-10',
      checkOut: '2026-08-15',
      guests: 2,
      rooms: 1,
      price: 24500,
      status: 'confirmed',
      address: 'Old Road, Sheynam, Leh, Jammu and Kashmir 194101'
    },
    {
      id: 'LC-FLT-5542',
      type: 'flight',
      title: 'IndiGo (6E-2051)',
      from: 'Delhi (DEL)',
      to: 'Leh (IXL)',
      date: '2026-08-10',
      time: '06:45 AM',
      price: 8900,
      status: 'confirmed',
      seats: ['12A']
    }
  ];

  const [bookings, setBookings] = useState(initialBookings);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('lehconnect_bookings');
        if (saved) {
          setBookings(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.error('Failed to parse bookings from localStorage', e);
    }
  }, []);

  // Support Tickets State
  const [tickets, setTickets] = useState([
    { id: 'ST-1002', subject: 'Refund delay for cancelled Flight LC-FLT-2210', category: 'Refunds', status: 'open', date: '2026-07-15' },
    { id: 'ST-0985', subject: 'Cab driver details not received', category: 'Cabs', status: 'resolved', date: '2026-07-10' }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Booking Confirmed!', message: 'Your booking for The Grand Dragon Ladakh is successfully confirmed.', time: '2 hours ago', read: false },
    { id: 2, title: 'Wallet Credited', message: 'INR 1,000 promotional cashback has been added to your wallet.', time: '1 day ago', read: true }
  ]);

  // Wishlist
  const [wishlist, setWishlist] = useState([
    { id: 1, type: 'hotel', name: 'Hotel Singge Palace Leh', rating: 4.5, price: 5500, img: '/images/booking/hotel-singge-palace.webp' },
    { id: 2, type: 'holiday', name: 'Best of Ladakh: Pangong & Nubra Special', rating: 4.8, price: 18999, img: '/images/gallery/gallery-scenic-ladakh.webp' }
  ]);

  // Coupon Lists
  const [coupons, setCoupons] = useState([
    { code: 'LEHWELCOME', discount: 15, maxDiscount: 2000, description: 'Get 15% off up to ₹2000 on your first booking' },
    { code: 'CABSPECIAL', discount: 10, maxDiscount: 500, description: 'Get 10% off up to ₹500 on all outstation cab bookings' },
    { code: 'FREERIDE', discount: 5, maxDiscount: 300, description: 'Get 5% off up to ₹300' }
  ]);

  const updateSearchParams = (moduleName, fields) => {
    setSearchParams(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        ...fields
      }
    }));
  };

  const addBooking = (newBooking) => {
    setBookings(prev => {
      const updated = [newBooking, ...prev];
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lehconnect_bookings', JSON.stringify(updated));
        }
      } catch (e) {
        console.error('Failed to save bookings to localStorage', e);
      }
      return updated;
    });
  };

  const cancelBooking = (id) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lehconnect_bookings', JSON.stringify(updated));
        }
      } catch (e) {
        console.error('Failed to save bookings to localStorage', e);
      }
      return updated;
    });
  };

  const addSupportTicket = (subject, category) => {
    const newId = `ST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = { id: newId, subject, category, status: 'open', date: new Date().toISOString().split('T')[0] };
    setTickets(prev => [newTicket, ...prev]);
    return newId;
  };

  const toggleNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateProfile = useCallback((profileData) => {
    setUser(prev => ({ ...prev, ...profileData }));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setProfileLoaded(false);
      setProfileLoadError(false);
      return;
    }

    let active = true;
    setProfileLoaded(false);
    setProfileLoadError(false);

    getCustomerProfile()
      .then((response) => {
        const profile = response?.results ?? response?.data?.results ?? response?.data;
        if (!profile || typeof profile !== 'object') {
          throw new Error('Customer profile response was empty.');
        }

        if (active) {
          const firstName = profile.first_name || '';
          const lastName = profile.last_name || '';
          const address = {
            street: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            pincode: profile.pincode || '',
            country: profile.country || '',
          };
          updateProfile({
            firstName,
            lastName,
            name: [firstName, lastName].filter(Boolean).join(' ') || 'Your profile',
            email: profile.email || '',
            phone: profile.contact || '',
            ...(profile.profile_image ? { avatar: profile.profile_image } : {}),
            address,
            savedAddresses: Object.values(address).some(Boolean)
              ? [{ id: 1, type: 'Home', ...address, isDefault: true }]
              : [],
          });
          setProfileLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Customer profile fetch failed:', error);
        if (active) {
          setProfileLoadError(true);
          setProfileLoaded(true);
        }
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, updateProfile]);

  return (
    <BookingContext.Provider
      value={{
        user,
        profileLoaded,
        profileLoadError,
        isLoggedIn,
        setIsLoggedIn,
        searchParams,
        updateSearchParams,
        checkoutItem,
        setCheckoutItem,
        bookings,
        addBooking,
        cancelBooking,
        tickets,
        addSupportTicket,
        notifications,
        toggleNotificationRead,
        wishlist,
        setWishlist,
        coupons,
        updateProfile,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        isLoginModalOpen,
        setIsLoginModalOpen,
        openLoginModal,
        closeLoginModal
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
