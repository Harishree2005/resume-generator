import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { buildResumePrompt } from "../prompts/resumePrompt.js";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from the .env file.");
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function generateResume(candidate) {
  const prompt = buildResumePrompt(candidate);

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Gemini returned invalid JSON.");
  }
}