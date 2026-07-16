import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// ---- API config ----
// Point this at your env variable, e.g. import.meta.env.VITE_BASE_URL for Vite
// or process.env.REACT_APP_BASE_URL for CRA.
const BASE_URL = import.meta.env?.VITE_BASE_URL || "https://vanivoicechat.com/api";

function authHeaders() {
  const token = localStorage.getItem("token"); // adjust key to whatever you store it as
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// The list API returns cycle as a label ("01-15" / "16-End"), but the details
// API expects the numeric cycle (1 / 2). This converts the label to that number.
function cycleLabelToNumber(cycleLabel) {
  if (cycleLabel === undefined || cycleLabel === null) return undefined;
  const str = String(cycleLabel);
  if (str.startsWith("01")) return 1;
  if (str.startsWith("16")) return 2;
  const match = str.match(/^(\d+)/);
  return match ? Number(match[1]) : str;
}

// ---- Normalizers ----
// GET {{base_url}}/agency/agency-my-work
// Real response shape:
// { status: true, message: "...", data: [{ month, cycle, target, target_level,
//   salary, status, sort_date }] }
function normalizeListItem(raw) {
  return {
    id: `${raw.month}-${raw.cycle}`,
    month: raw.month, // e.g. "2026-07"
    cycle: raw.cycle, // display label, e.g. "16-End"
    cycleNumber: cycleLabelToNumber(raw.cycle), // e.g. 2 - used for the details API call
    period: `${raw.month} (${raw.cycle})`,
    status: raw.status === "Settled" ? "Settled" : "Unsettled",
    target: Number(raw.target ?? 0),
    salary: Number(raw.salary ?? 0),
    targetLv: Number(raw.target_level ?? raw.targetLv ?? 0),
  };
}

// GET {{base_url}}/agency/agency-my-work-details?month=YYYY-MM&cycle=N
// Real response shape:
// { status: true, message: "...", data: { month, cycle, start_date, end_date,
//   target, target_level, salary, status, details: [{ date, target }] } }
function normalizeDetails(raw, fallback) {
  const period =
    raw.start_date && raw.end_date
      ? `${raw.start_date}/${raw.end_date}`
      : fallback.period;

  const dailyRecords = (raw.details || raw.dailyRecords || raw.records || []).map((r) => ({
    date: r.date,
    target: Number(r.target ?? 0),
  }));

  return {
    ...fallback,
    period,
    status: raw.status === "Settled" ? "Settled" : "Unsettled",
    target: Number(raw.target ?? fallback.target),
    salary: Number(raw.salary ?? fallback.salary),
    targetLv: Number(raw.target_level ?? raw.targetLv ?? fallback.targetLv),
    dailyRecords,
  };
}

function StatusPill({ status }) {
  const isSettled = status === "Settled";
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm sm:text-base font-medium whitespace-nowrap ${
        isSettled
          ? "bg-green-700 text-white ring-2 ring-green-300"
          : "bg-blue-600 text-white"
      }`}
    >
      {status}
    </span>
  );
}

function WorkCard({ item, onSeeMore }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 break-words">
          {item.period}
        </h3>
        <StatusPill status={item.status} />
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
        <p className="text-slate-500 text-sm sm:text-base">
          Target: <span className="text-orange-500 font-semibold">{item.target}</span>
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          Salary:{" "}
          <span className="text-orange-500 font-semibold">
            ${item.salary.toFixed(2)}
          </span>
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          Target Lv:{" "}
          <span className="text-orange-500 font-semibold">{item.targetLv}</span>
        </p>
      </div>

      <button
        onClick={() => onSeeMore(item)}
        className="w-full flex items-center justify-center gap-1 text-slate-500 hover:text-slate-700 text-sm sm:text-base py-1 transition-colors"
      >
        See more details <ChevronRight size={18} />
      </button>
    </div>
  );
}

function WorkDetailsSheet({ item, open, onClose, loading, error }) {
  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
        max-h-[85vh] overflow-y-auto transition-transform duration-300 ease-out
        ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Drag handle - tap to close */}
        <button
          onClick={onClose}
          className="w-full flex justify-center pt-3 pb-2"
          aria-label="Close details"
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </button>

        <div className="px-5 sm:px-6 pb-8 pt-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6">
            Details
          </h2>

          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              Loading details...
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center text-red-500 text-sm sm:text-base">
              {error}
            </div>
          )}

          {!loading && !error && item && (
            <>
              {/* Summary card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 mb-5">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 break-words">
                    {item.period}
                  </h3>
                  <StatusPill status={item.status} />
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <p className="text-slate-500 text-sm sm:text-base">
                    Target:{" "}
                    <span className="text-orange-500 font-semibold">{item.target}</span>
                  </p>
                  <p className="text-slate-500 text-sm sm:text-base">
                    Salary:{" "}
                    <span className="text-orange-500 font-semibold">
                      ${item.salary.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-slate-500 text-sm sm:text-base">
                    Target Lv:{" "}
                    <span className="text-orange-500 font-semibold">
                      {item.targetLv}
                    </span>
                  </p>
                </div>
              </div>

              {/* Date / Target table */}
              <div className="rounded-2xl overflow-hidden border border-slate-100">
                <div className="grid grid-cols-2 bg-slate-50">
                  <div className="px-4 py-3 text-slate-600 font-medium text-sm sm:text-base">
                    Date
                  </div>
                  <div className="px-3 py-3 bg-orange-100 text-slate-700 font-medium text-sm sm:text-base text-center">
                    Target
                  </div>
                </div>

                {item.dailyRecords.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-sm sm:text-base">
                    No Data Found!
                  </div>
                ) : (
                  item.dailyRecords.map((record, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-2 items-center ${
                        idx !== item.dailyRecords.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <div className="px-4 py-3 text-slate-700 text-sm sm:text-base">
                        {record.date}
                      </div>
                      <div className="px-3 py-3 bg-orange-50 text-slate-700 text-center text-sm sm:text-base">
                        {record.target}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgencyMyWork() {
  const [myWork, setMyWork] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // GET {{base_url}}/agency/agency-my-work
  useEffect(() => {
    const controller = new AbortController();

    async function fetchMyWork() {
      setListLoading(true);
      setListError(null);
      try {
        const res = await fetch(`${BASE_URL}/agency/agency-my-work`, {
          method: "GET",
          headers: { ...authHeaders() },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();
        // Adjust `json.data` below if your API wraps the array differently
        const rawList = Array.isArray(json) ? json : json.data || json.result || [];
        setMyWork(rawList.map(normalizeListItem));
      } catch (err) {
        if (err.name !== "AbortError") {
          setListError("Couldn't load your work. Pull down to try again.");
        }
      } finally {
        setListLoading(false);
      }
    }

    fetchMyWork();
    return () => controller.abort();
  }, []);

  // GET {{base_url}}/agency/agency-my-work-details?month=YYYY-MM&cycle=N
  const handleSeeMore = async (item) => {
    setSelectedItem(item);
    setSheetOpen(true);
    setDetailsError(null);
    setDetailsLoading(true);

    try {
      const params = new URLSearchParams({
        month: item.month,
        cycle: item.cycleNumber,
      });
      const res = await fetch(
        `${BASE_URL}/agency/agency-my-work-details?${params.toString()}`,
        { method: "GET", headers: { ...authHeaders() } }
      );
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      const rawDetails = json.data || json.result || json;
      setSelectedItem(normalizeDetails(rawDetails, item));
    } catch (err) {
      setDetailsError("Couldn't load details. Please try again.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleClose = () => {
    setSheetOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-purple-50 px-4 sm:px-6 py-5 flex items-center relative">
        <button
          onClick={() => window.history.back()}
          className="text-slate-800 p-1 -ml-1"
          aria-label="Go back"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl sm:text-2xl font-bold text-slate-900">
          My Work
        </h1>
      </div>

      {/* List */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
        {listLoading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            Loading...
          </div>
        )}

        {!listLoading && listError && (
          <div className="text-center text-red-500 py-16 text-sm sm:text-base">
            {listError}
          </div>
        )}

        {!listLoading && !listError && myWork.length === 0 && (
          <div className="text-center text-slate-400 py-16 text-sm sm:text-base">
            No Data Found!
          </div>
        )}

        {!listLoading &&
          !listError &&
          myWork.map((item) => (
            <WorkCard key={item.id} item={item} onSeeMore={handleSeeMore} />
          ))}
      </div>

      {/* Bottom sheet */}
      <WorkDetailsSheet
        item={selectedItem}
        open={sheetOpen}
        onClose={handleClose}
        loading={detailsLoading}
        error={detailsError}
      />
    </div>
  );
}