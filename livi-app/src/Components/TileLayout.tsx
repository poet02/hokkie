import React from 'react';
// import styled from 'styled-components';
import Tile from '../Components/Tile/Tile';

// Example icons (you can use any icon library like lucide-react, react-icons, etc.)
import { 
  User, 
  Settings, 
  BarChart3, 
  Calendar, 
  FileText, 
  Mail,
  Shield,
  HelpCircle,
  CreditCard,
  Database,
  Bell,
  Camera
} from 'lucide-react';
import { PageContainer, TilesGrid } from '../Pages/styles';

export interface TileItem {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface TilesPageProps {
  title?: string;
  subtitle?: string;
  tiles: TileItem[];
  columns?: number;
  gap?: string;
  className?: string;
}

const TilesPage: React.FC<TilesPageProps> = ({
  title = "Dashboard",
  subtitle = "Choose an option to get started",
  tiles,
  columns = 4,
  gap = "1.5rem",
  className,
}) => {
  return (
    <PageContainer className={className}>
      {/* <PageHeader>
        <PageTitle>{title}</PageTitle>
        {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
      </PageHeader> */}
      
      <TilesGrid columns={columns} gap={gap}>
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            title={tile.title}
            icon={tile.icon}
            onClick={tile.onClick}
            disabled={tile.disabled}
            description={tile.description}
            size={tile.size}
          />
        ))}
      </TilesGrid>
    </PageContainer>
  );
};

// Example usage
export const ExampleTilesPage: React.FC = () => {
  const tiles: TileItem[] = [
    {
      title: "Profile",
      icon: <User />,
      onClick: () => console.log('Profile clicked'),
      description: "Manage your account settings",
    },
    {
      title: "Analytics",
      icon: <BarChart3 />,
      onClick: () => console.log('Analytics clicked'),
      description: "View usage statistics and reports",
    },
    {
      title: "Calendar",
      icon: <Calendar />,
      onClick: () => console.log('Calendar clicked'),
      description: "Schedule and manage events",
    },
    {
      title: "Documents",
      icon: <FileText />,
      onClick: () => console.log('Documents clicked'),
      description: "Access your files and documents",
    },
    {
      title: "Messages",
      icon: <Mail />,
      onClick: () => console.log('Messages clicked'),
      description: "Check your inbox and sent items",
      size: 'medium',
    },
    {
      title: "Security",
      icon: <Shield />,
      onClick: () => console.log('Security clicked'),
      description: "Configure security settings",
    },
    {
      title: "Support",
      icon: <HelpCircle />,
      onClick: () => console.log('Support clicked'),
      description: "Get help and contact support",
      disabled: true,
    },
    {
      title: "Billing",
      icon: <CreditCard />,
      onClick: () => console.log('Billing clicked'),
      description: "Manage payments and invoices",
      size: 'large',
    },
    {
      title: "Storage",
      icon: <Database />,
      onClick: () => console.log('Storage clicked'),
      description: "View storage usage and limits",
      size: 'small',
    },
    {
      title: "Notifications",
      icon: <Bell />,
      onClick: () => console.log('Notifications clicked'),
      description: "Configure notification preferences",
    },
    {
      title: "Media",
      icon: <Camera />,
      onClick: () => console.log('Media clicked'),
      description: "Manage photos and videos",
    },
    {
      title: "Settings",
      icon: <Settings />,
      onClick: () => console.log('Settings clicked'),
      description: "System and application settings",
    },
  ];

  return (
    <TilesPage
      title="Admin Dashboard"
      subtitle="Manage your application settings and features"
      tiles={tiles}
      columns={4}
      gap="2rem"
    />
  );
};

export default TilesPage;