import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          <div className="card shadow-sm border-0 p-4 p-md-5 rounded-4 bg-white">
            <h2 className="fw-bold text-dark border-bottom pb-3 mb-4">Privacy Policy</h2>
            <p className="text-secondary fs-7 lh-lg">
              We value your privacy. LehConnect collects minimal user registration credentials (email, name, mobile number) and booking choices to process secure tickets, coordinate outstation driver communications, and credit cashback wallet details. We do not sell user travel logs to third parties. Financial transactions are processed via secure encryption standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

