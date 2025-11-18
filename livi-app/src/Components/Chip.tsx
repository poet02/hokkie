import React from 'react';
import styled, { css } from 'styled-components';

export interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  onDelete?: (e:any) => void;
  onClick?: () => void;
  disabled?: boolean;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const ChipContainer = styled.div<{
  variant: 'filled' | 'outlined';
  color: string;
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  clickable: boolean;
}>`
  display: inline-flex;
  align-items: center;
  border: none;
  border-radius: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};
  user-select: none;
  
  /* Sizes */
  ${props => {
    switch (props.size) {
      case 'small':
        return css`
          padding: 4px 8px;
          font-size: 12px;
          height: 24px;
        `;
      case 'large':
        return css`
          padding: 8px 16px;
          font-size: 16px;
          height: 40px;
        `;
      default: // medium
        return css`
          padding: 6px 12px;
          font-size: 14px;
          height: 32px;
        `;
    }
  }}

  /* Variants and Colors */
  ${props => {
    if (props.variant === 'outlined') {
      return css`
        background-color: transparent;
        border: 1px solid ${getColor(props.color, 'main')};
        color: ${getColor(props.color, 'main')};
      `;
    }
    
    // Filled variant
    return css`
      background-color: ${getColor(props.color, 'main')};
      color: ${getColor(props.color, 'text')};
    `;
  }}

  /* Interactive States */
  ${props => props.clickable && !props.disabled && css`
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  `}

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;
  font-size: 16px;
`;

const Label = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  margin-right: -4px;
  background: none;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Color palette helper
const colors = {
  primary: { main: '#1976d2', text: 'white' },
  secondary: { main: '#9c27b0', text: 'white' },
  success: { main: '#2e7d32', text: 'white' },
  error: { main: '#d32f2f', text: 'white' },
  warning: { main: '#ed6c02', text: 'white' },
  info: { main: '#0288d1', text: 'white' },
  default: { main: '#e0e0e0', text: '#424242' }
};

const getColor = (color: string, type: 'main' | 'text') => {
  return colors[color as keyof typeof colors]?.[type] || colors.default[type];
};

const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = 'secondary',
  size = 'small',
  onDelete,
  onClick,
  disabled = false,
  avatar,
  icon,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    onClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    onDelete?.(label);
  };

  return (
    <ChipContainer
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      clickable={!!onClick}
      className={className}
      onClick={handleClick}
    >
      {avatar && <Avatar>{avatar}</Avatar>}
      {icon && !avatar && <Icon>{icon}</Icon>}
      <Label>{label}</Label>
      {onDelete && (
        <DeleteButton
          onClick={handleDelete}
          disabled={disabled}
          aria-label={`Remove ${label}`}
        >
          ×
        </DeleteButton>
      )}
    </ChipContainer>
  );
};

export default Chip;