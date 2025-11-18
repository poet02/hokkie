import React from 'react';
import styled from 'styled-components';

export interface TileProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  description?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const TileContainer = styled.div<{
  disabled: boolean;
  clickable: boolean;
  size: 'small' | 'medium' | 'large';
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '1.5rem';
      case 'large': return '3rem';
      default: return '2rem';
    }
  }};
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};
  text-align: center;
  height: 100%;

  &:hover {
    ${props => props.clickable && !props.disabled && `
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      border-color: #1976d2;
    `}
  }

  ${props => props.disabled && `
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-color: #e0e0e0;
    }
  `}
`;

const IconWrapper = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => {
    switch (props.size) {
      case 'small': return '0.75rem';
      case 'large': return '1.5rem';
      default: return '1rem';
    }
  }};
  color: #1976d2;

  svg {
    width: ${props => {
      switch (props.size) {
        case 'small': return '2rem';
        case 'large': return '4rem';
        default: return '3rem';
      }
    }};
    height: ${props => {
      switch (props.size) {
        case 'small': return '2rem';
        case 'large': return '4rem';
        default: return '3rem';
      }
    }};
  }
`;

const Title = styled.h3<{ size: 'small' | 'medium' | 'large' }>`
  margin: 0;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '1rem';
      case 'large': return '1.5rem';
      default: return '1.25rem';
    }
  }};
  font-weight: 600;
  color: #333;
  margin-bottom: ${props => props.size === 'large' ? '0.5rem' : '0.25rem'};
`;

const Description = styled.p<{ size: 'small' | 'medium' | 'large' }>`
  margin: 0;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.75rem';
      case 'large': return '1rem';
      default: return '0.875rem';
    }
  }};
  color: #666;
  line-height: 1.4;
`;

const Tile: React.FC<TileProps> = ({
  title,
  icon,
  onClick,
  disabled = false,
  description,
  className,
  size = 'medium',
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <TileContainer
      disabled={disabled}
      clickable={!!onClick}
      size={size}
      className={className}
      onClick={handleClick}
    >
      <IconWrapper size={size}>
        {icon}
      </IconWrapper>
      <Title size={size}>{title}</Title>
      {description && (
        <Description size={size}>{description}</Description>
      )}
    </TileContainer>
  );
};

export default Tile;