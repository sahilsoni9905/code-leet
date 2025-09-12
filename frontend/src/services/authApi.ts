import { ApiResponse, AuthResponse } from "../types";

// Use relative URLs for same-origin requests (Vercel API routes will proxy)
const API_BASE_URL = '';

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  // Always use relative URLs for Vercel API routes
  return `/api/auth${endpoint}`;
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
  const response = await fetch(getApiUrl('/login'), {
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
  const response = await fetch(getApiUrl('/register'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  return response.json();
}

export async function verifyToken(): Promise<ApiResponse> {
  const response = await fetch(getApiUrl('/verify'), {
    headers: getAuthHeaders(),
  });

  return response.json();
}
