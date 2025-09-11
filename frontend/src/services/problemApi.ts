import { ApiResponse, Problem } from "../types";

// Always use HTTPS URL - hardcoded to avoid environment variable issues
const API_BASE_URL = 'https://13.201.255.178';

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  // Always use the full backend URL (both dev and prod)
  return `${API_BASE_URL}/api/problems${endpoint}`;
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
