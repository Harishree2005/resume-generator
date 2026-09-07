import express from "express";
import { generateResume } from "../services/geminiService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const candidate = req.body;

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: "Candidate information is required.",
      });
    }

    const resume = await generateResume(candidate);

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Resume generation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate resume.",
    });
  }
});

export default router;