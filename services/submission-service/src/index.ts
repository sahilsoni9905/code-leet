import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import submissionRoutes from "./routes/submissions";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://13.201.255.178"], // Allow both dev and production
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3003;

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
        message: "Too many submissions, please try again later",
      });
    }

    userRequests.push(now);
    requests.set(ip, userRequests);
    next();
  };
};

// Make io instance available globally
export { io };

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
app.use(rateLimit(15 * 60 * 1000, 50)); // 50 submissions per 15 minutes

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/codoleet")
  .then(() => console.log("Submission Service: Connected to MongoDB"))
  .catch((error) =>
    console.error("Submission Service: MongoDB connection error:", error)
  );

// Routes
app.use("/api/submissions", submissionRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "submission-service", status: "healthy" });
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-user-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Submission Service running on port ${PORT}`);
});
