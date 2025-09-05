import { ApiResponse, Submission } from "../types";

// Use Vercel rewrites in production, direct URL in development
const API_BASE_URL = (import.meta as any).env.PROD
  ? "" // Empty string for rewrites
  : ((import.meta as any).env.VITE_SUBMISSION_SERVICE_URL || 'http://13.203.186.121:3003');

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  if ((import.meta as any).env.PROD) {
    // In production, use rewrites - full path
    return `/api/submissions${endpoint}`;
  } else {
    // In development, use the full backend URL
    return `${API_BASE_URL}/api/submissions${endpoint}`;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export async function submitSolution(
  problemId: string,
  code: string,
  language: 'cpp'
): Promise<ApiResponse<Submission>> {
  const response = await fetch(getApiUrl(""), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ problemId, code, language }),
  });

  return response.json();
}

export async function getUserSubmissions(
  userId: string
): Promise<ApiResponse<Submission[]>> {
  const response = await fetch(getApiUrl(`/user/${userId}`), {
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function getSubmission(
  id: string
): Promise<ApiResponse<Submission>> {
  const response = await fetch(getApiUrl(`/${id}`), {
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function getProblemSubmissions(
  problemId: string
): Promise<ApiResponse<Submission[]>> {
  const response = await fetch(getApiUrl(`/problem/${problemId}`), {
    headers: getAuthHeaders(),
  });

  return response.json();
}
