import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/codoleet")
  .then(() => console.log("User Service: Connected to MongoDB"))
  .catch((error) =>
    console.error("User Service: MongoDB connection error:", error)
  );

// Routes
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "user-service", status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
