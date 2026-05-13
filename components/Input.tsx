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
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-on-surface uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-2.5 border rounded-lg bg-surface-container-lowest text-on-surface text-sm transition-all duration-200 placeholder:text-outline-variant/70
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            ${leftIcon ? 'pl-10 pr-4' : 'px-4'}
            ${error
              ? 'border-error/60 focus:ring-error/30 focus:border-error'
              : 'border-outline-variant hover:border-outline'
            }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-error font-medium flex items-center gap-1">
          {error}
        </span>
      )}
    </div>
  );
};
