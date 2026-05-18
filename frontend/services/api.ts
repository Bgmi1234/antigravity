import axios from 'axios';
import { Employee, WorkflowStep } from '../types';
export type { Employee, WorkflowStep };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

const handleApiError = (error: any): never => {
  console.error("API Error:", error);
  if (error.response) {
    throw new Error(error.response.data?.detail || `API Error: ${error.response.status}`);
  } else if (error.request) {
    throw new Error("Network Error: Could not connect to backend");
  } else {
    throw new Error(`Error: ${error.message}`);
  }
};

export const getEmployees = async (
  search?: string,
  department?: string,
  skip: number = 0,
  limit: number = 100
): Promise<Employee[]> => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (department && department !== 'All') params.append('department', department);
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEmployee = async (id: number): Promise<Employee> => {
  try {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await api.post('/employees/', data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateEmployee = async (id: number, data: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await api.delete(`/employees/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEmployeeSteps = async (employeeId: number): Promise<WorkflowStep[]> => {
  try {
    const response = await api.get(`/employees/${employeeId}/steps`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createWorkflowStep = async (employeeId: number, data: { step_order: number, instruction: string }): Promise<WorkflowStep> => {
  try {
    const response = await api.post(`/employees/${employeeId}/steps`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export interface TaskEmployeeStatus {
  id: string;
  role: string;
  status: string;
  current_task: string;
  progress: number;
}

export interface TaskPlanResponse {
  task_id: number;
  task_summary: string;
  employees_needed: TaskEmployeeStatus[];
  workflow_plan: string[];
  employee_count: number;
  charge_required: boolean;
  estimated_price: number;
}

export const planTask = async (userPrompt: string): Promise<TaskPlanResponse> => {
  try {
    const response = await api.post('/tasks/plan', { user_prompt: userPrompt });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTaskStatus = async (taskId: number): Promise<TaskPlanResponse> => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

