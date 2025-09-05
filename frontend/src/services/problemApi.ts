import { ApiResponse, Problem } from "../types";

// Use Vercel proxy in production, direct URL in development
const API_BASE_URL = (import.meta as any).env.PROD 
  ? "/api/problems" 
  : ((import.meta as any).env.VITE_PROBLEM_SERVICE_URL || 'http://3.111.163.113:3002');

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  if ((import.meta as any).env.PROD) {
    // In production, use the proxy endpoint
    return `${API_BASE_URL}${endpoint}`;
  } else {
    // In development, use the full backend URL
    return `${(import.meta as any).env.VITE_PROBLEM_SERVICE_URL || 'http://3.111.163.113:3002'}/api/problems${endpoint}`;
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
  const response = await fetch(getApiUrl(""));
  return response.json();
}

export async function getProblem(id: string): Promise<ApiResponse<Problem>> {
  const response = await fetch(getApiUrl(`/${id}`));
  return response.json();
}

export async function createProblem(
  problemData: Partial<Problem>
): Promise<ApiResponse<Problem>> {
  const response = await fetch(getApiUrl(""), {
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

export async function deleteProblem(id: string): Promise<ApiResponse> {
  const response = await fetch(getApiUrl(`/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.json();
}
