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

// ---- Normalizers ----
// GET {{base_url}}/agency/team-bill
// Adjust the right-hand field names below to match your actual API response.
function normalizeListItem(raw) {
  return {
    id: raw._id || raw.id,
    month: raw.month, // needed to call the details endpoint, e.g. "2026-06"
    cycle: raw.cycle, // needed to call the details endpoint, e.g. 2
    period:
      raw.period ||
      (raw.startDate && raw.endDate ? `${raw.startDate}/${raw.endDate}` : raw.month),
    status: raw.status === "settled" || raw.status === "Settled" ? "Settled" : "Unsettled",
    memberSalary: Number(raw.memberSalary ?? raw.member_salary ?? 0),
    agentSalary: Number(raw.agentSalary ?? raw.agent_salary ?? 0),
    total: Number(raw.total ?? 0),
    target: Number(raw.target ?? 0),
  };
}

// GET {{base_url}}/agency/team-bill-details?month=YYYY-MM&cycle=N
function normalizeDetails(raw, fallback) {
  const workMembers = (raw.workMembers || raw.members || raw.list || []).map((m) => ({
    id: m.id || m._id || m.memberId,
    name: m.name,
    target: Number(m.target ?? 0),
    salary: Number(m.salary ?? 0),
  }));

  return {
    ...fallback,
    status:
      raw.status === "settled" || raw.status === "Settled" ? "Settled" : fallback.status,
    memberSalary: Number(raw.memberSalary ?? raw.member_salary ?? fallback.memberSalary),
    agentSalary: Number(raw.agentSalary ?? raw.agent_salary ?? fallback.agentSalary),
    total: Number(raw.total ?? fallback.total),
    target: Number(raw.target ?? fallback.target),
    workMembers,
  };
}

// Simple ghost-style avatar placeholder (matches the round icon in the screenshot)
function GhostAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-300" fill="currentColor">
        <path d="M12 2C7.03 2 3 6.03 3 11v8.5a1 1 0 0 0 1.7.7l1.3-1.3 1.5 1.5a1 1 0 0 0 1.4 0l1.6-1.6 1.6 1.6a1 1 0 0 0 1.4 0l1.5-1.5 1.3 1.3a1 1 0 0 0 1.7-.7V11c0-4.97-4.03-9-9-9Zm-3 8a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 9 10Zm6 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
      </svg>
    </div>
  );
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

function BillCard({ bill, onSeeMore }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 break-words">
          {bill.period}
        </h3>
        <StatusPill status={bill.status} />
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
        <p className="text-slate-500 text-sm sm:text-base">
          Member salary:{" "}
          <span className="text-orange-500 font-semibold">
            ${bill.memberSalary.toFixed(2)}
          </span>
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          Agent salary:{" "}
          <span className="text-orange-500 font-semibold">
            ${bill.agentSalary.toFixed(2)}
          </span>
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          Total:{" "}
          <span className="text-orange-500 font-semibold">
            ${bill.total.toFixed(2)}
          </span>
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          Target: <span className="text-orange-500 font-semibold">{bill.target}</span>
        </p>
      </div>

      <button
        onClick={() => onSeeMore(bill)}
        className="w-full flex items-center justify-center gap-1 text-slate-500 hover:text-slate-700 text-sm sm:text-base py-1 transition-colors"
      >
        See more details <ChevronRight size={18} />
      </button>
    </div>
  );
}

function BillDetailsSheet({ bill, open, onClose, loading, error }) {
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
        {/* Drag handle */}
        <button
          onClick={onClose}
          className="w-full flex justify-center pt-3 pb-2"
          aria-label="Close details"
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </button>

        <div className="px-5 sm:px-6 pb-8 pt-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6">
            Bill Details
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

          {!loading && !error && bill && (
            <>
              {/* Summary card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 mb-5">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 break-words">
                    {bill.period}
                  </h3>
                  <StatusPill status={bill.status} />
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <p className="text-slate-500 text-sm sm:text-base">
                    Member salary:{" "}
                    <span className="text-orange-500 font-semibold">
                      ${bill.memberSalary.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-slate-500 text-sm sm:text-base">
                    Agent salary:{" "}
                    <span className="text-orange-500 font-semibold">
                      ${bill.agentSalary.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-slate-500 text-sm sm:text-base">
                    Total:{" "}
                    <span className="text-orange-500 font-semibold">
                      ${bill.total.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-slate-500 text-sm sm:text-base">
                    Target:{" "}
                    <span className="text-orange-500 font-semibold">{bill.target}</span>
                  </p>
                </div>
              </div>

              {/* Work members table */}
              <div className="rounded-2xl overflow-hidden border border-slate-100">
                <div className="grid grid-cols-3 bg-slate-50">
                  <div className="px-4 py-3 text-slate-600 font-medium text-sm sm:text-base">
                    Work members
                  </div>
                  <div className="px-3 py-3 bg-orange-100 text-slate-700 font-medium text-sm sm:text-base text-center">
                    Target
                  </div>
                  <div className="px-3 py-3 bg-emerald-400 text-white font-medium text-sm sm:text-base text-center">
                    Salary
                  </div>
                </div>

                {bill.workMembers.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-sm sm:text-base">
                    No Data Found!
                  </div>
                ) : (
                  bill.workMembers.map((member, idx) => (
                  <div
                    key={member.id}
                    className={`grid grid-cols-3 items-center ${
                      idx !== bill.workMembers.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
                      <GhostAvatar />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                          {member.name}
                        </p>
                        <p className="text-slate-400 text-xs sm:text-sm">
                          ID: {member.id}
                        </p>
                      </div>
                    </div>
                    <div className="px-2 py-3 bg-orange-50 text-slate-700 text-center text-sm sm:text-base h-full flex items-center justify-center">
                      {member.target.toFixed(2)}
                    </div>
                    <div className="px-2 py-3 bg-emerald-50 text-slate-900 font-semibold text-center text-sm sm:text-base h-full flex items-center justify-center">
                      ${member.salary}
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

export default function AgencyTeamBills() {
  const [teamBills, setTeamBills] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [selectedBill, setSelectedBill] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // GET {{base_url}}/agency/team-bill
  useEffect(() => {
    const controller = new AbortController();

    async function fetchTeamBills() {
      setListLoading(true);
      setListError(null);
      try {
        const res = await fetch(`${BASE_URL}/agency/team-bill`, {
          method: "GET",
          headers: { ...authHeaders() },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();
        // Adjust `json.data` below if your API wraps the array differently
        const rawList = Array.isArray(json) ? json : json.data || json.result || [];
        setTeamBills(rawList.map(normalizeListItem));
      } catch (err) {
        if (err.name !== "AbortError") {
          setListError("Couldn't load team bills. Pull down to try again.");
        }
      } finally {
        setListLoading(false);
      }
    }

    fetchTeamBills();
    return () => controller.abort();
  }, []);

  // GET {{base_url}}/agency/team-bill-details?month=YYYY-MM&cycle=N
  const handleSeeMore = async (bill) => {
    setSelectedBill(bill);
    setSheetOpen(true);
    setDetailsError(null);
    setDetailsLoading(true);

    try {
      const params = new URLSearchParams({
        month: bill.month,
        cycle: bill.cycle,
      });
      const res = await fetch(
        `${BASE_URL}/agency/team-bill-details?${params.toString()}`,
        { method: "GET", headers: { ...authHeaders() } }
      );
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      const rawDetails = json.data || json.result || json;
      setSelectedBill(normalizeDetails(rawDetails, bill));
    } catch (err) {
      setDetailsError("Couldn't load details. Please try again.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleClose = () => {
    setSheetOpen(false);
    setTimeout(() => setSelectedBill(null), 300);
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
          Team Bill
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

        {!listLoading && !listError && teamBills.length === 0 && (
          <div className="text-center text-slate-400 py-16 text-sm sm:text-base">
            No Data Found!
          </div>
        )}

        {!listLoading &&
          !listError &&
          teamBills.map((bill) => (
            <BillCard key={bill.id} bill={bill} onSeeMore={handleSeeMore} />
          ))}
      </div>

      {/* Bottom sheet */}
      <BillDetailsSheet
        bill={selectedBill}
        open={sheetOpen}
        onClose={handleClose}
        loading={detailsLoading}
        error={detailsError}
      />
    </div>
  );
}