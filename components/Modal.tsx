import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'primary' | 'error' | 'secondary';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  variant = 'primary'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const accentColors = {
    primary: 'from-primary/5 to-transparent border-primary/10',
    error: 'from-error/5 to-transparent border-error/10',
    secondary: 'from-secondary/5 to-transparent border-secondary/10',
  };

  const titleColors = {
    primary: 'text-primary',
    error: 'text-error',
    secondary: 'text-secondary',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl shadow-black/20 overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/50"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b border-outline-variant/60 bg-gradient-to-r ${accentColors[variant]}`}>
          <h3 className={`font-bold text-base ${titleColors[variant]}`}>{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
