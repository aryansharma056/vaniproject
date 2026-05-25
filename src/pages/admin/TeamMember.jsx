import { useState } from "react";
import { useNavigate } from "react-router-dom";
const MEMBERS = [
  {
    id: 1,
    name: "Mr Yoshio",
    uid: "2482036",
    agentCount: 18,
    coins: "5.71M",
    total: "635$",
    date: "2026-05",
    avatarEmoji: "🎮",
    avatarBg: "from-violet-600 to-blue-600",
  },
  {
    id: 2,
    name: "ShiVikA Th",
    uid: "2515965",
    agentCount: 5,
    coins: "239.53K",
    total: "16$",
    date: "2026-05",
    avatarEmoji: "👩",
    avatarBg: "from-pink-500 to-purple-500",
  },
];

function CoinIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="6"  rx="7" ry="3.2" fill="#f59e0b"/>
      <rect x="4" y="6" width="14" height="3" fill="#f59e0b"/>
      <ellipse cx="11" cy="9"  rx="7" ry="3.2" fill="#fbbf24"/>
      <rect x="4" y="9" width="14" height="3" fill="#f59e0b"/>
      <ellipse cx="11" cy="12" rx="7" ry="3.2" fill="#fcd34d"/>
    </svg>
  );
}

function MemberCard({ member }) {
    const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Top row */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`w-14 h-14 rounded-full flex-shrink-0 bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-2xl overflow-hidden`}
        >
          {member.avatarEmoji}
        </div>

        {/* Name + ID */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-extrabold text-gray-900 truncate">{member.name}</p>
          <p className=""text-sm font-semibold text-gray-400 mt-5>ID: {member.uid}</p>
        </div>

        {/* Right badges */}
        <div className="flex items-center justify-end gap-3 mb-8">
          <div className="border border-violet-400 rounded-full px-3 py-1 text-xs font-bold text-violet-500 whitespace-nowrap"
          onClick={() => navigate("/team")}>
            Agent: {member.agentCount}
          </div>
          <div className="border border-amber-400 rounded-full px-3 py-1 text-xs font-bold text-amber-500 whitespace-nowrap flex items-center gap-1.5">
            <CoinIcon />
            {member.coins}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-end gap-7 -mt-5 ">
        <div className="border border-amber-400 rounded-full px-3 py-1 text-xs font-bold text-amber-500 whitespace-nowrap">
          <span className="text-gray-800">Total: </span>{member.total}
        </div>
        <p className="text-sm font-semibold text-gray-400">{member.date}</p>
      </div>
    </div>
  );
}

export default function TeamMembers() {
  const [search, setSearch] = useState("");

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.uid.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#dce6f5] flex flex-col">

      {/* Header */}
      <div className="bg-white flex items-center justify-center px-4 py-4 relative border-b border-gray-100">
        <button className="absolute left-4 text-2xl text-gray-800 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200">
          &#8249;
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">Team Members</h1>
      </div>

      {/* Body */}
      <div className="flex-1 px-3.5 py-4 flex flex-col gap-3.5">

        {/* Search bar */}
        <div className="relative">
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
            className="w-full bg-white rounded-full py-3.5 pl-11 pr-5 text-sm text-gray-700 placeholder-gray-300 outline-none shadow-sm"
          />
        </div>

        {/* Member Cards */}
        {filtered.length > 0 ? (
          filtered.map((m) => <MemberCard key={m.id} member={m}  />)
        ) : (
          <p className="text-center text-gray-400 text-sm mt-10">No members found</p>
        )}

        {/* Load more */}
        <div className="text-center pt-2">
          <button className="text-sky-400 font-bold text-base hover:opacity-70 active:opacity-50">
            Load more
          </button>
        </div>

      </div>
    </div>
  );
}