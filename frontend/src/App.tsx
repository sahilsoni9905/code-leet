import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminPage from "./pages/AdminPage";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/problems" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/problems" /> : <RegisterPage />}
          />
          <Route
            path="/problems"
            element={user ? <ProblemsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/problems/:id"
            element={user ? <ProblemDetailPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/submissions"
            element={user ? <SubmissionsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/leaderboard"
            element={user ? <LeaderboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              user?.isAdmin ? <AdminPage /> : <Navigate to="/problems" />
            }
          />
          <Route path="/" element={<Navigate to="/problems" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
