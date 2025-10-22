// import { Feedback } from "../models/Feedback.js";

// export async function submitFeedback(req, res) {
//   try {
//     const { name, feedback } = req.body;

//     if (!feedback) {
//       return res.status(400).json({ error: "Feedback is required" });
//     }

//     const fb = await Feedback.create({ name, feedback, rating:parsedRating  });

//     res.json({
//       message: "Thank you for your feedback!",
//       feedback: fb,
//     });
//   } catch (err) {
//     console.error("Error saving feedback:", err);
//     res.status(500).json({ error: "Failed to save feedback" });
//   }
// }
// import { Feedback } from "../models/Feedback.js";

// export async function submitFeedback(req, res) {
//   try {
//     const { name, feedback, rating } = req.body; // ✅ make sure rating is destructured

//     if (!feedback) {
//       return res.status(400).json({ error: "Feedback is required" });
//     }

//     // Optional: validate rating
//     const parsedRating = Number(rating) || 0; // default to 0 if undefined
//     if (parsedRating < 0 || parsedRating > 5) {
//       return res.status(400).json({ error: "Rating must be between 0 and 5" });
//     }

//     const fb = await Feedback.create({ 
//       name, 
//       feedback, 
//       rating: parsedRating 
//     });

//     res.json({ message: "Thank you for your feedback!", feedback: fb });
//   } catch (err) {
//     console.error("Error saving feedback:", err);
//     res.status(500).json({ error: "Failed to save feedback" });
//   }
// }
// server/src/controllers/feedback.controller.js
import { Feedback } from "../models/Feedback.js";

// Submit feedback
export async function submitFeedback(req, res) {
  try {
    const { name, feedback, rating } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: "Feedback is required" });
    }

    // Ensure rating is a number between 0–5
    const parsedRating = Number(rating) || 0;
    if (parsedRating < 0 || parsedRating > 5) {
      return res.status(400).json({ error: "Rating must be between 0 and 5" });
    }

    const fb = await Feedback.create({
      name,
      feedback,
      rating: parsedRating,
    });

    res.json({ message: "Thank you for your feedback!", feedback: fb });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
}

// Get all feedbacks
// export async function getAllFeedback(req, res) {
//   try {
//     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//     res.json({ feedbacks });
//   } catch (err) {
//     console.error("Error fetching feedback:", err);
//     res.status(500).json({ error: "Failed to fetch feedback" });
//   }
// }
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ feedbacks });
  } catch (err) {
    console.error("Error fetching all feedbacks:", err);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
};