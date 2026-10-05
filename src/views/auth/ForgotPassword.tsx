'use client';

import React, { useState } from 'react';
import Link from '../../components/Link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    toast.success('Reset link and recovery instructions sent to your email.');
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center leh-style-auto-1039">
      <div className="card shadow-lg border-0 p-4 w-100 leh-style-auto-1040">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">Password Recovery</h3>
          <p className="text-muted fs-7">Enter your email and we'll send you instructions to reset your password</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold fs-7">Email Address</label>
            <input 
              type="email" 
              className="form-control py-2 fs-7" 
              placeholder="E.g., vikram@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-premium-primary w-100 py-2 justify-content-center mt-2">
            Send Recovery Link
          </button>
        </form>
        <div className="text-center mt-4">
          <Link href={ROUTES.LOGIN} className="text-muted fs-7 hover-text-orange">
            <i className="fa-solid fa-arrow-left me-1"></i> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
