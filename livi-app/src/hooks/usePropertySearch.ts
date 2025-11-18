// hooks/usePropertySearch.ts
import { useState, useEffect, useMemo } from 'react';

export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  type: 'apartment' | 'house' | 'condo';
  featured: boolean;
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 250000,
    address: '123 Main St, Downtown, NY',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    type: 'apartment',
    featured: true
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    price: 750000,
    address: '456 Oak Ave, Beverly Hills, CA',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400',
    type: 'house',
    featured: true
  },
  {
    id: '3',
    title: 'Cozy Studio Condo',
    price: 150000,
    address: '789 Pine St, Seattle, WA',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    type: 'condo',
    featured: false
  },
  {
    id: '4',
    title: 'Family Suburban Home',
    price: 450000,
    address: '321 Elm St, Austin, TX',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
    type: 'house',
    featured: false
  },
  {
    id: '5',
    title: 'Penthouse with City View',
    price: 1200000,
    address: '555 Skyline Dr, Miami, FL',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2800,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400',
    type: 'apartment',
    featured: true
  },
  {
    id: '6',
    title: 'Beachfront Condo',
    price: 350000,
    address: '777 Beach Blvd, San Diego, CA',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
    type: 'condo',
    featured: false
  }
];

export interface FilterOptions {
  minPrice: number;
  maxPrice: number;
}

export interface SearchFilters extends FilterOptions {
  query: string;
}

export const usePropertySearch = (searchFilters: SearchFilters) => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [loading, setLoading] = useState(false);

  const filteredProperties = useMemo(() => {
    setLoading(true);
    
    const filtered = mockProperties.filter(property => {
      // Search query filter
      const matchesQuery = searchFilters.query === '' || 
        property.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        property.address.toLowerCase().includes(searchFilters.query.toLowerCase());

      // Price range filter
      const matchesMinPrice = searchFilters.minPrice === 0 || property.price >= searchFilters.minPrice;
      const matchesMaxPrice = searchFilters.maxPrice === 0 || property.price <= searchFilters.maxPrice;

      return matchesQuery && matchesMinPrice && matchesMaxPrice;
    });

    // Simulate API delay
    setTimeout(() => setLoading(false), 300);
    
    return filtered;
  }, [searchFilters]);

  return {
    properties: filteredProperties,
    loading,
    allProperties: mockProperties
  };
};