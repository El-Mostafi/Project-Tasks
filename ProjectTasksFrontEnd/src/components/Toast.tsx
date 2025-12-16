import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-600" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`fixed bottom-4 right-4 ${styles.bg} border ${styles.border} ${styles.text} px-4 py-3 rounded-lg shadow-lg max-w-md z-50 animate-slide-up`}
    >
      <div className="flex items-start">
        {styles.icon}
        <p className="ml-3 flex-1">{message}</p>
        <button
          onClick={onClose}
          className={`ml-3 ${styles.text} hover:opacity-70`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

