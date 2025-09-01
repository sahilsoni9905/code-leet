import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import evaluatorRoutes from "./routes/evaluator";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/evaluate", evaluatorRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "evaluator-service", status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`Evaluator Service running on port ${PORT}`);
});
