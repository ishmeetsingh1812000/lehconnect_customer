'use client';

import React from 'react';
import { HowItWorksStep } from './types';
import { howItWorksSteps } from './homeData';

export interface HowItWorksSectionProps {
  tag?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  subtitle?: string;
  steps?: HowItWorksStep[];
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  tag = 'HOW IT WORKS',
  titlePrefix = 'Car Book ',
  titleHighlight = 'Process',
  subtitle = 'Book your ride in 3 easy steps and enjoy a smooth journey with us.',
  steps = howItWorksSteps
}) => {
  return (
    <section className="py-5 position-relative overflow-hidden leh-style-auto-1125">
      {/* Mountain background image overlay */}
      <div className="position-absolute start-0 top-0 w-100 h-100 leh-style-auto-1126" />

      <div className="container position-relative leh-style-auto-1080">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-flex justify-content-center mb-2">
            <span className="px-3 py-1 rounded-pill fw-bold fs-9 text-uppercase tracking-wider leh-style-auto-1127">
              {tag}
            </span>
          </div>
          <h2 className="fw-black text-dark mb-2 leh-style-auto-1128">
            {titlePrefix}
            <span className="leh-style-auto-1129">{titleHighlight}</span>
          </h2>
          <p className="text-muted fs-8 mb-0">{subtitle}</p>
        </div>

        <div className="row g-4 justify-content-center">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div
                className={`col-md-4 text-center ${!isLast ? 'position-relative' : ''}`}
                key={step.stepNumber}
              >
                <div className="card border-0 shadow-sm p-4 bg-white text-center position-relative h-100 leh-style-auto-1130">
                  <span className="position-absolute start-0 top-0 m-3 rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-9 leh-style-auto-1131">
                    {step.stepNumber}
                  </span>

                  <div
                    className={`mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4 position-relative ${
                      isLast ? 'overflow-hidden' : ''
                    } leh-style-auto-1132`}
                  >
                    <i
                      className={`${step.icon} ${
                        isLast ? 'leh-style-auto-1137' : 'leh-style-auto-1133'
                      }`}
                    ></i>
                  </div>

                  <h3 className="fw-bold text-dark fs-6 mb-3">
                    <span className="leh-style-auto-1134">{step.titlePrefix}</span> {step.titleSuffix}
                  </h3>
                  <p className="text-muted fs-8 px-2 mb-0 leh-style-auto-1135">{step.desc}</p>
                </div>

                {/* Connector Arrow for desktop */}
                {!isLast && (
                  <div className="position-absolute top-50 translate-middle-y d-none d-lg-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm border fw-bold leh-style-auto-1136">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
