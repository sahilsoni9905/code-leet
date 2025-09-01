import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import problemRoutes from "./routes/problems";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

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
