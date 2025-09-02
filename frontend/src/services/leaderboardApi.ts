import { ApiResponse } from "../types";

const API_BASE_URL =
  (import.meta as any).env.VITE_USER_SERVICE_URL ||
  "http://13.201.255.178:3001";

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
  const response = await fetch(`${API_BASE_URL}/api/auth/leaderboard`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
