export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate: string;
  projectId: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CreateProjectDto {
  title: string;
  description?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate: string;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
}

// Error handling types
export interface ErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface ApiError {
  type: 'validation' | 'error';
  status?: number;
  message?: string;
  validationErrors?: ValidationErrors;
  error?: string;
}

