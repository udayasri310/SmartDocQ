
// // client/src/pages/FeedbackPage.jsx
// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { SettingsContext } from "../context/SettingsContext";

// export default function FeedbackPage() {
//   const { darkMode } = useContext(SettingsContext);

//   const [name, setName] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [rating, setRating] = useState(0);
//   const [message, setMessage] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     if (!name || !feedback || rating === 0) {
//       setMessage("⚠ Please fill all fields and select a rating!");
//       return;
//     }
//     setSubmitting(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/feedback/submit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, feedback, rating }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("✅ " + data.message);
//         setName("");
//         setFeedback("");
//         setRating(0);
//       } else {
//         setMessage("❌ " + (data.error || "Something went wrong"));
//       }
//     } catch (err) {
//       console.error("Error submitting feedback:", err);
//       setMessage("❌ Error submitting feedback");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Colors based on darkMode
//   const bgColor = darkMode ? "#1a1a1a" : "#fff";
//   const inputBg = darkMode ? "#2b2b2b" : "#fff";
//   const inputBorder = darkMode ? "#444" : "#ccc";
//   const textColor = darkMode ? "#f1f1f1" : "#222";
//   const placeholderColor = "#777";

//   return (
//     <div
//       style={{
//         maxWidth: 700,
//         margin: "40px auto",
//         background: bgColor,
//         padding: "2rem",
//         borderRadius: 16,
//         boxShadow: darkMode
//           ? "0 12px 25px rgba(0,0,0,0.5)"
//           : "0 12px 25px rgba(0,0,0,0.12)",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         color: textColor,
//       }}
//     >
//       <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>📝 Feedback</h1>
//       <p style={{ textAlign: "center", marginBottom: "2rem", color: placeholderColor }}>
//         We’d love to hear your thoughts!
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
//       >
//         {/* Name */}
//         <div style={{ position: "relative" }}>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Your Name"
//             style={{
//               width: "100%",
//               padding: "12px",
//               borderRadius: 10,
//               border: `1px solid ${inputBorder}`,
//               outline: "none",
//               background: inputBg,
//               color: textColor,
//               transition: "0.2s",
//             }}
//           />
//           <label
//             style={{
//               position: "absolute",
//               left: 12,
//               top: name ? -8 : 12,
//               background: bgColor,
//               padding: "0 4px",
//               fontSize: name ? 12 : 16,
//               color: placeholderColor,
//               transition: "0.2s",
//             }}
//           >
//             Your Name
//           </label>
//         </div>

//         {/* Feedback */}
//         <div style={{ position: "relative" }}>
//           <textarea
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             placeholder="Your feedback"
//             rows="5"
//             style={{
//               width: "100%",
//               padding: "12px",
//               borderRadius: 10,
//               border: `1px solid ${inputBorder}`,
//               outline: "none",
//               resize: "vertical",
//               background: inputBg,
//               color: textColor,
//             }}
//           />
//           <label
//             style={{
//               position: "absolute",
//               left: 12,
//               top: feedback ? -8 : 12,
//               background: bgColor,
//               padding: "0 4px",
//               fontSize: feedback ? 12 : 16,
//               color: placeholderColor,
//               transition: "0.2s",
//             }}
//           >
//             Feedback
//           </label>
//         </div>

//         {/* Rating */}
//         <div>
//           <label style={{ display: "block", marginBottom: 6 }}>Rating:</label>
//           <div>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span
//                 key={star}
//                 onClick={() => setRating(star)}
//                 style={{
//                   cursor: "pointer",
//                   fontSize: 32,
//                   color: star <= rating ? "#FFD700" : "#555",
//                   marginRight: 6,
//                   transition: "0.2s",
//                 }}
//                 onMouseEnter={(e) => (e.target.style.color = "#FFD700")}
//                 onMouseLeave={(e) =>
//                   (e.target.style.color = star <= rating ? "#FFD700" : "#555")
//                 }
//               >
//                 ★
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//           <button
//             type="submit"
//             disabled={submitting}
//             style={{
//               flex: 1,
//               padding: "0.75rem",
//               borderRadius: 10,
//               border: "none",
//               background: submitting ? "#007bff99" : "#007bff",
//               color: "#fff",
//               fontWeight: "bold",
//               cursor: submitting ? "not-allowed" : "pointer",
//               transition: "0.2s",
//             }}
//           >
//             {submitting ? "Submitting..." : "Submit Feedback"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/reviews")}
//             style={{
//               flex: 1,
//               padding: "0.75rem",
//               borderRadius: 10,
//               border: "none",
//               background: "#28a745",
//               color: "#fff",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "0.2s",
//             }}
//           >
//             See Reviews
//           </button>
//         </div>
//       </form>

//       {message && (
//         <p
//           style={{
//             marginTop: "1.5rem",
//             textAlign: "center",
//             fontWeight: "bold",
//             color: message.startsWith("✅") ? "#4CAF50" : "#E53935",
//             transition: "0.3s",
//           }}
//         >
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Apply same gradient background as QA page
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(135deg, #e6d6f0, #d4c1f4, #f0e6fc)";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !feedback || rating === 0)
      return alert("⚠ Please fill all fields and select a rating!");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, feedback, rating }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + data.message);
        setName("");
        setFeedback("");
        setRating(0);
      } else {
        setMessage("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qa-page">
      <div className="qa-container">
        <h2>📝 Feedback</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Write your feedback here..."
            rows="5"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <div className="rating-section">
            <p>Select your rating:</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "active" : ""}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" disabled={loading} className="lav-btn">
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/reviews")}
              className="lav-btn back"
            >
              View Reviews
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="lav-btn recent"
            >
              ⬅ Back to Home
            </button>
          </div>
        </form>

        {message && (
          <p
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontWeight: "bold",
              color: message.startsWith("✅") ? "#4caf50" : "#e53935",
            }}
          >
            {message}
          </p>
        )}
      </div>

      <style>{`
        body {
          background: linear-gradient(135deg, #e6d6f0, #d4c1f4, #f0e6fc) !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
        }

        .qa-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .qa-container {
          max-width: 800px;
          width: 100%;
          padding: 2rem;
          background: #121212;
          border-radius: 20px;
          color: #f0f0f0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          text-align: center;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #ffffff;
          text-shadow: 0 0 8px #00000099;
        }

        input, textarea {
          width: 100%;
          border-radius: 12px;
          border: none;
          padding: 1rem;
          background: #1e1e1e;
          color: #fff;
          font-size: 1rem;
          outline: none;
          resize: none;
          margin-bottom: 1.2rem;
        }

        .rating-section {
          margin-bottom: 1.5rem;
        }

        .stars {
          font-size: 1.8rem;
          cursor: pointer;
        }

        .stars span {
          margin: 0 4px;
          color: #777;
          transition: color 0.3s ease;
        }

        .stars span.active {
          color: #FFD700;
        }

        .btn-group {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        /* Lavender Buttons */
        .lav-btn {
          background: linear-gradient(135deg, #c7b2f0, #e6d6fc);
          color: #3a2d5c;
          padding: 12px 20px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px rgba(159, 122, 234, 0.6);
          min-width: 140px;
        }

        .lav-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 12px 30px rgba(123, 90, 192, 0.75);
        }

        .lav-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lav-btn.back {
          background: linear-gradient(135deg, #63b3ed, #3182ce);
          color: white;
        }

        .lav-btn.recent {
          background: linear-gradient(135deg, #718096, #4a5568);
          color: white;
        }

        @media (max-width: 680px) {
          .lav-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
