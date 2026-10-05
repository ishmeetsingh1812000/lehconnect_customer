import React from 'react';

export const CancellationPolicy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          <div className="card shadow-sm border-0 p-4 p-md-5 rounded-4 bg-white">
            <h2 className="fw-bold text-dark border-bottom pb-3 mb-4">Cancellation Policy</h2>
            <p className="text-secondary fs-7 lh-lg">
              Cabs cancelled 24 hours prior to pickup are eligible for a 100% refund. Stays and hotel rooms cancellation rules vary by booking type and vendor selection. Flights are subject to airline cancellation fees. Cancel requests can be managed directly on your Dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;

