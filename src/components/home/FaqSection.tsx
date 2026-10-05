'use client';

import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { FaqItem } from './types';
import { faqsData } from './homeData';

export interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs?: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  title,
  subtitle = 'Clear answers to common questions about booking and operations',
  faqs = faqsData
}) => {
  const { t } = useBooking();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const displayTitle = title || t('faqs');

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section className="py-5 bg-white">
      <div className="container leh-style-auto-1154">
        <div className="text-center mb-5">
          <h3 className="fw-bold text-dark">{displayTitle}</h3>
          <p className="text-muted">{subtitle}</p>
        </div>
        <div className="accordion-wrapper">
          {faqs.map((faq, index) => (
            <div className="faq-card" key={index}>
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className={`faq-button ${activeFaq === index ? 'active' : ''}`}
              >
                <span>{faq.q}</span>
                {activeFaq === index ? (
                  <i className="fa-solid fa-chevron-up"></i>
                ) : (
                  <i className="fa-solid fa-chevron-down"></i>
                )}
              </button>
              {activeFaq === index && (
                <div className="faq-body">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
