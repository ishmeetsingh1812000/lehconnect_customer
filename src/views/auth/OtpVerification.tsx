'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const OtpVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      toast.error('Please enter the complete 4-digit code.');
      return;
    }
    toast.success('Mobile & Email verification successful! You can now log in.');
    router.push(ROUTES.LOGIN);
  };

  const handleResend = () => {
    toast.success('A new OTP has been sent to your email and phone.');
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center leh-style-auto-1039">
      <div className="card shadow-lg border-0 p-4 w-100 leh-style-auto-1040">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">One Time Password</h3>
          <p className="text-muted fs-7">We have sent a verification code to your email and mobile</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center gap-2 mb-4">
            {otp.map((data, index) => (
              <input key={index} type="text" maxLength={1} className="form-control text-center fs-4 fw-bold leh-style-auto-1057" value={data} onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                required
              />
            ))}
          </div>
          <button type="submit" className="btn btn-premium-primary w-100 py-2 justify-content-center">
            Verify Code
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="fs-7 text-muted mb-0">
            Didn't receive the code? <button onClick={handleResend} className="btn btn-link p-0 fw-bold fs-7">Resend OTP</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

