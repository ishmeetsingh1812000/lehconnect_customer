'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '../../hooks/useAppNavigation';
import { aboutUsContent } from './homeData';

export interface AboutUsSectionProps {
  tag?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  para1?: string;
  para2?: string;
  image?: string;
  imageAlt?: string;
  ridesTarget?: number;
  customersTarget?: number;
  citiesTarget?: number;
  ridesLabel?: string;
  customersLabel?: string;
  citiesLabel?: string;
  onKnowMore?: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  tag = aboutUsContent.tag,
  titlePrefix = aboutUsContent.titlePrefix,
  titleHighlight = aboutUsContent.titleHighlight,
  titleSuffix = aboutUsContent.titleSuffix,
  para1 = aboutUsContent.para1,
  para2 = aboutUsContent.para2,
  image = aboutUsContent.image,
  imageAlt = aboutUsContent.imageAlt,
  ridesTarget = aboutUsContent.stats.ridesTarget,
  customersTarget = aboutUsContent.stats.customersTarget,
  citiesTarget = aboutUsContent.stats.citiesTarget,
  ridesLabel = aboutUsContent.stats.ridesLabel,
  customersLabel = aboutUsContent.stats.customersLabel,
  citiesLabel = aboutUsContent.stats.citiesLabel,
  onKnowMore
}) => {
  const navigate = useNavigate();
  const aboutUsRef = useRef<HTMLDivElement>(null);
  const [ridesCount, setRidesCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [citiesCount, setCitiesCount] = useState(0);

  useEffect(() => {
    let observer: IntersectionObserver;
    let timer: NodeJS.Timeout;

    if (aboutUsRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let frame = 0;
            const duration = 1800;
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);

            timer = setInterval(() => {
              frame++;
              const progress = frame / totalFrames;
              const easeProgress = progress * (2 - progress);

              setRidesCount(Math.min(ridesTarget, Math.floor(easeProgress * ridesTarget)));
              setCustomersCount(Math.min(customersTarget, Math.floor(easeProgress * customersTarget)));
              setCitiesCount(Math.min(citiesTarget, Math.floor(easeProgress * citiesTarget)));

              if (frame >= totalFrames) {
                clearInterval(timer);
                setRidesCount(ridesTarget);
                setCustomersCount(customersTarget);
                setCitiesCount(citiesTarget);
              }
            }, frameRate);

            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(aboutUsRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [ridesTarget, customersTarget, citiesTarget]);

  const handleButtonClick = () => {
    if (onKnowMore) {
      onKnowMore();
    } else {
      navigate('/services/cabs');
    }
  };

  return (
    <section ref={aboutUsRef} className="py-5 leh-style-auto-1110">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 text-start">
            <span className="fw-bold text-uppercase tracking-wider fs-9 d-block mb-2">
              {tag}
            </span>
            <h2 className="fw-bold text-dark mb-3 leh-style-auto-1111">
              {titlePrefix}
              <span className="leh-style-auto-1112">{titleHighlight}</span>
              {titleSuffix}
            </h2>
            <p className="text-muted fs-7 mb-4 leh-style-auto-1113">{para1}</p>
            <p className="text-muted fs-7 mb-4 leh-style-auto-1113">{para2}</p>

            <div className="row g-4 mb-4">
              <div className="col-4">
                <h3 className="fw-black mb-0 leh-style-auto-1029">{ridesCount}+</h3>
                <small className="text-muted fw-semibold leh-style-auto-1022">{ridesLabel}</small>
              </div>
              <div className="col-4">
                <h3 className="fw-black mb-0 leh-style-auto-1029">{customersCount}+</h3>
                <small className="text-muted fw-semibold leh-style-auto-1022">{customersLabel}</small>
              </div>
              <div className="col-4">
                <h3 className="fw-black mb-0 leh-style-auto-1029">{citiesCount}+</h3>
                <small className="text-muted fw-semibold leh-style-auto-1022">{citiesLabel}</small>
              </div>
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 leh-style-auto-1092"
            >
              Know More <i className="fa-solid fa-arrow-right ms-1"></i>
            </button>
          </div>
          <div className="col-lg-6 text-center position-relative">
            <div className="position-absolute rounded-circle start-50 top-50 translate-middle opacity-20 leh-style-auto-1114" />
            <img
              src={image}
              alt={imageAlt}
              width={540}
              height={360}
              loading="lazy"
              decoding="async"
              className="img-fluid position-relative shadow-sm rounded-4 leh-style-auto-1115"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
