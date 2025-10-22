// import React from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./Header";
// import Sidebar from "./Sidebar";

// export default function DashboardLayout({ user, setUser }) {
//   return (
//     <div className="dashboard-layout" style={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar />
//       <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Header user={user} setUser={setUser} />
//         <div style={{ padding: "2rem", flex: 1, background: "#f9fafc" }}>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ user, setUser }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafc" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header user={user} setUser={setUser} />
        <main style={{ flex: 1, padding: "2rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
