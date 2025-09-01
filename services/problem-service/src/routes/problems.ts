import express from "express";
import Problem from "../models/Problem";
import "../models/User"; // Import to register the User model
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = express.Router();

// Get all problems
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("-testCases")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get problem by ID
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Don't expose hidden test cases to regular users
    const publicTestCases = problem.testCases.filter((tc) => !tc.isHidden);

    res.json({
      success: true,
      data: {
        ...problem.toObject(),
        testCases: publicTestCases,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create problem (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const problemData = {
      ...req.body,
      createdBy: req.user!.userId,
    };

    const problem = new Problem(problemData);
    await problem.save();

    res.status(201).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update problem (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete problem (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      message: "Problem deleted successfully",
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
