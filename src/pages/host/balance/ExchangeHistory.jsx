import { useState, useMemo, useRef, useEffect } from "react";
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

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toISODate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function buildMonthGrid(year, month) {
  // month: 0-indexed
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

// ── Responsive calendar popover ────────────────────────────────────────
// Pops out below its trigger, clamps horizontally so it never overflows
// the edge of the page/container on small screens.
function CalendarDropdown({ value, onSelect, onClose, minDate, maxDate, align = "left" }) {
  const popRef = useRef(null);
  const today = new Date();
  const initial = value ? new Date(`${value}T00:00:00`) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const cells = buildMonthGrid(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isDisabled = (iso) => (minDate && iso < minDate) || (maxDate && iso > maxDate);

  return (
    <div
      ref={popRef}
      className={`absolute z-50 top-full mt-2 ${align === "right" ? "right-0" : "left-0"}
                  w-[min(280px,88vw)] max-w-[calc(100vw-2rem)]
                  bg-white rounded-2xl shadow-xl border border-gray-100 p-3`}
    >
      {/* Month nav */}
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          type="button"
          onClick={goPrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 text-sm"
        >
          &#8249;
        </button>
        <p className="text-sm font-bold text-gray-800">{monthLabel}</p>
        <button
          type="button"
          onClick={goNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 text-sm"
        >
          &#8250;
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-gray-400 py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const iso = toISODate(viewYear, viewMonth, day);
          const selected = value === iso;
          const disabled = isDisabled(iso);
          return (
            <button
              type="button"
              key={idx}
              disabled={disabled}
              onClick={() => {
                onSelect(iso);
                onClose();
              }}
              className={`mx-auto w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors
                ${selected ? "bg-indigo-500 text-white" : disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-indigo-50"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatDisplayDate(isoDate) {
  // isoDate: "yyyy-mm-dd" -> "14 Jul 2026"
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ExchangeHistoryPage() {
  const [searchUID, setSearchUID] = useState("");
  const [appliedUID, setAppliedUID] = useState("");
  const [startDate, setStartDate] = useState(""); // "yyyy-mm-dd"
  const [endDate, setEndDate] = useState(""); // "yyyy-mm-dd"
  const [openPicker, setOpenPicker] = useState(null); // "start" | "end" | null
  const navigate = useNavigate();

  // ── Filtered records ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_RECORDS.filter((r) => {
      if (appliedUID && String(r.uid) !== appliedUID.trim()) return false;
      const recordDate = r.date.slice(0, 10); // "yyyy-mm-dd"
      if (startDate && recordDate < startDate) return false;
      if (endDate && recordDate > endDate) return false;
      return true;
    });
  }, [appliedUID, startDate, endDate]);

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
          className="absolute left-4 text-gray-700 text-2xl font-light leading-none"
        >
          &#8249;
        </button>
        <h1 className="w-full text-center text-lg font-bold text-gray-900">Exchange History</h1>
      </div>

      {/* ── Page Content ── */}
      <div className="flex-1 px-4 pt-4 pb-8 flex flex-col gap-4">
        {/* Back + Title */}
        <div>
          {/* <button className="flex items-center gap-1 text-gray-700 text-sm font-medium mb-2">
            <span className="text-base">&#8249;</span> Back
          </button> */}
          <h2 className="text-2xl font-extrabold text-gray-900">Exchange History</h2>
        </div>

        {/* ── Filter Card ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          {/* Date range filter (replaces Type / Source dropdowns) */}
          <div className="flex gap-3">
            {/* Start date */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setOpenPicker(openPicker === "start" ? null : "start")}
                className="w-full flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 text-sm text-left focus:outline-none"
              >
                <span className={startDate ? "text-gray-700 font-medium" : "text-gray-500"}>
                  {startDate ? formatDisplayDate(startDate) : "Start Date"}
                </span>
                <span className="text-gray-400 text-base leading-none">📅</span>
              </button>
              {openPicker === "start" && (
                <CalendarDropdown
                  value={startDate}
                  onSelect={setStartDate}
                  onClose={() => setOpenPicker(null)}
                  maxDate={endDate || undefined}
                  align="left"
                />
              )}
            </div>

            {/* End date */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setOpenPicker(openPicker === "end" ? null : "end")}
                className="w-full flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 text-sm text-left focus:outline-none"
              >
                <span className={endDate ? "text-gray-700 font-medium" : "text-gray-500"}>
                  {endDate ? formatDisplayDate(endDate) : "End Date"}
                </span>
                <span className="text-gray-400 text-base leading-none">📅</span>
              </button>
              {openPicker === "end" && (
                <CalendarDropdown
                  value={endDate}
                  onSelect={setEndDate}
                  onClose={() => setOpenPicker(null)}
                  minDate={startDate || undefined}
                  align="right"
                />
              )}
            </div>
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="self-start text-xs text-indigo-500 font-medium hover:text-indigo-600"
            >
              Clear dates
            </button>
          )}

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