import { ApiResponse, AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export async function login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  return response.json();
}

export async function register(
  username: string, 
  email: string, 
  password: string
): Promise<ApiResponse<AuthResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  return response.json();
}

export async function verifyToken(): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
    headers: getAuthHeaders()
  });

  return response.json();
}