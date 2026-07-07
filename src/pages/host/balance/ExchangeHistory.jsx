import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ── Mock data – replace with API fetch when ready ─────────────────────────
const MOCK_RECORDS = [
  {
    id: 1,
    type: "Exchange (Mo...",
    uid: 0,
    source: "System",
    amount: -261000.0,
    date: "2026-06-18 08:23:27",
  },
  {
    id: 2,
    type: "Exchange (Mo...",
    uid: 5,
    source: "User",
    amount: -15000.0,
    date: "2026-06-17 14:10:05",
  },
  {
    id: 3,
    type: "Exchange (Mo...",
    uid: 12,
    source: "System",
    amount: 5000.0,
    date: "2026-06-15 09:00:00",
  },
];

const TYPE_OPTIONS = ["All Types", "Exchange (Mo...)"];
const SOURCE_OPTIONS = ["All Sources", "System", "User"];

export default function ExchangeHistoryPage() {
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [searchUID, setSearchUID] = useState("");
  const [appliedUID, setAppliedUID] = useState("");
  const navigate = useNavigate();

  // ── Filtered records ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_RECORDS.filter((r) => {
      if (typeFilter !== "All Types" && r.type !== typeFilter) return false;
      if (sourceFilter !== "All Sources" && r.source !== sourceFilter) return false;
      if (appliedUID && String(r.uid) !== appliedUID.trim()) return false;
      return true;
    });
  }, [typeFilter, sourceFilter, appliedUID]);

  const netAmount = filtered.reduce((sum, r) => sum + r.amount, 0);

  const handleSearch = () => setAppliedUID(searchUID);

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: 430, margin: "0 auto" }}
    >
      {/* ── Top Header ── */}
      <div className="bg-white px-4 py-4 flex items-center relative shadow-sm">
        <button
         onClick={() => navigate(-1)}
          className="absolute left-4 text-gray-700 text-2xl font-light leading-none">
          &#8249;
        </button>
        <h1 className="w-full text-center text-lg font-bold text-gray-900">Exchange History</h1>
      </div>

      {/* ── Page Content ── */}
      <div className="flex-1 px-4 pt-4 pb-8 flex flex-col gap-4">

        {/* Back + Title */}
        <div>
          <button className="flex items-center gap-1 text-gray-700 text-sm font-medium mb-2">
            <span className="text-base">&#8249;</span> Back
          </button>
          <h2 className="text-2xl font-extrabold text-gray-900">Exchange History</h2>
        </div>

        {/* ── Filter Card ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">

          {/* Dropdowns */}
          <div className="flex gap-3">
            {/* Type */}
            <div className="relative flex-1">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 pr-8 focus:outline-none"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>

            {/* Source */}
            <div className="relative flex-1">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full appearance-none bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 pr-8 focus:outline-none"
              >
                {SOURCE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          {/* UID Search */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search UID"
              value={searchUID}
              onChange={(e) => setSearchUID(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
            >
              Search
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Summary row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Records</p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${netAmount < 0 ? "text-gray-900" : "text-green-600"}`}>
                {netAmount < 0 ? "-" : "+"}${Math.abs(netAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Net Amount</p>
            </div>
          </div>
        </div>

        {/* ── Record List ── */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No records found</p>
          ) : (
            filtered.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl px-4 py-4 shadow-sm flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-lg">&#8595;</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{record.type}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    UID: {record.uid} | {record.source}
                  </p>
                </div>

                {/* Amount + Date */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-base font-bold ${record.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                    {record.amount < 0 ? "-" : "+"}
                    {Math.abs(record.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{record.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}