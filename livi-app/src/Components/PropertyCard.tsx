// components/PropertyCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Property } from '../hooks/usePropertySearch';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Badge = styled.div<{ type: 'apartment' | 'house' | 'condo' }>`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => {
    switch (props.type) {
      case 'apartment': return '#1976d2';
      case 'house': return '#2e7d32';
      case 'condo': return '#ed6c02';
      default: return '#666';
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #d32f2f;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Price = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
`;

const Title = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
`;

const Address = styled.p`
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.875rem;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ImageContainer = styled.div`
  position: relative;
`;

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card onClick={() => onClick?.(property)}>
      <ImageContainer>
        <Image src={property.image} alt={property.title} />
        <Badge type={property.type}>{property.type}</Badge>
        {property.featured && <FeaturedBadge>Featured</FeaturedBadge>}
      </ImageContainer>
      <Content>
        <Price>{formatPrice(property.price)}</Price>
        <Title>{property.title}</Title>
        <Address>{property.address}</Address>
        <Details>
          <DetailItem>
            <DetailValue>{property.bedrooms}</DetailValue>
            <DetailLabel>Bedrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{property.bathrooms}</DetailValue>
            <DetailLabel>Bathrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{property.sqft.toLocaleString()}</DetailValue>
            <DetailLabel>Sq Ft</DetailLabel>
          </DetailItem>
        </Details>
      </Content>
    </Card>
  );
};

