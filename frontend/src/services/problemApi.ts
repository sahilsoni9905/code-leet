import { ApiResponse, Problem } from "../types";

// Use Vercel rewrites in production, direct URL in development
const API_BASE_URL = (import.meta as any).env.VITE_PROBLEM_SERVICE_URL || 'https://13.201.255.178';

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  if ((import.meta as any).env.PROD) {
    // In production, use rewrites - full path
    return `/api/problems${endpoint}`;
  } else {
    // In development, use the full backend URL
    return `${API_BASE_URL}/api/problems${endpoint}`;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export async function getProblems(): Promise<ApiResponse<Problem[]>> {
  const response = await fetch(getApiUrl(''));
  return response.json();
}

export async function getProblem(id: string): Promise<ApiResponse<Problem>> {
  const response = await fetch(getApiUrl(`/${id}`));
  return response.json();
}

export async function createProblem(
  problemData: Partial<Problem>
): Promise<ApiResponse<Problem>> {
  const response = await fetch(getApiUrl(''), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(problemData),
  });

  return response.json();
}

export async function updateProblem(
  id: string,
  problemData: Partial<Problem>
): Promise<ApiResponse<Problem>> {
  const response = await fetch(getApiUrl(`/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(problemData),
  });

  return response.json();
}

export async function deleteProblem(id: string): Promise<ApiResponse<void>> {
  const response = await fetch(getApiUrl(`/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.json();
}
