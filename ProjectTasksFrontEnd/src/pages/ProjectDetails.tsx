import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';
import ErrorAlert from '../components/ErrorAlert';
import Toast from '../components/Toast';
import { projectsService } from '../services/projects';
import { tasksService } from '../services/tasks';
import { Project, Task, CreateProjectDto, CreateTaskDto, ApiError } from '../types';
import { handleApiError, formatApiError, getErrorPagePath } from '../utils/errorHandler';
import { useToast } from '../hooks/useToast';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [error, setError] = useState<ApiError | null>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined);
  const [dueDateFrom, setDueDateFrom] = useState('');
  const [dueDateTo, setDueDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject();
      loadTasks();
    }
  }, [id, page, searchQuery, completedFilter, dueDateFrom, dueDateTo]);

  const loadProject = async () => {
    try {
      const data = await projectsService.getProject(Number(id));
      setProject(data);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);

      // Redirect to error page for 404, 403, 500 errors
      const errorPagePath = getErrorPagePath(apiError);
      if (errorPagePath) {
        navigate(errorPagePath, { replace: true });
        return;
      }

      // Show inline error for other errors
      setError(apiError);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksService.getTasks(Number(id), {
        page,
        size: 5,
        query: searchQuery,
        completed: completedFilter,
        dueDateFrom,
        dueDateTo
      });
      setTasks(response.content);
      setTotalPages(response.totalPages);
      setIsLastPage(response.last);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (data: CreateProjectDto) => {
    await projectsService.updateProject(Number(id), data);
    loadProject();
    showSuccess('Project updated successfully!');
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
      try {
        await projectsService.deleteProject(Number(id));
        showSuccess('Project deleted successfully!');
        setTimeout(() => navigate('/projects'), 1000);
      } catch (err) {
        const apiError = handleApiError(err);
        showError(formatApiError(apiError));
      }
    }
  };

  const handleCreateTask = async (data: CreateTaskDto) => {
    await tasksService.createTask(Number(id), data);
    setPage(0);
    loadTasks();
    loadProject();
    showSuccess('Task created successfully!');
  };

  const handleUpdateTask = async (data: CreateTaskDto | { title: string; description?: string; dueDate: string; completed: boolean }) => {
    if (editingTask) {
      const updateData = 'completed' in data ? data : { ...data, completed: editingTask.isCompleted };
      await tasksService.updateTask(editingTask.id, updateData);
      loadTasks();
      loadProject();
      showSuccess('Task updated successfully!');
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      await tasksService.toggleComplete(taskId);
      loadTasks();
      loadProject();
      showSuccess('Task status updated!');
    } catch (err) {
      const apiError = handleApiError(err);
      showError(formatApiError(apiError));
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksService.deleteTask(taskId);
        loadTasks();
        loadProject();
        showSuccess('Task deleted successfully!');
      } catch (err) {
        const apiError = handleApiError(err);
        showError(formatApiError(apiError));
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCompletedFilter(undefined);
    setDueDateFrom('');
    setDueDateTo('');
    setPage(0);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </button>

        <ErrorAlert error={error} onClose={() => setError(null)} />

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
              {project.description && (
                <p className="text-gray-600 mb-4">{project.description}</p>
              )}

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <span>
                  {project.completedTasks} / {project.totalTasks} tasks completed
                </span>
                <span className="font-semibold text-blue-600">
                  {project.progressPercentage.toFixed(0)}% complete
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2 ml-6">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteProject}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
            <button
              onClick={() => {
                setEditingTask(undefined);
                setIsTaskModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={completedFilter === undefined ? '' : completedFilter.toString()}
                      onChange={(e) => {
                        setCompletedFilter(e.target.value === '' ? undefined : e.target.value === 'true');
                        setPage(0);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="false">Active</option>
                      <option value="true">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date From
                    </label>
                    <input
                      type="date"
                      value={dueDateFrom}
                      onChange={(e) => {
                        setDueDateFrom(e.target.value);
                        setPage(0);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date To
                    </label>
                    <input
                      type="date"
                      value={dueDateTo}
                      onChange={(e) => {
                        setDueDateTo(e.target.value);
                        setPage(0);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks yet. Add your first task!</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  <span className="text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={isLastPage}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateProject}
        initialData={{ title: project.title, description: project.description }}
        isEdit
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
        isEdit={!!editingTask}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
