import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Submission } from "../types";
import { getUserSubmissions } from "../services/submissionApi";
import { useAuth } from "../contexts/AuthContext";
import { socketService } from "../services/socketService";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { Clock, Code } from "lucide-react";

function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubmissions();
    }
  }, [user]);

  // Set up WebSocket listener for real-time submission updates
  useEffect(() => {
    const handleSubmissionUpdate = (data: any) => {
      console.log("Received submission update:", data);

      // Update the specific submission in the list
      setSubmissions((prev) => {
        const updated = prev.map((sub) =>
          sub._id === data.submissionId
            ? {
                ...sub,
                status: data.status,
                runtime: data.runtime,
                testResults: data.testResults,
              }
            : sub
        );

        // If this is a new submission, add it to the list
        if (
          !updated.find((sub) => sub._id === data.submissionId) &&
          data.submission
        ) {
          return [data.submission, ...updated];
        }

        return updated;
      });
    };

    socketService.onSubmissionUpdate(handleSubmissionUpdate);

    // Cleanup listener when component unmounts
    return () => {
      socketService.offSubmissionUpdate(handleSubmissionUpdate);
    };
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await getUserSubmissions(user!._id);
      if (response.success && response.data) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Submissions
        </h1>
        <p className="text-gray-600">
          Track your coding progress and submission history
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <Code className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No submissions yet</p>
            <p className="text-sm text-gray-400">
              Start solving problems to see your submission history
            </p>
            <Link
              to="/problems"
              className="inline-flex items-center mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Browse Problems
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/problems/${submission.problemId}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {(submission.problemId as any).title ||
                          "Unknown Problem"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {submission.language === "javascript"
                          ? "JavaScript"
                          : "C++"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.runtime ? (
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {submission.runtime}ms
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmissionsPage;
