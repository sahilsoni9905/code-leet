import Submission from "../models/Submission";
import { io } from "../index";

const PROBLEM_SERVICE_URL = "http://3.111.163.113:3002";
const EVALUATOR_SERVICE_URL =
  process.env.EVALUATOR_SERVICE_URL || "http://35.154.178.103:3004";

export async function evaluateSubmission(
  submissionId: string,
  code: string,
  language: string,
  problemId: string
) {
  try {
    console.log("Evaluating submission with URLs:", {
      PROBLEM_SERVICE_URL,
      EVALUATOR_SERVICE_URL,
    });

    // Fetch test cases from problem service
    const problemResponse = await fetch(
      `${PROBLEM_SERVICE_URL}/api/problems/${problemId}`
    );

    if (!problemResponse.ok) {
      throw new Error("Failed to fetch problem details");
    }

    const problemData = await problemResponse.json();
    const testCases = problemData.data.testCases;

    // Call evaluator service
    const evaluatorResponse = await fetch(
      `${EVALUATOR_SERVICE_URL}/api/evaluate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          testCases,
        }),
      }
    );

    if (!evaluatorResponse.ok) {
      throw new Error("Evaluation service failed");
    }

    const evaluationResult = await evaluatorResponse.json();

    // Update submission with results
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        status: evaluationResult.data.status,
        runtime: evaluationResult.data.totalRuntime,
        testResults: evaluationResult.data.testResults,
      },
      { new: true }
    ).populate("problemId", "title difficulty");

    // Emit real-time update to the user
    if (updatedSubmission) {
      io.to(`user-${updatedSubmission.userId}`).emit("submission-updated", {
        submissionId,
        status: updatedSubmission.status,
        runtime: updatedSubmission.runtime,
        testResults: updatedSubmission.testResults,
        submission: updatedSubmission,
      });
      console.log(
        `Emitted submission update for user ${updatedSubmission.userId}`
      );
    }
  } catch (error) {
    console.error("Evaluation failed:", error);

    // Update submission with error status
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        status: "runtime_error",
      },
      { new: true }
    );

    // Emit real-time update for error case
    if (updatedSubmission) {
      io.to(`user-${updatedSubmission.userId}`).emit("submission-updated", {
        submissionId,
        status: "runtime_error",
        submission: updatedSubmission,
      });
      console.log(
        `Emitted submission error update for user ${updatedSubmission.userId}`
      );
    }
  }
}
