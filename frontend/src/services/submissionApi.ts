import { ApiResponse, Submission } from "../types";

// Use relative URLs for same-origin requests (Vercel API routes will proxy)
const API_BASE_URL = "";

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  // Always use relative URLs for Vercel API routes
  return `/api/submissions${endpoint}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function submitSolution(
  problemId: string,
  code: string,
  language: "cpp"
): Promise<ApiResponse<Submission>> {
  const response = await fetch(getApiUrl(""), {
    method: "POST",
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
