import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MEMBERS = [
  { id: 1, name: "AYAN", uid: "2519664", hostCount: 2, coins: "3.31K", total: "0$", date: "2026-05", avatarEmoji: "🧑", avatarBg: "from-rose-400 to-red-600" },
  { id: 2, name: "ShiVikA Th", uid: "2515965", hostCount: 1, coins: "0", total: "0$", date: "2026-05", avatarEmoji: "👩", avatarBg: "from-pink-400 to-purple-500" },
  { id: 3, name: "Last Waring", uid: "2577671", hostCount: 1, coins: "6.28K", total: "0$", date: "2026-05", avatarEmoji: "🧑", avatarBg: "from-yellow-400 to-orange-500" },
  { id: 4, name: "Romantic 🦊", uid: "2485755", hostCount: 1, coins: "0", total: "0$", date: "2026-05", avatarEmoji: "🕶️", avatarBg: "from-orange-400 to-amber-600" },
  { id: 5, name: "🔥 𝗔𝗔𝗥𝗔", uid: "12567753", hostCount: 1, coins: "0", total: "0$", date: "2026-05", avatarEmoji: "🧍", avatarBg: "from-sky-400 to-blue-600" },
  { id: 6, name: "ᵞₒₒᵍMRZÛBÎ", uid: "12572577", hostCount: 2, coins: "0", total: "0$", date: "2026-05", avatarEmoji: "😎", avatarBg: "from-cyan-400 to-blue-500" },
  { id: 7, name: "Kannadiga", uid: "12573605", hostCount: 1, coins: "0", total: "0$", date: "2026-05", avatarEmoji: "🎭", avatarBg: "from-red-600 to-rose-800" },
];

function CoinIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="6"  rx="7" ry="3.2" fill="#f59e0b"/>
      <rect x="4" y="6" width="14" height="3" fill="#f59e0b"/>
      <ellipse cx="11" cy="9"  rx="7" ry="3.2" fill="#fbbf24"/>
      <rect x="4" y="9" width="14" height="3" fill="#f59e0b"/>
      <ellipse cx="11" cy="12" rx="7" ry="3.2" fill="#fcd34d"/>
    </svg>
  );
}

function MemberCard({ member }) {
  const navigate = useNavigate(); // ✅ fix: useNavigate must be called inside the component that uses it

  return (
    <div className="bg-white rounded-2xl px-3.5 py-3 shadow-sm w-full">
      {/* Top row */}
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div
          className={`w-12 h-12 sm:w-[62px] sm:h-[62px] rounded-full flex-shrink-0 bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-xl sm:text-2xl overflow-hidden`}
        >
          {member.avatarEmoji}
        </div>

        {/* Name + ID */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-extrabold text-gray-900 break-words leading-tight">
            {member.name}
          </p>
          <p className="text-[12px] sm:text-[13px] font-semibold text-gray-400 mt-0.5">
            ID: {member.uid}
          </p>
        </div>

        {/* Right badges */}
        <div className="flex items-center justify-end gap-1.5 mb-8 flex-shrink-0">
          {/* Host badge — navigates to /members on click */}
          <div
            className="border border-violet-400 rounded-full px-2.5 sm:px-3.5 py-0.5 text-[11px] sm:text-[13px] font-bold text-violet-500 whitespace-nowrap cursor-pointer active:opacity-70"
            onClick={() => navigate("/members")}
          >
            Host: {member.hostCount}
          </div>

          {/* Coins badge */}
          <div className="border border-amber-400 rounded-full px-2.5 sm:px-3 py-0.5 text-[11px] sm:text-[13px] font-bold text-amber-500 whitespace-nowrap flex items-center gap-1">
            <CoinIcon />
            {member.coins}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-end gap-4 sm:gap-7 -mt-3">
        <div className="border border-amber-400 rounded-full px-2.5 sm:px-3.5 py-0.5 text-[11px] sm:text-[13px] font-bold text-amber-500 whitespace-nowrap">
          <span className="text-gray-800 font-bold">Total: </span>
          {member.total}
        </div>
        <p className="text-[12px] sm:text-[13px] font-semibold text-gray-400">{member.date}</p>
      </div>
    </div>
  );
}

export default function AgentMembers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.uid.includes(search)
  );

  return (
    <div className="min-h-screen w-full bg-[#dce6f5] flex flex-col">

      {/* Header */}
      <div className="bg-white flex items-center justify-center px-4 py-4 relative border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 text-3xl text-gray-800 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 leading-none"
        >
          ‹
        </button>
        <h1 className="text-[18px] font-bold text-gray-900 tracking-wide">
          Agent Members
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 w-full max-w-lg mx-auto px-3.5 py-4 flex flex-col gap-3">

        {/* Search bar */}
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Please enter an account"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-full py-3 sm:py-3.5 pl-11 pr-5 text-[14px] text-gray-700 placeholder-gray-300 outline-none shadow-sm"
          />
        </div>

        {/* Cards */}
        {filtered.length > 0 ? (
          filtered.map((m) => <MemberCard key={m.id} member={m} />)
        ) : (
          <p className="text-center text-gray-400 text-sm mt-10">No members found</p>
        )}

        {/* Load more */}
        <div className="text-center pt-1 pb-4">
          <button className="text-sky-400 font-bold text-[15px] hover:opacity-70 active:opacity-50">
            Load more
          </button>
        </div>

      </div>
    </div>
  );
}