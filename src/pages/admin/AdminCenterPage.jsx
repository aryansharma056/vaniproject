import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AVATAR_IMG     from "../../assets/ht heaven place.webp";
import ICON_BALANCE   from "../../assets/Balance.webp";
import ICON_MEMBERS   from "../../assets/menber list.webp";
import ICON_AGENT     from "../../assets/agent list.webp";
import ICON_INV_AGENT from "../../assets/invite agent.webp";
import ICON_INV_BD    from "../../assets/invite BD.webp";
import PROFILE_BG     from "../../assets/admin center 2.webp";
import HOST_HEADER_BG from "../../assets/host_header_bg.webp";

/*
  The only CSS we cannot express in Tailwind and must keep in a <style> tag:
    1. @import for Google Fonts (Tailwind has no font-import utility)
    2. @keyframes ring-hue  — custom animation with hue-rotate + drop-shadow
    3. @keyframes dropIn    — custom enter animation for the dropdown
    4. .card-wave           — repeating-linear-gradient + mask-image (no Tailwind equivalent)
    5. ::-webkit-scrollbar* — pseudo-element styles (not supported by Tailwind)
  Everything else below is pure Tailwind.
*/
const minimalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

  /* Avatar spinning glow ring */
  @keyframes ring-hue {
    from { filter: drop-shadow(0 0 8px rgba(140,100,255,0.7)) hue-rotate(0deg); }
    to   { filter: drop-shadow(0 0 8px rgba(100,160,255,0.7)) hue-rotate(360deg); }
  }
  .avatar-ring-anim { animation: ring-hue 4s linear infinite; }

  /* Dropdown enter animation */
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .dropdown-enter { animation: dropIn 0.18s ease; }

  /* Wave overlay inside profile card — repeating gradient + mask, no Tailwind equivalent */
  .card-wave {
    position: absolute; right: 0; top: 0; bottom: 0; width: 55%;
    opacity: 0.12; pointer-events: none;
    background: repeating-linear-gradient(
      90deg, transparent 0px, transparent 6px,
      rgba(200,180,255,0.6) 7px, transparent 8px
    );
    -webkit-mask-image: radial-gradient(ellipse 80% 100% at 80% 50%, black 0%, transparent 100%);
    mask-image:         radial-gradient(ellipse 80% 100% at 80% 50%, black 0%, transparent 100%);
  }

  /* Custom scrollbar inside month picker */
  .picker-scroll::-webkit-scrollbar       { width: 4px; }
  .picker-scroll::-webkit-scrollbar-track { background: transparent; }
  .picker-scroll::-webkit-scrollbar-thumb { background: #d0d4f0; border-radius: 4px; }
`;

/* ─── helpers ─────────────────────────────────────────── */
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function lastDayOf(year, month) {
  return new Date(year, month, 0).getDate();
}

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

/* ─── static bar data ────────────────────────────────── */
const BARS_FIRST_HALF  = [4,5,4,7,5,4,9,6,8,5,10,14,10,18,22];
const BARS_SECOND_HALF = [4,6,4,9,5,4,12,7,8,10,14,6,18,10,22];

/* ─── StatCard ───────────────────────────────────────── */
function StatCard({ label, bars, accentColor, accentHighlight, iconBg, iconShadow }) {
  return (
    /* ac-card → white bg, rounded-[18px], border border-black/5, shadow */
    <div className="bg-white rounded-[18px] border border-black/5 shadow-[0_2px_14px_rgba(100,120,200,0.08)] p-3.5 overflow-hidden">

      {/* icon + amount row */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-lg font-extrabold text-white"
          style={{ background: iconBg, boxShadow: iconShadow }}
        >
          $
        </div>
        <div>
          <p className="text-[22px] font-extrabold m-0 leading-none text-[#1a1a2e]">$0</p>
          <p className="text-[11px] text-gray-400 mt-0.5 mb-0">{label}</p>
        </div>
      </div>

      {/* mini bar chart */}
      <div className="flex items-end h-8 gap-0.5">
        {bars.map((h, i) => (
          <div
            key={i}
            /* stat-bar → inline-block, rounded-t, horizontal margin 1.5px */
            className="inline-block rounded-t-sm"
            style={{
              width: 5,
              height: h,
              marginLeft: 1.5,
              marginRight: 1.5,
              background:
                h >= Math.max(...bars) * 0.85
                  ? accentHighlight
                  : `rgba(${accentColor},${0.22 + h * 0.025})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── MonthFilter ────────────────────────────────────── */
function MonthFilter({ selectedYear, selectedMonth, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const now     = new Date();
  const options = buildMonthOptions(now.getFullYear(), now.getMonth() + 1);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label          = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;

  return (
    /* position:relative + alignSelf:flex-start */
    <div ref={wrapRef} className="relative self-start">

      {/* month-filter-btn */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-[7px] bg-white border-[1.5px] border-[rgba(68,102,255,0.18)]
                   rounded-3xl py-[7px] pr-[14px] pl-[12px] cursor-pointer font-[Nunito]
                   text-sm font-bold text-[#1a1a2e] shadow-[0_2px_10px_rgba(68,102,255,0.09)]
                   transition-all duration-150 whitespace-nowrap
                   hover:bg-[#f0f2ff] hover:border-[rgba(68,102,255,0.35)]
                   hover:shadow-[0_4px_16px_rgba(68,102,255,0.15)]"
      >
        {/* cal-icon */}
        <span className="text-base shrink-0">📅</span>

        {label}

        {isCurrentMonth && (
          <span className="text-[10px] font-extrabold bg-[#4466ff] text-white rounded-lg px-1.5 py-px ml-0.5">
            NOW
          </span>
        )}

        {/* chevron — rotates 180° when open */}
        <span
          className={`text-[13px] text-[#7090cc] ml-0.5 transition-transform duration-200 inline-block
                      ${open ? "rotate-180" : "rotate-0"}`}
        >
          ▾
        </span>
      </button>

      {/* month-picker-dropdown */}
      {open && (
        <div
          className="dropdown-enter absolute top-[calc(100%+8px)] left-0 bg-white rounded-[18px]
                     border-[1.5px] border-[rgba(68,102,255,0.15)] shadow-[0_12px_48px_rgba(30,40,120,0.18)]
                     w-[220px] overflow-hidden z-[100]"
        >
          {/* month-picker-header */}
          <div className="px-3.5 pt-3 pb-2 text-[11px] font-extrabold tracking-[0.08em]
                          text-gray-400 uppercase border-b border-[#f0f0f8]">
            Select Month
          </div>

          {/* month-picker-list */}
          <div className="picker-scroll max-h-[260px] overflow-y-auto py-1.5">
            {options.map(({ year, month }) => {
              const isSelected = year === selectedYear && month === selectedMonth;
              const isCurrent  = year === now.getFullYear() && month === now.getMonth() + 1;
              return (
                <div
                  key={`${year}-${month}`}
                  onClick={() => { onChange(year, month); setOpen(false); }}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer
                              text-sm font-bold transition-colors duration-[120ms]
                              ${isSelected
                                ? "bg-gradient-to-r from-[#f0f2ff] to-[#e8edff] text-[#3355dd]"
                                : "text-[#1a1a2e] hover:bg-[#f2f4ff]"
                              }`}
                >
                  <span>{MONTH_NAMES[month - 1]} {year}</span>
                  <span className="flex items-center gap-1.5">
                    {/* today-dot */}
                    {isCurrent && (
                      <span className="w-[7px] h-[7px] rounded-full bg-[#4466ff] shrink-0" />
                    )}
                    {/* check */}
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

/* ─── AdminCenter (main) ─────────────────────────────── */
export default function AdminCenter() {
  const navigate = useNavigate();
  const now      = new Date();
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const endDay = lastDayOf(selectedYear, selectedMonth);
  const label1 = `1–15`;
  const label2 = `16–${endDay}`;

  return (
    <>
      <style>{minimalStyles}</style>

      {/* ac-root — font-[Nunito] min-h-screen overflow-hidden bg-[#eef0f8] */}
      <div className="font-[Nunito] min-h-screen overflow-hidden bg-[#eef0f8]">

        {/* ── ZONE 1: Header (background image) ── */}
        <div
          className="bg-cover bg-center px-3.5 pt-3.5 pb-[22px]"
          style={{ backgroundImage: `url(${HOST_HEADER_BG})` }}
        >
          <div className="flex items-center justify-between relative z-[2]">
            {/* btn-nav */}
            <button className="bg-white/[0.08] border border-white/[0.12] text-white
                               w-9 h-9 rounded-[10px] cursor-pointer text-xl
                               flex items-center justify-center shrink-0">
              ‹
            </button>

            <h1 className="text-[19px] font-extrabold tracking-[0.2px] m-0 text-white">
              Admin Center
            </h1>

            <button className="bg-white/[0.08] border border-white/[0.12] text-white
                               w-9 h-9 rounded-[10px] cursor-pointer text-xl
                               flex items-center justify-center shrink-0">
              ✕
            </button>
          </div>
        </div>

        {/* ── ZONE 2: Profile card (dark gradient bg) ── */}
        {/* zone-bottom → background gradient */}
        <div className="bg-gradient-to-b from-[#141a48] to-[#0f1540]">

          {/* profile-card */}
          <div
            className="bg-cover bg-center rounded-2xl p-[14px_16px]
                       flex items-center justify-between relative overflow-hidden text-white
                       border border-[rgba(120,100,255,0.35)]
                       shadow-[0_10px_40px_rgba(60,30,180,0.55),0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
            style={{ backgroundImage: `url(${PROFILE_BG})` }}
          >
            {/* card-wave — kept in <style> because of mask-image */}
            <div className="card-wave" />

            {/* avatar + name */}
            <div className="flex items-center gap-3 relative z-[1]">

              {/* avatar-ring — conic-gradient + animation, both need inline style / CSS class */}
              <div
                className="avatar-ring-anim w-[66px] h-[66px] rounded-full shrink-0 p-[2.5px]"
                style={{
                  background: "conic-gradient(from 180deg,#a855f7,#3b82f6,#06b6d4,#3b82f6,#a855f7)",
                }}
              >
                {/* avatar-inner */}
                <div className="w-full h-full rounded-full bg-[#1a1a3e] overflow-hidden
                                flex items-center justify-center border-2 border-[#06091a]">
                  <img
                    src={AVATAR_IMG}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <div>
                <p className="font-extrabold text-base mb-1 mt-0 text-white">HT = Heaven place</p>
                <p className="text-[13px] text-white/60 m-0">ID: 1</p>
              </div>
            </div>

            {/* admin-badge */}
            <div
              className="relative z-[1] flex items-center gap-[5px] whitespace-nowrap shrink-0
                         text-[#5c2d00] font-extrabold text-xs px-[13px] py-[7px] rounded-3xl
                         shadow-[0_2px_12px_rgba(247,151,30,0.5)]"
              style={{ background: "linear-gradient(135deg,#f7971e 0%,#ffcc00 100%)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#5c2d00">
                <path d="M2 19l2-8 4 4 4-8 4 8 4-4 2 8H2z" />
              </svg>
              ADMIN
            </div>
          </div>
        </div>

        {/* ── WHITE MAIN CONTENT ── */}
        {/* main-content → bg-[#eef0f8] p-4 pb-8 flex flex-col gap-3 */}
        <div className="bg-[#eef0f8] px-4 pt-4 pb-8 flex flex-col gap-3">

          {/* Month Filter */}
          <MonthFilter
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onChange={(y, m) => { setSelectedYear(y); setSelectedMonth(m); }}
          />

          {/* Stats row — 2-col grid */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Balance — full-width action card */}
          {/* action-card */}
          <div className="bg-white rounded-2xl border border-black/5
                          shadow-[0_2px_10px_rgba(100,120,200,0.07)]
                          flex items-center justify-between px-[18px] py-4
                          cursor-pointer transition-colors duration-150 min-w-0
                          hover:bg-[#f5f6ff]"
           onClick = {() => navigate("/wallet")}               
                          >
            <div className="flex items-center gap-3.5">
              <img
                src={ICON_BALANCE}
                alt="Balance"
                className="w-[52px] h-[52px] rounded-[14px] object-cover shrink-0"
              />
              <span className="text-base font-bold text-[#1a1a2e]">Balance</span>
            </div>
            {/* arrow-btn */}
            <div className="w-8 h-[30px] rounded-full bg-[#eef0f8] border border-black/[0.07]
                            flex items-center justify-center text-[22px] text-gray-400 shrink-0">
              ›
            </div>
          </div>

          {/* 2×2 Action Grid */}
          <div className="grid grid-cols-2 gap-2.5">

            {/* BD List */}
            {/* action-card-grid */}
            <div
              className="bg-white rounded-2xl border border-black/5
                         shadow-[0_2px_10px_rgba(100,120,200,0.07)]
                         flex items-center justify-between p-2.5 gap-1
                         cursor-pointer transition-colors duration-150 min-w-0 overflow-hidden
                         hover:bg-[#f5f6ff]"
              onClick={() => navigate("/team")}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <img src={ICON_MEMBERS} alt="BD List"
                     className="w-11 h-11 rounded-[12px] object-cover shrink-0" />
                <span className="text-[13px] font-bold text-[#1a1a2e] leading-[1.35] min-w-0 break-words">
                  BD<br />List
                </span>
              </div>
              <div className="w-8 h-[30px] rounded-full bg-[#eef0f8] border border-black/[0.07]
                              flex items-center justify-center text-[22px] text-gray-400 shrink-0">
                ›
              </div>
            </div>

            {/* Agent List */}
            <div
              className="bg-white rounded-2xl border border-black/5
                         shadow-[0_2px_10px_rgba(100,120,200,0.07)]
                         flex items-center justify-between p-2.5 gap-1
                         cursor-pointer transition-colors duration-150 min-w-0 overflow-hidden
                         hover:bg-[#f5f6ff]"
              onClick={() => navigate("/agent")}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <img src={ICON_AGENT} alt="Agent List"
                     className="w-11 h-11 rounded-[12px] object-cover shrink-0" />
                <span className="text-[13px] font-bold text-[#1a1a2e] leading-[1.35] min-w-0 break-words">
                  Agent<br />List
                </span>
              </div>
              <div className="w-8 h-[30px] rounded-full bg-[#eef0f8] border border-black/[0.07]
                              flex items-center justify-center text-[22px] text-gray-400 shrink-0">
                ›
              </div>
            </div>

            {/* Invite Agent */}
            <div
              className="bg-white rounded-2xl border border-black/5
                         shadow-[0_2px_10px_rgba(100,120,200,0.07)]
                         flex items-center justify-between p-2.5 gap-1
                         cursor-pointer transition-colors duration-150 min-w-0 overflow-hidden
                         hover:bg-[#f5f6ff]"
              onClick={() => navigate("/invite")}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <img src={ICON_INV_AGENT} alt="Invite Agent"
                     className="w-11 h-11 rounded-[12px] object-cover shrink-0" />
                <span className="text-[13px] font-bold text-[#1a1a2e] leading-[1.35] min-w-0 break-words">
                  Invite<br />Agent
                </span>
              </div>
              <div className="w-8 h-[30px] rounded-full bg-[#eef0f8] border border-black/[0.07]
                              flex items-center justify-center text-[22px] text-gray-400 shrink-0">
                ›
              </div>
            </div>

            {/* Invite BD */}
            <div
              className="bg-white rounded-2xl border border-black/5
                         shadow-[0_2px_10px_rgba(100,120,200,0.07)]
                         flex items-center justify-between p-2.5 gap-1
                         cursor-pointer transition-colors duration-150 min-w-0 overflow-hidden
                         hover:bg-[#f5f6ff]"
              onClick={() => navigate("/invite")}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <img src={ICON_INV_BD} alt="Invite BD"
                     className="w-11 h-11 rounded-[12px] object-cover shrink-0" />
                <span className="text-[13px] font-bold text-[#1a1a2e] leading-[1.35] min-w-0 break-words">
                  Invite<br />BD
                </span>
              </div>
              <div className="w-8 h-[30px] rounded-full bg-[#eef0f8] border border-black/[0.07]
                              flex items-center justify-center text-[22px] text-gray-400 shrink-0">
                ›
              </div>
            </div>

          </div>{/* end 2×2 grid */}
        </div>{/* end main-content */}
      </div>{/* end ac-root */}
    </>
  );
}