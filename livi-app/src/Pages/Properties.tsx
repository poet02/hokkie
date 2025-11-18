// a properties page
//add property button
//search bar at the top, with filter button on the right
// when filter is pressed, a side panel comes in from the right with filter options
//for now filter should just have min price and max price
//show list of filtered propereties under search bar
//for searching using a a custom hook usePropertySearch that takes in search query and filter options and returns list of properties
//use mock data for properties in the hook

// pages/PropertiesPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePropertySearch, SearchFilters } from '../hooks/usePropertySearch';
import { PropertyCard } from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import { Search, Filter, Plus, HousePlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
    overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
`;


const SearchSection = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 50;
  transform: translateY(${props => props.visible ? '0' : '-100%'});
  transition: transform 0.3s ease-in-out;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
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

const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
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

const ResultsSection = styled.div`
  margin-bottom: 2rem;
  padding-top: 1rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ResultsCount = styled.p`
  margin: 0;
  color: #666;
  font-size: 1rem;
`;

const PropertiesGrid = styled.div`
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

const IconSection = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`;

const BackButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

`;

const Icon = styled.button`
  top: 1rem;
  left: 1rem;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

`;

export const Properties: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 0,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(searchFilters);
  const [showSearch, setShowSearch] = useState(true);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const currentScrollY = containerRef.current.scrollTop;

      if (currentScrollY <= 0) {
        setShowSearch(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setShowSearch(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setShowSearch(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const { properties, loading } = usePropertySearch(searchFilters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters(prev => ({ ...prev, query: e.target.value }));
  };

  const handleFilterOpen = () => {
    setCurrentFilters(searchFilters);
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setCurrentFilters(filters);
  };

  const handleApplyFilters = () => {
    setSearchFilters(currentFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { query: searchFilters.query, minPrice: 0, maxPrice: 0 };
    setCurrentFilters(clearedFilters);
    setSearchFilters(clearedFilters);
  };

  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property);
    navigate(`/properties/${property.id}`);

    // Navigate to property details page or show modal
  };

  const handleAddProperty = () => {
    console.log('Add property clicked');
    navigate('/add-property');
    // Open add property modal or navigate to form
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer ref={containerRef}>


      <SearchSection visible={showSearch}>
        <IconSection>
          <BackButton onClick={handleBack}>
            <ArrowLeft color="#333" strokeWidth={2} size={20} />
          </BackButton>
          <Icon>
            <HousePlus onClick={handleAddProperty} color='blue' size={24} />
          </Icon>
        </IconSection>

        <SearchContainer>
          <SearchInput>
            <SearchIcon />
            <Input
              type="text"
              placeholder="Search properties by title or address..."
              value={searchFilters.query}
              onChange={handleSearchChange}
            />
          </SearchInput>

        </SearchContainer>
      </SearchSection>

      <ResultsSection>
        <ResultsHeader>
          <ResultsCount>
            {loading ? 'Searching...' : `${properties.length} properties found`}
          </ResultsCount>
        </ResultsHeader>

        {loading ? (
          <LoadingMessage>Loading properties...</LoadingMessage>
        ) : properties.length === 0 ? (
          <EmptyMessage>No properties found matching your criteria.</EmptyMessage>
        ) : (
          <PropertiesGrid>
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={handlePropertyClick}
              />
            ))}
          </PropertiesGrid>
        )}
      </ResultsSection>

    </PageContainer>
  );
};

// export default PropertiesPage;