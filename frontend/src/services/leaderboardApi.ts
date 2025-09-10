import { ApiResponse } from "../types";

// Use Vercel rewrites in production, direct URL in development
const API_BASE_URL = (import.meta as any).env.VITE_USER_SERVICE_URL || 'https://13.201.255.178';

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  if ((import.meta as any).env.PROD) {
    // In production, use rewrites - full path
    return `/api/leaderboard${endpoint}`;
  } else {
    // In development, use the full backend URL
    return `${API_BASE_URL}/api/leaderboard${endpoint}`;
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
  const response = await fetch(getApiUrl(''), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
