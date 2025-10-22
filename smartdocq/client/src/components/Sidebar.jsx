// import React, { useEffect, useState } from 'react';
// import { ConvAPI } from '../api/auth';

// export default function Sidebar({ onSelectConversation }) {
//   const [tab, setTab] = useState('temporary');
//   const [items, setItems] = useState([]);

//   const load = async () => {
//     const res = await ConvAPI.list(tab);
//     setItems(res);
//   };

//   useEffect(() => { load(); }, [tab]);

//   return (
//     <aside className="sidebar panel">
//       <button className="btn" onClick={async()=>{
//         const conv = await ConvAPI.create({ isTemporary: tab==='temporary', isPermanent: tab==='permanent' });
//         load();
//         onSelectConversation(conv._id);
//       }}>+ New Chat</button>

//       <div className="tabs">
//         <div className={`tab ${tab==='temporary'?'active':''}`} onClick={()=>setTab('temporary')}>Temporary</div>
//         <div className={`tab ${tab==='permanent'?'active':''}`} onClick={()=>setTab('permanent')}>Permanent</div>
//       </div>

//       <div className="list">
//         {items.map(c => (
//           <div key={c._id} className="card" onClick={()=>onSelectConversation(c._id)} style={{cursor:'pointer'}}>
//             <div style={{fontWeight:600}}>{c.title}</div>
//             <div style={{fontSize:12, color:'#a3a3b2'}}>
//               {c.isTemporary ? 'Expires soon' : 'Saved'}
//             </div>
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// }


// client/src/components/Sidebar.jsx

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { name: "Upload", path: "/upload" },
    { name: "Chat", path: "/chat" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside style={{
      width: 220,
      background: "#2c3e50",
      color: "white",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem"
    }}>
      <h2 style={{ marginBottom: "2rem" }}>SmartDocQ</h2>
      {links.map(link => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: 6,
            background: location.pathname === link.path ? "#34495e" : "transparent",
            color: "white",
            textDecoration: "none",
          }}
        >
          {link.name}
        </Link>
      ))}
    </aside>
  );
}
