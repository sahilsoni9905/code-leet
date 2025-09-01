import express from "express";
import { executeCode } from "../utils/codeExecutor";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: code, language, testCases",
      });
    }

    const results = await executeCode(code, language, testCases);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Evaluation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
