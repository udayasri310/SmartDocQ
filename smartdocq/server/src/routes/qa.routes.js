// import { Router } from "express";
// import {
//   answer,
//   saveQA,
//   getLongTermHistory,
//   saveExtractedText,
//   getPreviousQA,
//   getRecentQAByFile,
// } from "../controllers/qa.controller.js";

// const r = Router();

// // AI routes
// r.post("/answer", answer);

// // Manual save routes
// r.post("/save-qa", saveQA);
// r.get("/previous-questions", getPreviousQA);
// r.get("/history/long-term", getLongTermHistory);
// r.get("/recent", getRecentQAByFile);

// // Save extracted text (when no Q&A)
// r.post("/save-text", saveExtractedText);

// export default r;

// server/src/routes/qa.routes.js
import { Router } from "express";
import {
  answer,
  saveQA,
  getUserHistory,
  saveExtractedText,
  getPreviousQA,
  getRecentQAByFile,
  getExtractedTexts
} from "../controllers/qa.controller.js";

const router = Router();

// 📝 Ask a question (Gemini-powered)
router.post("/answer", answer);

// 💾 Save manual Q&A
router.post("/save-qa", saveQA);
router.get("/previous-questions", getPreviousQA);
// router.get("/history/long-term", getLongTermHistory);
router.get("/recent", getRecentQAByFile);
router.post("/save-text", saveExtractedText);
router.get("/get-extracted", getExtractedTexts);
// 🧠 Fetch user-specific history
router.get("/history/user", getUserHistory);

export default router;
