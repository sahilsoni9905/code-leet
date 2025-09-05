import { ApiResponse } from "../types";

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
  const response = await fetch(getApiUrl("/leaderboard"), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
