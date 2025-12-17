import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmButtonClass?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slideUp mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 sm:space-x-3 px-4 sm:px-6 pb-4 sm:pb-6">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-white rounded-lg transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
