import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CreateTaskDto, Task, ApiError } from "../types";
import { handleApiError } from "../utils/errorHandler";
import ErrorAlert from "./ErrorAlert";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data:
      | CreateTaskDto
      | {
          title: string;
          description?: string;
          dueDate: string;
          completed: boolean;
        }
  ) => Promise<void>;
  initialData?: Task;
  isEdit?: boolean;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
        dueDate: initialData.dueDate,
      });
    } else {
      setFormData({ title: "", description: "", dueDate: "" });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && initialData) {
        await onSave({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          completed: initialData.isCompleted,
        });
      } else {
        await onSave({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
        });
      }
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
            {isEdit ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            title="close"
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
              placeholder="Enter task title"
            />
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
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              title="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
