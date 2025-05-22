import React, { ButtonHTMLAttributes } from 'react';

export interface ElegantButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const ElegantButton: React.FC<ElegantButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg';
      case 'secondary':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg';
      case 'outline':
        return 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-400';
      case 'ghost':
        return 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white';
      case 'text':
        return 'bg-transparent text-blue-400 hover:text-blue-300 p-0 shadow-none';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-md';
      case 'lg':
        return 'px-8 py-3 text-base rounded-lg';
      default:
        return 'px-6 py-2.5 text-sm rounded-lg';
    }
  };
  
  return (
    <button
      className={`
        font-medium transition-all duration-300 relative overflow-hidden
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${icon ? 'flex items-center justify-center gap-2' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default ElegantButton;