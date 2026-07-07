import {
  useState,
  useEffect,
} from "react";

import { useNavigate }
from "react-router-dom";

import api from "../../services/api";
import AVATAR_IMG from "../../assets/ht heaven place.webp";

import eqBg from "../../assets/bd center.webp";
import profileBg from "../../assets/admin center 2.webp";
import balanceImg from "../../assets/Balance.webp";
import agentListImg from "../../assets/agent list.webp";
import inviteAgentImg from "../../assets/invite agent.webp";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; }
  .ac-root { font-family:'Nunito',sans-serif; min-height:100vh; padding:0; overflow:hidden; }

  .zone-top    { position:relative; overflow:hidden; padding:14px 14px 0; }
  .zone-bottom { background:linear-gradient(180deg,#141a48 0%,#0f1540 100%); padding:14px 14px 18px; }

  .main-content {
    background:#eef0f8;
    padding:16px;
    display:flex; flex-direction:column; gap:12px;
    min-height:60vh;
  }

  /* ── Generic white card (stats) ── */
  .ac-card {
    background:#ffffff;
    border-radius:18px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 14px rgba(100,120,200,0.08);
  }

  /* ── Full-width action card (Balance row) ── */
  .action-card {
    background:#ffffff;
    border-radius:16px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 10px rgba(100,120,200,0.07);
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 16px; cursor:pointer; transition:background .15s;
    min-width:0;
  }
  .action-card:hover { background:#f5f6ff; }

  /* ── 2-col grid card ── */
  .action-card-grid {
    background:#ffffff;
    border-radius:16px;
    border:1px solid rgba(0,0,0,0.05);
    box-shadow:0 2px 10px rgba(100,120,200,0.07);
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:11px 10px;
    cursor:pointer;
    transition:background .15s;
    min-width:0;      /* never blow out the grid column */
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

  /* Icon box — grid card variant */
  .grid-icon-box {
    width:46px;
    height:46px;
    border-radius:13px;
    flex-shrink:0;
    overflow:hidden;
    display:flex; align-items:center; justify-content:center;
  }

  /* Label — grid card */
  .grid-label {
    font-size:13px;
    font-weight:700;
    color:#1a1a2e;
    line-height:1.35;
    min-width:0;
    word-break:break-word;
  }

  .stat-bar  { display:inline-block; border-radius:3px 3px 0 0; margin:0 1.5px; }

  /* Arrow — fixed size, never shrinks */
  .arrow-btn {
    width:30px; height:28px; border-radius:50%;
    background:#eef0f8; border:1px solid rgba(0,0,0,0.07);
    display:flex; align-items:center; justify-content:center;
    font-size:22px; color:#aaa;
    flex-shrink:0;   /* KEY */
  }

  .btn-nav {
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);
    color:#fff; width:36px; height:36px; border-radius:10px; cursor:pointer;
    font-size:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  /* EQ background overlay */
  .eq-bg-img {
    position:absolute; top:0; left:0; right:0; bottom:0;
    width:100%; height:100%; object-fit:cover; opacity:0.85; pointer-events:none;
  }

  /* Profile card */
  .profile-card {
    border-radius:16px; padding:14px 16px;
    display:flex; align-items:center; justify-content:space-between;
    position:relative; overflow:hidden; color:#fff;
    border:1px solid rgba(120,100,255,0.35);
    box-shadow:0 10px 40px rgba(60,30,180,0.55),0 4px 16px rgba(0,0,0,0.5);
    gap:10px;
    min-width:0;
  }
  .profile-card-bg {
    position:absolute; top:0; left:0; right:0; bottom:0;
    width:100%; height:100%; object-fit:cover; pointer-events:none;
  }

  /* Avatar glow ring */
  .avatar-ring {
    width:66px; height:66px; border-radius:50%; flex-shrink:0;
    background:conic-gradient(from 180deg,#a855f7,#3b82f6,#06b6d4,#3b82f6,#a855f7);
    padding:2.5px; animation:ring-hue 4s linear infinite;
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

  /* ── Responsive: Galaxy S8+ (≤ 360px) ── */
  @media (max-width: 360px) {
    .main-content          { padding:12px 10px 28px; gap:10px; }

    /* profile */
    .profile-card          { padding:12px 10px; }
    .avatar-ring           { width:56px; height:56px; }

    /* grid cards */
    .action-card-grid      { padding:9px 8px; gap:3px; }
    .grid-icon-box         { width:40px; height:40px; border-radius:11px; }
    .grid-label            { font-size:12px; }
    .arrow-btn             { width:24px; height:24px; font-size:14px; }

    /* balance card */
    .action-card           { padding:13px 14px; }
  }

  /* ── Very small fallback (≤ 320px) ── */
  @media (max-width: 320px) {
    .grid-icon-box  { width:34px; height:34px; }
    .grid-label     { font-size:11px; }
    .avatar-ring    { width:48px; height:48px; }
  }
`;

export default function BdCenterPage() {
  const navigate =
  useNavigate();
  const [bdDetails, setBdDetails] = useState(null);
  useEffect(() => {
    const fetchBDDetails = async () => {
      try {
        const result = await api.get("/bd/bd-details");

        console.log(result);

        if (result?.status) {
          setBdDetails(result.data);
        }
      } catch (error) {
        console.error("BD details error:", error);
      }
    };

    fetchBDDetails();
  }, []);
  return (
    <>
      <style>{styles}</style>
      <div className="ac-root">
        {/* ── ZONE 1: EQ image header ── */}
        <div className="zone-top" style={{ minHeight: 80 }}>
          <img src={eqBg} className="eq-bg-img" alt="" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 2,
            }}
          >
            <button className="btn-nav">&#8249;</button>
            <button className="btn-nav">&#10005;</button>
          </div>
        </div>

        {/* ── ZONE 2: Profile card ── */}
        <div className="zone-bottom">
          <div className="profile-card">
            <img src={profileBg} className="profile-card-bg" alt="" />

            {/* Avatar + info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                position: "relative",
                zIndex: 1,
                flex: 1,
                minWidth: 0 /* allows info block to compress */,
              }}
            >
              <div className="avatar-ring">
                <div className="avatar-inner">
                  <img
                    src={bdDetails?.image || AVATAR_IMG}
                    alt="profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = AVATAR_IMG;
                    }}
                  />
                </div>
              </div>

              {/* text — min-width:0 lets it yield space */}
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    margin: "0 0 4px",
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {bdDetails?.name || "BD Center"}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    margin: 0,
                  }}
                >
                  ID: {bdDetails?.uid || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHITE MAIN CONTENT ── */}
        <div className="main-content">
          {/* Stats Row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              className="ac-card"
              style={{ padding: 14, overflow: "hidden" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#4466ff,#2244cc)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: 800,
                    boxShadow: "0 4px 12px rgba(68,102,255,0.35)",
                  }}
                >
                  $
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      margin: 0,
                      lineHeight: 1,
                      color: "#1a1a2e",
                    }}
                  >
                    $0
                  </p>
                  <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>
                    This month
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  height: 32,
                  gap: 2,
                }}
              >
                {[
                  4, 5, 4, 7, 5, 4, 9, 6, 8, 5, 10, 14, 10, 18, 22, 28, 18, 32,
                  20,
                ].map((h, i) => (
                  <div
                    key={i}
                    className="stat-bar"
                    style={{
                      width: 5,
                      height: h,
                      background:
                        h >= 30
                          ? "#7ab5ff"
                          : `rgba(100,160,255,${0.25 + h * 0.022})`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              className="ac-card"
              style={{ padding: 14, overflow: "hidden" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#22dd88,#1aaa66)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: 800,
                    boxShadow: "0 4px 12px rgba(34,200,130,0.35)",
                  }}
                >
                  $
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      margin: 0,
                      lineHeight: 1,
                      color: "#1a1a2e",
                    }}
                  >
                    $0
                  </p>
                  <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>
                    Last month
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  height: 32,
                  gap: 2,
                }}
              >
                {[
                  4, 6, 4, 9, 5, 4, 12, 7, 8, 10, 14, 6, 18, 10, 22, 28, 14, 32,
                  18,
                ].map((h, i) => (
                  <div
                    key={i}
                    className="stat-bar"
                    style={{
                      width: 5,
                      height: h,
                      background:
                        h >= 30
                          ? "#5ee8bb"
                          : `rgba(60,200,140,${0.22 + h * 0.022})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Balance — full width */}
          <div className="action-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  flexShrink: 0,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={balanceImg}
                  alt="Balance"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>
                Balance
              </span>
            </div>
            <div className="arrow-btn">›</div>
          </div>

          {/* 2-col grid */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {/* Agent List */}
            <div
  className="action-card-grid"
  onClick={() =>
   navigate(
  "/agent/bd-center"
)
  }
>
              <div className="grid-card-left">
                <div className="grid-icon-box">
                  <img
                    src={agentListImg}
                    alt="Agent List"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <span className="grid-label">
                  Agent
                  <br />
                  List
                </span>
              </div>
              <div className="arrow-btn">›</div>
            </div>

            {/* Invite Agent */}
            <div
  className="action-card-grid"
  onClick={() =>
   navigate(
  "/invite/bd-center"
)
  }
>
              <div className="grid-card-left">
                <div className="grid-icon-box">
                  <img
                    src={inviteAgentImg}
                    alt="Invite Agent"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <span className="grid-label">
                  Invite
                  <br />
                  Agent
                </span>
              </div>
              <div className="arrow-btn">›</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
