import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Code, User, LogOut, Settings, List, Trophy } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-primary-100 text-primary-700"
      : "text-gray-600 hover:text-primary-600 hover:bg-gray-100";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/problems" className="flex items-center space-x-2">
            <Code className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Codo-Leet</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/problems"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "/problems"
                )}`}
              >
                Problems
              </Link>
              <Link
                to="/submissions"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "/submissions"
                )}`}
              >
                <List className="w-4 h-4 inline mr-1" />
                Submissions
              </Link>
              <Link
                to="/leaderboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "/leaderboard"
                )}`}
              >
                <Trophy className="w-4 h-4 inline mr-1" />
                Leaderboard
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                    "/admin"
                  )}`}
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  Admin
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
