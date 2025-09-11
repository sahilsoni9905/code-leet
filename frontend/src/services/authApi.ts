import { ApiResponse, AuthResponse } from "../types";

// Always use HTTPS URL - hardcoded to avoid environment variable issues
const API_BASE_URL = 'https://13.201.255.178';

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  // Always use the full backend URL (both dev and prod)
  return `${API_BASE_URL}/api/auth${endpoint}`;
};

// Custom fetch function that handles self-signed certificates
const customFetch = async (url: string, options: RequestInit = {}) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    // If certificate error, show helpful message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Certificate error detected. Please visit the API URL in browser and accept the certificate.');
      throw new Error('SSL Certificate not accepted. Please visit https://13.201.255.178 in your browser and accept the certificate, then try again.');
    }
    throw error;
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
  const response = await customFetch(getApiUrl('/login'), {
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
