import { ApiResponse } from "../types";

// Use Vercel rewrites in production, direct URL in development
const API_BASE_URL = (import.meta as any).env.VITE_USER_SERVICE_URL || 'https://13.201.255.178';

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  if ((import.meta as any).env.PROD) {
    // In production, use rewrites - leaderboard is part of auth service
    return `/api/auth${endpoint}`;
  } else {
    // In development, use the full backend URL - leaderboard is part of auth service
    return `${API_BASE_URL}/api/auth${endpoint}`;
  }
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

export interface LeaderboardUser {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  problemsSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  rank: number;
}

export async function getLeaderboard(): Promise<
  ApiResponse<LeaderboardUser[]>
> {
  const response = await customFetch(getApiUrl('/leaderboard'), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
