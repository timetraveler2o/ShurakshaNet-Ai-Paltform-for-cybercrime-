import React, { ReactNode } from 'react';

export interface ElegantCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'accent' | 'gradient';
  hover?: boolean;
  animate?: boolean;
  action?: ReactNode;
}

const ElegantCard: React.FC<ElegantCardProps> = ({ 
  title, 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  animate = false,
  action
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/5 backdrop-blur-md border border-white/10';
      case 'accent':
        return 'blue-accent-border bg-slate-800/90';
      case 'gradient':
        return 'bg-gradient-to-br from-slate-800 via-slate-800/95 to-blue-900/20 border border-slate-700/50';
      default:
        return 'bg-slate-800/90 border border-slate-700';
    }
  };
  
  const getHoverClasses = () => {
    if (!hover) return '';
    
    switch (variant) {
      case 'accent':
        return 'hover:shadow-blue-glow-sm';
      case 'glass':
        return 'hover:bg-white/10 hover:border-white/20';
      case 'gradient':
        return 'hover:border-blue-500/30 hover:shadow-card-hover';
      default:
        return 'hover:border-blue-500/40 hover:shadow-card-hover';
    }
  };
  
  const getAnimationClasses = () => {
    if (!animate) return '';
    return 'animate-scaleIn';
  };
  
  return (
    <div className={`
      rounded-xl p-6 transition-all duration-300 shadow-card
      ${getVariantClasses()}
      ${getHoverClasses()}
      ${getAnimationClasses()}
      ${className}
    `}>
      {title && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50">
          <h3 className="font-poppins text-lg text-blue-400">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default ElegantCard;