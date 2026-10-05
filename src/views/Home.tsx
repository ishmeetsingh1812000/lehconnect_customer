'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from '../hooks/useAppNavigation';
import { useBooking } from '../context/BookingContext';
import { BookingWidget } from '../components/BookingWidget';
import { getEnquiryOffers } from '../APIs/api';

// Modular Home Components
import {
  HeroSection,
  OffersSection,
  HolidayExploreSection,
  AboutUsSection,
  ServicesSection,
  CarCategoriesSection,
  HowItWorksSection,
  LuxuryFleetSection,
  AppDownloadSection,
  TestimonialsSection,
  BlogSection,
  InstagramSection,
  FaqSection,
  AllOffersModal,
  InstagramModal,
  offersDataList,
  instaPhotos
} from '../components/home';

export interface HomeProps {
  initialTab?: string;
}

export const Home: React.FC<HomeProps> = ({ initialTab = 'cabs' }) => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useBooking();

  const [offerTab, setOfferTab] = useState<string>('all');
  const [showAllOffersModal, setShowAllOffersModal] = useState<boolean>(false);
  const [showInstaModal, setShowInstaModal] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  
  const [apiOffers, setApiOffers] = useState<any[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getEnquiryOffers();
        const offersList = data?.results?.["All Offers"] || [];
        if (offersList.length > 0) {
          const mappedOffers = offersList.map((offer: any) => {
            let cat = (offer.enquiry_type || 'all').toLowerCase();
            if (cat === 'buses') cat = 'bus';
            if (cat === 'trains') cat = 'train';
            
            let imgUrl = offer.image_path || '/images/gallery/gallery-scenic-ladakh-thumb.webp';
            if (imgUrl.includes('ngrok-free.dev')) {
              imgUrl = imgUrl.replace(/https:\/\/[^\/]+/, 'http://localhost:3001');
            }
            
            return {
              code: offer.promo_code || 'SPECIAL',
              category: cat,
              title: offer.title,
              desc: offer.description,
              exp: offer.valid_until ? `VALID TILL ${offer.valid_until}` : 'LIMITED TIME',
              img: imgUrl
            };
          });
          setApiOffers(mappedOffers);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };
    fetchOffers();
  }, []);

  // Sync tab with route path
  useEffect(() => {
    const syncTab = () => {
      let tabFromPath = initialTab;
      if (typeof window !== 'undefined') {
        const p = window.location.pathname.replace(/^\//, '').split('/')[0];
        if (['cabs', 'holidays', 'flights', 'hotels', 'train', 'bus', 'visa', 'insurance'].includes(p)) {
          tabFromPath = p;
        } else if (window.location.pathname === '/') {
          tabFromPath = 'cabs';
        }
      }
      if (tabFromPath) {
        setActiveTab(tabFromPath);
        setOfferTab(tabFromPath);
      }
    };

    syncTab();
    window.addEventListener('popstate', syncTab);
    return () => window.removeEventListener('popstate', syncTab);
  }, [initialTab, setActiveTab]);

  useEffect(() => {
    setOfferTab(activeTab);
  }, [activeTab]);

  const copyCoupon = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    toast.success(`Coupon "${code}" copied to clipboard!`);
  };

  const handleBookingTabChange = (tab: string) => {
    setActiveTab(tab);
    setOfferTab(tab);
    const target = tab === 'cabs' ? '/cabs' : `/${tab}`;
    navigate(target);
  };

  return (
    <div className="home-container bg-light">
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Floating Overlapping Search Card Box */}
      <div className="container leh-booking-container">
        <BookingWidget
          activeTab={activeTab}
          onTabChange={handleBookingTabChange}
        />
      </div>

      {/* 3. Main Content: Holidays View or General Home View */}
      {activeTab === 'holidays' ? (
        <HolidayExploreSection />
      ) : (
        <>
          {/* Offers & Deals Section */}
          <OffersSection
            offers={apiOffers}
            currentTab={offerTab}
            onTabChange={(tab) => setOfferTab(tab)}
            onViewAllClick={() => setShowAllOffersModal(true)}
            onCopyCoupon={copyCoupon}
          />

          {/* About Us Section with Animated Stats */}
          <AboutUsSection onKnowMore={() => navigate('/services/cabs')} />

          {/* Our Services Section */}
          <ServicesSection onServiceClick={(serviceId) => navigate(`/services/${serviceId}`)} />

          {/* Book Car Types / Categories */}
          <CarCategoriesSection />

          {/* How It Works (3 Steps) */}
          <HowItWorksSection />

          {/* Luxury Car Fleet */}
          <LuxuryFleetSection />

          {/* App Download Promo */}
          <AppDownloadSection />

          {/* Customer Testimonials */}
          <TestimonialsSection />

          {/* Latest News / Blog */}
          <BlogSection />

          {/* Instagram Journey Highlights */}
          <InstagramSection
            onViewAllClick={() => {
              setShowInstaModal(true);
              setActivePhotoIndex(null);
            }}
            onPhotoClick={(index) => {
              setShowInstaModal(true);
              setActivePhotoIndex(index);
            }}
          />

          {/* Frequently Asked Questions */}
          <FaqSection />
        </>
      )}

      {/* 4. Popups & Modals */}
      <AllOffersModal
        isOpen={showAllOffersModal}
        onClose={() => setShowAllOffersModal(false)}
        offers={offersDataList}
        onCopyCoupon={copyCoupon}
      />

      <InstagramModal
        isOpen={showInstaModal}
        onClose={() => setShowInstaModal(false)}
        photos={instaPhotos}
        activePhotoIndex={activePhotoIndex}
        setActivePhotoIndex={setActivePhotoIndex}
      />
    </div>
  );
};

export default Home;
