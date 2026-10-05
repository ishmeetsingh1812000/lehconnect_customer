'use client';

import React from 'react';
import Link from '../Link';
import { appDownloadContent } from './homeData';

export interface AppDownloadSectionProps {
  title?: string;
  desc?: string;
  googlePlayLink?: string;
  appStoreLink?: string;
  qrLabel?: string;
}

export const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({
  title = appDownloadContent.title,
  desc = appDownloadContent.desc,
  googlePlayLink = appDownloadContent.googlePlayLink,
  appStoreLink = appDownloadContent.appStoreLink,
  qrLabel = appDownloadContent.qrLabel
}) => {
  return (
    <section className="container mb-5">
      <div className="position-relative overflow-hidden rounded-4 text-start text-white shadow-lg p-5 leh-style-auto-1139">
        <div className="row align-items-center g-4">
          <div className="col-lg-8 leh-style-auto-1140">
            <h3 className="fw-black text-white mb-2 leh-style-auto-1141">{title}</h3>
            <p className="text-white-50 fs-7 mb-4 leh-style-auto-1142">{desc}</p>
            <div className="d-flex flex-wrap gap-3">
              <Link
                to={googlePlayLink}
                className="btn btn-warning fw-bold px-4 py-2 text-dark rounded-pill d-flex align-items-center gap-2 text-decoration-none leh-style-auto-1061"
              >
                <i className="fa-brands fa-android"></i> Get it on Google Play
              </Link>
              <Link
                to={appStoreLink}
                className="btn btn-outline-light fw-bold px-4 py-2 rounded-pill d-flex align-items-center gap-2 text-decoration-none leh-style-auto-1061"
              >
                <i className="fa-brands fa-apple"></i> Get it on App Store
              </Link>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end text-center d-flex justify-content-lg-end justify-content-center gap-3 leh-style-auto-1140">
            <div className="bg-white p-3 border rounded shadow-sm text-center text-dark leh-style-auto-1143">
              <i className="fa-solid fa-qrcode mx-auto" style={{ fontSize: '50px' }}></i>
              <span className="fs-9 text-muted d-block mt-2">{qrLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
