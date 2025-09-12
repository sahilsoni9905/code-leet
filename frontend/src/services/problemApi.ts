import { ApiResponse, Problem } from "../types";

// Use relative URLs for same-origin requests (Vercel API routes will proxy)
const API_BASE_URL = "";

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  // Always use relative URLs for Vercel API routes
  return `/api/problems${endpoint}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
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

export async function deleteProblem(id: string): Promise<ApiResponse<void>> {
  const response = await fetch(getApiUrl(`/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.json();
}
