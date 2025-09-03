import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import evaluatorRoutes from "./routes/evaluator";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

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
    
    const userRequests = requests.get(ip).filter((time: number) => time > windowStart);
    
    if (userRequests.length >= max) {
      return res.status(429).json({ 
        success: false, 
        message: 'Too many evaluation requests, please try again later' 
      });
    }
    
    userRequests.push(now);
    requests.set(ip, userRequests);
    next();
  };
};

// Middleware
// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(rateLimit(15 * 60 * 1000, 30)); // 30 evaluations per 15 minutes

// Routes
app.use("/api/evaluate", evaluatorRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "evaluator-service", status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`Evaluator Service running on port ${PORT}`);
});
