import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastStyles: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
  success: {
    icon: <Check className="w-4 h-4" />,
    bg: 'bg-status-bullish/10',
    border: 'border-status-bullish/30',
    text: 'text-status-bullish'
  },
  error: {
    icon: <X className="w-4 h-4" />,
    bg: 'bg-status-bearish/10',
    border: 'border-status-bearish/30',
    text: 'text-status-bearish'
  },
  warning: {
    icon: <AlertCircle className="w-4 h-4" />,
    bg: 'bg-accent-warning/10',
    border: 'border-accent-warning/30',
    text: 'text-accent-warning'
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    bg: 'bg-accent-secondary/10',
    border: 'border-accent-secondary/30',
    text: 'text-accent-secondary'
  }
};

export default function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  const [isShowing, setIsShowing] = useState(false);
  const style = toastStyles[type];

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isShowing) return null;

  return (
    <div className={`
      fixed bottom-4 right-4 z-50 
      flex items-center gap-3 px-4 py-3
      ${style.bg} border ${style.border} rounded-sm
      shadow-lg backdrop-blur-sm
      transition-all duration-300
      ${isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
    `}>
      <span className={style.text}>{style.icon}</span>
      <span className="text-small text-text-primary">{message}</span>
      <button onClick={() => {
        setIsShowing(false);
        setTimeout(onClose, 300);
      }} className="text-text-muted hover:text-text-primary ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast context for global usage
interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

export const ToastContext = React.createContext<ToastContextType>({
  showToast: () => {}
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([]);
  
  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
