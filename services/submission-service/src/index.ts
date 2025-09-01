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
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3003;

// Make io instance available globally
export { io };

// Middleware
app.use(cors());
app.use(express.json());

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
