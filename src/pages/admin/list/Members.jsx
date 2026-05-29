// pages/TeamMembers.jsx
// ─────────────────────────────────────────────────────────────
// HOW TO USE IN YOUR ROUTER (App.jsx or router file):
//
//   import TeamMembers from "./pages/TeamMembers";
//
//   <Route path="/team-members" element={<TeamMembers />} />
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── MOCK DATA ─────────────────────────────────────────────────
const MOCK_MEMBERS = [
  {
    id: 1, name: "Mr Yoshio", uid: "2482036", agentCount: 9,
    coins: "5.71M", total: "635$", date: "2026-05",
    avatarEmoji: "🎮", avatarBg: "from-violet-600 to-blue-600", status: "Agent",
  },
  {
    id: 2, name: "ShiVikA Th", uid: "2515965", agentCount: 5,
    coins: "239.53K", total: "16$", date: "2026-05",
    avatarEmoji: "👩", avatarBg: "from-pink-500 to-purple-500", status: "Member",
  },
  {
    id: 3, name: "Mr Yash", uid: "5482036", agentCount: 15,
    coins: "4.91M", total: "710$", date: "2026-05",
    avatarEmoji: "🦊", avatarBg: "from-orange-500 to-amber-500", status: "Agent",
  },
  {
    id: 4, name: "tirth", uid: "5545965", agentCount: 2,
    coins: "321.13K", total: "19$", date: "2026-05",
    avatarEmoji: "🔥", avatarBg: "from-red-500 to-pink-500", status: "Member",
  },
];

async function fetchMembers() {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MEMBERS), 600));
}

// ── COIN ICON ─────────────────────────────────────────────────
function CoinIcon({ size = 14 }) {
  return (
    <svg
      style={{ width: size, height: size, flexShrink: 0 }}
      viewBox="0 0 22 22"
      fill="none"
    >
      <ellipse cx="11" cy="6"  rx="7" ry="3.2" fill="#f59e0b"/>
      <rect    x="4"  y="6"  width="14" height="3" fill="#f59e0b"/>
      <ellipse cx="11" cy="9"  rx="7" ry="3.2" fill="#fbbf24"/>
      <rect    x="4"  y="9"  width="14" height="3" fill="#f59e0b"/>
      <ellipse cx="11" cy="12" rx="7" ry="3.2" fill="#fcd34d"/>
    </svg>
  );
}

// ── SKELETON ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 sm:w-14 sm:h-14" />
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="h-3.5 bg-gray-200 rounded-full w-2/5" />
          <div className="h-3 bg-gray-100 rounded-full w-1/4" />
        </div>
        <div className="flex flex-col gap-2 items-end flex-shrink-0">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-14" />
        </div>
      </div>
    </div>
  );
}

// ── BOTTOM SHEET ──────────────────────────────────────────────
function BottomSheet({ member, onClose, onViewDetails }) {
  const [stage, setStage] = useState(1);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (member) {
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    }
  }, [member]);

  const dismiss = () => {
    setAnimateIn(false);
    setTimeout(() => { onClose(); setStage(1); }, 280);
  };

  const goToDetails = () => {
    setAnimateIn(false);
    setTimeout(() => { onViewDetails(member); setStage(1); }, 280);
  };

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: animateIn ? 0.45 : 0 }}
        onClick={dismiss}
      />
      <div
        className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col transition-all duration-300 ease-out"
        style={{
          height: stage === 1 ? "22%" : "52%",
          minHeight: stage === 1 ? 140 : 320,
          maxHeight: "90vh",
          transform: animateIn ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {stage === 1 ? (
          <div className="flex flex-col flex-1">
            <button
              onClick={() => setStage(2)}
              className="flex-1 flex items-center justify-center text-sm font-bold text-gray-900 border-b border-gray-100 active:bg-gray-50"
            >
              Member Details
            </button>
            <button
              onClick={dismiss}
              className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-400 active:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <h2 className="text-center text-sm font-bold text-gray-900 py-3 border-b border-gray-100 flex-shrink-0">
              Details
            </h2>
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-lg flex-shrink-0`}
                >
                  {member.avatarEmoji}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-extrabold text-gray-900 truncate">{member.name}</p>
                    {member.status === "Agent" && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Agent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-semibold">ID: {member.uid}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-violet-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-violet-400 font-semibold mb-1">Agents</p>
                  <p className="text-sm font-extrabold text-violet-700">{member.agentCount}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-2.5 flex flex-col">
                  <p className="text-[10px] text-amber-400 font-semibold mb-1">Coins</p>
                  <div className="flex items-center gap-1">
                    <CoinIcon />
                    <p className="text-sm font-extrabold text-amber-600">{member.coins}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-2.5 col-span-2">
                  <p className="text-[10px] text-green-400 font-semibold mb-1">Total Earned</p>
                  <p className="text-sm font-extrabold text-green-700">{member.total}</p>
                </div>
              </div>

              <button
                onClick={goToDetails}
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl text-sm active:bg-blue-600"
              >
                View Full Teammate Detail →
              </button>
            </div>

            <button
              onClick={dismiss}
              className="flex-shrink-0 py-3 text-sm font-semibold text-gray-400 border-t border-gray-100 active:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MEMBER CARD ───────────────────────────────────────────────
function MemberCard({ member, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl p-3 shadow-sm active:scale-[0.98] transition-transform cursor-pointer sm:p-4"
      onClick={() => onClick(member)}
    >
      {/* Top row: avatar + name + pills */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        {/* Avatar */}
        <div
          className={`w-11 h-11 rounded-full flex-shrink-0 bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-xl sm:w-14 sm:h-14 sm:text-2xl`}
        >
          {member.avatarEmoji}
        </div>

        {/* Name + ID */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-extrabold text-gray-900 truncate sm:text-base">
              {member.name}
            </p>
            {member.status === "Agent" && (
              <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 sm:text-[10px] sm:px-2">
                Agent
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            ID: {member.uid}
          </p>
        </div>

        {/* Right pills: Agent count + Coins */}
        <div className="flex items-center justify-end gap-1.5 mb-8 flex-shrink-0">
          <div className="border border-violet-400 rounded-full px-2 py-0.5 flex items-center gap-1 whitespace-nowrap">
            <span className="text-[10px] font-bold text-violet-600 sm:text-xs">
              Agent: {member.agentCount}
            </span>
          </div>
          <div className="border border-amber-400 rounded-full px-2 py-0.5 flex items-center gap-1 whitespace-nowrap">
            <CoinIcon size={12} />
            <span className="text-[10px] font-bold text-amber-500 sm:text-xs">
              {member.coins}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: Total + Date */}
      <div className="flex items-center justify-end gap-4 sm:gap-7 -mt-3">
        <div className="border border-amber-400 rounded-full px-2.5 py-0.5 whitespace-nowrap">
          <span className="text-[10px] font-bold text-gray-800 sm:text-xs">Total: </span>
          <span className="text-[10px] font-bold text-amber-500 sm:text-xs">{member.total}</span>
        </div>
        <p className="text-xs font-semibold text-gray-400">{member.date}</p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function TeamMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMembers()
      .then((data) => setMembers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.uid.includes(search)
  );

  const handleViewDetails = (member) => {
    navigate(`/teammate/${member.uid}`);
  };

  const retry = () => {
    setLoading(true);
    fetchMembers()
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#dce6f5] flex flex-col">
      {/* Header */}
      <div className="bg-white flex items-center justify-center px-4 py-3.5 relative border-b border-gray-100 sm:py-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 text-2xl text-gray-800 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 sm:left-4"
          aria-label="Go back"
        >
          &#8249;
        </button>
        <h1 className="text-[18px] font-bold text-gray-900 tracking-wide">
          Team Members
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-3.5 flex flex-col gap-3 sm:px-3.5 sm:py-4 sm:gap-3.5">
        {/* Search bar */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none sm:left-4">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#bbb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Please enter an account"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-full py-3 pl-10 pr-5 text-sm text-gray-700 placeholder-gray-300 outline-none shadow-sm sm:py-3.5 sm:pl-11"
          />
        </div>

        {/* Loading */}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-500 font-semibold text-sm">{error}</p>
            <button
              onClick={retry}
              className="mt-2 text-blue-500 font-bold text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">
            No members found
          </p>
        )}

        {/* List */}
        {!loading && !error && filtered.map((m) => (
          <MemberCard key={m.id} member={m} onClick={setSelectedMember} />
        ))}

        {/* Load more */}
        {!loading && !error && filtered.length > 0 && (
          <div className="text-center pt-1 pb-4">
            <button className="text-sky-400 font-bold text-sm hover:opacity-70 active:opacity-50 sm:text-base">
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      {selectedMember && (
        <BottomSheet
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}