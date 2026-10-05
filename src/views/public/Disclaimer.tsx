import React from 'react';

export const Disclaimer = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          <div className="card shadow-sm border-0 p-4 p-md-5 rounded-4 bg-white">
            <h2 className="fw-bold text-dark border-bottom pb-3 mb-4">Disclaimer</h2>
            <p className="text-secondary fs-7 lh-lg">
              High-altitude mountain travel contains inherent risk due to terrain, landslips, and oxygen pressure. LehConnect is not liable for itinerary disruptions, flight cancellations, or cab blockages caused by weather anomalies or road closures by local military/border police authorities. Travelers are advised to obtain travel insurance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;

