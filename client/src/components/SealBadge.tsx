import { Shield, Star, Award, Gem } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  type: 'Standard' | 'Premium' | 'Legal' | 'Diamond';
  size?: 'sm' | 'md' | 'lg';
}

const sealConfig = {
  Standard: { 
    color: 'bg-slate-600', 
    icon: Shield,
    label: 'Standard Seal',
    description: 'Basic verification'
  },
  Premium: { 
    color: 'bg-green-600', 
    icon: Star,
    label: 'Premium Seal',
    description: 'Enhanced verification'
  },
  Legal: { 
    color: 'bg-blue-600', 
    icon: Award,
    label: 'Legal Seal',
    description: 'Legal certification'
  },
  Diamond: { 
    color: 'bg-purple-600', 
    icon: Gem,
    label: 'Diamond Seal',
    description: 'Elite verification'
  }
};

export default function SealBadge({ type, size = 'md' }: Props) {
  const config = sealConfig[type];
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  return (
    <Badge 
      className={`${config.color} text-white ${sizeClasses[size]} flex items-center gap-1 font-semibold`}
      title={config.description}
    >
      <IconComponent className={iconSizes[size]} />
      {config.label}
    </Badge>
  );
}