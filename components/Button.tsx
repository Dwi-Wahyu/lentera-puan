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
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] select-none';

  const variants = {
    primary:
      'bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary shadow-sm hover:shadow-md',
    secondary:
      'bg-secondary text-on-secondary hover:bg-secondary/90 focus-visible:ring-secondary shadow-sm hover:shadow-md',
    error:
      'bg-error text-on-error hover:bg-error/90 focus-visible:ring-error shadow-sm hover:shadow-md',
    outline:
      'border border-outline-variant text-primary bg-transparent hover:bg-surface-container-low hover:border-primary focus-visible:ring-primary',
    ghost:
      'text-primary bg-transparent hover:bg-surface-container-low focus-visible:ring-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2',
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
