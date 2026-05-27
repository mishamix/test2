import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const { t } = useApp();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={onClose}
        />

        <div
          className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-secondary-900 rounded-2xl shadow-2xl animate-scale-in`}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label={t('common.close')}
              >
                <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </button>
            </div>
          )}

          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
