import { ApiResponse, AuthResponse } from "../types";

// Use environment variables for both development and production
const API_BASE_URL = (import.meta as any).env.VITE_USER_SERVICE_URL || "http://13.201.255.178:3001";

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  // Use the full backend URL
  return `${API_BASE_URL}/api/auth${endpoint}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function login(
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  return response.json();
}

export async function verifyToken(): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
    headers: getAuthHeaders(),
  });

  return response.json();
}
