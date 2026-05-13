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
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-bold text-on-surface">{title}</h3>}
          {subtitle && <p className="text-sm text-on-surface-variant">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
