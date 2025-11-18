// hooks/usePlaceSearch.ts
import { useState, useMemo } from 'react';
import { PlaceToStay, SearchFilters, SearchLocation } from '../types/search';
import { mockPlaces } from '../data/mockPlaces';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export function usePlaceSearch() {
  const [searchLocation, setSearchLocation] = useState<SearchLocation>({
    address: '',
    useCurrentLocation: false
  });
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 1000,
    radius: 50,
    minBedrooms: 0,
    minBathrooms: 0,
    minSqft: 0,
    maxSqft: 5000,
    types: [],
    minRating: 0
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchResults = useMemo(() => {
    if (!hasSearched) return [];

    let results = [...mockPlaces];

    // Filter by location if coordinates are available
    if (searchLocation.latitude && searchLocation.longitude) {
      results = results.map(place => ({
        ...place,
        distance: calculateDistance(
          searchLocation.latitude!,
          searchLocation.longitude!,
          place.latitude,
          place.longitude
        )
      })).filter(place => place.distance <= filters.radius);
    }

    // Apply filters
    results = results.filter(place => {
      return (
        place.price >= filters.minPrice &&
        place.price <= filters.maxPrice &&
        place.bedrooms >= filters.minBedrooms &&
        place.bathrooms >= filters.minBathrooms &&
        place.sqft >= filters.minSqft &&
        place.sqft <= filters.maxSqft &&
        place.rating >= filters.minRating &&
        (filters.types.length === 0 || filters.types.includes(place.type))
      );
    });

    // Sort by distance if available, otherwise by rating
    results.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    });

    return results;
  }, [searchLocation, filters, hasSearched]);

  const executeSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasSearched(true);
    setIsSearching(false);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocation({
            address: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            useCurrentLocation: true
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const clearSearch = () => {
    setSearchLocation({
      address: '',
      useCurrentLocation: false
    });
    setHasSearched(false);
  };

  return {
    searchLocation,
    setSearchLocation,
    filters,
    setFilters,
    searchResults,
    isSearching,
    hasSearched,
    executeSearch,
    useCurrentLocation,
    clearSearch
  };
}