'use client';

import React, { useState } from 'react';
import Link from '../../components/Link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('All fields are required.');
      return;
    }
    toast.success('Registration initial step success. Verifying OTP...');
    router.push(ROUTES.OTP);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center leh-style-auto-1058">
      <div className="card shadow-lg border-0 p-4 w-100 leh-style-auto-1040">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">Create Account</h3>
          <p className="text-muted fs-7">Join LehConnect to unlock exclusive travel member offers</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold fs-7">Full Name</label>
            <input 
              type="text" 
              className="form-control py-2 fs-7" 
              placeholder="E.g., Vikram Singh"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold fs-7">Email Address</label>
            <input 
              type="email" 
              className="form-control py-2 fs-7" 
              placeholder="E.g., vikram@example.com"
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold fs-7">Phone Number</label>
            <input 
              type="tel" 
              className="form-control py-2 fs-7" 
              placeholder="E.g., +91 98765 43210"
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold fs-7">Password</label>
            <input 
              type="password" 
              className="form-control py-2 fs-7" 
              placeholder="Create secure password"
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-premium-primary w-100 py-2 justify-content-center mt-2">
            Create Account
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="fs-7 text-muted mb-0">
            Already have an account? <Link href={ROUTES.LOGIN} className="  fw-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

