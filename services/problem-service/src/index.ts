import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import problemRoutes from "./routes/problems";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting middleware
const rateLimit = (windowMs: number, max: number) => {
  const requests = new Map();

  return (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests
      .get(ip)
      .filter((time: number) => time > windowStart);

    if (userRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
      });
    }

    userRequests.push(now);
    requests.set(ip, userRequests);
    next();
  };
};

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development
      "http://localhost:5174", // Development (alternate port)
      "https://code-leet-7etz-mtqe78zkr-sahils-projects-73628115.vercel.app", // Your Vercel domain
      /^https:\/\/code-leet-.*\.vercel\.app$/, // Allow any Vercel domain with your project name
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(rateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/codoleet")
  .then(() => console.log("Problem Service: Connected to MongoDB"))
  .catch((error) =>
    console.error("Problem Service: MongoDB connection error:", error)
  );

// Routes
app.use("/api/problems", problemRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "problem-service", status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`Problem Service running on port ${PORT}`);
});
