import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AVATAR_IMG from "../../assets/ht heaven place.webp";
import eqBg from "../../assets/bd center.webp";
import profileBg from "../../assets/admin center 2.webp";
import balanceImg from "../../assets/Balance.webp";
import agentListImg from "../../assets/agent list.webp";
import inviteAgentImg from "../../assets/invite agent.webp";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  
  * { 
    box-sizing: border-box; 
    margin: 0;
    padding: 0;
  }
  
  .ac-root { 
    font-family: 'Nunito', sans-serif; 
    min-height: 100vh; 
    min-height: 100dvh;
    padding: 0; 
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
  }

  /* ── Zone Top (Header) ── */
  .zone-top { 
    position: relative; 
    overflow: hidden; 
    padding: 14px 14px 0;
    min-height: 80px;
  }

  /* ── Zone Bottom (Profile) ── */
  .zone-bottom { 
    background: linear-gradient(180deg, #141a48 0%, #0f1540 100%); 
    padding: 14px 14px 18px; 
  }

  /* ── Main Content ── */
  .main-content {
    background: #eef0f8;
    padding: 16px;
    display: flex; 
    flex-direction: column; 
    gap: 12px;
    min-height: 60vh;
    flex: 1;
    width: 100%;
  }

  /* ── Generic white card (stats) ── */
  .ac-card {
    background: #ffffff;
    border-radius: 18px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 14px rgba(100, 120, 200, 0.08);
    width: 100%;
    overflow: hidden;
  }

  /* ── Full-width action card (Balance row) ── */
  .action-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 10px rgba(100, 120, 200, 0.07);
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 14px 16px; 
    cursor: pointer; 
    transition: background 0.15s;
    min-width: 0;
    width: 100%;
  }
  .action-card:hover { 
    background: #f5f6ff; 
  }

  /* ── 2-col grid card ── */
  .action-card-grid {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 10px rgba(100, 120, 200, 0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 10px;
    cursor: pointer;
    transition: background 0.15s;
    min-width: 0;
    width: 100%;
    overflow: hidden;
    gap: 4px;
  }
  .action-card-grid:hover { 
    background: #f5f6ff; 
  }

  /* Left slot inside grid card */
  .grid-card-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
    overflow: hidden;
  }

  /* Icon box — grid card variant */
  .grid-icon-box {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    flex-shrink: 0;
    overflow: hidden;
    display: flex; 
    align-items: center; 
    justify-content: center;
  }

  /* Label — grid card */
  .grid-label {
    font-size: 13px;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.35;
    min-width: 0;
    word-break: break-word;
  }

  .stat-bar { 
    display: inline-block; 
    border-radius: 3px 3px 0 0; 
    margin: 0 1.5px; 
    width: 5px;
    transition: height 0.3s ease;
  }

  /* Arrow — fixed size, never shrinks */
  .arrow-btn {
    width: 30px; 
    height: 28px; 
    border-radius: 50%;
    background: #eef0f8; 
    border: 1px solid rgba(0, 0, 0, 0.07);
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 22px; 
    color: #aaa;
    flex-shrink: 0;
  }

  .btn-nav {
    background: rgba(255, 255, 255, 0.08); 
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #fff; 
    width: 36px; 
    height: 36px; 
    border-radius: 10px; 
    cursor: pointer;
    font-size: 20px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    flex-shrink: 0;
  }
  .btn-nav:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  /* EQ background overlay */
  .eq-bg-img {
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0;
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    opacity: 0.85; 
    pointer-events: none;
  }

  /* Profile card */
  .profile-card {
    border-radius: 16px; 
    padding: 14px 16px;
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    position: relative; 
    overflow: hidden; 
    color: #fff;
    border: 1px solid rgba(120, 100, 255, 0.35);
    box-shadow: 0 10px 40px rgba(60, 30, 180, 0.55), 0 4px 16px rgba(0, 0, 0, 0.5);
    gap: 10px;
    min-width: 0;
    width: 100%;
  }
  
  .profile-card-bg {
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0;
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    pointer-events: none;
  }

  /* Avatar glow ring */
  .avatar-ring {
    width: 66px; 
    height: 66px; 
    border-radius: 50%; 
    flex-shrink: 0;
    background: conic-gradient(from 180deg, #a855f7, #3b82f6, #06b6d4, #3b82f6, #a855f7);
    padding: 2.5px; 
    animation: ring-hue 4s linear infinite;
  }
  
  @keyframes ring-hue {
    from { 
      filter: drop-shadow(0 0 8px rgba(140, 100, 255, 0.7)) hue-rotate(0deg); 
    }
    to { 
      filter: drop-shadow(0 0 8px rgba(100, 160, 255, 0.7)) hue-rotate(360deg); 
    }
  }
  
  .avatar-inner {
    width: 100%; 
    height: 100%; 
    border-radius: 50%;
    background: #1a1a3e; 
    overflow: hidden;
    display: flex; 
    align-items: center; 
    justify-content: center;
    border: 2px solid #06091a;
  }

  /* ── Month filter dropdown enter animation ── */
  @keyframes dropIn {
    from { 
      opacity: 0; 
      transform: translateY(-6px) scale(0.97); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  .dropdown-enter { 
    animation: dropIn 0.18s ease; 
  }

  /* ── Month picker custom scrollbar ── */
  .picker-scroll::-webkit-scrollbar { 
    width: 4px; 
  }
  .picker-scroll::-webkit-scrollbar-track { 
    background: transparent; 
  }
  .picker-scroll::-webkit-scrollbar-thumb { 
    background: #d0d4f0; 
    border-radius: 4px; 
  }

  /* ── Stats Grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
  }

  /* ── Action Grid ── */
  .action-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
  }

  /* ───────────────────────────────────────────────
     RESPONSIVE BREAKPOINTS
     ─────────────────────────────────────────────── */

  /* Extra small devices (iPhone SE, older phones - 320px to 374px) */
  @media (max-width: 374px) {
    .main-content { 
      padding: 10px 8px 20px; 
      gap: 8px; 
    }

    .zone-top { 
      padding: 10px 10px 0; 
      min-height: 60px;
    }

    .zone-bottom { 
      padding: 10px 10px 14px; 
    }

    .profile-card { 
      padding: 10px 8px; 
      gap: 8px;
      border-radius: 12px;
    }
    
    .avatar-ring { 
      width: 48px; 
      height: 48px; 
    }

    .ac-card {
      border-radius: 12px;
      padding: 10px !important;
    }

    .stats-grid { 
      gap: 8px; 
    }

    .action-card-grid { 
      padding: 8px 6px; 
      gap: 3px;
      border-radius: 12px;
    }
    
    .grid-card-left { 
      gap: 5px; 
    }
    
    .grid-icon-box { 
      width: 34px; 
      height: 34px; 
      border-radius: 9px; 
    }
    
    .grid-label { 
      font-size: 11px; 
    }
    
    .arrow-btn { 
      width: 24px; 
      height: 24px; 
      font-size: 16px; 
    }

    .action-card { 
      padding: 12px 12px; 
      border-radius: 12px;
    }
    
    .btn-nav { 
      width: 30px; 
      height: 30px; 
      font-size: 16px; 
      border-radius: 8px;
    }

    .stat-bar { 
      width: 3px; 
      margin: 0 1px; 
    }
  }

  /* Small devices (Galaxy S8+, iPhone 6/7/8 - 360px to 413px) */
  @media (min-width: 360px) and (max-width: 413px) {
    .main-content { 
      padding: 12px 10px 24px; 
      gap: 10px; 
    }

    .profile-card { 
      padding: 12px 10px; 
    }
    
    .avatar-ring { 
      width: 56px; 
      height: 56px; 
    }

    .ac-card {
      padding: 12px !important;
    }

    .action-card-grid { 
      padding: 9px 8px; 
      gap: 3px; 
    }
    
    .grid-icon-box { 
      width: 40px; 
      height: 40px; 
      border-radius: 11px; 
    }
    
    .grid-label { 
      font-size: 12px; 
    }
    
    .arrow-btn { 
      width: 26px; 
      height: 26px; 
      font-size: 18px; 
    }

    .action-card { 
      padding: 13px 14px; 
    }

    .stats-grid { 
      gap: 10px; 
    }
  }

  /* Medium-small devices (iPhone XR, 11, 12/13/14 - 414px to 428px) */
  @media (min-width: 414px) and (max-width: 428px) {
    .main-content { 
      padding: 14px 12px 24px; 
    }

    .action-card-grid { 
      padding: 10px 9px; 
    }

    .grid-icon-box { 
      width: 42px; 
      height: 42px; 
    }
  }

  /* Medium devices (Large phones, small tablets - 429px to 767px) */
  @media (min-width: 429px) and (max-width: 767px) {
    .main-content { 
      padding: 16px 16px 24px; 
      gap: 14px; 
    }

    .action-card-grid { 
      padding: 12px 10px; 
    }

    .grid-icon-box { 
      width: 48px; 
      height: 48px; 
    }

    .stats-grid { 
      gap: 14px; 
    }

    .action-grid { 
      gap: 12px; 
    }
  }

  /* Tablets (768px to 1023px) */
  @media (min-width: 768px) and (max-width: 1023px) {
    .ac-root {
      max-width: 600px;
      margin: 0 auto;
    }

    .main-content { 
      padding: 20px 20px 28px; 
      gap: 16px; 
    }

    .stats-grid { 
      gap: 16px; 
    }

    .action-grid { 
      gap: 14px; 
    }

    .profile-card { 
      padding: 16px 18px; 
    }

    .avatar-ring { 
      width: 72px; 
      height: 72px; 
    }
  }

  /* Desktop and large screens (1024px and above) */
  @media (min-width: 1024px) {
    .ac-root {
      max-width: 480px;
      margin: 20px auto;
      border-radius: 20px;
      box-shadow: 0 0 60px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }

    .main-content { 
      padding: 20px 20px 32px; 
      gap: 16px; 
      max-width: 100%;
    }

    .stats-grid { 
      gap: 16px; 
    }

    .action-grid { 
      gap: 14px; 
    }
  }

  /* Landscape mode adjustments */
  @media (orientation: landscape) and (max-height: 600px) {
    .zone-top { 
      min-height: 50px; 
      padding: 8px 14px 0;
    }

    .zone-bottom { 
      padding: 10px 14px 14px; 
    }
    
    .main-content { 
      padding: 12px 14px 20px; 
      gap: 8px; 
    }
    
    .stats-grid { 
      gap: 8px; 
    }
    
    .action-grid { 
      gap: 6px; 
    }

    .profile-card { 
      padding: 10px 14px; 
    }

    .avatar-ring { 
      width: 50px; 
      height: 50px; 
    }
  }

  /* Landscape mode for tablets */
  @media (orientation: landscape) and (min-width: 768px) {
    .ac-root {
      max-width: 700px;
      margin: 0 auto;
    }
  }

  /* High DPI screens (Retina displays) */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .ac-root {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }

  /* Safe area for notched devices (iPhone X and newer) */
  @supports (padding: max(0px)) {
    .ac-root {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    
    .zone-top {
      padding-top: max(14px, env(safe-area-inset-top));
    }
    
    .main-content {
      padding-bottom: max(20px, env(safe-area-inset-bottom));
    }
  }

  /* Dark mode support (optional) */
  @media (prefers-color-scheme: dark) {
    /* Keep the design as-is or add dark mode overrides if needed */
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .avatar-ring {
      animation: none;
    }
    
    .dropdown-enter {
      animation: none;
    }
  }
`;

/* ─── helpers ─────────────────────────────────────────── */
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function lastDayOf(year, month) {
  return new Date(year, month, 0).getDate();
}

function buildMonthOptions(refYear, refMonth) {
  const options = [];
  for (let delta = -6; delta <= 6; delta++) {
    let m = refMonth + delta;
    let y = refYear;
    while (m < 1) {
      m += 12;
      y--;
    }
    while (m > 12) {
      m -= 12;
      y++;
    }
    options.push({ year: y, month: m });
  }
  return options;
}

/* ─── MonthFilter ────────────────────────────────────── */
function MonthFilter({ selectedYear, selectedMonth, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const now = new Date();
  const options = buildMonthOptions(now.getFullYear(), now.getMonth() + 1);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  const isCurrentMonth =
    selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;

  return (
    <div ref={wrapRef} className="relative self-start">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[7px] bg-white border-[1.5px] border-[rgba(68,102,255,0.18)]
                   rounded-3xl py-[7px] pr-[14px] pl-[12px] cursor-pointer font-[Nunito]
                   text-sm font-bold text-[#1a1a2e] shadow-[0_2px_10px_rgba(68,102,255,0.09)]
                   transition-all duration-150 whitespace-nowrap
                   hover:bg-[#f0f2ff] hover:border-[rgba(68,102,255,0.35)]
                   hover:shadow-[0_4px_16px_rgba(68,102,255,0.15)]"
      >
        <span className="text-base shrink-0">📅</span>

        {label}

        {isCurrentMonth && (
          <span className="text-[10px] font-extrabold bg-[#4466ff] text-white rounded-lg px-1.5 py-px ml-0.5">
            NOW
          </span>
        )}

        <span
          className={`text-[13px] text-[#7090cc] ml-0.5 transition-transform duration-200 inline-block
                      ${open ? "rotate-180" : "rotate-0"}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="dropdown-enter absolute top-[calc(100%+8px)] left-0 bg-white rounded-[18px]
                     border-[1.5px] border-[rgba(68,102,255,0.15)] shadow-[0_12px_48px_rgba(30,40,120,0.18)]
                     w-[220px] overflow-hidden z-[100]"
        >
          <div
            className="px-3.5 pt-3 pb-2 text-[11px] font-extrabold tracking-[0.08em]
                          text-gray-400 uppercase border-b border-[#f0f0f8]"
          >
            Select Month
          </div>

          <div className="picker-scroll max-h-[260px] overflow-y-auto py-1.5">
            {options.map(({ year, month }) => {
              const isSelected =
                year === selectedYear && month === selectedMonth;
              const isCurrent =
                year === now.getFullYear() && month === now.getMonth() + 1;
              return (
                <div
                  key={`${year}-${month}`}
                  onClick={() => {
                    onChange(year, month);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer
                              text-sm font-bold transition-colors duration-[120ms]
                              ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#f0f2ff] to-[#e8edff] text-[#3355dd]"
                                  : "text-[#1a1a2e] hover:bg-[#f2f4ff]"
                              }`}
                >
                  <span>
                    {MONTH_NAMES[month - 1]} {year}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {isCurrent && (
                      <span className="w-[7px] h-[7px] rounded-full bg-[#4466ff] shrink-0" />
                    )}
                    {isSelected && (
                      <span className="text-base text-[#3355dd]">✓</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BdCenterPage() {
  const navigate = useNavigate();
  const [bdDetails, setBdDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const fetchBDDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.get(
        `/bd/bd-details?year=${selectedYear}&month=${selectedMonth}`
      );

      console.log(result);

      if (result?.status) {
        setBdDetails(result.data);
      }
    } catch (error) {
      console.error("BD details error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchBDDetails();
  }, [fetchBDDetails]);

  return (
    <>
      <style>{styles}</style>
      <div className="ac-root">
        {/* ── ZONE 1: EQ image header ── */}
        <div className="zone-top">
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
            <button className="btn-nav" onClick={() => navigate(-1)}>
              &#8249;
            </button>
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
                minWidth: 0,
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
                    color: "rgba(255, 255, 255, 0.6)",
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
          {/* Month Filter */}
          <MonthFilter
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onChange={(y, m) => {
              setSelectedYear(y);
              setSelectedMonth(m);
            }}
          />

          {/* Stats Row */}
          <div className="stats-grid">
            <div className="ac-card" style={{ padding: 14, overflow: "hidden" }}>
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
                    background: "linear-gradient(135deg, #4466ff, #2244cc)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: 800,
                    boxShadow: "0 4px 12px rgba(68, 102, 255, 0.35)",
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
                      height: h,
                      background:
                        h >= 30
                          ? "#7ab5ff"
                          : `rgba(100, 160, 255, ${0.25 + h * 0.022})`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="ac-card" style={{ padding: 14, overflow: "hidden" }}>
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
                    background: "linear-gradient(135deg, #22dd88, #1aaa66)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: 800,
                    boxShadow: "0 4px 12px rgba(34, 200, 130, 0.35)",
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
                      height: h,
                      background:
                        h >= 30
                          ? "#5ee8bb"
                          : `rgba(60, 200, 140, ${0.22 + h * 0.022})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Balance — full width */}
          <div
            className="action-card"
            style={{ padding: "16px 18px", cursor: "pointer" }}
            onClick={() => navigate("/host/balance")}
          >
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
          <div className="action-grid">
            {/* Agent List */}
            <div
              className="action-card-grid"
              onClick={() => navigate("/agent/bd-center")}
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
              onClick={() => navigate("/invite/bd-center")}
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