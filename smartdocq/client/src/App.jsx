
// client/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Header from "./components/Header";
import UploadPage from "./pages/UploadPage";
import FeedbackPage from "./pages/FeedbackPage";
import HistoryPage from "./pages/HistoryPage";
import ReviewsPage from "./pages/ReviewsPage";
import ChatbotPage from "./pages/ChatbotPage";
import RecentQA from "./pages/RecentQA";
import TextExtractor from "./pages/TextExtractor";
import QA from "./pages/QA";

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ documents: 0, questions: 0 });

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats");
        const data = await res.json();
        setStats({ documents: data.documents, questions: data.questions });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} stats={stats} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/feedback" element={<FeedbackPage user={user} />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/text-extractor" element={<TextExtractor />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/qa/recent" element={<RecentQA />} />
        <Route path="/qa" element={<QA />} />
      </Routes>
    </Router>
  );
}
