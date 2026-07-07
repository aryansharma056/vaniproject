import { useState } from "react";
import HOST_HEADER_BG from "../../assets/host_header_bg.webp";
import ICON_BALANCE   from "../../assets/Balance.webp";
import ICON_MY_WORK   from "../../assets/my work.webp";
import ICON_POLICY    from "../../assets/policy.webp";
import PROFILE_BG     from "../../assets/hostcenter hero.webp";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .hc-root { font-family:'Nunito',sans-serif; background:#eef0f8; min-height:100vh; }

  /* ── Header ── */
  .hc-header {
    position:relative; overflow:hidden;
    background-size:cover; background-position:center;
  }
  .nav-btn {
    background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.15);
    color:#fff; width:42px; height:42px; border-radius:14px; cursor:pointer;
    font-size:22px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  /* ── Profile card ── */
  .profile-card {
    border-radius:20px;
    margin:16px;
    padding:20px 18px;
    display:flex;
    align-items:center;
    gap:16px;
    position:relative;
    overflow:hidden;
    box-shadow:0 8px 32px rgba(40,60,200,0.35);
    background-size:cover;
    background-position:center;
    min-width:0;
  }
  .card-dots {
    position:absolute; right:0; top:0; bottom:0; width:55%; opacity:0.08;
    background-image:radial-gradient(circle,#fff 1.5px,transparent 1.5px);
    background-size:12px 12px; pointer-events:none;
  }
  .card-wave {
    position:absolute; bottom:0; left:0; right:0; height:60%; opacity:0.1;
    pointer-events:none;
    background:repeating-linear-gradient(170deg,transparent 0,transparent 10px,rgba(180,160,255,0.5) 11px,transparent 12px);
  }

  /* ── Avatar glow ring ── */
  .avatar-ring {
    width:82px; height:82px; border-radius:50%; flex-shrink:0;
    background:conic-gradient(from 0deg,#a855f7,#3b82f6,#60a5fa,#a855f7);
    padding:3px; animation:ring-hue 4s linear infinite;
  }
  @keyframes ring-hue { from{filter:hue-rotate(0deg)} to{filter:hue-rotate(360deg)} }
  .avatar-inner {
    width:100%; height:100%; border-radius:50%;
    background:linear-gradient(135deg,#c8d8ff,#e8eeff);
    display:flex; align-items:center; justify-content:center; border:2px solid #060d1f;
  }

  /* Profile info block — compresses gracefully */
  .profile-info {
    flex:1;
    min-width:0;    /* KEY: allow shrink */
    position:relative;
    z-index:1;
  }
  .profile-name {
    font-size:20px; font-weight:900; color:#fff;
    margin-bottom:8px; letter-spacing:0.2px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .profile-meta {
    display:flex; align-items:center; gap:7px; margin-bottom:6px;
  }
  .profile-meta-text {
    font-size:13px; color:rgba(255,255,255,0.85); font-weight:600;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    min-width:0;
  }

  /* ── 2-col grid cards (vertical layout) ── */
  .grid-card {
    background:#fff;
    border-radius:18px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 14px rgba(100,120,200,0.08);
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:10px;
    padding:18px 14px;
    cursor:pointer;
    transition:background .15s;
    min-width:0;    /* prevent grid blowout */
    overflow:hidden;
  }
  .grid-card:hover { background:#f8f9ff; }

  /* Icon inside grid card */
  .grid-card-icon {
    width:62px; height:62px;
    border-radius:16px;
    object-fit:cover;
    flex-shrink:0;
  }

  /* Bottom row of grid card (label + arrow) */
  .grid-card-footer {
    display:flex; align-items:center;
    justify-content:space-between;
    width:100%;
    gap:4px;
  }
  .grid-card-label {
    font-size:15px; font-weight:800; color:#1a1a2e;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    min-width:0; flex:1;
  }

  /* ── Full-width action card (Policy) ── */
  .full-card {
    background:#fff;
    border-radius:18px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 14px rgba(100,120,200,0.08);
    display:flex;
    align-items:center;
    margin:12px 16px;
    gap:14px;
    padding:16px 18px;
    cursor:pointer;
    transition:background .15s;
    min-width:0;
  }
  .full-card:hover { background:#f8f9ff; }
  .full-card-icon {
    width:62px; height:62px;
    border-radius:16px; object-fit:cover; flex-shrink:0;
  }
  .full-card-label {
    font-size:16px; font-weight:800; color:#1a1a2e; flex:1; min-width:0;
  }

  /* Arrow — always fixed, never shrinks */
  .arrow { font-size:22px; color:#bbb; flex-shrink:0; line-height:1; }

  /* ── Responsive: Galaxy S8+ (≤ 360px) ── */
  @media (max-width: 360px) {
    .profile-card      { padding:14px 12px; gap:11px; margin:12px; }
    .avatar-ring       { width:66px; height:66px; }
    .profile-name      { font-size:16px; margin-bottom:6px; }
    .profile-meta-text { font-size:11px; }
    .profile-meta      { gap:5px; margin-bottom:4px; }

    .grid-card         { padding:14px 10px; gap:8px; }
    .grid-card-icon    { width:50px; height:50px; border-radius:13px; }
    .grid-card-label   { font-size:13px; }

    .full-card         { padding:13px 14px; gap:10px; margin:10px 12px; }
    .full-card-icon    { width:50px; height:50px; border-radius:13px; }
    .full-card-label   { font-size:14px; }
    .arrow             { font-size:16px; }
  }

  /* ── Very small fallback (≤ 320px) ── */
  @media (max-width: 320px) {
    .avatar-ring    { width:56px; height:56px; }
    .profile-name   { font-size:14px; }
    .grid-card-icon { width:42px; height:42px; }
    .full-card-icon { width:42px; height:42px; }
    .grid-card      { padding:12px 8px; }
  }
`;

export default function HostCenter() {
   const navigate = useNavigate();
  return (
    <>
      <style>{styles}</style>
      <div className="hc-root">

        {/* ── Header ── */}
        <div className="hc-header" style={{ backgroundImage:`url(${HOST_HEADER_BG})` }}>
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            position:"relative", zIndex:2, padding:"14px 14px 0",
          }}>
            <button className="nav-btn">&#8249;</button>
            <h1 style={{ fontSize:21, fontWeight:900, color:"#fff", letterSpacing:"0.3px", marginTop:"5px" }}>
              Host Center
            </h1>
            <button className="nav-btn">&#10005;</button>
          </div>
          <div style={{ height:40 }}/>
        </div>

        {/* ── Profile Card ── */}
        <div className="profile-card" style={{ backgroundImage:`url(${PROFILE_BG})` }}>
          <div className="card-dots"/>
          <div className="card-wave"/>

          {/* Avatar */}
          <div className="avatar-ring">
            <div className="avatar-inner">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4.5" fill="#2244cc"/>
                <path d="M3 21c0-5 4-9 9-9s9 4 9 9" fill="#2244cc" opacity="0.85"/>
              </svg>
            </div>
          </div>

          {/* Info — flex:1 + min-width:0 compresses before overflowing */}
          <div className="profile-info">
            <h2 className="profile-name">IN-Assistant</h2>

            <div className="profile-meta">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                <rect x="3" y="5" width="18" height="14" rx="3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8"/>
                <circle cx="9" cy="12" r="2.5" fill="rgba(255,255,255,0.7)"/>
                <line x1="13" y1="10" x2="19" y2="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="13" y1="14" x2="19" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="profile-meta-text">ID: 2482036</span>
            </div>

            <div className="profile-meta" style={{marginBottom:0}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                <path d="M12 3L4 7v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7L12 3z"
                  stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4"
                  stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="profile-meta-text">Agency ID: 2480459</span>
            </div>
          </div>
        </div>

        {/* ── 2-col Grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"0 16px" }}>

         {/* Balance */}
<div className="grid-card" onClick={() => navigate("/host/balance")}>
  <img src={ICON_BALANCE} alt="Balance" className="grid-card-icon"/>
  <div className="grid-card-footer">
    <span className="grid-card-label">Balance</span>
    <span className="arrow">›</span>
  </div>
</div>

          {/* My Work */}
          <div className="grid-card" onClick={() => navigate("/host/dashboard/mywork")}>
            <img src={ICON_MY_WORK} alt="My Work" className="grid-card-icon"/>
            <div className="grid-card-footer">
              <span className="grid-card-label">My Work</span>
              <span className="arrow">›</span>
            </div>
          </div>

        </div>

        {/* ── Policy (full width) ── */}
        <div className="full-card">
          <img src={ICON_POLICY} alt="Policy" className="full-card-icon"/>
          <span className="full-card-label">Policy</span>
          <span className="arrow">›</span>
        </div>

      </div>
    </>
  );
}