'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '../../context/BookingContext';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const Login = () => {
  const router = useRouter();
  const { setIsLoggedIn } = useBooking();
  const [phone, setPhone] = useState('');
  const [referral, setReferral] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!agree) {
      toast.error('You must agree to the Privacy Policy and Terms & Conditions.');
      return;
    }
    
    setIsLoggedIn(true);
    toast.success('Successfully logged in!');
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center leh-style-auto-1041">
      <div className="card shadow-lg border-0 bg-white overflow-hidden d-flex flex-row w-100 leh-style-auto-1042">
        {/* Left Side: Balleno hatchback car image */}
        <div className="d-none d-md-block leh-style-auto-1043">
          <img src="/images/fleet/cab-tempo-traveller.webp" alt="Baleno Hatchback" className="leh-style-auto-1044" loading="lazy" decoding="async" />
        </div>

        {/* Right Side: Login Form */}
        <div className="p-4 p-lg-5 d-flex flex-column justify-content-between position-relative flex-grow-1 leh-style-auto-1045">
          
          {/* Close button top right */}
          <button type="button" onClick={() => router.push(ROUTES.HOME)} className="btn btn-link text-muted position-absolute leh-style-auto-1046">
            <i className="fa-solid fa-xmark fs-5"></i>
          </button>

          {/* Heading */}
          <div className="text-start mt-2">
            <h4 className="fw-bold text-dark mb-0 leh-style-auto-1018">Login</h4>
          </div>

          <form onSubmit={handleSubmit} className="my-auto py-3">
            
            {/* Custom Location Handshake Logo */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
              <img src="/logo.jpg" alt="LehConnect Logo" className="leh-style-auto-1027" loading="lazy" decoding="async" />
            </div>

            {/* Phone Number Fields */}
            <div className="mb-3 text-start">
              <label className="form-label fw-bold text-dark fs-7 mb-2">Phone Number</label>
              <div className="input-group leh-style-auto-1052">
                <span className="input-group-text bg-light text-dark fw-bold border leh-style-auto-1053">+91</span>
                <input 
                  type="tel" 
                  className="form-control border fs-7 py-2" 
                  placeholder="Enter your mobile" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  required 
                />
              </div>
            </div>

            {/* Referral Code Field */}
            <div className="mb-3 text-start">
              <input type="text" className="form-control border fs-7 py-2 leh-style-auto-1054" placeholder="Do you have a referral code?" value={referral} onChange={(e) => setReferral(e.target.value)} />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="form-check text-start mb-4">
              <input 
                className="form-check-input border-secondary" 
                type="checkbox" 
                id="privacyAgreeCheck"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required 
              />
              <label className="form-check-label fs-8 text-muted fw-semibold leh-style-auto-1055" htmlFor="privacyAgreeCheck">
                I agree to the Privacy Policy and Terms & Condition
              </label>
            </div>

            {/* Continue Button */}
            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold text-uppercase fs-7 hover-shadow leh-style-auto-1056">
              Continue
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
