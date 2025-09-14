import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_AI_API_KEY);

app.post("/api/generate-trip", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // use your correct model
      generationConfig: { maxOutputTokens: 8192 }
    });

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text }; // fallback if parsing fails
    }

    res.json(json);
  } catch (err) {
    console.error("Error in server:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
