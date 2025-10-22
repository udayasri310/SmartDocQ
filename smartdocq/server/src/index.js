
// server/src/index.js
import 'dotenv/config';   // loads .env automatically
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './db.js';
import { config } from './config.js';
import authRoutes from './routes/auth.routes.js';
//import qaRoutes from "./routes/qa.js";
import userRoutes from './routes/user.routes.js';
import convRoutes from './routes/conversation.routes.js';
import qaRoutes from './routes/qa.routes.js';
import uploadRouter from './routes/upload.js'; // ✅ upload router
import feedbackRoutes from "./routes/feedback.routes.js";
import { notFound, errorHandler } from './middleware/error.js';
import { Conversation } from './models/Conversation.js';
import chatbotRoutes from "./routes/chatbot.routes.js";



import path from 'path';

// Ensure TTL index for conversations.expiresAt
Conversation.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});

const app = express();

// Security & logging
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// CORS for frontend
app.use(cors({
  origin: config.clientOrigin, // e.g., http://localhost:5173
  credentials: true
}));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/conversations', convRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/upload', uploadRouter); // ✅ mount upload router
app.use("/api/feedback", feedbackRoutes);
app.use("/api/chatbot", chatbotRoutes);
// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(config.port, () => console.log(`API running on http://localhost:${config.port}`));
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
// import express from "express";
// import fs from "fs";
// import path from "path";
// import cors from "cors";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(express.json());
// app.use(cors());

// // ✅ Folder where your files (PDFs, etc.) are uploaded
// const UPLOAD_DIR = path.join(__dirname, "uploads");

// // ✅ Endpoint to get stats
// app.get("/api/stats", (req, res) => {
//   try {
//     // Count files in the uploads folder
//     let documentCount = 0;
//     if (fs.existsSync(UPLOAD_DIR)) {
//       const files = fs.readdirSync(UPLOAD_DIR);
//       documentCount = files.length;
//     }

//     // ✅ If questions.json doesn’t exist, return 0 safely
//     let questionsCount = 0;
//     const questionsFile = path.join(__dirname, "questions.json");
//     if (fs.existsSync(questionsFile)) {
//       const questionsData = JSON.parse(fs.readFileSync(questionsFile, "utf-8"));
//       questionsCount = Array.isArray(questionsData) ? questionsData.length : 0;
//     }

//     res.json({
//       documents: documentCount,
//       questions: questionsCount,
//     });
//   } catch (err) {
//     console.error("Error reading stats:", err);
//     res.status(500).json({ error: "Failed to fetch stats" });
//   }
// });

// app.listen(5000, () => console.log("✅ Server running on port 5000"));

// server/src/index.js
// import 'dotenv/config';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import { connectDB } from './db.js';
// import { config } from './config.js';
// import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/user.routes.js';
// import convRoutes from './routes/conversation.routes.js';
// import qaRoutes from './routes/qa.routes.js';
// import uploadRouter from './routes/upload.js';
// import feedbackRoutes from './routes/feedback.routes.js';
// import chatbotRoutes from './routes/chatbot.routes.js';
// import { notFound, errorHandler } from './middleware/error.js';
// import { Conversation } from './models/Conversation.js';

// // -------------------- __dirname fix --------------------
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure TTL index for conversations.expiresAt
// Conversation.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});

// const app = express();

// // -------------------- Middleware --------------------
// app.use(helmet());
// app.use(morgan('dev'));
// app.use(express.json({ limit: '10mb' }));
// app.use(cookieParser());
// app.use(cors({ origin: config.clientOrigin, credentials: true }));

// // Serve uploaded files statically
// const UPLOAD_DIR = path.join(__dirname, 'uploads');
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// app.use('/uploads', express.static(UPLOAD_DIR));

// // -------------------- Health check --------------------
// app.get('/api/health', (_, res) => res.json({ ok: true }));

// // -------------------- Stats endpoint --------------------
// app.get('/api/stats', (req, res) => {
//   try {
//     // Count files in uploads folder
//     let documentCount = 0;
//     if (fs.existsSync(UPLOAD_DIR)) {
//       const files = fs.readdirSync(UPLOAD_DIR);
//       documentCount = files.length;
//     }

//     // Count questions from JSON file
//     let questionsCount = 0;
//     const questionsFile = path.join(__dirname, 'questions.json');
//     if (fs.existsSync(questionsFile)) {
//       const questionsData = JSON.parse(fs.readFileSync(questionsFile, 'utf-8'));
//       questionsCount = Array.isArray(questionsData) ? questionsData.length : 0;
//     }

//     res.json({ documents: documentCount, questions: questionsCount });
//   } catch (err) {
//     console.error('Error reading stats:', err);
//     res.status(500).json({ error: 'Failed to fetch stats' });
//   }
// });

// // -------------------- Routes --------------------
// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);
// app.use('/api/conversations', convRoutes);
// app.use('/api/qa', qaRoutes);
// app.use('/api/upload', uploadRouter);
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/chatbot', chatbotRoutes);

// // -------------------- Error handling --------------------
// app.use(notFound);
// app.use(errorHandler);

// // -------------------- Start server --------------------
// connectDB()
//   .then(() => {
//     app.listen(config.port, () => console.log(`✅ API running on http://localhost:${config.port}`));
//   })
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });
