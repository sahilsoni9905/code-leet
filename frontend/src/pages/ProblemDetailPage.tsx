import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Problem, Submission } from "../types";
import { getProblem } from "../services/problemApi";
import {
  submitSolution,
  getProblemSubmissions,
} from "../services/submissionApi";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { socketService } from "../services/socketService";
import DifficultyBadge from "../components/DifficultyBadge";
import StatusBadge from "../components/StatusBadge";
import CodeEditor from "../components/CodeEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import { Play, Clock, Code } from "lucide-react";

function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<"javascript" | "cpp">("javascript");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "submissions">(
    "problem"
  );

  useEffect(() => {
    if (id) {
      loadProblem();
      loadSubmissions();
    }
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.functionSignatures[language] || "");
    }
  }, [problem, language]);

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

      // Show toast notification for status updates
      if (data.status === "accepted") {
        addToast({
          type: "success",
          title: "Solution Accepted!",
          message: "🎉 Your solution passed all test cases",
        });
      } else if (data.status === "wrong_answer") {
        addToast({
          type: "error",
          title: "Wrong Answer",
          message: "❌ Your solution didn't pass all test cases",
        });
      } else if (data.status === "runtime_error") {
        addToast({
          type: "error",
          title: "Runtime Error",
          message: "💥 Your code encountered a runtime error",
        });
      }
    };

    socketService.onSubmissionUpdate(handleSubmissionUpdate);

    // Cleanup listener when component unmounts
    return () => {
      socketService.offSubmissionUpdate(handleSubmissionUpdate);
    };
  }, [addToast]);

  const loadProblem = async () => {
    try {
      const response = await getProblem(id!);
      if (response.success && response.data) {
        setProblem(response.data);
      }
    } catch (error) {
      console.error("Failed to load problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await getProblemSubmissions(id!);
      if (response.success && response.data) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error("Failed to load submissions:", error);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;

    setSubmitting(true);
    try {
      const response = await submitSolution(id!, code, language);
      if (response.success && response.data) {
        // Add the new submission to the list immediately with 'pending' status
        setSubmissions((prev) => [response.data!, ...prev]);

        // Switch to submissions tab to show the result
        setActiveTab("submissions");

        // Show initial toast notification
        addToast({
          type: "warning",
          title: "Submission Received",
          message: "⏳ Evaluating your solution...",
        });
      }
    } catch (error) {
      console.error("Submission failed:", error);
      addToast({
        type: "error",
        title: "Submission Failed",
        message: "Failed to submit your solution. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Problem not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Problem Description */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {problem.title}
              </h1>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>

              {problem.examples && problem.examples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Examples
                  </h3>
                  <div className="space-y-4">
                    {problem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">
                              Input:
                            </span>
                            <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">
                              {example.input}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Output:
                            </span>
                            <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Explanation:
                              </span>
                              <p className="text-gray-600 text-sm mt-1">
                                {example.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Constraints
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {problem.constraints}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for Problem/Submissions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("problem")}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "problem"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Problem Details
                </button>
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "submissions"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  My Submissions ({submissions.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "submissions" && (
                <div className="space-y-4">
                  {submissions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No submissions yet
                    </p>
                  ) : (
                    submissions.map((submission) => (
                      <div
                        key={submission._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <StatusBadge status={submission.status} />
                          <span className="text-sm text-gray-600">
                            {submission.language === "javascript"
                              ? "JavaScript"
                              : "C++"}
                          </span>
                          {submission.runtime && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {submission.runtime}ms
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Solution
              </h3>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "javascript" | "cpp")
                }
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              placeholder={`Write your ${
                language === "javascript" ? "JavaScript" : "C++"
              } solution here...`}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                <Play className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Solution"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
