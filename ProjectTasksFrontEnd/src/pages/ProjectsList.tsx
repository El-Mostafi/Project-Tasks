import { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import ErrorAlert from "../components/ErrorAlert";
import { projectsService } from "../services/projects";
import { Project, CreateProjectDto, ApiError } from "../types";
import { handleApiError, formatApiError } from "../utils/errorHandler";
import { useToast } from "../hooks/useToast";

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    loadProjects();
  }, [page]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsService.getProjects(page, 6);
      setProjects(response.content);
      setTotalPages(response.totalPages);
      setIsLastPage(response.last);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: CreateProjectDto) => {
    await projectsService.createProject(data);
    setPage(0);
    loadProjects();
    showSuccess("Project created successfully!");
  };

  const handleUpdateProject = async (data: CreateProjectDto) => {
    if (editingProject) {
      await projectsService.updateProject(editingProject.id, data);
      loadProjects();
      showSuccess("Project updated successfully!");
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        await projectsService.deleteProject(projectToDelete.id);
        showSuccess("Project deleted successfully!");
        loadProjects();
      } catch (err) {
        const apiError = handleApiError(err);
        showError(formatApiError(apiError));
      }
      setProjectToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Projects
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage your projects and tasks
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProject(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        <ErrorAlert error={error} onClose={() => setError(null)} />

        <div className="min-h-[420px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects yet. Create your first project!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-sm sm:text-base text-gray-600 px-2">
              {page + 1} / {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={isLastPage}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(undefined);
        }}
        onSave={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={
          editingProject
            ? {
                title: editingProject.title,
                description: editingProject.description,
              }
            : undefined
        }
        isEdit={!!editingProject}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={
          projectToDelete
            ? `Are you sure you want to delete "${projectToDelete.title}"? This will permanently delete the project and all its tasks. This action cannot be undone.`
            : ""
        }
        confirmText="Delete Project"
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
