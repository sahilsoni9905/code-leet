import express from "express";
import Submission from "../models/Submission";
import "../models/User"; // Import to register the User model
import "../models/Problem"; // Import to register the Problem model
import { authenticateToken } from "../middleware/auth";
import { evaluateSubmission } from "../utils/evaluationClient";

const router = express.Router();

// Submit solution
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user!.userId;

    // Create initial submission
    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      status: "pending",
    });

    await submission.save();

    // Trigger evaluation asynchronously
    evaluateSubmission(
      submission._id.toString(),
      code,
      language,
      problemId
    ).catch((error) => console.error("Evaluation error:", error));

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get leaderboard data (public endpoint for user service)
router.get("/leaderboard-data", async (req, res) => {
  try {
    // Aggregate submissions by user and calculate stats
    const leaderboardData = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          totalSubmissions: { $sum: 1 },
          acceptedSubmissions: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
          uniqueProblems: { $addToSet: "$problemId" },
        },
      },
      {
        $project: {
          userId: "$_id",
          totalSubmissions: 1,
          acceptedSubmissions: 1,
          problemsSolved: { $size: "$uniqueProblems" },
        },
      },
    ]);

    res.json({
      success: true,
      data: leaderboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get user submissions
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only view their own submissions unless admin
    if (req.user!.userId !== userId && !req.user!.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const submissions = await Submission.find({ userId })
      .populate("problemId", "title difficulty")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get submission by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("problemId", "title difficulty")
      .populate("userId", "username");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Users can only view their own submissions unless admin
    if (
      submission.userId._id.toString() !== req.user!.userId &&
      !req.user!.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get submissions for a problem
router.get("/problem/:problemId", authenticateToken, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user!.userId;

    const submissions = await Submission.find({
      problemId,
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
