import React from 'react';
import type { Metadata } from 'next';
import Contact from '@/views/public/Contact';

export const metadata: Metadata = {
  title: 'Contact Us | LehConnect - 24/7 Travel & Booking Support',
  description: 'Get in touch with LehConnect for cabs, hotel bookings, flight inquiries, and Ladakh holiday packages. 24/7 dedicated support via phone, email, or office visit.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactUsPage() {
  return <Contact />;
}
