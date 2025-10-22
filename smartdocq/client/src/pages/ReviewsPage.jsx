
// // client/src/pages/ReviewsPage.jsx
// import { useEffect, useState, useContext } from "react";
// import { SettingsContext } from "../context/SettingsContext";

// export default function ReviewsPage() {
//   const { darkMode } = useContext(SettingsContext);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchFeedbacks() {
//       try {
//         const res = await fetch("http://localhost:5000/api/feedback/all");
//         const data = await res.json();
//         setFeedbacks(data.feedbacks || []);
//       } catch (err) {
//         console.error("Error fetching feedbacks:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchFeedbacks();
//   }, []);

//   const containerBg = darkMode ? "#121212" : "#f5f5f5";
//   const cardBg = darkMode ? "#1f1f1f" : "#fff";
//   const textColor = darkMode ? "#fff" : "#222";
//   const secondaryColor = darkMode ? "#aaa" : "#555";

//   return (
//     <div
//       style={{
//         maxWidth: 800,
//         margin: "40px auto",
//         background: containerBg,
//         padding: "2rem",
//         borderRadius: 16,
//         boxShadow: darkMode
//           ? "0 12px 25px rgba(0,0,0,0.5)"
//           : "0 8px 20px rgba(0,0,0,0.1)",
//         color: textColor,
//       }}
//     >
//       <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🌟 Feedback History</h1>

//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading feedbacks...</p>
//       ) : feedbacks.length === 0 ? (
//         <p style={{ textAlign: "center" }}>No feedbacks yet.</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {feedbacks.map((fb) => (
//             <li
//               key={fb._id}
//               style={{
//                 padding: "1rem",
//                 marginBottom: "1rem",
//                 background: cardBg,
//                 borderRadius: 12,
//                 boxShadow: darkMode
//                   ? "0 4px 12px rgba(0,0,0,0.5)"
//                   : "0 2px 6px rgba(0,0,0,0.1)",
//                 transition: "0.2s",
//               }}
//             >
//               <p>
//                 <strong>Name:</strong> {fb.name || "Anonymous"}
//               </p>
//               <p>
//                 <strong>Feedback:</strong> {fb.feedback}
//               </p>
//               <p>
//                 <strong>Rating:</strong>{" "}
//                 <span style={{ color: "#FFD700" }}>
//                   {"⭐".repeat(fb.rating)}
//                 </span>
//                 <span style={{ color: secondaryColor }}>
//                   {"☆".repeat(5 - fb.rating)}
//                 </span>
//               </p>
//               <p style={{ fontSize: "0.8rem", color: secondaryColor }}>
//                 {new Date(fb.createdAt).toLocaleString()}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function ReviewsPage() {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // ✅ Gradient background setup
//   useEffect(() => {
//     document.body.style.background =
//       "linear-gradient(135deg, #e6d6f0, #d4c1f4, #f0e6fc)";
//     document.body.style.margin = "0";
//     document.body.style.minHeight = "100vh";
//     return () => {
//       document.body.style.background = "";
//     };
//   }, []);

//   useEffect(() => {
//     async function fetchFeedbacks() {
//       try {
//         const res = await fetch("http://localhost:5000/api/feedback/all");
//         const data = await res.json();
//         setFeedbacks(data.feedbacks || []);
//       } catch (err) {
//         console.error("Error fetching feedbacks:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchFeedbacks();
//   }, []);

//   return (
//     <div className="qa-page">
//       <div className="qa-container">
//         <h2>🌟 Feedback History</h2>

//         {loading ? (
//           <p style={{ textAlign: "center" }}>⏳ Loading feedbacks...</p>
//         ) : feedbacks.length === 0 ? (
//           <p style={{ textAlign: "center" }}>No feedbacks yet.</p>
//         ) : (
//           <ul className="feedback-list">
//             {feedbacks.map((fb) => (
//               <li key={fb._id} className="feedback-card">
//                 <p>
//                   <strong>👤 Name:</strong> {fb.name || "Anonymous"}
//                 </p>
//                 <p>
//                   <strong>💬 Feedback:</strong> {fb.feedback}
//                 </p>
//                 <p>
//                   <strong>⭐ Rating:</strong>{" "}
//                   <span style={{ color: "#FFD700" }}>
//                     {"★".repeat(fb.rating)}
//                   </span>
//                   <span style={{ color: "#777" }}>
//                     {"☆".repeat(5 - fb.rating)}
//                   </span>
//                 </p>
//                 <p className="date">
//                   {new Date(fb.createdAt).toLocaleString()}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* ✅ Back button moved to bottom */}
//         <div style={{ textAlign: "center", marginTop: "2rem" }}>
//           <button
//             onClick={() => navigate("/feedback")}
//             className="lav-btn back"
//           >
//             ⬅ Back to Feedback
//           </button>
//         </div>
//       </div>

//       <style>{`
//         body {
//           background: linear-gradient(135deg, #e6d6f0, #d4c1f4, #f0e6fc) !important;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           margin: 0;
//         }

//         .qa-page {
//           min-height: 100vh;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           padding: 20px;
//         }

//         .qa-container {
//           max-width: 800px;
//           width: 100%;
//           padding: 2rem;
//           background: #121212;
//           border-radius: 20px;
//           color: #f0f0f0;
//           box-shadow: 0 20px 40px rgba(0,0,0,0.3);
//           text-align: center;
//         }

//         h2 {
//           font-size: 2rem;
//           margin-bottom: 1.5rem;
//           color: #ffffff;
//           text-shadow: 0 0 8px #00000099;
//         }

//         .feedback-list {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }

//         .feedback-card {
//           background: #1e1e1e;
//           padding: 1.2rem;
//           border-radius: 14px;
//           margin-bottom: 1.2rem;
//           text-align: left;
//           box-shadow: 0 8px 25px rgba(0,0,0,0.4);
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }

//         .feedback-card:hover {
//           transform: scale(1.02);
//           box-shadow: 0 12px 30px rgba(0,0,0,0.5);
//         }

//         .feedback-card p {
//           margin: 0.4rem 0;
//           color: #f1f1f1;
//         }

//         .date {
//           font-size: 0.8rem;
//           color: #999;
//           margin-top: 0.5rem;
//         }

//         /* Lavender Buttons */
//         .lav-btn {
//           background: linear-gradient(135deg, #c7b2f0, #e6d6fc);
//           color: #3a2d5c;
//           padding: 12px 20px;
//           border: none;
//           border-radius: 14px;
//           cursor: pointer;
//           font-weight: 700;
//           transition: all 0.25s ease;
//           box-shadow: 0 6px 18px rgba(159, 122, 234, 0.6);
//           min-width: 160px;
//         }

//         .lav-btn:hover {
//           transform: scale(1.06);
//           box-shadow: 0 12px 30px rgba(123, 90, 192, 0.75);
//         }

//         .lav-btn.back {
//           background: linear-gradient(135deg, #63b3ed, #3182ce);
//           color: white;
//         }

//         @media (max-width: 680px) {
//           .lav-btn {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReviewsPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Set gradient background
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(135deg, #e6d6f0, #d4c1f4, #f0e6fc)";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  // ✅ Fetch all feedbacks from backend
  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const res = await fetch("http://localhost:5000/api/feedback/all");
        if (!res.ok) throw new Error("Failed to fetch feedbacks");
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedbacks();
  }, []);

  return (
    <div className="qa-page">
      <div className="qa-container">
        <h2>🌟 All User Feedback</h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>⏳ Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p style={{ textAlign: "center" }}>No feedbacks available yet.</p>
        ) : (
          <ul className="feedback-list">
            {feedbacks.map((fb) => (
              <li key={fb._id} className="feedback-card">
                <p>
                  <strong>👤 Name:</strong> {fb.name || "Anonymous"}
                </p>
                <p>
                  <strong>💬 Feedback:</strong> {fb.feedback}
                </p>
                <p>
                  <strong>⭐ Rating:</strong>{" "}
                  <span style={{ color: "#FFD700" }}>
                    {"★".repeat(fb.rating || 0)}
                  </span>
                  <span style={{ color: "#777" }}>
                    {"☆".repeat(5 - (fb.rating || 0))}
                  </span>
                </p>
                <p className="date">
                  {new Date(fb.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Back button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => navigate("/feedback")}
            className="lav-btn back"
          >
            ⬅ Back to Feedback
          </button>
        </div>
      </div>

      <style>{`
        .qa-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .qa-container {
          max-width: 850px;
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

        .feedback-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feedback-card {
          background: #1e1e1e;
          padding: 1.2rem;
          border-radius: 14px;
          margin-bottom: 1.2rem;
          text-align: left;
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feedback-card:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(0,0,0,0.5);
        }

        .feedback-card p {
          margin: 0.4rem 0;
          color: #f1f1f1;
        }

        .date {
          font-size: 0.8rem;
          color: #999;
          margin-top: 0.5rem;
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
          min-width: 160px;
        }

        .lav-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 12px 30px rgba(123, 90, 192, 0.75);
        }

        .lav-btn.back {
          background: linear-gradient(135deg, #63b3ed, #3182ce);
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
