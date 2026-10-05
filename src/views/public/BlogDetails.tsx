'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from '../../components/Link';
import { ROUTES } from '../../constants/routes';

const BLOG_DATA = {
  'exploring-lehconnect-a-guide-for-luxury-car-renters': {
    title: 'Exploring LehConnect: A Guide for Luxury Car Renters',
    category: 'Car Rental',
    date: 'Dec 01, 2025',
    readTime: '5 min read',
    subtitle: 'Your complete guide to renting the perfect luxury car for your LehConnect adventure. Drive in comfort, safety and style.',
    author: {
      name: 'Tashi Namgyal',
      role: 'LehConnect Travel Specialist',
      avatar: '/images/blog/author-sonam.webp',
      bio: 'Tashi is a local LehConnect tour expert with over 10 years of experience managing luxury road trip expeditions across the Himalayas.'
    },
    img: '/images/home/cab-driving-scenic.webp',
    content: (
      <>
        <p className="lead text-dark fs-6 leh-style-auto-1113">
          Driving through LehConnect's highest mountain passes requires a perfect blend of horsepower, reliability, and passenger comfort. This guide helps you pick the right premium vehicle for your Himalayan adventure.
        </p>
        
        {/* Accent Header */}
        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">Why Luxury SUV is Crucial for LehConnect Terrain</h5>
        </div>
        <p className="text-secondary fs-7 leh-style-auto-1135">
          LehConnect is home to some of the highest motorable roads in the world, including Khardung La and Chang La. However, these terrains are often prone to gravel trails, stream crossings, and rough patches. Sedan cars can face chassis scraping due to lower ground clearance, making robust SUVs like the Mahindra XUV700 or Toyota Innova Crysta the preferred choices.
        </p>

        {/* Styled Quote Callout */}
        <div className="p-4 my-4 d-flex gap-3 text-start leh-style-auto-1175">
          <span className="leh-style-auto-1176">“</span>
          <p className="text-secondary fw-semibold mb-0 fs-7 italic leh-style-auto-1177">
            The road is your home in LehConnect. Choosing the right vehicle isn't just about premium styling—it's about handling rocky roads, high altitudes, and keeping travelers safe and relaxed.
          </p>
        </div>

        {/* Accent Header */}
        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">Key Features to Look for When Renting:</h5>
        </div>

        {/* 3 Columns Specs Cards Row */}
        <div className="row g-3 my-3">
          {/* Col 1 */}
          <div className="col-md-4">
            <div className="p-3 border rounded-3 bg-white h-100 text-start shadow-xs">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center   mb-3.5 leh-style-auto-1178">
                <i className="fa-solid fa-ruler-horizontal"></i>
              </div>
              <h6 className="fw-bold text-dark fs-8 mb-1.5">Ground Clearance</h6>
              <p className="text-muted mb-0 leh-style-auto-1179">
                Ensure the vehicle has at least 200mm ground clearance to pass through shallow stream crossings safely.
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="col-md-4">
            <div className="p-3 border rounded-3 bg-white h-100 text-start shadow-xs">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-success mb-3.5 leh-style-auto-1180">
                <i className="fa-solid fa-gear"></i>
              </div>
              <h6 className="fw-bold text-dark fs-8 mb-1.5">Engine Power</h6>
              <p className="text-muted mb-0 leh-style-auto-1179">
                High-altitude drives demand powerful torque engines. Turbodiesel powertrains excel at climbing steep gradients.
              </p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="col-md-4">
            <div className="p-3 border rounded-3 bg-white h-100 text-start shadow-xs">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-warning mb-3.5 leh-style-auto-1181">
                <i className="fa-regular fa-snowflake"></i>
              </div>
              <h6 className="fw-bold text-dark fs-8 mb-1.5">Air Conditioning</h6>
              <p className="text-muted mb-0 leh-style-auto-1179">
                Temperatures can shift dramatically. Robust climate control systems are essential.
              </p>
            </div>
          </div>
        </div>

        {/* Accent Header */}
        <div className="d-flex align-items-center gap-2 mt-4.5 mb-3.5">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">Top Recommended Vehicles</h5>
        </div>

        {/* Vehicles Recommendations Cards */}
        <div className="row g-3 align-items-center my-2 position-relative">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="card border rounded-3 p-2.5 bg-white text-center shadow-xs">
              <div className="overflow-hidden rounded-3 mb-2 leh-style-auto-1182">
                <img src="/images/fleet/cab-toyota-innova.webp" alt="Innova" className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
              </div>
              <h6 className="fw-bold text-dark mb-1 fs-8">Toyota Innova Crysta</h6>
              <div className="d-flex justify-content-center gap-3 fs-9 text-muted mb-2">
                <span><i className="fa-solid fa-user-group me-1"></i> 7 Seats</span>
                <span><i className="fa-solid fa-gas-pump me-1"></i> Diesel</span>
              </div>
              <span className="badge bg-primary-subtle   border border-primary border-opacity-10 px-2 py-1 fs-9 fw-bold rounded">
                BEST FOR GROUPS
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="card border rounded-3 p-2.5 bg-white text-center shadow-xs">
              <div className="overflow-hidden rounded-3 mb-2 leh-style-auto-1182">
                <img src="/images/fleet/cab-mahindra-xuv700.webp" alt="XUV700" className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
              </div>
              <h6 className="fw-bold text-dark mb-1 fs-8">Mahindra XUV700</h6>
              <div className="d-flex justify-content-center gap-3 fs-9 text-muted mb-2">
                <span><i className="fa-solid fa-user-group me-1"></i> 6-7 Seats</span>
                <span><i className="fa-solid fa-gas-pump me-1"></i> Diesel</span>
              </div>
              <span className="badge bg-primary-subtle   border border-primary border-opacity-10 px-2 py-1 fs-9 fw-bold rounded">
                BEST PERFORMANCE
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="card border rounded-3 p-2.5 bg-white text-center shadow-xs">
              <div className="overflow-hidden rounded-3 mb-2 leh-style-auto-1182">
                <img src="/images/fleet/cab-toyota-fortuner.webp" alt="Fortuner" className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
              </div>
              <h6 className="fw-bold text-dark mb-1 fs-8">Toyota Fortuner</h6>
              <div className="d-flex justify-content-center gap-3 fs-9 text-muted mb-2">
                <span><i className="fa-solid fa-user-group me-1"></i> 7 Seats</span>
                <span><i className="fa-solid fa-gas-pump me-1"></i> Diesel</span>
              </div>
              <span className="badge bg-primary-subtle   border border-primary border-opacity-10 px-2 py-1 fs-9 fw-bold rounded">
                PREMIUM SUV
              </span>
            </div>
          </div>
        </div>
      </>
    )
  },
  'top-5-luxury-retreats-in-lehconnect-you-must-experience': {
    title: 'Top 5 Luxury Retreats in LehConnect You Must Experience',
    category: 'Hotels & Stays',
    date: 'Nov 18, 2025',
    readTime: '6 min read',
    subtitle: 'Discover hotel options offering mountain-view bedrooms, premium spas, and traditional LehConnect heritage hospitality.',
    author: {
      name: 'Stanzin Dolma',
      role: 'Luxury Stays Curator',
      avatar: '/images/blog/author-sonam.webp',
      bio: 'Stanzin is a designer and hospitality specialist dedicated to highlighting unique eco-luxury resorts and heritage hotels across LehConnect.'
    },
    img: '/images/booking/hotel-luxury-resort.webp',
    content: (
      <>
        <p className="lead text-dark fs-6 leh-style-auto-1113">
          Experience the majestic mountains of LehConnect without compromising on comfort. From organic farm-to-table dining to heritage palaces, these luxury resorts offer premium wellness and LehConnect hospitality.
        </p>
        
        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">1. The Grand Dragon LehConnect (Leh)</h5>
        </div>
        <p className="text-secondary fs-7 leh-style-auto-1135">
          One of the first luxury hotels in Leh, The Grand Dragon offers fully heated rooms with large glass windows overlooking snow-capped Stok Kangri range, fine-dining restaurants, and active high-altitude health centers.
        </p>

        <div className="p-4 my-4 d-flex gap-3 text-start leh-style-auto-1175">
          <span className="leh-style-auto-1176">“</span>
          <p className="text-secondary fw-semibold mb-0 fs-7 italic leh-style-auto-1177">
            True luxury in LehConnect is a warm fireplace, a cozy room overlooking snowy peaks, and traditional butter tea served with warm LehConnect bread.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">2. Khygar Resort (Nubra Valley)</h5>
        </div>
        <p className="text-secondary fs-7 leh-style-auto-1135">
          Tucked away in Nubra Valley, this eco-resort features private luxury tents and stone cottages. They offer traditional wood-fire heating systems, locally grown organic meals, and hot herbal stone baths.
        </p>
      </>
    )
  },
  'hassle-free-flight-bookings-to-lehconnect': {
    title: 'Hassle-Free Flight Bookings to LehConnect',
    category: 'Flight Tips',
    date: 'Nov 05, 2025',
    readTime: '4 min read',
    subtitle: 'Find and compare morning flight schedules to LehConnect easily, and avoid excess baggage check-in surprises.',
    author: {
      name: 'Vikram Singh',
      role: 'Travel Planner',
      avatar: '/images/blog/author-sonam.webp',
      bio: 'Vikram tracks airfare price matrices and booking flight routes to make remote travel accessible and pocket-friendly.'
    },
    img: '/images/common/scenic-himalayan-road.webp',
    content: (
      <>
        <p className="lead text-dark fs-6 leh-style-auto-1113">
          Flying to LehConnect is one of the most scenic journeys in the world, but high airfares and sudden flight changes can create issues. Follow these pro tips for a stress-free air booking experience.
        </p>
        
        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">Book Early to Avoid Peak Demand Surges</h5>
        </div>
        <p className="text-secondary fs-7 leh-style-auto-1135">
          Leh's Kushok Bakula Rimpochee Airport is highly dependent on clear morning weather. Because the airport operates morning flights only, seats fill quickly. Booking at least 60-90 days in advance is crucial, especially during the summer peak (May to September).
        </p>

        <div className="p-4 my-4 d-flex gap-3 text-start leh-style-auto-1175">
          <span className="leh-style-auto-1176">“</span>
          <p className="text-secondary fw-semibold mb-0 fs-7 italic leh-style-auto-1177">
            Always select window seats on the left side of the aircraft when flying from Delhi to LehConnect for the best panoramic views of the high Himalayan peaks.
          </p>
        </div>
      </>
    )
  },
  'lehconnect-to-nubra-valley-road-trip-checklist': {
    title: 'LehConnect to Nubra Valley Road Trip Checklist',
    category: 'Road Trips',
    date: 'Oct 25, 2025',
    readTime: '7 min read',
    subtitle: 'Make sure your high-altitude permits, acclimation checklists, and woolen layer packaging are ready for Nubra Valley.',
    author: {
      name: 'Sonam Rigzin',
      role: 'Expedition Guide',
      avatar: '/images/blog/author-sonam.webp',
      bio: 'Sonam has guided overland convoys across LehConnect for a decade and knows every turn from LehConnect to Nubra Valley.'
    },
    img: '/images/fleet/cab-tempo-traveller.webp',
    content: (
      <>
        <p className="lead text-dark fs-6 leh-style-auto-1113">
          A road trip to Nubra Valley via Khardung La is an adventure of a lifetime. Ensure a safe and unforgettable trip with our comprehensive packing, permit, and route guide.
        </p>
        
        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">Inner Line Permit (ILP) Requirements</h5>
        </div>
        <p className="text-secondary fs-7 leh-style-auto-1135">
          Foreign and domestic tourists need Inner Line Permits to travel past North Pullu checkposts. You can apply online at the LehConnect LAHDC portal or let your booking provider handle the permits. Carry at least 4 printed copies to submit at checkposts.
        </p>
      </>
    )
  },
  'acclimatization-tips-for-first-time-lehconnect-travelers': {
    title: 'Acclimatization Tips for First-Time LehConnect Travelers',
    category: 'Travel Advice',
    date: 'Oct 10, 2025',
    readTime: '5 min read',
    subtitle: 'Stay safe and adjust comfortably to high altitude oxygen drops with these clinical recommendations.',
    author: {
      name: 'Dr. Lobzang Wangyal',
      role: 'High-Altitude Health Consultant',
      avatar: '/images/blog/author-sonam.webp',
      bio: 'Dr. Lobzang consults on altitude acclimation and sports medicine in high mountain terrains.'
    },
    img: '/images/common/scenic-himalayan-road.webp',
    content: (
      <>
        <p className="lead text-dark fs-6 leh-style-auto-1113">
          acute mountain sickness (AMS) is a real concern when landing in Leh (elevation 11,500 ft). Follow our medically sound guidelines to adjust comfortably and safely.
        </p>
        
        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <div className="leh-style-auto-1174" />
          <h5 className="fw-bold text-dark mb-0 fs-6">The Golden Rule: Rest on Day 1</h5>
        </div>
        <p className="text-secondary fs-7 leh-style-auto-1135">
          No matter how excited you are, stay in your hotel room for the first 24-36 hours. Sleep, drink warm fluids, and avoid heavy activities. This allows your body to adjust to low oxygen levels.
        </p>
      </>
    )
  }
};

export const BlogDetails = ({ id: propId }) => {
  const routerParams = useParams();
  const router = useRouter();
  const id = propId || routerParams?.id;

  const blog = BLOG_DATA[id] || BLOG_DATA['exploring-lehconnect-a-guide-for-luxury-car-renters'];

  const navigate = (path) => router.push(path);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="bg-light min-vh-100 pb-5">


      {/* Dynamic Dark Hero Banner */}
      <div className="position-relative overflow-hidden text-white py-5 text-start leh-style-auto-1095">
        {/* Background image overlay */}
        <div className="position-absolute start-0 top-0 w-100 h-100 leh-style-auto-1184" />

        <div className="container position-relative leh-style-auto-1080">
          <div className="row g-4 align-items-center">
            
            {/* Header info */}
            <div className="col-lg-8">
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-sm btn-link text-white text-decoration-none p-0 d-inline-flex align-items-center gap-1.5 fs-8 mb-3 fw-semibold"
              >
                <i className="fa-solid fa-arrow-left me-1"></i> Back to Blog
              </button>
              
              <div className="mb-2.5">
                <span className="badge bg-primary text-uppercase px-2.5 py-1.5 fs-9 fw-bold rounded leh-style-auto-1185">
                  {blog.category}
                </span>
              </div>
              
              <h1 className="fw-bold text-white mb-3 leh-style-auto-1186">
                {blog.title}
              </h1>

              <p className="text-white-50 fs-7 mb-4 max-w-xl leh-style-auto-1187">
                {blog.subtitle}
              </p>

              <div className="d-flex flex-wrap align-items-center gap-4 fs-8 text-white-50">
                <span className="d-flex align-items-center gap-2">
                  <i className="fa-regular fa-calendar-days"></i> {blog.date}
                </span>
                <span className="d-flex align-items-center gap-2">
                  <i className="fa-regular fa-user"></i> By {blog.author.name}
                </span>
                <span className="d-flex align-items-center gap-2">
                  <i className="fa-regular fa-clock"></i> {blog.readTime}
                </span>
              </div>
            </div>

            {/* Right side banner car graphic overlay */}
            <div className="col-lg-4 d-none d-lg-block text-end">
              <img src="/images/fleet/cab-mahindra-xuv700.webp" alt="SUV Graphic" className="leh-style-auto-1188" loading="lazy" decoding="async" />
            </div>

          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row g-4">
          
          {/* Main content column */}
          <div className="col-lg-8">
            <div className="card border shadow-sm rounded-4 overflow-hidden bg-white p-4 text-start">
              
              {/* Cover Image */}
              <div className="rounded-3 overflow-hidden mb-4 leh-style-auto-1189">
                <img src={blog.img} alt={blog.title} className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
              </div>

              {/* Rich Body */}
              <div className="article-body">
                {blog.content}
              </div>

              {/* Share block */}
              <div className="border-top pt-4 mt-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <span className="fw-bold text-dark fs-8">Share this article:</span>
                <div className="d-flex gap-2">
                  <a href="#" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1190">
                    <i className="fa-brands fa-facebook-f fs-7"></i>
                  </a>
                  <a href="#" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1190">
                    <i className="fa-brands fa-x-twitter fs-7"></i>
                  </a>
                  <a href="#" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center leh-style-auto-1190">
                    <i className="fa-brands fa-linkedin-in fs-7"></i>
                  </a>
                  <a href="#" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center text-success leh-style-auto-1190">
                    <i className="fa-brands fa-whatsapp fs-7"></i>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar column */}
          <div className="col-lg-4">
            
            {/* Author card with social buttons */}
            <div className="card border shadow-sm rounded-4 p-4 bg-white text-start mb-4">
              <h6 className="fw-bold text-dark mb-3 fs-7 border-bottom pb-2">About The Author</h6>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="overflow-hidden rounded-circle leh-style-auto-1191">
                  <img src={blog.author.avatar} alt={blog.author.name} className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0.5 fs-8">{blog.author.name}</h6>
                  <small className="  fw-semibold fs-9">{blog.author.role}</small>
                </div>
              </div>
              
              {/* Social icons */}
              <div className="d-flex gap-2 mb-3">
                <a href="#" className="btn btn-sm btn-light border p-0 rounded-circle d-flex align-items-center justify-content-center text-secondary leh-style-auto-1192"><i className="fa-brands fa-facebook-f fs-9"></i></a>
                <a href="#" className="btn btn-sm btn-light border p-0 rounded-circle d-flex align-items-center justify-content-center text-secondary leh-style-auto-1192"><i className="fa-brands fa-instagram fs-9"></i></a>
                <a href="#" className="btn btn-sm btn-light border p-0 rounded-circle d-flex align-items-center justify-content-center text-secondary leh-style-auto-1192"><i className="fa-brands fa-x-twitter fs-9"></i></a>
                <a href="#" className="btn btn-sm btn-light border p-0 rounded-circle d-flex align-items-center justify-content-center text-secondary leh-style-auto-1192"><i className="fa-brands fa-linkedin-in fs-9"></i></a>
              </div>

              <p className="text-muted fs-8 mb-0 leh-style-auto-1135">
                {blog.author.bio}
              </p>
            </div>

            {/* Travel promotion Widget (Mockup accurate graphics) */}
            <div className="card border-0 text-white rounded-4 p-4 text-center position-relative overflow-hidden mb-4 leh-style-auto-1193">
              {/* Mountain backdrop graphic */}
              <div className="position-absolute start-0 top-0 w-100 h-100 opacity-20 bg-cover leh-style-auto-1194" />
              
              <div className="position-relative leh-style-auto-1080">
                <i className="fa-solid fa-mountain fs-2 d-block mb-3 text-warning"></i>
                <h5 className="fw-bold text-white mb-2 fs-7">Ready to Explore LehConnect?</h5>
                <p className="text-white-50 fs-8 px-3 mb-4">
                  Book verified outstation taxis or local tour cabs at guaranteed best prices.
                </p>
                <button onClick={() => navigate(ROUTES.CAB_SEARCH)} className="btn btn-warning rounded-pill py-2.5 px-4 fw-bold text-dark border-0 fs-8 w-100 d-flex align-items-center justify-content-center gap-1.5 leh-style-auto-1195">
                  Book Cab Now <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* Other articles list */}
            <div className="card border shadow-sm rounded-4 p-4 bg-white text-start">
              <h6 className="fw-bold text-dark mb-3 fs-7 border-bottom pb-2">Popular Articles</h6>
              <div className="d-flex flex-column gap-3 mb-3">
                
                {Object.entries(BLOG_DATA)
                  .filter(([key]) => key !== id)
                  .slice(0, 3)
                  .map(([key, item]) => (
                    <Link to={`/blog/${key}`} key={key} className="text-decoration-none d-flex gap-3 align-items-center">
                      <div className="overflow-hidden rounded-3 border flex-shrink-0 leh-style-auto-1196">
                        <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 fs-9 hover-text-primary text-line-clamp-2 leh-style-auto-1197">
                          {item.title}
                        </h6>
                        <small className="text-muted fs-9 leh-style-auto-1086">{item.date}</small>
                      </div>
                    </Link>
                  ))}

              </div>
              <div className="border-top pt-2 text-center">
                <button onClick={() => navigate('/')} className="btn btn-link   text-decoration-none fs-8 fw-bold p-0 mt-1">
                  View All Articles <i className="fa-solid fa-arrow-right ms-1"></i>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

