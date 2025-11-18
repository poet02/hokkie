import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail } from 'lucide-react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const Container = styled.div`
  eight: 95vh;
    overflow-y: auto;
  background: white;
  color: #333;
`;

const Header = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;
  cursor: pointer;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.05);
  }

  svg {
    width: 24px;
    height: 24px;
    color: #333;
  }
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 2rem 1.5rem 1.5rem;
  color: white;
  pointer-events: none;
`;

const Price = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Address = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  opacity: 0.9;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Content = styled.div`
  padding: 2rem 1.5rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const DetailIcon = styled.div`
  color: #1976d2;
  margin-bottom: 0.5rem;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const DetailValue = styled.span`
  font-weight: 600;
  font-size: 1.125rem;
  color: #333;
  margin-bottom: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const Description = styled.p`
  line-height: 1.6;
  color: #666;
  margin: 0;
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
`;

const ActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
  z-index: 100;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #e0e0e0'};
  background: ${props => props.variant === 'primary' ? '#1976d2' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#1565c0' : '#f5f5f5'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const GalleryModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CloseGalleryButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
  font-size: 1.5rem;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.05);
  }
`;



const GalleryContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 90vh;

  .image-gallery {
    height: 100%;
  }

  .image-gallery-slide-wrapper {
    height: calc(100% - 100px);
  }

  .image-gallery-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-gallery-image {
    max-height: 80vh;
    object-fit: contain;
  }

  .image-gallery-thumbnails-wrapper {
    height: 100px;
  }
`;

// Mock data
const mockProperty = {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 250000,
    address: '123 Main Street, Downtown, New York, NY 10001',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200'
    ],
    type: 'apartment',
    featured: true,
    description: 'Beautiful modern apartment in the heart of downtown. This spacious 2-bedroom, 2-bathroom unit features floor-to-ceiling windows with stunning city views, hardwood floors throughout, and a gourmet kitchen with stainless steel appliances. The building offers 24-hour concierge, fitness center, and rooftop terrace.',
    amenities: [
        'Floor-to-ceiling windows',
        'Hardwood floors',
        'Gourmet kitchen',
        'Stainless steel appliances',
        'In-unit laundry',
        'Central air conditioning',
        '24-hour concierge',
        'Fitness center',
        'Rooftop terrace',
        'Pet friendly',
        'Swimming pool',
        'Parking available'
    ],
    yearBuilt: 2018,
    parking: 1,
    petFriendly: true
};

export function Property() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [property, setProperty] = useState(mockProperty);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        // In a real app, you would fetch the property data based on the ID
        console.log('Loading property:', id);
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleContactAgent = () => {
        console.log('Contact agent');
    };

    const handleScheduleTour = () => {
        console.log('Schedule tour');
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleShare = () => {
        console.log('Share property');
    };

    const handleImageClick = () => {
        setIsGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setIsGalleryOpen(false);
    };

    // Convert property images to react-image-gallery format
    const galleryImages = property.images.map((image, index) => ({
        original: image,
        thumbnail: image,
        originalAlt: `${property.title} - Image ${index + 1}`,
        thumbnailAlt: `${property.title} - Thumbnail ${index + 1}`,
    }));

    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <Container>
            <Header onClick={handleImageClick}>
                <BackButton onClick={(e) => {
                    e.stopPropagation();
                    handleBack();
                }}>
                    <ArrowLeft color="#333" strokeWidth={2} />
                </BackButton>
                <PropertyImage src={property.images[0]} alt={property.title} />
                <ImageOverlay>
                    <Price>{formatPrice(property.price)}</Price>
                    <Title>{property.title}</Title>
                    <Address>
                        <MapPin />
                        {property.address}
                    </Address>
                </ImageOverlay>
            </Header>

            <Content>
                <Section>
                    <DetailsGrid>
                        <DetailItem>
                            <DetailIcon>
                                <Bed />
                            </DetailIcon>
                            <DetailValue>{property.bedrooms}</DetailValue>
                            <DetailLabel>Bedrooms</DetailLabel>
                        </DetailItem>
                        <DetailItem>
                            <DetailIcon>
                                <Bath />
                            </DetailIcon>
                            <DetailValue>{property.bathrooms}</DetailValue>
                            <DetailLabel>Bathrooms</DetailLabel>
                        </DetailItem>
                        <DetailItem>
                            <DetailIcon>
                                <Square />
                            </DetailIcon>
                            <DetailValue>{property.sqft.toLocaleString()}</DetailValue>
                            <DetailLabel>Sq Ft</DetailLabel>
                        </DetailItem>
                        <DetailItem>
                            <DetailIcon>
                                <MapPin />
                            </DetailIcon>
                            <DetailValue>{property.type}</DetailValue>
                            <DetailLabel>Type</DetailLabel>
                        </DetailItem>
                    </DetailsGrid>
                </Section>

                <Section>
                    <SectionTitle>Description</SectionTitle>
                    <Description>{property.description}</Description>
                </Section>

                <Section>
                    <SectionTitle>Amenities</SectionTitle>
                    <AmenitiesGrid>
                        {property.amenities.map((amenity, index) => (
                            <AmenityItem key={index}>
                                <span>•</span>
                                <span>{amenity}</span>
                            </AmenityItem>
                        ))}
                    </AmenitiesGrid>
                </Section>

                <Section>
                    <SectionTitle>Property Details</SectionTitle>
                    <AmenitiesGrid>
                        <AmenityItem>
                            <strong>Year Built:</strong> {property.yearBuilt}
                        </AmenityItem>
                        <AmenityItem>
                            <strong>Parking:</strong> {property.parking} space(s)
                        </AmenityItem>
                        <AmenityItem>
                            <strong>Pets:</strong> {property.petFriendly ? 'Allowed' : 'Not allowed'}
                        </AmenityItem>
                        <AmenityItem>
                            <strong>Status:</strong> {property.featured ? 'Featured' : 'Available'}
                        </AmenityItem>
                    </AmenitiesGrid>
                </Section>
            </Content>

            <ActionBar>
                <IconButton onClick={toggleFavorite}>
                    <Heart fill={isFavorite ? '#d32f2f' : 'none'} color={isFavorite ? '#d32f2f' : '#666'} />
                </IconButton>
                <IconButton onClick={handleShare}>
                    <Share2 />
                </IconButton>
                <ActionButton variant="secondary" onClick={handleContactAgent}>
                    <Mail />
                    Contact
                </ActionButton>
                <ActionButton variant="primary" onClick={handleScheduleTour}>
                    <Phone />
                    Schedule Tour
                </ActionButton>
            </ActionBar>

            {/* Image Gallery Modal */}
            <GalleryModal isOpen={isGalleryOpen}>
                <CloseGalleryButton onClick={handleCloseGallery}>
                    ×
                </CloseGalleryButton>
                <GalleryContainer>
                    <ImageGallery
                        items={galleryImages}
                        showPlayButton={false}
                        showFullscreenButton={true}
                        showThumbnails={true}
                        showNav={true}
                        showBullets={false}
                        autoPlay={false}
                        additionalClass="property-gallery"
                        onScreenChange={(fullScreen) => {
                            // Handle fullscreen change if needed
                        }}
                    />
                </GalleryContainer>
            </GalleryModal>
        </Container>
    );
}