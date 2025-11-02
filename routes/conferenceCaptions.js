const express = require("express");
const router = express.Router();
const Caption = require("../models/caption");
const { CohereClient } = require("cohere-ai");

// Initialize Cohere
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
});

// POST /api/conference-captions/get-conference-captions
router.post("/get-conference-captions", async (req, res) => {
  const { theme, audience, date, location, speakers, tone } = req.body;

  try {
    // 1️⃣ Check if captions exist in DB
    const existing = await Caption.findOne({ theme, audience, date, tone });
    if (existing)
      return res.json({ captions: existing.captions, source: "cache" });

    // 2️⃣ Build prompt
    const message = `
You are a social media expert for churches.
Generate 2 short, ${tone} social media captions for IVC Church's upcoming conference.
Theme: ${theme}
Audience: ${audience}
Date: ${date}
Location: ${location}
Speakers: ${speakers}
Include excitement.
Number each caption.
`;

    // 3️⃣ Get captions from Cohere Chat
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message,
      max_tokens: 200,
      temperature: 0.8
    });

    const captionsText = response.output?.[0]?.content || response.text || "";
    if (!captionsText.trim())
      return res.json({
        captions: [],
        message: "⚠️ No captions returned from AI"
      });

    // 4️⃣ Split into array
    const captions = captionsText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // 5️⃣ Save to MongoDB
    const saved = await Caption.create({
      theme,
      audience,
      date,
      location,
      speakers,
      tone,
      captions
    });

    // 6️⃣ Send response
    res.json({ captions, saved, source: "AI" });
  } catch (err) {
    console.error("Cohere Chat API error:", err);
    res.status(500).json({ message: "AI error", error: err.message });
  }
});

module.exports = router;
