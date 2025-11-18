// pages/SearchPlaces.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Filter, MapPin, Navigation } from 'lucide-react';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { PlacesFilterPanel } from '../Components/PlacesFilterPanel';
import { PlaceCard } from '../Components/PlaceCard';
import { popularDestinations } from '../data/mockPlaces';

const Container = styled.div`
  height: 100vh;
    overflow-y: auto;
  background: #f5f5f5;
  color: #333;
`;

const Header = styled.div`
  background: white;
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0 0 2rem 0;
  color: #666;
  text-align: center;
  font-size: 1.125rem;
`;

const SearchSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  width: 20px;
  height: 20px;
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #f5f5f5;
    border-color: #1976d2;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1976d2;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1565c0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const ResultsSection = styled.div`
  margin-bottom: 3rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ResultsTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const ResultsCount = styled.p`
  margin: 0;
  color: #666;
`;

const PlacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.125rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.125rem;
`;

const SuggestionsSection = styled.div`
  margin-top: 3rem;
`;

const SuggestionsTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

const DestinationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const DestinationCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const DestinationImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const DestinationOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1.5rem;
  color: white;
`;

const DestinationName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const DestinationCount = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
`;

export function SearchPlaces() {
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const {
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
    } = usePlaceSearch();

    const handleSearch = async () => {
        if (!searchLocation.address && !searchLocation.useCurrentLocation) {
            alert('Please enter a location or use your current location');
            return;
        }
        await executeSearch();
    };

    const handleUseCurrentLocation = () => {
        useCurrentLocation();
    };

    const handlePlaceClick = (place: any) => {
        // Navigate to property details or show more info
        navigate(`/properties/${place.id}`);
    };

    const handleDestinationClick = (destination: any) => {
        setSearchLocation({
            address: destination.name,
            useCurrentLocation: false
        });
    };

    const hasActiveFilters =
        filters.minPrice > 0 ||
        filters.maxPrice < 1000 ||
        filters.radius < 50 ||
        filters.minBedrooms > 0 ||
        filters.minBathrooms > 0 ||
        filters.minSqft > 0 ||
        filters.maxSqft < 5000 ||
        filters.types.length > 0 ||
        filters.minRating > 0;

    return (
        <Container>
            <Header>
                <Title>Find Your Perfect Stay</Title>
                <Subtitle>Discover places to stay around the world</Subtitle>

                <SearchSection>
                    <SearchContainer>
                        <SearchInput>
                            <SearchIcon />
                            <Input
                                type="text"
                                placeholder="Search by city, address, or landmark..."
                                value={searchLocation.address}
                                onChange={(e) => setSearchLocation(prev => ({
                                    ...prev,
                                    address: e.target.value,
                                    useCurrentLocation: false
                                }))}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </SearchInput>

                        <LocationButton onClick={handleUseCurrentLocation}>
                            <Navigation size={16} />
                            My Location
                        </LocationButton>

                        <SearchButton
                            onClick={handleSearch}
                            disabled={isSearching}
                        >
                            <Search />
                            {isSearching ? 'Searching...' : 'Search'}
                        </SearchButton>
                    </SearchContainer>

                    <ActionsRow>
                        <FilterButton
                            active={hasActiveFilters}
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter />
                            Filters
                        </FilterButton>

                        {hasSearched && (
                            <button
                                onClick={clearSearch}
                                style={{
                                    background: 'none',
                                    border: '1px solid #e0e0e0',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                Clear Search
                            </button>
                        )}
                    </ActionsRow>
                </SearchSection>
            </Header>

            <Content>
                {hasSearched ? (
                    <ResultsSection>
                        <ResultsHeader>
                            <ResultsTitle>Search Results</ResultsTitle>
                            <ResultsCount>
                                {searchResults.length} {searchResults.length === 1 ? 'property' : 'properties'} found
                                {searchLocation.useCurrentLocation && ' near you'}
                            </ResultsCount>
                        </ResultsHeader>

                        {isSearching ? (
                            <LoadingMessage>Searching for places...</LoadingMessage>
                        ) : searchResults.length === 0 ? (
                            <EmptyMessage>
                                No properties found matching your criteria. Try adjusting your filters or search location.
                            </EmptyMessage>
                        ) : (
                            <PlacesGrid>
                                {searchResults.map(place => (
                                    <PlaceCard
                                        key={place.id}
                                        place={place}
                                        onClick={handlePlaceClick}
                                    />
                                ))}
                            </PlacesGrid>
                        )}
                    </ResultsSection>
                ) : (
                    <SuggestionsSection>
                        <SuggestionsTitle>Popular Destinations</SuggestionsTitle>
                        <DestinationsGrid>
                            {popularDestinations.map((destination, index) => (
                                <DestinationCard
                                    key={index}
                                    onClick={() => handleDestinationClick(destination)}
                                >
                                    <DestinationImage src={destination.image} alt={destination.name} />
                                    <DestinationOverlay>
                                        <DestinationName>{destination.name}</DestinationName>
                                        <DestinationCount>{destination.count}</DestinationCount>
                                    </DestinationOverlay>
                                </DestinationCard>
                            ))}
                        </DestinationsGrid>
                    </SuggestionsSection>
                )}
            </Content>

            <PlacesFilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleSearch}
                onClearFilters={() => {
                    setFilters({
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
                }}
            />
        </Container>
    );
}