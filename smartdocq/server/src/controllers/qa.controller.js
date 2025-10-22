
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { QA } from "../models/QA.js";
import { ExtractedText } from "../models/ExtractedText.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import * as genai from "@google/genai"; // Gemini SDK

// Initialize Gemini client
const ai = new genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* -------------------------------------------------------------------------- */
/* 🧩 Helper: Extract text from files                                          */
/* -------------------------------------------------------------------------- */
async function extractText(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath.replace(/^\/+/, ""));
    if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${fullPath}`);

    const ext = path.extname(fullPath).toLowerCase();
    let text = "";

    if (ext === ".pdf") {
      const pdfParse = await import("pdf-parse");
      const buffer = fs.readFileSync(fullPath);
      const data = await pdfParse.default(buffer);
      text = data.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: fullPath });
      text = result.value;
    } else if (ext === ".txt") {
      text = fs.readFileSync(fullPath, "utf8");
    } else {
      throw new Error("Unsupported file type: " + ext);
    }

    return text.trim();
  } catch (err) {
    console.error("❌ Text extraction failed:", err);
    throw err;
  }
}

/* -------------------------------------------------------------------------- */
/* 🤖 Q&A Endpoint                                                             */
/* -------------------------------------------------------------------------- */
export async function answer(req, res) {
  const { conversationId, query, filePath, email } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    // Save user's query in messages
    if (conversationId) {
      await Message.create({ conversationId, role: "user", content: query });
    }

    // Extract text from file if provided
    let contextText = "";
    if (filePath) {
      const uploadPath = filePath.startsWith("/uploads/") ? filePath : `/uploads/${filePath}`;
      contextText = await extractText(uploadPath);
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Document content:\n\n${contextText}\n\nQuestion: ${query}`,
    });

    const answerText = response.text;

    // Save assistant message
    if (conversationId) {
      await Message.create({ conversationId, role: "assistant", content: answerText });
    }

    // Save only Q&A in QA collection (Text Extraction not included)
    await QA.create({
      conversationId,
      question: query,
      answer: answerText,
      source: "gemini",
      metadata: { model: "gemini-2.5-flash", response_id: Date.now().toString(), email: email || "unknown" },
    });

    res.json({ answer: answerText });
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({ error: "Failed to generate or save answer" });
  }
}

/* -------------------------------------------------------------------------- */
/* 💬 Save Manual Q&A                                                          */
/* -------------------------------------------------------------------------- */
export async function saveQA(req, res) {
  try {
    const { userId, question, answer, fileName } = req.body;
    if (!userId || !question || !answer)
      return res.status(400).json({ error: "Missing required fields" });

    const newQA = await QA.create({ userId, question, answer, fileName, source: "manual" });
    res.json({ success: true, message: "Q&A saved successfully", data: newQA });
  } catch (err) {
    console.error("❌ Error saving Q&A:", err);
    res.status(500).json({ error: "Failed to save Q&A" });
  }
}

/* -------------------------------------------------------------------------- */
/* 🧠 Save Extracted Text                                                      */
/* -------------------------------------------------------------------------- */
export async function saveExtractedText(req, res) {
  try {
    const { userId, fileName, text } = req.body;
    if (!userId || !fileName || !text)
      return res.status(400).json({ error: "Missing required fields" });

    const newText = await ExtractedText.create({ userId, fileName, text });
    res.json({ success: true, message: "✅ Extracted text saved successfully!", data: newText });
  } catch (err) {
    console.error("❌ Error saving extracted text:", err);
    res.status(500).json({ error: "Failed to save extracted text" });
  }
}

/* -------------------------------------------------------------------------- */
/* 📂 Get all Extracted Texts for a user                                       */
/* -------------------------------------------------------------------------- */
export async function getExtractedTexts(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const texts = await ExtractedText.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: texts });
  } catch (err) {
    console.error("❌ Error fetching extracted texts:", err);
    res.status(500).json({ error: "Failed to fetch extracted texts" });
  }
}

/* -------------------------------------------------------------------------- */
/* 📌 Get all QAs for a user                                                  */
/* -------------------------------------------------------------------------- */
export async function getQAs(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const qas = await QA.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: qas });
  } catch (err) {
    console.error("❌ Error fetching QAs:", err);
    res.status(500).json({ error: "Failed to fetch QAs" });
  }
}

/* -------------------------------------------------------------------------- */
/* 📌 Fetch All Previous Q&A (only Q&A)                                        */
/* -------------------------------------------------------------------------- */
export async function getPreviousQA(req, res) {
  try {
    const allQA = await QA.find().sort({ createdAt: -1 });
    res.json(allQA);
  } catch (err) {
    console.error("❌ Error fetching previous Q&A:", err);
    res.status(500).json({ error: "Failed to fetch previous Q&A" });
  }
}

/* -------------------------------------------------------------------------- */
/* 📂 Fetch Recent Q&A by File (only Q&A)                                      */
/* -------------------------------------------------------------------------- */
export async function getRecentQAByFile(req, res) {
  try {
    const { file } = req.query;
    if (!file) return res.status(400).json({ error: "File name is required" });

    const recentQA = await QA.find({ fileName: file }).sort({ createdAt: -1 });
    res.json(recentQA);
  } catch (err) {
    console.error("❌ Error fetching recent Q&A by file:", err);
    res.status(500).json({ error: "Failed to fetch recent Q&A" });
  }
}

/* -------------------------------------------------------------------------- */
/* 🧠 Fetch User-Specific History (only Q&A)                                   */
/* -------------------------------------------------------------------------- */
export async function getUserHistory(req, res) {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const history = await QA.find({ "metadata.email": email }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("❌ Error fetching user history:", err);
    res.status(500).json({ error: "Failed to fetch user history" });
  }
}
// import fs from "fs";
// import path from "path";
// import mammoth from "mammoth";
// import { QA } from "../models/QA.js";
// import { ExtractedText } from "../models/ExtractedText.js";
// import { Message } from "../models/Message.js";
// import { User } from "../models/User.js";
// import * as genai from "@google/genai"; // Gemini SDK

// // Initialize Gemini client
// const ai = new genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// /* -------------------------------------------------------------------------- */
// /* 🧩 Helper: Extract text from files                                          */
// /* -------------------------------------------------------------------------- */
// async function extractText(filePath) {
//   try {
//     const fullPath = path.join(process.cwd(), filePath.replace(/^\/+/, ""));
//     if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${fullPath}`);

//     const ext = path.extname(fullPath).toLowerCase();
//     let text = "";

//     if (ext === ".pdf") {
//       const pdfParse = await import("pdf-parse");
//       const buffer = fs.readFileSync(fullPath);
//       const data = await pdfParse.default(buffer);
//       text = data.text;
//     } else if (ext === ".docx") {
//       const result = await mammoth.extractRawText({ path: fullPath });
//       text = result.value;
//     } else if (ext === ".txt") {
//       text = fs.readFileSync(fullPath, "utf8");
//     } else {
//       throw new Error("Unsupported file type: " + ext);
//     }

//     return text.trim();
//   } catch (err) {
//     console.error("❌ Text extraction failed:", err);
//     throw err;
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 🤖 Q&A Endpoint                                                             */
// /* -------------------------------------------------------------------------- */
// export async function answer(req, res) {
//   const { conversationId, query, filePath, email } = req.body;
//   if (!query) return res.status(400).json({ error: "Query is required" });

//   try {
//     // Save user's query in messages
//     const convId = conversationId || `conv-${Date.now()}`;
//     if (convId) {
//       await Message.create({ conversationId: convId, role: "user", content: query });
//     }

//     // Extract text from file if provided
//     let contextText = "";
//     if (filePath) {
//       const uploadPath = filePath.startsWith("/uploads/") ? filePath : `/uploads/${filePath}`;
//       contextText = await extractText(uploadPath);
//     }

//     // Call Gemini API
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: `Document content:\n\n${contextText}\n\nQuestion: ${query}`,
//     });

//     const answerText = response.text;

//     // Save assistant message
//     if (convId) {
//       await Message.create({ conversationId: convId, role: "assistant", content: answerText });
//     }

//     // Save Q&A in QA collection
//     await QA.create({
//       conversationId: convId,
//       question: query,
//       answer: answerText,
//       source: "gemini",
//       metadata: { model: "gemini-2.5-flash", response_id: Date.now().toString(), email: email || "unknown" },
//     });

//     res.json({ answer: answerText, conversationId: convId });
//   } catch (err) {
//     console.error("❌ Gemini API error:", err);
//     res.status(500).json({ error: "Failed to generate or save answer" });
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 💬 Save Manual Q&A                                                          */
// /* -------------------------------------------------------------------------- */
// export async function saveQA(req, res) {
//   try {
//     const { userId, question, answer, fileName, email } = req.body;
//     if (!userId || !question || !answer)
//       return res.status(400).json({ error: "Missing required fields" });

//     const newQA = await QA.create({
//       userId,
//       question,
//       answer,
//       fileName,
//       source: "manual",
//       metadata: { email: email || "unknown" },
//     });

//     res.json({ success: true, message: "Q&A saved successfully", data: newQA });
//   } catch (err) {
//     console.error("❌ Error saving Q&A:", err);
//     res.status(500).json({ error: "Failed to save Q&A" });
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 🧠 Save Extracted Text                                                      */
// /* -------------------------------------------------------------------------- */
// export async function saveExtractedText(req, res) {
//   try {
//     const { userId, fileName, text } = req.body;
//     if (!userId || !fileName || !text)
//       return res.status(400).json({ error: "Missing required fields" });

//     const newText = await ExtractedText.create({ userId, fileName, text });
//     res.json({ success: true, message: "✅ Extracted text saved successfully!", data: newText });
//   } catch (err) {
//     console.error("❌ Error saving extracted text:", err);
//     res.status(500).json({ error: "Failed to save extracted text" });
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 📂 Get all Extracted Texts for a user                                       */
// /* -------------------------------------------------------------------------- */
// export async function getExtractedTexts(req, res) {
//   try {
//     const { userId } = req.query;
//     if (!userId) return res.status(400).json({ error: "User ID required" });

//     const texts = await ExtractedText.find({ userId }).sort({ createdAt: -1 });
//     res.json({ success: true, data: texts });
//   } catch (err) {
//     console.error("❌ Error fetching extracted texts:", err);
//     res.status(500).json({ error: "Failed to fetch extracted texts" });
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 📌 Get all QAs for a user                                                  */
// /* -------------------------------------------------------------------------- */
// export async function getQAs(req, res) {
//   try {
//     const { userId } = req.query;
//     if (!userId) return res.status(400).json({ error: "User ID required" });

//     const qas = await QA.find({ userId }).sort({ createdAt: -1 });
//     res.json({ success: true, data: qas });
//   } catch (err) {
//     console.error("❌ Error fetching QAs:", err);
//     res.status(500).json({ error: "Failed to fetch QAs" });
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 📌 Fetch All Previous Q&A (only Q&A)                                        */
// /* -------------------------------------------------------------------------- */
// export async function getPreviousQA(req, res) {
//   try {
//     const allQA = await QA.find().sort({ createdAt: -1 });
//     res.json(allQA);
//   } catch (err) {
//     console.error("❌ Error fetching previous Q&A:", err);
//     res.status(500).json({ error: "Failed to fetch previous Q&A" });
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 📂 Fetch Recent Q&A by File (only Q&A)                                      */
// /* -------------------------------------------------------------------------- */
// export async function getRecentQAByFile(req, res) {
//   try {
//     const { file } = req.query;
//     if (!file) return res.status(400).json({ error: "File name is required" });

//     const recentQA = await QA.find({ fileName: file }).sort({ createdAt: -1 });
//     res.json(recentQA);
//   } catch (err) {
//     console.error("❌ Error fetching recent Q&A by file:", err);
//     res.status(500).json({ error: "Failed to fetch recent Q&A" });
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 🧠 Fetch User-Specific History (only Q&A)                                   */
// /* -------------------------------------------------------------------------- */
// export async function getUserHistory(req, res) {
//   try {
//     const { email } = req.query;
//     if (!email) return res.status(400).json({ error: "Email is required" });

//     const history = await QA.find({ "metadata.email": email }).sort({ createdAt: -1 });
//     res.json(history);
//   } catch (err) {
//     console.error("❌ Error fetching user history:", err);
//     res.status(500).json({ error: "Failed to fetch user history" });
//   }
// }
