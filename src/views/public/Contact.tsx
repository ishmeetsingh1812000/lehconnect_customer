'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields (*)');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Your message has been sent successfully! Our support team will get in touch shortly.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="leh-contact-page">
      {/* 1. Hero Header / Breadcrumb Banner */}
      <section
        className="text-white text-center py-5 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(rgba(11, 21, 40, 0.88), rgba(11, 21, 40, 0.92)), url("/images/gallery/gallery-scenic-ladakh.webp") center/cover no-repeat',
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem'
        }}
      >
        <div className="container position-relative z-index-2">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fs-8 fw-bold mb-3 d-inline-block">
                <i className="fa-solid fa-headset me-1.5"></i> WE'RE HERE TO HELP
              </span>
              <h1 className="fw-black display-5 text-white mb-2">
                Contact <span className="text-warning">LehConnect</span>
              </h1>
              <p className="text-white-50 fs-7 mx-auto mb-0" style={{ maxWidth: '580px' }}>
                Have questions about cab bookings, hotel stays, flight reservations, or customized Ladakh holiday packages? Reach out to our 24/7 dedicated travel desk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Contact Info Cards */}
      <section className="contact-box py-5 bg-light border-bottom">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Box 1: Email us */}
            <div className="col-lg-3 col-md-6">
              <div className="item text-center p-4 bg-white rounded-4 shadow-sm h-100 border transition-all hover-shadow-md">
                <div
                  className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="fa-solid fa-envelope fs-3"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Email us</h5>
                <p className="mb-0 text-muted fs-8">
                  <a href="mailto:info@lehconnect.com" className="text-decoration-none text-muted hover-text-primary">
                    info@lehconnect.com
                  </a>
                </p>
                <p className="mb-0 text-muted fs-8">
                  <a href="mailto:support@lehconnect.com" className="text-decoration-none text-muted hover-text-primary">
                    support@lehconnect.com
                  </a>
                </p>
              </div>
            </div>

            {/* Box 2: Our address */}
            <div className="col-lg-3 col-md-6">
              <div className="item text-center p-4 bg-white rounded-4 shadow-sm h-100 border transition-all hover-shadow-md">
                <div
                  className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="fa-solid fa-location-dot fs-3"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Our address</h5>
                <p className="mb-0 text-muted fs-8">
                  D6, Ranisathi Nager Jaipur 302019
                </p>
                <p className="mb-0 text-muted fs-8">
                  Rajasthan (India)
                </p>
              </div>
            </div>

            {/* Box 3: Opening Hours */}
            <div className="col-lg-3 col-md-6">
              <div className="item text-center p-4 bg-white rounded-4 shadow-sm h-100 border transition-all hover-shadow-md">
                <div
                  className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="fa-solid fa-clock fs-3"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Opening Hours</h5>
                <p className="mb-0 text-muted fs-8">
                  Mon - Sun: 24 Hours
                </p>
                <p className="mb-0 text-success fw-semibold fs-9">
                  Always Open & Active
                </p>
              </div>
            </div>

            {/* Box 4: Call us */}
            <div className="col-lg-3 col-md-6">
              <div className="item text-center p-4 bg-white rounded-4 shadow-sm h-100 border transition-all hover-shadow-md">
                <div
                  className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="fa-solid fa-phone fs-3"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">Call us</h5>
                <p className="mb-0 fs-8">
                  <a href="tel:+919602212487" className="text-decoration-none fw-bold text-dark hover-text-primary">
                    +91 9602212487
                  </a>
                </p>
                <p className="mb-0 text-muted fs-9">
                  Instant Support & Booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Form & Google Map Section */}
      <section className="contact py-5">
        <div className="container">
          <div className="row g-5 align-items-stretch">
            {/* Left Column: Get in touch form */}
            <div className="col-lg-6 col-md-12 text-start">
              <div className="form-box bg-white p-4 p-md-5 rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fs-5 flex-shrink-0"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-0 text-dark">Get in touch</h4>
                      <small className="text-muted fs-8">Leave your query and we'll get back to you in minutes</small>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="contact__form">
                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-md-6">
                        <label className="form-label fs-8 fw-semibold text-dark mb-1">
                          Your Name <span className="text-danger">*</span>
                        </label>
                        <input
                          name="name"
                          type="text"
                          placeholder="Your Name *"
                          className="form-control py-2.5 fs-8"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          aria-label="Your Name"
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label className="form-label fs-8 fw-semibold text-dark mb-1">
                          Your Email <span className="text-danger">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          placeholder="Your Email *"
                          className="form-control py-2.5 fs-8"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          aria-label="Your Email"
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <label className="form-label fs-8 fw-semibold text-dark mb-1">
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="Your Phone Number"
                          className="form-control py-2.5 fs-8"
                          value={formData.phone}
                          onChange={handleChange}
                          aria-label="Your Phone Number"
                        />
                      </div>

                      {/* Subject */}
                      <div className="col-md-6">
                        <label className="form-label fs-8 fw-semibold text-dark mb-1">
                          Subject
                        </label>
                        <input
                          name="subject"
                          type="text"
                          placeholder="Subject (e.g., Taxi in Leh, Hotel inquiry)"
                          className="form-control py-2.5 fs-8"
                          value={formData.subject}
                          onChange={handleChange}
                          aria-label="Subject"
                        />
                      </div>

                      {/* Message */}
                      <div className="col-12">
                        <label className="form-label fs-8 fw-semibold text-dark mb-1">
                          Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          placeholder="How can we help you with your journey? *"
                          className="form-control py-2.5 fs-8"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          aria-label="Message"
                        />
                      </div>

                      {/* Submit button */}
                      <div className="col-12 mt-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm"
                        >
                          {isSubmitting ? (
                            <span><i className="fa-solid fa-spinner fa-spin me-2"></i> Sending...</span>
                          ) : (
                            <span><i className="fa-solid fa-paper-plane me-2"></i> Send Message</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="text-center text-muted fs-9 mt-4 pt-3 border-top">
                  <i className="fa-solid fa-lock text-secondary me-1.5"></i>
                  Your contact information is strictly confidential and protected.
                </div>
              </div>
            </div>

            {/* Right Column: Location & Google Map */}
            <div className="col-lg-6 col-md-12 text-start">
              <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fs-5 flex-shrink-0"
                    style={{ width: '48px', height: '48px' }}
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-dark">Location</h4>
                    <small className="text-muted fs-8">Visit our corporate headquarters or navigate via GPS</small>
                  </div>
                </div>

                <div className="google-map rounded-4 overflow-hidden border flex-grow-1 position-relative" style={{ minHeight: '380px' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d28472.82357533683!2d75.73786435302067!3d26.86847014007368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x396db4ebf4d63403%3A0x2f1b9dc2c845d849!2sRani%20Sati%20Nagar%2C%20Nirman%20Nagar%2C%20Brijlalpura%2C%20Jaipur%2C%20Rajasthan!3m2!1d26.886169!2d75.7444172!4m5!1s0x396db4ebf4d63403%3A0x2f1b9dc2c845d849!2sRani%20Sati%20Nagar%2C%20Nirman%20Nagar%2C%20Brijlalpura%2C%20Jaipur%2C%20Rajasthan!3m2!1d26.886169!2d75.7444172!5e0!3m2!1sen!2sin!4v1772183436384!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '380px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Jaipur Location Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Support & WhatsApp Banner */}
      <section className="py-3">
        <div className="container">
          <div className="bg-white border rounded-4 p-4 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-4 text-start">
            <div className="d-flex align-items-center gap-3.5">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="fa-solid fa-headset fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-1 fs-6">Need immediate assistance?</h5>
                <p className="text-secondary fs-8 mb-0">Our 24/7 dedicated support team is available via direct phone or WhatsApp.</p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <a
                href="tel:+919602212487"
                className="btn btn-outline-primary rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center gap-2 fs-8 text-decoration-none"
              >
                <i className="fa-solid fa-phone"></i>
                <span>Call +91 9602212487</span>
              </a>
              <a
                href="https://wa.me/919602212487"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center gap-2 fs-8 text-decoration-none"
              >
                <i className="fa-brands fa-whatsapp fs-5"></i>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. App Download Banner Section */}
      <section className="py-5">
        <div className="container">
          <div
            className="rounded-4 p-5 text-center text-white position-relative overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #0b1528 0%, #172554 50%, #1e3a8a 100%)'
            }}
          >
            <div className="row justify-content-center position-relative z-index-2">
              <div className="col-lg-8">
                <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill fs-9 text-uppercase mb-3">
                  MOBILE APPS
                </span>
                <h2 className="fw-bold display-6 mb-3 text-white">
                  Lehconnect User Friendly App Available
                </h2>
                <p className="text-white-50 lead fs-7 mb-4 mx-auto" style={{ maxWidth: '620px' }}>
                  Book cabs, hotels, and tour packages anytime, anywhere with our easy-to-use mobile app. Enjoy quick bookings, real-time updates, and secure payments.
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-inline-block transition-all hover-opacity"
                  >
                    <img
                      src="/images/common/play-store.svg"
                      alt="Get it on Google Play"
                      style={{ height: '48px', width: 'auto' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-inline-block transition-all hover-opacity"
                  >
                    <img
                      src="/images/common/apple.svg"
                      alt="Download on the App Store"
                      style={{ height: '48px', width: 'auto' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
