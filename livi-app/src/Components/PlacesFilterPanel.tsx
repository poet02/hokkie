// components/FilterPanel.tsx
import styled from 'styled-components';
import { SearchFilters } from '../types/search';
import { X, Star } from 'lucide-react';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
`;

const Panel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background: white;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;

  &:hover {
    color: #333;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const RangeInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;

  input {
    margin: 0;
  }
`;

const RatingFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RatingOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;

  input {
    margin: 0;
  }
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Actions = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  background: white;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background: #1976d2;
    color: white;

    &:hover {
      background: #1565c0;
    }
  ` : `
    background: #f5f5f5;
    color: #333;
    border: 1px solid #e0e0e0;

    &:hover {
      background: #e0e0e0;
    }
  `}
`;

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'villa', label: 'Villa' }
];

const ratingOptions = [
  { value: 0, label: 'Any rating' },
  { value: 4.5, label: '4.5+ Excellent' },
  { value: 4.0, label: '4.0+ Very Good' },
  { value: 3.5, label: '3.5+ Good' },
  { value: 3.0, label: '3.0+ Fair' }
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function PlacesFilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: FilterPanelProps) {
  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, [field]: numValue });
  };

  const handleRadiusChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, radius: numValue });
  };

  const handleBedroomsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, minBedrooms: numValue });
  };

  const handleBathroomsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, minBathrooms: numValue });
  };

  const handleSqftChange = (field: 'minSqft' | 'maxSqft', value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, [field]: numValue });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.types, type]
      : filters.types.filter(t => t !== type);
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Panel isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Filters</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        
        <Content>
          {/* Price Range */}
          <Section>
            <SectionTitle>Price Range (per night)</SectionTitle>
            <RangeInputs>
              <InputGroup>
                <Label>Min Price ($)</Label>
                <Input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  min="0"
                />
              </InputGroup>
              <InputGroup>
                <Label>Max Price ($)</Label>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  min="0"
                />
              </InputGroup>
            </RangeInputs>
          </Section>

          {/* Radius */}
          <Section>
            <SectionTitle>Search Radius</SectionTitle>
            <InputGroup>
              <Label>Maximum Distance (km)</Label>
              <Input
                type="range"
                min="1"
                max="50"
                value={filters.radius}
                onChange={(e) => handleRadiusChange(e.target.value)}
              />
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                {filters.radius} km
              </div>
            </InputGroup>
          </Section>

          {/* Bedrooms & Bathrooms */}
          <Section>
            <SectionTitle>Rooms</SectionTitle>
            <RangeInputs>
              <InputGroup>
                <Label>Min Bedrooms</Label>
                <Input
                  type="number"
                  value={filters.minBedrooms}
                  onChange={(e) => handleBedroomsChange(e.target.value)}
                  min="0"
                  max="10"
                />
              </InputGroup>
              <InputGroup>
                <Label>Min Bathrooms</Label>
                <Input
                  type="number"
                  value={filters.minBathrooms}
                  onChange={(e) => handleBathroomsChange(e.target.value)}
                  min="0"
                  max="10"
                  step="0.5"
                />
              </InputGroup>
            </RangeInputs>
          </Section>

          {/* Size Range */}
          <Section>
            <SectionTitle>Size (sq ft)</SectionTitle>
            <RangeInputs>
              <InputGroup>
                <Label>Min Size</Label>
                <Input
                  type="number"
                  value={filters.minSqft}
                  onChange={(e) => handleSqftChange('minSqft', e.target.value)}
                  min="0"
                />
              </InputGroup>
              <InputGroup>
                <Label>Max Size</Label>
                <Input
                  type="number"
                  value={filters.maxSqft}
                  onChange={(e) => handleSqftChange('maxSqft', e.target.value)}
                  min="0"
                />
              </InputGroup>
            </RangeInputs>
          </Section>

          {/* Property Types */}
          <Section>
            <SectionTitle>Property Type</SectionTitle>
            <CheckboxGroup>
              {propertyTypes.map(type => (
                <CheckboxLabel key={type.value}>
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.value)}
                    onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                  />
                  {type.label}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
          </Section>

          {/* Rating */}
          <Section>
            <SectionTitle>Minimum Rating</SectionTitle>
            <RatingFilter>
              {ratingOptions.map(option => (
                <RatingOption key={option.value}>
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === option.value}
                    onChange={() => handleRatingChange(option.value)}
                  />
                  <StarContainer>
                    {option.value > 0 && (
                      <>
                        <Star size={16} fill="gold" color="gold" />
                        <span>{option.label}</span>
                      </>
                    )}
                    {option.value === 0 && <span>{option.label}</span>}
                  </StarContainer>
                </RatingOption>
              ))}
            </RatingFilter>
          </Section>
        </Content>
        
        <Actions>
          <Button variant="secondary" onClick={onClearFilters}>
            Clear All
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Filters
          </Button>
        </Actions>
      </Panel>
    </Overlay>
  );
}