import { ApiResponse, AuthResponse } from "../types";

// Use Vercel proxy in production, direct URL in development
const API_BASE_URL = (import.meta as any).env.PROD
  ? "/api/auth"
  : ((import.meta as any).env.VITE_USER_SERVICE_URL || "http://13.201.255.178:3001");

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  if ((import.meta as any).env.PROD) {
    // In production, use the proxy endpoint
    return `${API_BASE_URL}${endpoint}`;
  } else {
    // In development, use the full backend URL
    return `${(import.meta as any).env.VITE_USER_SERVICE_URL || "http://13.201.255.178:3001"}/api/auth${endpoint}`;
  }
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
  const response = await fetch(getApiUrl("/login"), {
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
  const response = await fetch(getApiUrl("/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  return response.json();
}

export async function verifyToken(): Promise<ApiResponse> {
  const response = await fetch(getApiUrl("/verify"), {
    headers: getAuthHeaders(),
  });

  return response.json();
}
