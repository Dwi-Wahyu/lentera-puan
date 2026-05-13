import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container focus:ring-primary',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary-container focus:ring-secondary',
    error: 'bg-error text-on-error hover:bg-error-container focus:ring-error',
    outline: 'border-2 border-primary text-primary hover:bg-surface-container-low focus:ring-primary',
    ghost: 'text-primary hover:bg-surface-container-low focus:ring-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
