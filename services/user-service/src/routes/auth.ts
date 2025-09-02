import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        },
        token,
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

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        },
        token,
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

// Verify token
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    console.log("Leaderboard endpoint called");

    // Get all users
    const users = await User.find({}, "username email isAdmin").lean();
    console.log(`Found ${users.length} users`);

    // Get aggregated submission data from submission service
    const submissionServiceUrl = process.env.SUBMISSION_SERVICE_URL || 'http://localhost:3003';
    const submissionResponse = await fetch(
      `${submissionServiceUrl}/api/submissions/leaderboard-data`
    );

    let submissionData: any[] = [];
    if (submissionResponse.ok) {
      const result = await submissionResponse.json();
      submissionData = result.data || [];
      console.log(`Got submission data for ${submissionData.length} users`);
    } else {
      console.warn("Failed to fetch submission data, using empty data");
    }

    // Create leaderboard by combining user data with submission stats
    const leaderboard = users.map((user) => {
      const userStats = submissionData.find(
        (stat: any) => stat.userId === user._id.toString()
      ) || {
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        problemsSolved: 0,
      };

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        problemsSolved: userStats.problemsSolved,
        totalSubmissions: userStats.totalSubmissions,
        acceptedSubmissions: userStats.acceptedSubmissions,
      };
    });

    // Sort by problems solved (descending), then by total submissions (ascending)
    leaderboard.sort((a, b) => {
      if (b.problemsSolved !== a.problemsSolved) {
        return b.problemsSolved - a.problemsSolved;
      }
      return a.totalSubmissions - b.totalSubmissions;
    });

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    console.log(`Returning leaderboard with ${rankedLeaderboard.length} users`);

    res.json({
      success: true,
      data: rankedLeaderboard,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
