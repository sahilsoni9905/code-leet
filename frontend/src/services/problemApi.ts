import { ApiResponse, Problem } from '../types';

// Use relative URL for production (Vercel), full URL for development
const API_BASE_URL = (import.meta as any).env.PROD 
  ? "" // Empty string for relative URLs in production
  : ((import.meta as any).env.VITE_PROBLEM_SERVICE_URL || 'http://3.111.163.113:3002');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export async function getProblems(): Promise<ApiResponse<Problem[]>> {
  const response = await fetch(`${API_BASE_URL}/api/problems`);
  return response.json();
}

export async function getProblem(id: string): Promise<ApiResponse<Problem>> {
  const response = await fetch(`${API_BASE_URL}/api/problems/${id}`);
  return response.json();
}

export async function createProblem(problemData: Partial<Problem>): Promise<ApiResponse<Problem>> {
  const response = await fetch(`${API_BASE_URL}/api/problems`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(problemData)
  });

  return response.json();
}

export async function updateProblem(id: string, problemData: Partial<Problem>): Promise<ApiResponse<Problem>> {
  const response = await fetch(`${API_BASE_URL}/api/problems/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(problemData)
  });

  return response.json();
}

export async function deleteProblem(id: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/problems/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  return response.json();
}