import styled from 'styled-components';
import { PlaceToStay } from '../types/search';
import { Star, MapPin } from 'lucide-react';

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

const Badge = styled.div<{ featured?: boolean }>`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => props.featured ? '#d32f2f' : '#1976d2'};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const Address = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ReviewCount = styled.span`
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

const Distance = styled.div`
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #666;
`;

const ImageContainer = styled.div`
  position: relative;
`;

interface PlaceCardProps {
  place: PlaceToStay;
  onClick?: (place: PlaceToStay) => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < Math.floor(rating) ? 'gold' : 'none'}
        color="gold"
      />
    ));
  };

  return (
    <Card onClick={() => onClick?.(place)}>
      <ImageContainer>
        <Image src={place.image} alt={place.title} />
        {place.featured && <Badge featured>Featured</Badge>}
        <Badge>{place.type}</Badge>
      </ImageContainer>
      <Content>
        <Header>
          <Title>{place.title}</Title>
          <Price>${place.price}</Price>
        </Header>
        
        <Address>
          <MapPin size={14} />
          {place.address}
        </Address>

        <Rating>
          <Stars>
            {renderStars(place.rating)}
          </Stars>
          <span>{place.rating}</span>
          <ReviewCount>({place.reviewCount} reviews)</ReviewCount>
        </Rating>

        <Details>
          <DetailItem>
            <DetailValue>{place.bedrooms}</DetailValue>
            <DetailLabel>Bedrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{place.bathrooms}</DetailValue>
            <DetailLabel>Bathrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{place.sqft.toLocaleString()}</DetailValue>
            <DetailLabel>Sq Ft</DetailLabel>
          </DetailItem>
          {place.distance && (
            <Distance>{place.distance.toFixed(1)} km away</Distance>
          )}
        </Details>
      </Content>
    </Card>
  );
}