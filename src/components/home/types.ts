export interface OfferItem {
  code: string;
  category: 'all' | 'cabs' | 'hotels' | 'flights' | 'holidays' | 'bus' | 'train' | 'visa' | 'insurance';
  title: string;
  desc: string;
  exp: string;
  img: string;
}

export interface RecentlyViewedPackage {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  price: string;
  badge: string;
  img: string;
  action: string;
  footer: string;
}

export interface HolidayDestinationItem {
  name: string;
  img: string;
  price?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  img: string;
  linkText?: string;
}

export interface CarCategoryItem {
  name: string;
  subtitle: string;
  img: string;
  filterType: string;
}

export interface HowItWorksStep {
  stepNumber: string;
  titlePrefix: string;
  titleSuffix: string;
  desc: string;
  icon: string;
}

export interface LuxuryCarItem {
  name: string;
  subtitle: string;
  img: string;
  filterType: string;
}

export interface TestimonialItem {
  id: string | number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  img: string;
}

export interface BlogPostItem {
  id: string | number;
  date: string;
  title: string;
  excerpt: string;
  img: string;
  slug: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CarFleetDetail {
  name: string;
  img: string;
  ac: string;
  seats: string;
  transmission: string;
  luggage: string;
  features: string[];
}

export interface AboutUsStats {
  ridesTarget: number;
  customersTarget: number;
  citiesTarget: number;
  ridesLabel: string;
  customersLabel: string;
  citiesLabel: string;
}
