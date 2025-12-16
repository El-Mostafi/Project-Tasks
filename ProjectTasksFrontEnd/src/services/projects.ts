import api from './api';
import { Project, PaginatedResponse, CreateProjectDto } from '../types';

export const projectsService = {
  getProjects: async (page = 0, size = 6): Promise<PaginatedResponse<Project>> => {
    const response = await api.get<PaginatedResponse<Project>>('/projects', {
      params: { page, size }
    });
    return response.data;
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectDto): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  updateProject: async (id: number, data: CreateProjectDto): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  }
};
