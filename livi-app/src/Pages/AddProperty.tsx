import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';

// Mock data for editing - in real app, this would come from API
const mockProperties = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 250000,
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: 'apartment',
    yearBuilt: 2018,
    parking: 1,
    description: 'Beautiful modern apartment in the heart of downtown.',
    petFriendly: true,
    featured: true,
    amenities: ['Swimming Pool', 'Gym/Fitness Center', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200'
    ]
  }
];

// Reuse your existing styled components (keeping them the same)
const Container = styled.div`
  height: 95vh;
  background: #f5f5f5;
  padding-bottom: 2rem;
    overflow-y: auto;
    color: #333;
`;

const Header = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #333;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Form = styled.form`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1976d2;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const RequiredStar = styled.span`
  color: #d32f2f;
  margin-left: 0.25rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#d32f2f' : '#e0e0e0'};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#d32f2f' : '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(211, 47, 47, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#d32f2f' : '#e0e0e0'};
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#d32f2f' : '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(211, 47, 47, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#d32f2f' : '#e0e0e0'};
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#d32f2f' : '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(211, 47, 47, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const ImageUploadSection = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: border-color 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #1976d2;
  }
`;

const UploadIcon = styled.div`
  color: #666;
  margin-bottom: 1rem;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const UploadText = styled.p`
  margin: 0 0 1rem 0;
  color: #666;
`;

const UploadButton = styled.label`
  display: inline-block;
  background: #1976d2;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background: #1565c0;
  }

  input {
    display: none;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ImagePreview = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
    color: #d32f2f;
  }
`;

const AmenitiesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 2rem;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #e0e0e0'};
  background: ${props => props.variant === 'primary' ? '#1976d2' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#1565c0' : '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.div`
  background: #2e7d32;
  color: white;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
`;

// Types
interface PropertyFormData {
  title: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'apartment' | 'house' | 'condo';
  yearBuilt?: number;
  parking?: number;
  description: string;
  petFriendly: boolean;
  featured: boolean;
  amenities: string[];
  images: File[];
  existingImages?: string[];
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
];

const commonAmenities = [
  'Swimming Pool',
  'Gym/Fitness Center',
  'Parking',
  'Security',
  'Balcony',
  'Garden',
  'Air Conditioning',
  'Heating',
  'Laundry',
  'Dishwasher',
  'Fireplace',
  'Hardwood Floors',
  'Furnished',
  'Pet Friendly',
  'Wheelchair Access',
];

const defaultValues: PropertyFormData = {
  title: '',
  price: 0,
  address: '',
  city: '',
  state: '',
  zipCode: '',
  bedrooms: 0,
  bathrooms: 0,
  sqft: 0,
  type: 'apartment',
  yearBuilt: undefined,
  parking: undefined,
  description: '',
  petFriendly: false,
  featured: false,
  amenities: [],
  images: [],
  existingImages: [],
};

export function AddProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<PropertyFormData>({
    defaultValues,
    mode: 'onChange'
  });

  const watchedAmenities = watch('amenities', []);

  // Load property data for editing
  useEffect(() => {
    if (isEditMode && id) {
      const propertyToEdit = mockProperties.find(prop => prop.id === id);

      if (propertyToEdit) {
        // Set form values
        reset({
          title: propertyToEdit.title,
          price: propertyToEdit.price,
          address: propertyToEdit.address,
          city: propertyToEdit.city,
          state: propertyToEdit.state,
          zipCode: propertyToEdit.zipCode,
          bedrooms: propertyToEdit.bedrooms,
          bathrooms: propertyToEdit.bathrooms,
          sqft: propertyToEdit.sqft,
          type: propertyToEdit.type as 'apartment' | 'house' | 'condo',
          yearBuilt: propertyToEdit.yearBuilt,
          parking: propertyToEdit.parking,
          description: propertyToEdit.description,
          petFriendly: propertyToEdit.petFriendly,
          featured: propertyToEdit.featured,
          amenities: propertyToEdit.amenities,
          images: [],
          existingImages: propertyToEdit.images
        });

        setExistingImages(propertyToEdit.images);
        setImagePreviews([]);
      }
    }
  }, [id, isEditMode, reset]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = watchedAmenities;
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];

    setValue('amenities', newAmenities, { shouldValidate: true });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      const currentImages = watch('images');
      const newImages = [...currentImages, ...files];
      setValue('images', newImages, { shouldValidate: true });

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const currentImages = watch('images');
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue('images', newImages, { shouldValidate: true });

    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleRemoveExistingImage = (index: number) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
    setValue('existingImages', newExistingImages, { shouldValidate: true });
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Property data to submit:', {
        ...data,
        isEditMode,
        propertyId: id
      });

      // Show success message
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        reset(defaultValues);
        setImagePreviews([]);
        setExistingImages([]);
        setShowSuccess(false);
        navigate('/properties');
      }, 2000);

    } catch (error) {
      console.error('Error submitting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeft />
        </BackButton>
        <Title>
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </Title>
      </Header>

      <FormContainer>
        {showSuccess && (
          <SuccessMessage>
            Property {isEditMode ? 'updated' : 'added'} successfully! Redirecting...
          </SuccessMessage>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Information Section */}
          <Section>
            <SectionTitle>Basic Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label>
                  Property Title <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  {...register('title', {
                    required: 'Property title is required',
                    minLength: { value: 5, message: 'Title must be at least 5 characters' }
                  })}
                  placeholder="e.g., Modern Downtown Apartment"
                  hasError={!!errors.title}
                />
                {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Property Type <RequiredStar>*</RequiredStar>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Property type is required' }}
                  render={({ field }) => (
                    <Select {...field} hasError={!!errors.type}>
                      {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>
                  Price ($) <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="number"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                  placeholder="250000"
                  hasError={!!errors.price}
                />
                {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Year Built</Label>
                <Input
                  type="number"
                  {...register('yearBuilt', {
                    min: { value: 1800, message: 'Year must be 1800 or later' },
                    max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                  })}
                  placeholder="2018"
                  hasError={!!errors.yearBuilt}
                />
                {errors.yearBuilt && <ErrorMessage>{errors.yearBuilt.message}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                {...register('description')}
                placeholder="Describe the property features, location advantages, and unique selling points..."
              />
            </FormGroup>
          </Section>

          {/* Location Section */}
          <Section>
            <SectionTitle>Location</SectionTitle>
            <FormGroup>
              <Label>
                Street Address <RequiredStar>*</RequiredStar>
              </Label>
              <Input
                {...register('address', {
                  required: 'Address is required',
                  minLength: { value: 5, message: 'Address must be at least 5 characters' }
                })}
                placeholder="123 Main Street"
                hasError={!!errors.address}
              />
              {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>
                  City <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  {...register('city', {
                    required: 'City is required',
                    pattern: { value: /^[A-Za-z\s]+$/, message: 'City must contain only letters' }
                  })}
                  placeholder="New York"
                  hasError={!!errors.city}
                />
                {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  State <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  {...register('state', {
                    required: 'State is required',
                    pattern: { value: /^[A-Za-z]{2}$/, message: 'State must be 2 letters' }
                  })}
                  placeholder="NY"
                  maxLength={2}
                  hasError={!!errors.state}
                />
                {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  ZIP Code <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  {...register('zipCode', {
                    required: 'ZIP code is required',
                    pattern: { value: /^\d{5}(-\d{4})?$/, message: 'ZIP code must be 5 or 9 digits' }
                  })}
                  placeholder="10001"
                  hasError={!!errors.zipCode}
                />
                {errors.zipCode && <ErrorMessage>{errors.zipCode.message}</ErrorMessage>}
              </FormGroup>
            </FormRow>
          </Section>

          {/* Property Details Section */}
          <Section>
            <SectionTitle>Property Details</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label>
                  Bedrooms <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="number"
                  {...register('bedrooms', {
                    required: 'Bedrooms is required',
                    min: { value: 0, message: 'Bedrooms cannot be negative' }
                  })}
                  placeholder="2"
                  hasError={!!errors.bedrooms}
                />
                {errors.bedrooms && <ErrorMessage>{errors.bedrooms.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Bathrooms <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="number"
                  {...register('bathrooms', {
                    required: 'Bathrooms is required',
                    min: { value: 0, message: 'Bathrooms cannot be negative' }
                  })}
                  placeholder="2"
                  step="0.5"
                  hasError={!!errors.bathrooms}
                />
                {errors.bathrooms && <ErrorMessage>{errors.bathrooms.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Square Feet <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="number"
                  {...register('sqft', {
                    required: 'Square footage is required',
                    min: { value: 1, message: 'Square footage must be greater than 0' }
                  })}
                  placeholder="1200"
                  hasError={!!errors.sqft}
                />
                {errors.sqft && <ErrorMessage>{errors.sqft.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Parking Spaces</Label>
                <Input
                  type="number"
                  {...register('parking', {
                    min: { value: 0, message: 'Parking spaces cannot be negative' }
                  })}
                  placeholder="1"
                  hasError={!!errors.parking}
                />
                {errors.parking && <ErrorMessage>{errors.parking.message}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <CheckboxLabel>
                  <input type="checkbox" {...register('petFriendly')} />
                  Pet Friendly
                </CheckboxLabel>
              </FormGroup>
              <FormGroup>
                <CheckboxLabel>
                  <input type="checkbox" {...register('featured')} />
                  Featured Property
                </CheckboxLabel>
              </FormGroup>
            </FormRow>
          </Section>

          {/* Amenities Section */}
          <Section>
            <SectionTitle>Amenities</SectionTitle>
            <AmenitiesSection>
              {commonAmenities.map(amenity => (
                <CheckboxLabel key={amenity}>
                  <input
                    type="checkbox"
                    checked={watchedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  {amenity}
                </CheckboxLabel>
              ))}
            </AmenitiesSection>
          </Section>

          {/* Images Section */}
          <Section>
            <SectionTitle>Property Images</SectionTitle>

            {/* Existing Images (Edit Mode) */}
            {isEditMode && existingImages.length > 0 && (
              <>
                <UploadText>Existing Images</UploadText>
                <ImagePreviewGrid>
                  {existingImages.map((image, index) => (
                    <ImagePreview key={`existing-${index}`}>
                      <PreviewImage src={image} alt={`Existing ${index + 1}`} />
                      <RemoveImageButton
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        <X />
                      </RemoveImageButton>
                    </ImagePreview>
                  ))}
                </ImagePreviewGrid>
              </>
            )}

            {/* Image Upload */}
            <ImageUploadSection>
              <UploadIcon>
                <Upload />
              </UploadIcon>
              <UploadText>
                {isEditMode ? 'Add more images' : 'Upload high-quality photos of your property'}
              </UploadText>
              <UploadButton>
                <Plus />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </UploadButton>
            </ImageUploadSection>

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <>
                <UploadText>
                  {imagePreviews.length} new image(s) selected
                </UploadText>
                <ImagePreviewGrid>
                  {imagePreviews.map((preview, index) => (
                    <ImagePreview key={`new-${index}`}>
                      <PreviewImage src={preview} alt={`Preview ${index + 1}`} />
                      <RemoveImageButton
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <X />
                      </RemoveImageButton>
                    </ImagePreview>
                  ))}
                </ImagePreviewGrid>
              </>
            )}
          </Section>

          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting
                ? (isEditMode ? 'Updating Property...' : 'Adding Property...')
                : (isEditMode ? 'Update Property' : 'Add Property')
              }
            </Button>
          </FormActions>
        </Form>
      </FormContainer>
    </Container>
  );
}