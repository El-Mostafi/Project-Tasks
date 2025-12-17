import { useNavigate } from "react-router-dom";
import { Project } from "../types";
import { FolderOpen, CheckCircle2, Edit, Trash2 } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(project);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-4 sm:p-6 border border-gray-200 relative group"
    >
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors bg-white sm:bg-transparent shadow-sm sm:shadow-none"
              title="Edit project"
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-white sm:bg-transparent shadow-sm sm:shadow-none"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
          <div className="pr-12 sm:pr-16 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600 flex items-center space-x-1 sm:space-x-2">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>
              {project.completedTasks} / {project.totalTasks} tasks
            </span>
          </span>
          <span className="font-semibold text-blue-600">
            {project.progressPercentage.toFixed(0)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${project.progressPercentage}%` }}
          ></div>
        </div>

        <div className="text-xs text-gray-500">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
