import { AlertCircle, X } from 'lucide-react';
import { ApiError } from '../types';
import { formatApiError } from '../utils/errorHandler';

interface ErrorAlertProps {
  error: ApiError | string | null;
  onClose?: () => void;
}

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : formatApiError(error);
  const isValidationError = typeof error === 'object' && error.type === 'validation';

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          {isValidationError && typeof error === 'object' && error.validationErrors ? (
            <div>
              <p className="font-semibold mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(error.validationErrors).map(([field, message]) => (
                  <li key={field} className="text-sm">
                    <span className="font-medium capitalize">{field}</span>: {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="whitespace-pre-line">{errorMessage}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 ml-3 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

