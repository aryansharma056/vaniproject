import { useState } from "react";
import AVATAR_IMG     from "../../assets/ht heaven place.webp";
import ICON_BALANCE   from "../../assets/Balance.webp";
import ICON_MEMBERS   from "../../assets/menber list.webp";
import ICON_AGENT     from "../../assets/agent list.webp";
import ICON_INV_AGENT from "../../assets/invite agent.webp";
import ICON_INV_BD    from "../../assets/invite BD.webp";
import PROFILE_BG from "../../assets/admin center 2.webp";
import HOST_HEADER_BG from "../../assets/host_header_bg.webp";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; }
  .ac-root { font-family:'Nunito',sans-serif; min-height:100vh; padding:0; overflow:hidden; background:#eef0f8; }

  /* ── Dark top zones ── */
  .zone-top    { background:#06091a; padding:14px 14px 0; position:relative; overflow:hidden; }
  .zone-bottom { background:linear-gradient(180deg,#141a48 0%,#0f1540 100%); }

  /* ── White lower section ── */
  .main-content {
    background:#eef0f8;
    padding:16px 16px 32px;
    display:flex; flex-direction:column; gap:12px;
  }

  /* White cards */
  .ac-card {
    background:#ffffff;
    border-radius:18px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 14px rgba(100,120,200,0.08);
  }

  /* ── ACTION CARD: full-width (Balance row) ── */
  .action-card {
    background:#ffffff;
    border-radius:16px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 10px rgba(100,120,200,0.07);
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:14px 16px;
    cursor:pointer;
    transition:background .15s;
    min-width:0; /* prevent grid blowout */
  }
  .action-card:hover { background:#f5f6ff; }

  /* ── ACTION CARD: grid variant (2-col) ── */
  .action-card-grid {
    background:#ffffff;
    border-radius:16px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 10px rgba(100,120,200,0.07);
    display:flex;
    align-items:center;
    justify-content:space-between;
    /* tighter padding so nothing overlaps on 360px */
    padding:10px 10px;
    cursor:pointer;
    transition:background .15s;
    min-width:0;
    overflow:hidden;
    gap:4px;
  }
  .action-card-grid:hover { background:#f5f6ff; }

  /* Left slot inside grid card */
  .grid-card-left {
    display:flex;
    align-items:center;
    gap:8px;
    min-width:0;
    flex:1;
    overflow:hidden;
  }

  /* Icon inside grid card – slightly smaller */
  .grid-icon {
    width:44px;
    height:44px;
    border-radius:12px;
    object-fit:cover;
    flex-shrink:0;
  }

  /* Label inside grid card */
  .grid-label {
    font-size:13px;
    font-weight:700;
    color:#1a1a2e;
    line-height:1.35;
    min-width:0;
    word-break:break-word;
  }

  /* EQ bars */
  .eq-bar {
    display:inline-block; width:4px; border-radius:2px 2px 0 0; margin:0 1.5px;
    animation:eq var(--dur,0.8s) ease-in-out infinite alternate;
    transform-origin:bottom;
  }
  @keyframes eq { from{transform:scaleY(0.1)} to{transform:scaleY(1)} }

  .stat-bar { display:inline-block; border-radius:3px 3px 0 0; margin:0 1.5px; }

  /* Arrow button – fixed size, never shrinks */
  .arrow-btn {
    width:32px;
    height:30px;
    border-radius:50%;
    background:#eef0f8;
    border:1px solid rgba(0,0,0,0.07);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:22px;
    color:#aaa;
    flex-shrink:0; /* KEY: never compress */
  }

  .btn-nav   { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; width:36px; height:36px; border-radius:10px; cursor:pointer; font-size:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  /* Profile card */
  .profile-card {
    background: transparent;
    border-radius:16px; padding:14px 16px;
    display:flex; align-items:center; justify-content:space-between;
    position:relative; overflow:hidden; color:#fff;
    border:1px solid rgba(120,100,255,0.35);
    box-shadow:0 10px 40px rgba(60,30,180,0.55),0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .card-wave {
    position:absolute; right:0; top:0; bottom:0; width:55%;
    opacity:0.12; pointer-events:none;
    background:repeating-linear-gradient(90deg,transparent 0px,transparent 6px,rgba(200,180,255,0.6) 7px,transparent 8px);
    -webkit-mask-image:radial-gradient(ellipse 80% 100% at 80% 50%,black 0%,transparent 100%);
    mask-image:radial-gradient(ellipse 80% 100% at 80% 50%,black 0%,transparent 100%);
  }

  /* Avatar glow ring */
  .avatar-ring {
    width:66px; height:66px; border-radius:50%; flex-shrink:0;
    background:conic-gradient(from 180deg,#a855f7,#3b82f6,#06b6d4,#3b82f6,#a855f7);
    padding:2.5px;
    animation:ring-hue 4s linear infinite;
  }
  @keyframes ring-hue {
    from { filter:drop-shadow(0 0 8px rgba(140,100,255,0.7)) hue-rotate(0deg); }
    to   { filter:drop-shadow(0 0 8px rgba(100,160,255,0.7)) hue-rotate(360deg); }
  }
  .avatar-inner {
    width:100%; height:100%; border-radius:50%;
    background:#1a1a3e; overflow:hidden;
    display:flex; align-items:center; justify-content:center;
    border:2px solid #06091a;
  }

  .admin-badge {
    background:linear-gradient(135deg,#f7971e 0%,#ffcc00 100%);
    color:#5c2d00; font-weight:800; font-size:12px;
    padding:7px 13px; border-radius:24px;
    display:flex; align-items:center; gap:5px;
    white-space:nowrap; flex-shrink:0;
    box-shadow:0 2px 12px rgba(247,151,30,0.5);
  }

  /* ── Responsive: very narrow (≤360px, Galaxy S8+) ── */
  @media (max-width: 360px) {
    .main-content { padding:12px 10px 28px; gap:10px; }
    .action-card-grid { padding:9px 8px; gap:3px; }
    .grid-icon { width:38px; height:38px; border-radius:10px; }
    .grid-label { font-size:12px; }
    .arrow-btn { width:24px; height:24px; font-size:15px; }
    .ac-card { border-radius:14px; }
  }
`;

export default function AdminCenter() {
  return (
    <>
      <style>{styles}</style>
      <div className="ac-root">

        {/* ── ZONE 1: Header with background image ── */}
        <div style={{
          backgroundImage: `url(${HOST_HEADER_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "14px 14px 22px",
        }}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:2}}>
            <button className="btn-nav">&#8249;</button>
            <h1 style={{fontSize:19,fontWeight:800,letterSpacing:"0.2px",margin:0,color:"#fff"}}>Admin Center</h1>
            <button className="btn-nav">&#10005;</button>
          </div>
        </div>

        {/* ── ZONE 2: Indigo base + profile card ── */}
        <div className="zone-bottom">
          <div className="profile-card" style={{ backgroundImage: `url(${PROFILE_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="card-wave"/>
            <div style={{display:"flex",alignItems:"center",gap:12,position:"relative",zIndex:1}}>
              <div className="avatar-ring">
                <div className="avatar-inner">
                  <img src={AVATAR_IMG} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                </div>
              </div>
              <div>
                <p style={{fontWeight:800,fontSize:16,margin:"0 0 4px",color:"#fff"}}>HT = Heaven place</p>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",margin:0}}>ID: 1</p>
              </div>
            </div>
            <div className="admin-badge" style={{position:"relative",zIndex:1}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#5c2d00">
                <path d="M2 19l2-8 4 4 4-8 4 8 4-4 2 8H2z"/>
              </svg>
              ADMIN
            </div>
          </div>
        </div>

        {/* ── WHITE MAIN CONTENT ── */}
        <div className="main-content">

          {/* Stats Row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="ac-card" style={{padding:14,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#4466ff,#2244cc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:800,boxShadow:"0 4px 12px rgba(68,102,255,0.35)"}}>$</div>
                <div>
                  <p style={{fontSize:22,fontWeight:800,margin:0,lineHeight:1,color:"#1a1a2e"}}>$0</p>
                  <p style={{fontSize:11,color:"#999",margin:"2px 0 0"}}>This month</p>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"flex-end",height:32,gap:2}}>
                {[4,5,4,7,5,4,9,6,8,5,10,14,10,18,22,28,18,32,20].map((h,i)=>(
                  <div key={i} className="stat-bar" style={{width:5,height:h,background:h>=30?"#7ab5ff":`rgba(100,160,255,${0.25+h*0.022})`}}/>
                ))}
              </div>
            </div>

            <div className="ac-card" style={{padding:14,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#22dd88,#1aaa66)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:800,boxShadow:"0 4px 12px rgba(34,200,130,0.35)"}}>$</div>
                <div>
                  <p style={{fontSize:22,fontWeight:800,margin:0,lineHeight:1,color:"#1a1a2e"}}>$0</p>
                  <p style={{fontSize:11,color:"#999",margin:"2px 0 0"}}>Last month</p>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"flex-end",height:32,gap:2}}>
                {[4,6,4,9,5,4,12,7,8,10,14,6,18,10,22,28,14,32,18].map((h,i)=>(
                  <div key={i} className="stat-bar" style={{width:5,height:h,background:h>=30?"#5ee8bb":`rgba(60,200,140,${0.22+h*0.022})`}}/>
                ))}
              </div>
            </div>
          </div>

          {/* Balance – full width row */}
          <div className="action-card" style={{padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <img src={ICON_BALANCE} alt="Balance" style={{width:52,height:52,borderRadius:14,objectFit:"cover",flexShrink:0}}/>
              <span style={{fontSize:16,fontWeight:700,color:"#1a1a2e"}}>Balance</span>
            </div>
            <div className="arrow-btn">›</div>
          </div>

          {/* 2×2 Action Grid – uses action-card-grid class */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>

            {/* Members List */}
            <div className="action-card-grid">
              <div className="grid-card-left">
                <img src={ICON_MEMBERS} alt="Members List" className="grid-icon"/>
                <span className="grid-label">Members<br/>List</span>
              </div>
              <div className="arrow-btn">›</div>
            </div>

            {/* Agent List */}
            <div className="action-card-grid">
              <div className="grid-card-left">
                <img src={ICON_AGENT} alt="Agent List" className="grid-icon"/>
                <span className="grid-label">Agent<br/>List</span>
              </div>
              <div className="arrow-btn">›</div>
            </div>

            {/* Invite Agent */}
            <div className="action-card-grid">
              <div className="grid-card-left">
                <img src={ICON_INV_AGENT} alt="Invite Agent" className="grid-icon"/>
                <span className="grid-label">Invite<br/>Agent</span>
              </div>
              <div className="arrow-btn">›</div>
            </div>

            {/* Invite BD */}
            <div className="action-card-grid">
              <div className="grid-card-left">
                <img src={ICON_INV_BD} alt="Invite BD" className="grid-icon"/>
                <span className="grid-label">Invite<br/>BD</span>
              </div>
              <div className="arrow-btn">›</div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}