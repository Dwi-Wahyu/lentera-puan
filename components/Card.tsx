import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
}) => {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h3 className="text-lg font-bold text-on-surface leading-tight">{title}</h3>
          )}
          {subtitle && (
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
