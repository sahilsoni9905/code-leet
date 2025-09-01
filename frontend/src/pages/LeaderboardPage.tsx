import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, User, Target, CheckCircle } from "lucide-react";
import { getLeaderboard, LeaderboardUser } from "../services/leaderboardApi";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] =
    useState<LeaderboardUser | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      if (response.success && response.data) {
        setLeaderboard(response.data);

        // Find current user's rank
        if (user) {
          const userRank = response.data.find((u) => u._id === user._id);
          setCurrentUserRank(userRank || null);
        }
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-semibold">
            #{rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-blue-50 border-blue-200";

    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200";
      case 2:
        return "bg-gray-50 border-gray-200";
      case 3:
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-gray-600">
          See how you rank among fellow coders based on problems solved
        </p>
      </div>

      {/* Current User Stats */}
      {currentUserRank && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Your Ranking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {getRankIcon(currentUserRank.rank)}
              </div>
              <p className="text-2xl font-bold text-blue-900">
                #{currentUserRank.rank}
              </p>
              <p className="text-sm text-blue-600">Rank</p>
            </div>
            <div className="text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {currentUserRank.problemsSolved}
              </p>
              <p className="text-sm text-gray-600">Problems Solved</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {currentUserRank.acceptedSubmissions}
              </p>
              <p className="text-sm text-gray-600">Accepted Solutions</p>
            </div>
            <div className="text-center">
              <User className="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {currentUserRank.totalSubmissions}
              </p>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No leaderboard data available</p>
            <p className="text-sm text-gray-400">
              Start solving problems to see the leaderboard
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problems Solved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accepted Solutions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Submissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((leaderUser) => {
                  const isCurrentUser = user && leaderUser._id === user._id;
                  const successRate =
                    leaderUser.totalSubmissions > 0
                      ? Math.round(
                          (leaderUser.acceptedSubmissions /
                            leaderUser.totalSubmissions) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={leaderUser._id}
                      className={`hover:bg-gray-50 border ${getRankBg(
                        leaderUser.rank,
                        !!isCurrentUser
                      )}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getRankIcon(leaderUser.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {leaderUser.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {leaderUser.username}
                              {isCurrentUser && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                              {leaderUser.isAdmin && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-500" />
                          <span className="text-lg font-bold text-gray-900">
                            {leaderUser.problemsSolved}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-900">
                            {leaderUser.acceptedSubmissions}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {leaderUser.totalSubmissions}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{
                                width: `${Math.min(successRate, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {successRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Ranking Criteria
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            • <strong>Primary:</strong> Number of unique problems solved (higher
            is better)
          </p>
          <p>
            • <strong>Tiebreaker:</strong> Total submissions (lower is better)
          </p>
          <p>• Only accepted solutions count towards problems solved</p>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
