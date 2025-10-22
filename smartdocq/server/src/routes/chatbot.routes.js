// import express from "express";
// import OpenAI from "openai";

// const router = express.Router();
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // POST /api/chatbot
// router.post("/", async (req, res) => {
//   const { message, language } = req.body;
//   if (!message) return res.status(400).json({ error: "Message is required" });

//   try {
//     // Ask OpenAI to answer general questions
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a helpful assistant answering general questions." },
//         { role: "user", content: message },
//       ],
//     });

//     const reply = response.choices?.[0]?.message?.content ?? "🤖 Sorry, I didn't understand.";
//     res.json({ reply });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ reply: "❌ Error generating response" });
//   }
// });

// export default router;


import { Router } from "express";
import OpenAI from "openai";

const router = Router();

// Initialize OpenAI with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 seconds
});

/**
 * Safe request wrapper with retry
 */
async function safeOpenAIRequest(messages, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error(`OpenAI attempt ${i + 1} failed:`, err.message);
      if (i === retries) throw err;
    }
  }
}

// POST /api/chatbot
router.post("/", async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Prepare messages for OpenAI
  const messages = [
    ...conversationHistory, // previous messages
    { role: "user", content: message },
  ];

  try {
    const answer = await safeOpenAIRequest(messages, 1); // 1 retry

    res.json({ answer });
  } catch (err) {
    console.error("❌ OpenAI request failed:", err);
    res.status(500).json({
      error:
        "Failed to get a response from OpenAI. Please try again later.",
    });
  }
});

export default router;
