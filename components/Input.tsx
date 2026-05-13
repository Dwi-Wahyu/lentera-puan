import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  leftIcon,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-on-surface"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant ${
            leftIcon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error ? 'border-error ring-error' : 'border-outline-variant'
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-error font-medium">{error}</span>}
    </div>
  );
};
