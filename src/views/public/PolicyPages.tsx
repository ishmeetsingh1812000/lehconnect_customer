'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';

export const PolicyPages = () => {
  const pathname = usePathname() || '';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('privacy');

  const handleTabClick = (key) => {
    const routeMap = {
      privacy: ROUTES.PRIVACY,
      terms: ROUTES.TERMS,
      refund: ROUTES.REFUND,
      cancellation: ROUTES.CANCELLATION,
      cookies: ROUTES.COOKIES,
      disclaimer: ROUTES.DISCLAIMER
    };
    router.push(routeMap[key]);
  };

  useEffect(() => {
    const path = pathname;
    if (path.includes('privacy')) setActiveTab('privacy');
    else if (path.includes('terms')) setActiveTab('terms');
    else if (path.includes('refund')) setActiveTab('refund');
    else if (path.includes('cancellation')) setActiveTab('cancellation');
    else if (path.includes('cookies')) setActiveTab('cookies');
    else if (path.includes('disclaimer')) setActiveTab('disclaimer');
  }, [pathname]);

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      content: 'We value your privacy. LehConnect collects minimal user registration credentials (email, name, mobile number) and booking choices to process secure tickets, coordinate outstation driver communications, and credit cashback wallet details. We do not sell user travel logs to third parties. Financial transactions are processed via secure encryption standards.'
    },
    terms: {
      title: 'Terms & Conditions',
      content: 'By booking services on LehConnect (Vite App), you agree to our transit scheduling limits. We act as facilitators connecting you with verified outstation cab operators, airlines, and hotel partners. All carriage contracts and stays are subject to partner conditions and local high-altitude safety guidelines.'
    },
    refund: {
      title: 'Refund Policy',
      content: 'Refunds for cancellations are processed directly to your LehConnect wallet or original bank cards. Processing times are typically 3–5 business days. Promos and coupon credits are non-refundable. Flat processing fees may apply depending on the cancel schedule.'
    },
    cancellation: {
      title: 'Cancellation Policy',
      content: 'Cabs cancelled 24 hours prior to pickup are eligible for a 100% refund. Stays and hotel rooms cancellation rules vary by booking type and vendor selection. Flights are subject to airline cancellation fees. Cancel requests can be managed directly on your Dashboard.'
    },
    cookies: {
      title: 'Cookies Policy',
      content: 'LehConnect uses browser cookies to store active traveler details, recent search logs, and login state parameters. Cookies help us keep your account logged in and suggest relevant routes. You can clear cookies inside your browser settings at any time.'
    },
    disclaimer: {
      title: 'Disclaimer',
      content: 'High-altitude mountain travel contains inherent risk due to terrain, landslips, and oxygen pressure. LehConnect is not liable for itinerary disruptions, flight cancellations, or cab blockages caused by weather anomalies or road closures by local military/border police authorities. Travelers are advised to obtain travel insurance.'
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Policies & Legal Agreements</h2>
        <p className="text-muted">Review our terms, privacy collection, refund parameters, and disclaimer information.</p>
      </div>

      <div className="row g-4">
        {/* Tab Selection */}
        <div className="col-md-3">
          <div className="list-group shadow-sm border-0">
            {Object.keys(policies).map(key => (
              <button 
                key={key} 
                onClick={() => handleTabClick(key)} 
                className={`list-group-item list-group-item-action border-0 py-3 fw-bold fs-7 ${activeTab === key ? 'bg-primary text-white' : 'text-dark'}`}
              >
                {policies[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="col-md-9">
          <div className="card shadow-sm border-0 p-4 rounded-3 bg-white h-100">
            <h4 className="fw-bold text-dark border-bottom pb-3 mb-3">{policies[activeTab].title}</h4>
            <p className="text-muted fs-7 leh-style-auto-1221">
              {policies[activeTab].content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPages;

