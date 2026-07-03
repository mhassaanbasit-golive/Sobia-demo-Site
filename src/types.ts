export interface Tire {
  id: string;
  brand: string;
  brandLogo: string;
  name: string;
  type: 'All-Season' | 'All-Terrain' | 'Winter' | 'Summer' | 'Performance' | 'Touring' | 'Commercial';
  image1: string; // Front/tread view
  image2: string; // Angle/sidewall view
  rating: number;
  reviewsCount: number;
  price: number;
  installPrice: number;
  promoBadge?: string;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  savingsAmount?: number;
  sizes: string[];
  specs: {
    utqg: string; // e.g. 500 AA A
    warranty: string; // e.g. 60,000 miles
    loadIndex: string; // e.g. 98Y
    speedRating: string; // e.g. W, Y, H
    season: string;
    sidewall: string; // e.g. Black Sidewall
    runFlat: boolean;
  };
  description: string;
  features: string[];
}

export interface CartItem {
  tire: Tire;
  selectedSize: string;
  quantity: number;
}

export interface Installer {
  id: string;
  name: string;
  address: string;
  distance: number; // in miles
  rating: number;
  reviewsCount: number;
  pricePerTire: number;
  nextAvailable: string; // date/time description
  coordinates: { lat: number; lng: number };
  amenities: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  vehicle: string;
  text: string;
  verified: boolean;
  helpfulCount: number;
  photoUrl?: string;
}

export interface SavedVehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  tireSize: string;
  isDefault?: boolean;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export interface Rebate {
  id: string;
  brand: string;
  brandLogo: string;
  title: string;
  amount: number;
  expires: string;
  description: string;
}
