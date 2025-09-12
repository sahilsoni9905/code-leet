import { ApiResponse } from "../types";

// Use relative URLs for same-origin requests (Vercel API routes will proxy)
const API_BASE_URL = '';

// Helper function to build API URLs
const getApiUrl = (endpoint: string) => {
  // Always use relative URLs for Vercel API routes - leaderboard is part of auth service
  return `/api/auth${endpoint}`;
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
  const response = await fetch(getApiUrl('/leaderboard'), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
