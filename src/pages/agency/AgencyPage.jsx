import { useState } from "react";
import BG_IMG from "../../assets/bg.webp"
import AGENCY_HEADER_BG from "../../assets/AGENCY_HEADER_BG.webp"
import ICON_BALANCE    from "../../assets/Balance.webp"
import ICON_MY_WORK   from "../../assets/my work.webp"
import ICON_REQUEST   from "../../assets/request_compressed.webp"
import ICON_TEAM_BILL from "../../assets/team bill_compressed.webp"
import ICON_MEMBERS   from "../../assets/member list_compressed.webp"
import ICON_INVITE    from "../../assets/invite_compressed.webp"


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .ag-root { font-family:'Nunito',sans-serif; background:#eef0f8; min-height:100vh; }

  .ag-header {
    padding:14px 14px 18px; position:relative; overflow:hidden; min-height:100px;
  }
  .nav-btn {
    background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.18);
    color:#fff; width:42px; height:42px; border-radius:14px; cursor:pointer;
    font-size:22px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  /* ── Profile card ── */
  .profile-card {
    border-radius:20px;
    margin:16px;
    padding:16px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    position:relative;
    overflow:hidden;
    box-shadow:0 8px 32px rgba(7,34,153,0.45);
    background-size:cover;
    background-position:center;
    gap:10px;        /* consistent gap between children */
    min-width:0;
  }

  .profile-card-overlay {
    position:absolute; inset:0; border-radius:20px;
    background:rgba(5,15,50,0.38); pointer-events:none; z-index:0;
  }

  /* Avatar ring */
  .avatar-ring {
    width:68px; height:68px; border-radius:50%; flex-shrink:0;
    background:conic-gradient(from 0deg,#a855f7,#3b82f6,#60a5fa,#c084fc,#a855f7);
    padding:3px; animation:ring-hue 4s linear infinite; position:relative; z-index:1;
  }
  @keyframes ring-hue { from{filter:hue-rotate(0deg)} to{filter:hue-rotate(360deg)} }
  .avatar-inner {
    width:100%; height:100%; border-radius:50%;
    background:linear-gradient(135deg,#d0ddff,#eef2ff);
    display:flex; align-items:center; justify-content:center; border:2.5px solid #0a1540;
  }
  .avatar-icon-shadow {
    filter: drop-shadow(0px 3px 8px rgba(30,60,200,0.55)) drop-shadow(0px 1px 3px rgba(0,0,30,0.4));
  }

  /* Info block — takes remaining space, clips text */
  .profile-info {
    flex:1;
    min-width:0;       /* KEY: allows text to shrink below natural size */
    position:relative;
    z-index:1;
  }
  .profile-name {
    font-size:15px;
    font-weight:900;
    color:#fff;
    margin-bottom:2px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;  /* single line + ellipsis if needed */
  }

  /* AGENT badge — fixed, never grows or shrinks */
  .agent-badge {
    background:linear-gradient(135deg,#2a7aff,#1155ee);
    color:#fff;
    font-weight:900;
    font-size:13px;
    padding:8px 14px;
    border-radius:30px;
    border:1.5px solid rgba(100,160,255,0.4);
    box-shadow:0 2px 12px rgba(40,100,255,0.4);
    white-space:nowrap;
    letter-spacing:0.5px;
    flex-shrink:0;      /* KEY: never compress the badge */
    position:relative;
    z-index:1;
  }

  /* ── Action grid cards ── */
  .action-card {
    background:#fff;
    border-radius:16px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 14px rgba(100,120,200,0.08);
    display:flex;
    align-items:center;
    padding:13px 10px;
    cursor:pointer;
    transition:background .15s;
    gap:8px;
    min-width:0;    /* prevent grid blowout */
    overflow:hidden;
  }
  .action-card:hover { background:#f7f8ff; }

  /* Card icon */
  .card-icon {
    width:50px;
    height:50px;
    border-radius:14px;
    object-fit:cover;
    flex-shrink:0;
  }

  /* Card label */
  .card-label {
    font-size:13px;
    font-weight:800;
    color:#1a1a2e;
    flex:1;
    min-width:0;
    line-height:1.3;
    word-break:break-word;
  }

  /* Arrow */
  .card-arrow {
    font-size:22px;
    color:#c0c0cc;
    flex-shrink:0;
    line-height:1;
  }

  /* ── Responsive: Galaxy S8+ and narrower (≤360px) ── */
  @media (max-width: 360px) {
    .profile-card   { padding:12px 10px; gap:8px; margin:12px; }
    .avatar-ring    { width:58px; height:58px; }
    .profile-name   { font-size:13px; }
    .agent-badge    { font-size:11px; padding:7px 10px; }

    .action-card    { padding:10px 8px; gap:6px; }
    .card-icon      { width:42px; height:42px; border-radius:12px; }
    .card-label     { font-size:12px; }
    .card-arrow     { font-size:15px; }
  }

  /* ── Very small fallback (≤320px) ── */
  @media (max-width: 320px) {
    .avatar-ring    { width:50px; height:50px; }
    .agent-badge    { font-size:10px; padding:6px 8px; }
    .card-icon      { width:36px; height:36px; }
    .card-label     { font-size:11px; }
  }
`;

const CARDS = [
  { label: "Balance",      img: ICON_BALANCE    },
  { label: "My Work",      img: ICON_MY_WORK    },
  { label: "Request",      img: ICON_REQUEST    },
  { label: "Team Bills",   img: ICON_TEAM_BILL  },
  { label: "Members List", img: ICON_MEMBERS    },
  { label: "Invite",       img: ICON_INVITE     },
];

export default function AgencyPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="ag-root">

        {/* ── Header ── */}
        <div
          className="ag-header"
          style={{
            backgroundImage:`url(${AGENCY_HEADER_BG})`,
            backgroundSize:"cover",
            backgroundPosition:"center",
          }}
        >
          <div style={{
            position:"absolute",top:"50%",left:"50%",
            transform:"translate(-50%,-50%)",
            width:160,height:30,
            background:"radial-gradient(ellipse,rgba(100,200,255,0.25) 0%,transparent 70%)",
            pointerEvents:"none",
          }}/>
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            position:"relative",zIndex:2,
          }}>
            <button className="nav-btn">&#8249;</button>
            <h1 style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"0.9px",marginTop:"8px"}}>
              Agency
            </h1>
            <button className="nav-btn">&#10005;</button>
          </div>
          <div style={{display:"flex",justifyContent:"center",marginTop:10,position:"relative",zIndex:2}}>
            <div style={{width:140,height:2,background:"linear-gradient(90deg,transparent,#4af,#fff,#4af,transparent)",borderRadius:2}}/>
          </div>
        </div>

        {/* ── Profile Card ── */}
        <div className="profile-card" style={{backgroundImage:`url(${BG_IMG})`}}>
          <div className="profile-card-overlay"/>

          {/* Avatar */}
          <div className="avatar-ring">
            <div className="avatar-inner">
              <svg className="avatar-icon-shadow" width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4.5" fill="#2244cc"/>
                <path d="M3 21c0-5 4-9 9-9s9 4 9 9" fill="#2244cc" opacity="0.85"/>
              </svg>
            </div>
          </div>

          {/* Info — flex:1 + min-width:0 lets it compress gracefully */}
          <div className="profile-info">
            <p className="profile-name">HT=Heaven place</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.7)",fontWeight:600}}>ID: 1</p>
          </div>

          {/* Badge — flex-shrink:0 keeps it intact */}
          <div className="agent-badge">AGENT</div>
        </div>

        {/* ── Action Grid ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:12,
          margin:"0 16px 24px",
        }}>
          {CARDS.map(({ label, img }) => (
            <div key={label} className="action-card">
              <img src={img} alt={label} className="card-icon"/>
              <span className="card-label">{label}</span>
              <span className="card-arrow">›</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}