import React from 'react';
import ElegantCard from './ElegantCard';
import ElegantButton from './ElegantButton';

interface ElegantModuleCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'glass' | 'accent' | 'gradient';
}

const ElegantModuleCard: React.FC<ElegantModuleCardProps> = ({
  title,
  description,
  icon,
  onClick,
  variant = 'default'
}) => {
  return (
    <ElegantCard 
      variant={variant} 
      className="h-full transition-all duration-300 hover:translate-y-[-4px]"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          {icon && (
            <div className="mr-3 text-blue-400 bg-blue-500/10 p-2.5 rounded-lg">
              {icon}
            </div>
          )}
          <h3 className="font-poppins text-lg font-medium elegant-text-gradient">{title}</h3>
        </div>
        
        <p className="text-slate-300 mb-5 flex-grow text-sm">{description}</p>
        
        <div className="mt-auto">
          <ElegantButton 
            onClick={onClick} 
            variant="primary" 
            size="md" 
            className="w-full"
          >
            Launch Module
          </ElegantButton>
        </div>
      </div>
    </ElegantCard>
  );
};

export default ElegantModuleCard;