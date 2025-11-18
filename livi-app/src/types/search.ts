// types/search.ts
export interface PlaceToStay {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'apartment' | 'house' | 'condo' | 'villa';
  rating: number;
  reviewCount: number;
  image: string;
  featured: boolean;
  distance?: number;
}

export interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  radius: number;
  minBedrooms: number;
  minBathrooms: number;
  minSqft: number;
  maxSqft: number;
  types: string[];
  minRating: number;
}

export interface SearchLocation {
  address: string;
  latitude?: number;
  longitude?: number;
  useCurrentLocation: boolean;
}