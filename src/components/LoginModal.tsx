'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import toast from 'react-hot-toast';
import { sendOtp, verifyOtp } from '../APIs/api';

export const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, setIsLoggedIn } = useBooking();
  const [phone, setPhone] = useState('');
  const [referral, setReferral] = useState('');
  const [agree, setAgree] = useState(true);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginModalOpen) {
        closeLoginModal();
      }
    };
    if (isLoginModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'phone') {
      if (!phone || phone.length < 10) {
        toast.error('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!agree) {
        toast.error('You must agree to the Privacy Policy and Terms & Conditions.');
        return;
      }

      setIsLoading(true);
      try {
        await sendOtp(phone, 'customer');
        toast.success('OTP sent successfully!');
        setStep('otp');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to send OTP.');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!otp) {
        toast.error('Please enter the OTP.');
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await verifyOtp(phone, otp, 'customer');
        if (res?.results?.token) {
          localStorage.setItem('customerToken', res.results.token);
          if (res.results.refreshToken) {
            localStorage.setItem('customerRefreshToken', res.results.refreshToken);
          }
        }
        setIsLoggedIn(true);
        toast.success('Successfully logged in!');
        closeLoginModal();
        setPhone('');
        setReferral('');
        setOtp('');
        setStep('phone');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Invalid OTP.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="leh-login-modal-overlay"
      onClick={closeLoginModal}
    >
      <div
        className="card shadow-2xl border-0 bg-white leh-login-modal-card position-relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Tempo traveller showcase image on desktop / tablet */}
        <div className="leh-login-modal-media d-none d-md-block position-relative">
          <img
            src="/images/fleet/cab-tempo-traveller.webp"
            alt="LehConnect Travel"
            className="leh-login-modal-banner-img"
            loading="lazy"
            decoding="async"
          />
          <div className="leh-login-modal-overlay-gradient position-absolute bottom-0 start-0 w-100 p-4 text-white">
            <span className="badge bg-warning text-dark fw-bold fs-9 mb-1">PREMIUM TRAVEL</span>
            <h6 className="fw-bold mb-1 fs-7">Explore Ladakh with LehConnect</h6>
            <p className="fs-9 text-white-50 mb-0">Hassle-free cabs, hotels, flights & packages</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="leh-login-modal-content p-4 p-lg-5 d-flex flex-column justify-content-between position-relative flex-grow-1">
          {/* Close button top right */}
          <button
            type="button"
            onClick={closeLoginModal}
            className="leh-login-modal-close btn btn-light rounded-circle position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center p-0 shadow-sm"
            title="Close"
            aria-label="Close login modal"
          >
            <i className="fa-solid fa-xmark text-secondary fs-7"></i>
          </button>

          {/* Logo & Heading */}
          <div className="text-center pt-2 mb-3">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <img
                src="/logo.jpg"
                alt="LehConnect Logo"
                className="leh-login-logo"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* <h4 className="fw-bold text-dark mb-1 fs-5">Login or Sign Up</h4> */}
            <p className="text-muted fs-8 mb-0">
              {step === 'phone' 
                ? 'Enter your 10-digit mobile number to continue' 
                : `Enter the OTP sent to +91 ${phone}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="my-auto py-2">
            {step === 'phone' ? (
              <>
                {/* Phone Number Field */}
                <div className="mb-3 text-start">
                  <label className="form-label fw-bold text-dark fs-8 mb-1.5">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-dark fw-bold border fs-8 px-2.5">+91</span>
                    <input
                      type="tel"
                      className="form-control border fs-8 py-2"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Referral Code Field */}
                <div className="mb-3 text-start">
                  <input
                    type="text"
                    className="form-control border fs-8 py-2"
                    placeholder="Do you have a referral code? (Optional)"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                  />
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="form-check text-start mb-3">
                  <input
                    className="form-check-input border-secondary"
                    type="checkbox"
                    id="modalPrivacyAgreeCheck"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    required
                  />
                  <label
                    className="form-check-label fs-9 text-muted fw-semibold"
                    htmlFor="modalPrivacyAgreeCheck"
                  >
                    I agree to the <span className="text-primary">Privacy Policy</span> and{' '}
                    <span className="text-primary">Terms & Conditions</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                {/* OTP Field */}
                <div className="mb-3 text-start">
                  <label className="form-label fw-bold text-dark fs-8 mb-1.5">One Time Password</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control border fs-8 py-2 text-center text-tracking-widest fw-bold"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="text-end mt-2">
                    <button 
                      type="button" 
                      className="btn btn-link p-0 text-primary fs-9 text-decoration-none"
                      onClick={() => setStep('phone')}
                    >
                      Change Number?
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-100 py-2.5 fw-bold text-uppercase fs-8 shadow-sm leh-login-submit-btn"
            >
              {isLoading ? 'Processing...' : step === 'phone' ? 'Continue' : 'Verify & Login'}
            </button>
          </form>

          {/* Bottom Security Note */}
          <div className="text-center pt-2">
            <span className="fs-9 text-muted">
              <i className="fa-solid fa-lock text-success me-1"></i> 100% Safe & Secure Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
