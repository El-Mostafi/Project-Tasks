import { Task } from "../types";
import { Calendar, CheckCircle2, Circle, Edit, Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const isOpenTask = !task.isCompleted && new Date(task.dueDate) < new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-0.5 sm:mt-1 flex-shrink-0"
        >
          {task.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-blue-500" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm sm:text-base font-medium ${
              task.isCompleted ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`text-xs sm:text-sm mt-1 ${
                task.isCompleted ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="flex items-center mt-2 space-x-1 sm:space-x-2">
            <Calendar
              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                isOpenTask ? "text-green-500" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                isOpenTask ? "text-green-500 font-medium" : "text-gray-500"
              }`}
            >
              {!isOpenTask && new Date(task.dueDate).toLocaleDateString()}
              {isOpenTask && " Open Task"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
