import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Lato, Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../public/assets/css/style.css";
import "../../public/assets/css/responsive.css";

import BootstrapClient from "../components/BootstrapClient";
import { BookingProvider } from "../context/BookingContext";
import { Header } from "../layout/Header";
import { Breadcrumb } from "../layout/Breadcrumb";
import { Footer } from "../layout/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { LoginModal } from "../components/LoginModal";
import { Toaster } from "react-hot-toast";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lehconnect.com"),
  title:
    "LehConnect | Premium Travel Booking - Cabs, Hotels, Flights & Holidays",
  description:
    "Book cabs, hotels, flights, holidays, trains, and buses with LehConnect. A premium luxury travel booking platform inspired by industry leaders.",
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "LehConnect | Premium Travel Booking - Cabs, Hotels, Flights & Holidays",
    description:
      "Book cabs, hotels, flights, holidays, trains, and buses with LehConnect across the Himalayas.",
    url: "https://lehconnect.com",
    siteName: "LehConnect",
    images: [
      {
        url: "/images/gallery/gallery-scenic-ladakh.webp",
        width: 1200,
        height: 630,
        alt: "LehConnect Scenic Ladakh Travel",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LehConnect | Premium Travel Booking",
    description:
      "Book cabs, hotels, flights, holidays, trains, and buses with LehConnect across Ladakh and the Himalayas.",
    images: ["/images/gallery/gallery-scenic-ladakh.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://lehconnect.com/#agency",
      name: "LehConnect",
      url: "https://lehconnect.com",
      logo: "https://lehconnect.com/favicon.png",
      image: "https://lehconnect.com/images/gallery/gallery-scenic-ladakh.webp",
      description:
        "Book cabs, hotels, flights, and holiday tour packages across Ladakh and the Himalayas.",
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Leh",
        addressRegion: "Ladakh",
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://lehconnect.com/#website",
      url: "https://lehconnect.com",
      name: "LehConnect",
      publisher: {
        "@id": "https://lehconnect.com/#agency",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://lehconnect.com/holidays?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${poppins.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/gallery/gallery-scenic-ladakh-mobile.webp"
          fetchPriority="high"
          media="(max-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/gallery/gallery-scenic-ladakh.webp"
          fetchPriority="high"
          media="(min-width: 769px)"
        />
        <link rel="preload" as="style" href="/fa/css/all.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='/fa/css/all.min.css';document.head.appendChild(l);})();`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/fa/css/all.min.css" />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={lato.className}>
        <BootstrapClient />
        <BookingProvider>
          <ScrollToTop />
          <ScrollToTopButton />
          <LoginModal />
          <div className="app-container">
            <Header />
            <Suspense fallback={null}>
              <Breadcrumb />
            </Suspense>
            <main className="main-content">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontFamily: "inherit", fontSize: "14px" },
              }}
            />
          </div>
        </BookingProvider>
      </body>
    </html>
  );
}
