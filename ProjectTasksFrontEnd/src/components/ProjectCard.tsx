import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { FolderOpen, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FolderOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
            {project.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {project.completedTasks} / {project.totalTasks} tasks completed
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
