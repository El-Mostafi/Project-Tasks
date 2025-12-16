import api from './api';
import { Task, PaginatedResponse, CreateTaskDto, UpdateTaskDto } from '../types';

interface GetTasksParams {
  page?: number;
  size?: number;
  query?: string;
  completed?: boolean;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export const tasksService = {
  getTasks: async (projectId: number, params: GetTasksParams = {}): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>(`/projects/${projectId}/tasks`, {
      params: {
        page: params.page || 0,
        size: params.size || 5,
        query: params.query || '',
        completed: params.completed,
        dueDateFrom: params.dueDateFrom || '',
        dueDateTo: params.dueDateTo || ''
      }
    });
    return response.data;
  },

  createTask: async (projectId: number, data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTask: async (taskId: number, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  toggleComplete: async (taskId: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/complete`);
    return response.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  }
};
