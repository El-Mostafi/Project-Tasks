import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CreateProjectDto, ApiError } from "../types";
import { handleApiError } from "../utils/errorHandler";
import ErrorAlert from "./ErrorAlert";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProjectDto) => Promise<void>;
  initialData?: CreateProjectDto;
  isEdit?: boolean;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectDto>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: "", description: "" });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slideUp mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4"
        >
          <ErrorAlert error={error} onClose={() => setError(null)} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project title"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project description (optional)"
              rows={4}
            />
          </div>

          <div className="flex space-x-2 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
