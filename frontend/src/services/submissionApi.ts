import { ApiResponse, Submission } from '../types';

// Use relative URL for production (Vercel), full URL for development
const API_BASE_URL = (import.meta as any).env.PROD 
  ? "" // Empty string for relative URLs in production
  : ((import.meta as any).env.VITE_SUBMISSION_SERVICE_URL || 'http://13.203.186.121:3003');

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
  const response = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ problemId, code, language })
  });

  return response.json();
}

export async function getUserSubmissions(userId: string): Promise<ApiResponse<Submission[]>> {
  const response = await fetch(`${API_BASE_URL}/api/submissions/user/${userId}`, {
    headers: getAuthHeaders()
  });

  return response.json();
}

export async function getSubmission(id: string): Promise<ApiResponse<Submission>> {
  const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
    headers: getAuthHeaders()
  });

  return response.json();
}

export async function getProblemSubmissions(problemId: string): Promise<ApiResponse<Submission[]>> {
  const response = await fetch(`${API_BASE_URL}/api/submissions/problem/${problemId}`, {
    headers: getAuthHeaders()
  });

  return response.json();
}