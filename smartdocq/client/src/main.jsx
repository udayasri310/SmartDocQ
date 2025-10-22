// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { BrowserRouter } from "react-router-dom";
// import { SettingsProvider } from "./context/SettingsContext";
// import "./styles.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <SettingsProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </SettingsProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SettingsProvider } from "./context/SettingsContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SettingsProvider>
    <App />
  </SettingsProvider>
);


