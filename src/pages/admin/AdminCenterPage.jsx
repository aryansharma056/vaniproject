import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AVATAR_IMG     from "../../assets/ht heaven place.webp";
import ICON_BALANCE   from "../../assets/Balance.webp";
import ICON_MEMBERS   from "../../assets/menber list.webp";
import ICON_AGENT     from "../../assets/agent list.webp";
import ICON_INV_AGENT from "../../assets/invite agent.webp";
import ICON_INV_BD    from "../../assets/invite BD.webp";
import PROFILE_BG from "../../assets/admin center 2.webp";
import HOST_HEADER_BG from "../../assets/host_header_bg.webp";


/* ─── helpers ─────────────────────────────────────────── */
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

/** Returns the last day of a given month (1-indexed) */
function lastDayOf(year, month) {
  return new Date(year, month, 0).getDate(); // month is 1-based here
}

/** Build the picker list: current month ± 6 months */
function buildMonthOptions(refYear, refMonth) {
  const options = [];
  for (let delta = -6; delta <= 6; delta++) {
    let m = refMonth + delta;
    let y = refYear;
    while (m < 1)  { m += 12; y--; }
    while (m > 12) { m -= 12; y++; }
    options.push({ year: y, month: m });
  }
  return options;
}

/* ─── static bar data (replace with real data as needed) ─ */
const BARS_FIRST_HALF  = [4,5,4,7,5,4,9,6,8,5,10,14,10,18,22];
const BARS_SECOND_HALF = [4,6,4,9,5,4,12,7,8,10,14,6,18,10,22];

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
    min-width:0;
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
    padding:10px 10px;
    cursor:pointer;
    transition:background .15s;
    min-width:0;
    overflow:hidden;
    gap:4px;
  }
  .action-card-grid:hover { background:#f5f6ff; }

  .grid-card-left {
    display:flex; align-items:center; gap:8px;
    min-width:0; flex:1; overflow:hidden;
  }
  .grid-icon {
    width:44px; height:44px; border-radius:12px;
    object-fit:cover; flex-shrink:0;
  }
  .grid-label {
    font-size:13px; font-weight:700; color:#1a1a2e;
    line-height:1.35; min-width:0; word-break:break-word;
  }

  .stat-bar { display:inline-block; border-radius:3px 3px 0 0; margin:0 1.5px; }

  .arrow-btn {
    width:32px; height:30px; border-radius:50%;
    background:#eef0f8; border:1px solid rgba(0,0,0,0.07);
    display:flex; align-items:center; justify-content:center;
    font-size:22px; color:#aaa; flex-shrink:0;
  }

  .btn-nav {
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);
    color:#fff; width:36px; height:36px; border-radius:10px; cursor:pointer;
    font-size:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  /* Profile card */
  .profile-card {
    background:transparent; border-radius:16px; padding:14px 16px;
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

  /* ── Month filter button ── */
  .month-filter-btn {
    display:flex; align-items:center; gap:7px;
    background:#fff; border:1.5px solid rgba(68,102,255,0.18);
    border-radius:24px; padding:7px 14px 7px 12px;
    cursor:pointer; font-family:'Nunito',sans-serif;
    font-size:14px; font-weight:700; color:#1a1a2e;
    box-shadow:0 2px 10px rgba(68,102,255,0.09);
    transition:all .15s; white-space:nowrap;
    align-self:flex-start;
  }
  .month-filter-btn:hover {
    background:#f0f2ff;
    border-color:rgba(68,102,255,0.35);
    box-shadow:0 4px 16px rgba(68,102,255,0.15);
  }
  .month-filter-btn .cal-icon {
    font-size:16px; flex-shrink:0;
  }
  .month-filter-btn .chevron {
    font-size:13px; color:#7090cc; margin-left:2px;
    transition:transform .2s;
  }
  .month-filter-btn.open .chevron { transform:rotate(180deg); }

  /* ── Month picker dropdown ── */
  .month-picker-overlay {
    position:fixed; inset:0; z-index:50;
  }
  .month-picker-dropdown {
    position:absolute; top:calc(100% + 8px); left:0;
    background:#fff; border-radius:18px;
    border:1.5px solid rgba(68,102,255,0.15);
    box-shadow:0 12px 48px rgba(30,40,120,0.18);
    width:220px; overflow:hidden; z-index:100;
    animation:dropIn .18s ease;
  }
  @keyframes dropIn {
    from { opacity:0; transform:translateY(-6px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  .month-picker-header {
    padding:12px 14px 8px;
    font-size:11px; font-weight:800; letter-spacing:0.08em;
    color:#999; text-transform:uppercase;
    border-bottom:1px solid #f0f0f8;
  }
  .month-picker-list {
    max-height:260px; overflow-y:auto;
    padding:6px 0;
  }
  .month-picker-list::-webkit-scrollbar { width:4px; }
  .month-picker-list::-webkit-scrollbar-track { background:transparent; }
  .month-picker-list::-webkit-scrollbar-thumb { background:#d0d4f0; border-radius:4px; }
  .month-picker-item {
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 16px; cursor:pointer; font-size:14px;
    font-weight:700; color:#1a1a2e; transition:background .12s;
  }
  .month-picker-item:hover { background:#f2f4ff; }
  .month-picker-item.selected {
    background:linear-gradient(90deg,#f0f2ff,#e8edff);
    color:#3355dd;
  }
  .month-picker-item .check { color:#3355dd; font-size:16px; }
  .month-picker-item .today-dot {
    width:7px; height:7px; border-radius:50%;
    background:#4466ff; flex-shrink:0;
  }

  /* ── Responsive ── */
  @media (max-width: 360px) {
    .main-content { padding:12px 10px 28px; gap:10px; }
    .action-card-grid { padding:9px 8px; gap:3px; }
    .grid-icon { width:38px; height:38px; border-radius:10px; }
    .grid-label { font-size:12px; }
    .arrow-btn { width:24px; height:24px; font-size:15px; }
    .ac-card { border-radius:14px; }
    .month-filter-btn { font-size:13px; padding:6px 11px 6px 10px; }
  }
`;

/* ─── Stat Card Component ──────────────────────────────── */
function StatCard({ label, bars, accentColor, accentHighlight, iconBg, iconShadow }) {
  return (
    <div className="ac-card" style={{ padding:14, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{
          width:40, height:40, borderRadius:"50%", flexShrink:0,
          background:iconBg, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:18, color:"#fff", fontWeight:800,
          boxShadow:iconShadow
        }}>$</div>
        <div>
          <p style={{ fontSize:22, fontWeight:800, margin:0, lineHeight:1, color:"#1a1a2e" }}>$0</p>
          <p style={{ fontSize:11, color:"#999", margin:"2px 0 0" }}>{label}</p>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"flex-end", height:32, gap:2 }}>
        {bars.map((h, i) => (
          <div key={i} className="stat-bar" style={{
            width: 5, height: h,
            background: h >= Math.max(...bars) * 0.85
              ? accentHighlight
              : `rgba(${accentColor},${0.22 + h * 0.025})`
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── Month Filter Button + Picker ─────────────────────── */
function MonthFilter({ selectedYear, selectedMonth, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const now = new Date();
  const options = buildMonthOptions(now.getFullYear(), now.getMonth() + 1);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;

  return (
    <div ref={wrapRef} style={{ position:"relative", alignSelf:"flex-start" }}>
      <button
        className={`month-filter-btn${open ? " open" : ""}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className="cal-icon">📅</span>
        {label}
        {isCurrentMonth && (
          <span style={{
            fontSize:10, fontWeight:800, background:"#4466ff", color:"#fff",
            borderRadius:8, padding:"1px 6px", marginLeft:2
          }}>NOW</span>
        )}
        <span className="chevron">▾</span>
      </button>

      {open && (
        <div className="month-picker-dropdown">
          <div className="month-picker-header">Select Month</div>
          <div className="month-picker-list">
            {options.map(({ year, month }) => {
              const isSelected = year === selectedYear && month === selectedMonth;
              const isCurrent  = year === now.getFullYear() && month === now.getMonth() + 1;
              return (
                <div
                  key={`${year}-${month}`}
                  className={`month-picker-item${isSelected ? " selected" : ""}`}
                  onClick={() => { onChange(year, month); setOpen(false); }}
                >
                  <span>{MONTH_NAMES[month - 1]} {year}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                    {isCurrent && <span className="today-dot"/>}
                    {isSelected && <span className="check">✓</span>}
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

/* ─── Main Component ────────────────────────────────────── */
export default function AdminCenter() {
  const navigate =useNavigate();
  const now = new Date();
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  // Derive half-month labels dynamically
  const endDay = lastDayOf(selectedYear, selectedMonth); // e.g. 28/30/31
  const label1 = `1–15`;
  const label2 = `16–${endDay}`;

  return (
    <>
      <style>{styles}</style>
      <div className="ac-root">

        {/* ── ZONE 1: Header ── */}
        <div style={{
          backgroundImage:`url(${HOST_HEADER_BG})`,
          backgroundSize:"cover", backgroundPosition:"center",
          padding:"14px 14px 22px",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:2 }}>
            <button className="btn-nav">&#8249;</button>
            <h1 style={{ fontSize:19, fontWeight:800, letterSpacing:"0.2px", margin:0, color:"#fff" }}>Admin Center</h1>
            <button className="btn-nav">&#10005;</button>
          </div>
        </div>

        {/* ── ZONE 2: Profile card ── */}
        <div className="zone-bottom">
          <div className="profile-card" style={{ backgroundImage:`url(${PROFILE_BG})`, backgroundSize:"cover", backgroundPosition:"center" }}>
            <div className="card-wave"/>
            <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative", zIndex:1 }}>
              <div className="avatar-ring">
                <div className="avatar-inner">
                  <img src={AVATAR_IMG} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }}/>
                </div>
              </div>
              <div>
                <p style={{ fontWeight:800, fontSize:16, margin:"0 0 4px", color:"#fff" }}>HT = Heaven place</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:0 }}>ID: 1</p>
              </div>
            </div>
            <div className="admin-badge" style={{ position:"relative", zIndex:1 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#5c2d00">
                <path d="M2 19l2-8 4 4 4-8 4 8 4-4 2 8H2z"/>
              </svg>
              ADMIN
            </div>
          </div>
        </div>

        {/* ── WHITE MAIN CONTENT ── */}
        <div className="main-content">

          {/* ── Month Filter ── */}
          <MonthFilter
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onChange={(y, m) => { setSelectedYear(y); setSelectedMonth(m); }}
          />

          {/* ── Stats Row ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <StatCard
              label={label1}
              bars={BARS_FIRST_HALF}
              accentColor="100,160,255"
              accentHighlight="#7ab5ff"
              iconBg="linear-gradient(135deg,#4466ff,#2244cc)"
              iconShadow="0 4px 12px rgba(68,102,255,0.35)"
            />
            <StatCard
              label={label2}
              bars={BARS_SECOND_HALF}
              accentColor="60,200,140"
              accentHighlight="#5ee8bb"
              iconBg="linear-gradient(135deg,#22dd88,#1aaa66)"
              iconShadow="0 4px 12px rgba(34,200,130,0.35)"
            />
          </div>

          {/* Balance – full width */}
          <div className="action-card" style={{ padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <img src={ICON_BALANCE} alt="Balance" style={{ width:52, height:52, borderRadius:14, objectFit:"cover", flexShrink:0 }}/>
              <span style={{ fontSize:16, fontWeight:700, color:"#1a1a2e" }}>Balance</span>
            </div>
            <div className="arrow-btn">›</div>
          </div>

          {/* 2×2 Action Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
       <div
  className="action-card-grid"
  onClick={() => navigate("/team")}
>
  <div className="grid-card-left">
    <img src={ICON_MEMBERS} alt="BD List" className="grid-icon"/>
    <span className="grid-label">
      BD<br/>List
    </span>
  </div>

  <div className="arrow-btn">›</div>
</div>
            <div 
              className="action-card-grid"
              onClick={() => navigate("/agent")}
            >
              <div className="grid-card-left">
                <img src={ICON_AGENT} alt="Agent List" className="grid-icon"/>
                <span className="grid-label">Agent<br/>List</span>
              </div>
              <div className="arrow-btn">›</div>
            </div>
            <div className="action-card-grid">
              <div className="grid-card-left">
                <img src={ICON_INV_AGENT} alt="Invite Agent" className="grid-icon"/>
                <span className="grid-label">Invite<br/>Agent</span>
              </div>
              <div className="arrow-btn">›</div>
            </div>
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