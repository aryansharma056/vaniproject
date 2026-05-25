// pages/TeammateDetail.jsx
// ─────────────────────────────────────────────────────────────
// HOW TO USE IN YOUR ROUTER (App.jsx or router file):
//
//   import TeammateDetail from "./pages/TeammateDetail";
//
//   <Route path="/team-members/:uid" element={<TeammateDetail />} />
//
// The :uid comes from the URL automatically via useParams().
// When TeamMembers navigates: navigate(`/team-members/${member.uid}`)
// this page reads it and fetches that member's details.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ── MOCK DATA (remove when real API is ready) ─────────────────
const MOCK_DETAIL = {
  uid: "2482036",
  name: "Mr Yoshio",
  status: "Agent",
  avatarEmoji: "🎮",
  avatarBg: "from-violet-600 to-blue-600",
  monthlyStats: [
    {
      month: "2026-05", target: 4054, duration: "09h32m",
      targetLv: 0, salary: "$0", settled: false,
      daily: [
        { date: "2026-05-20", duration: "00h51m", target: 0 },
        { date: "2026-05-19", duration: "00h49m", target: 0 },
        { date: "2026-05-18", duration: "00h03m", target: 3 },
        { date: "2026-05-15", duration: "00h04m", target: 0 },
      ],
    },
    {
      month: "2026-04", target: 830, duration: "06h29m",
      targetLv: 0, salary: "$0", settled: true,
      daily: [
        { date: "2026-04-30", duration: "00h51m", target: 0 },
        { date: "2026-04-29", duration: "00h49m", target: 0 },
        { date: "2026-04-28", duration: "00h03m", target: 3 },
        { date: "2026-04-27", duration: "00h04m", target: 0 },
        { date: "2026-04-24", duration: "57s",    target: 0 },
        { date: "2026-04-23", duration: "51s",    target: 0 },
        { date: "2026-04-22", duration: "00h11m", target: 0 },
        { date: "2026-04-21", duration: "00h04m", target: 0 },
        { date: "2026-04-20", duration: "00h23m", target: 0 },
        { date: "2026-04-19", duration: "00h23m", target: 0 },
        { date: "2026-04-18", duration: "00h16m", target: 0 },
        { date: "2026-04-17", duration: "00h14m", target: 506 },
        { date: "2026-04-16", duration: "01h14m", target: 20 },
        { date: "2026-04-15", duration: "00h56m", target: 53 },
        { date: "2026-04-11", duration: "00h02m", target: 0 },
      ],
    },
    {
      month: "2026-03", target: 10891, duration: "03h41m",
      targetLv: 0, salary: "$0", settled: true,
      daily: [
        { date: "2026-03-28", duration: "01h10m", target: 500 },
        { date: "2026-03-20", duration: "00h45m", target: 300 },
      ],
    },
    {
      month: "2026-02", target: 148, duration: "09h54m",
      targetLv: 0, salary: "$0", settled: true,
      daily: [
        { date: "2026-02-14", duration: "00h30m", target: 148 },
      ],
    },
  ],
};

// ── API FUNCTION (swap mock with real fetch when ready) ───────
async function fetchTeammateDetail(uid) {
  // TODO: replace with real API call
  // const res = await fetch(`https://your-api.com/api/members/${uid}/details`);
  // if (!res.ok) throw new Error("Failed to fetch member details");
  // return res.json();

  // MOCK: simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve({ ...MOCK_DETAIL, uid }), 700));
}

// ── SKELETON LOADERS ──────────────────────────────────────────
function SkeletonProfile() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-3">
      <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 bg-gray-200 rounded-full w-1/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/4" />
      </div>
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
      </div>
      <div className="h-3 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
    </div>
  );
}

// ── MONTHLY STAT CARD ─────────────────────────────────────────
function MonthStatCard({ stat }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-blue-500 font-extrabold text-base">{stat.month}</span>
        <span className={`text-white text-xs font-bold px-4 py-1.5 rounded-full ${stat.settled ? "bg-emerald-500" : "bg-blue-500"}`}>
          {stat.settled ? "Settled" : "Unsettled"}
        </span>
      </div>

      <div className="flex gap-6 mt-0.5">
        <p className="text-sm font-semibold text-gray-700">
          Target: <span className="text-amber-500 font-extrabold">{stat.target}</span>
        </p>
        <p className="text-sm font-semibold text-gray-700">
          Duration: <span className="text-amber-500 font-extrabold">{stat.duration}</span>
        </p>
      </div>
      <div className="flex gap-6">
        <p className="text-sm font-semibold text-gray-700">
          Target LV: <span className="text-amber-500 font-extrabold">{stat.targetLv}</span>
        </p>
        <p className="text-sm font-semibold text-gray-700">
          Salary: <span className="text-amber-500 font-extrabold">{stat.salary}</span>
        </p>
      </div>

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-blue-500 text-sm font-semibold text-left mt-0.5"
      >
        {expanded ? "Hide details <<" : "See more details>>"}
      </button>

      {/* Daily breakdown table */}
      {expanded && (
        <div className="mt-1 rounded-xl overflow-hidden border border-gray-100">
          {/* Table header */}
          <div className="grid grid-cols-3">
            <div className="bg-gray-100 text-center py-2.5 text-xs font-bold text-gray-700">Date</div>
            <div className="bg-amber-50  text-center py-2.5 text-xs font-bold text-amber-700">Duration</div>
            <div className="bg-emerald-50 text-center py-2.5 text-xs font-bold text-emerald-700">Target</div>
          </div>
          {/* Table rows */}
          {stat.daily.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}
            >
              <div className="text-center py-2.5 text-xs font-semibold text-gray-700">{row.date}</div>
              <div className="text-center py-2.5 text-xs font-semibold text-amber-600">{row.duration}</div>
              <div className="text-center py-2.5 text-xs font-bold text-emerald-600">{row.target}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function TeammateDetail() {
  const { uid } = useParams();         // reads :uid from the URL
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch this member's detail on mount (or when uid changes)
  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    fetchTeammateDetail(uid)
      .then((data) => setMember(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [uid]);

  const retry = () => {
    setLoading(true);
    setError(null);
    fetchTeammateDetail(uid)
      .then(setMember)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#dce6f5] flex flex-col">
      {/* Header */}
      <div className="bg-white flex items-center justify-center px-4 py-4 relative border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 text-2xl text-gray-800 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200"
        >
          &#8249;
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">Teammate Detail</h1>
      </div>

      <div className="flex-1 px-3.5 py-4 flex flex-col gap-3 overflow-y-auto">

        {/* ── LOADING ── */}
        {loading && (
          <>
            <SkeletonProfile />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center mt-4">
            <p className="text-red-500 font-semibold text-sm mb-2">{error}</p>
            <button onClick={retry} className="text-blue-500 font-bold text-sm">Retry</button>
          </div>
        )}

        {/* ── DATA ── */}
        {!loading && !error && member && (
          <>
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-2xl flex-shrink-0`}>
                {member.avatarEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-extrabold text-gray-900">{member.name}</p>
                  {member.status === "Agent" && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Agent</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 font-semibold mt-0.5">ID: {member.uid}</p>
              </div>
            </div>

            {/* Monthly stat cards */}
            {member.monthlyStats.map((stat, i) => (
              <MonthStatCard key={i} stat={stat} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}