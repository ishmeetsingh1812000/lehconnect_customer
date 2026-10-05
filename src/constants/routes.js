export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',
  FAQS: '/faqs',
  TESTIMONIALS: '/testimonials',
  GALLERY: '/gallery',
  CAREERS: '/careers',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-conditions',
  REFUND: '/refund-policy',
  CANCELLATION: '/cancellation-policy',
  COOKIES: '/cookies-policy',
  DISCLAIMER: '/disclaimer',
  ERROR_404: '/404',
  ERROR_500: '/500',

  // Auth Routes
  LOGIN: '/login',
  REGISTER: '/register',
  OTP: '/otp-verification',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Cab Booking Module
  CAB_SEARCH: '/cabs',
  CAB_DETAILS: '/cabs/:id',
  CAB_CHECKOUT: '/cabs/checkout',
  CAB_SUCCESS: '/cabs/success',
  CAB_FAILED: '/cabs/failed',

  // Hotel Booking Module
  HOTEL_SEARCH: '/hotels',
  HOTEL_DETAILS: '/hotels/:id',
  HOTEL_CHECKOUT: '/hotels/checkout',
  HOTEL_SUCCESS: '/hotels/success',

  // Flight Booking Module
  FLIGHT_SEARCH: '/flights',
  FLIGHT_DETAILS: '/flights/:id',
  FLIGHT_CHECKOUT: '/flights/checkout',
  FLIGHT_SUCCESS: '/flights/success',

  // Holiday Packages Module
  HOLIDAY_SEARCH: '/holidays',
  HOLIDAY_DETAILS: '/holidays/:id',
  HOLIDAY_CHECKOUT: '/holidays/checkout',
  HOLIDAY_SUCCESS: '/holidays/success',

  // Bus Booking Module
  BUS_SEARCH: '/bus',
  BUS_CHECKOUT: '/bus/checkout',
  BUS_SUCCESS: '/bus/success',

  // Train Module
  TRAIN_ENQUIRY: '/train',

  // Insurance Module
  INSURANCE: '/insurance',

  // Visa Module
  VISA: '/visa',

  // User Dashboard Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  EDIT_PROFILE: '/dashboard/profile/edit',
  BOOKINGS: '/dashboard/bookings',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  WALLET: '/dashboard/wallet',
  SUPPORT: '/dashboard/support',
  INVOICES: '/dashboard/invoices',
  PAYMENTS: '/dashboard/payments',
  WISHLIST: '/dashboard/wishlist',
  SAVED_TRAVELLERS: '/dashboard/travellers',
  NOTIFICATIONS: '/dashboard/notifications',
  COUPONS: '/dashboard/coupons',

  // Admin Dashboard Routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_CMS: '/admin/cms',
  ADMIN_SETTINGS: '/admin/settings',
};
