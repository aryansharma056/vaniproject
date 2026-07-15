import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

// ─── Detail Modal ───────────────────────────────────────────────────────────
function DetailModal({ item, details, loading, error, onClose }) {
  const [activeTab, setActiveTab] = useState("Date");

  const tabs = ["Date", "Duration", "Target"];

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ backgroundColor: "rgba(80,80,80,0.6)" }}
        onClick={onClose}
      >
        <div
          className="w-full bg-white rounded-t-3xl px-5 pt-12 pb-16 shadow-2xl flex flex-col items-center justify-center"
          style={{ maxWidth: 430, minHeight: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ backgroundColor: "rgba(80,80,80,0.6)" }}
        onClick={onClose}
      >
        <div
          className="w-full bg-white rounded-t-3xl px-5 pt-6 pb-8 shadow-2xl text-center"
          style={{ maxWidth: 430 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center relative mb-5">
            <span className="text-lg font-bold text-gray-900">Details</span>
            <button onClick={onClose} className="absolute right-0 text-gray-400 text-xl">✕</button>
          </div>
          <p className="text-red-500 text-sm py-8">{error || "Failed to load details"}</p>
        </div>
      </div>
    );
  }

  // Map API details list to tab-compatible rows
  const apiDetails = details.details || [];
  const dateRows = apiDetails.map((d) => ({ label: d.date, value: "Active" }));
  const durationRows = []; // API does not currently return duration-level records
  const targetRows = apiDetails.map((d) => ({
    label: d.date,
    value: Number(d.target).toLocaleString(),
  }));

  const tabContent = {
    Date: dateRows,
    Duration: durationRows,
    Target: targetRows,
  };

  const rows = tabContent[activeTab];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(80,80,80,0.6)" }}
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="w-full bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl"
        style={{ maxWidth: 430 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center relative mb-5">
          <span className="text-lg font-bold text-gray-900">Details</span>
          <button
            onClick={onClose}
            className="absolute right-0 text-gray-400 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Period + Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-500 text-lg font-bold">
            {details.month} (Cycle {details.cycle})
          </span>
          <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            {details.status_text}
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Target:</span>
              <span className="text-blue-500 font-bold text-sm ml-2">
                {Number(details.target).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Duration:</span>
              <span className="text-gray-900 font-bold text-sm ml-2">0s</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Target LV:</span>
              <span className="text-yellow-500 font-bold text-sm ml-2">{details.target_level}</span>
            </div>
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Salary:</span>
              <span className="text-yellow-500 font-bold text-sm ml-2">${details.salary}</span>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const bg =
              tab === "Date"
                ? isActive
                  ? "bg-gray-200"
                  : "bg-white"
                : tab === "Duration"
                ? isActive
                  ? "bg-amber-200"
                  : "bg-white"
                : isActive
                ? "bg-teal-500"
                : "bg-white";

            const text =
              tab === "Target" && isActive
                ? "text-white"
                : "text-gray-800";

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${bg} ${text}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-4 min-h-16 max-h-48 overflow-y-auto">
          {rows.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">No data available</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rows.map((row, i) => (
                <li key={i} className="flex justify-between py-2 text-sm text-gray-700">
                  <span>{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Work Card ──────────────────────────────────────────────────────────────
function WorkCard({ item, onDetails }) {
  const period = `${item.month} (${item.cycle})`;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-blue-500 text-lg font-bold">{period}</span>
        <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">
          {item.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <div className="flex items-center w-1/2">
            <span className="text-gray-400 text-sm">Target:</span>
            <span className="text-blue-500 font-bold text-sm ml-2">
              {Number(item.target).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center w-1/2">
            <span className="text-gray-400 text-sm">Duration:</span>
            <span className="text-gray-900 font-bold text-sm ml-2">0s</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center w-1/2">
            <span className="text-gray-400 text-sm">Target LV:</span>
            <span className="text-gray-900 font-bold text-sm ml-2">{item.target_level}</span>
          </div>
          <div className="flex items-center w-1/2">
            <span className="text-gray-400 text-sm">Salary:</span>
            <span className="text-yellow-500 font-bold text-sm ml-2">${item.salary}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-4 mb-3" />

      <div className="text-center">
        <button
          onClick={() => onDetails(item)}
          className="text-blue-500 text-sm font-medium active:opacity-70"
        >
          See more details &gt;&gt;
        </button>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function MyWorkPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const navigate = useNavigate();

  const fetchWorkData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/host/my-work");
      if (res.status && Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setError(res.message || "Failed to fetch work data");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch work data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (item) => {
    setSelectedItem(item);
    setDetailsData(null);
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const cycleParam = item.cycle === "01-15" ? 1 : 2;
      const res = await api.get(
        `/host/my-work-details?month=${item.month}&cycle=${cycleParam}`
      );
      if (res.status && res.data) {
        setDetailsData(res.data);
      } else {
        setDetailsError(res.message || "Failed to load details");
      }
    } catch (err) {
      setDetailsError(err.message || "Failed to load details");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkData();
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: 430, margin: "0 auto" }}
    >
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center relative shadow-sm">
        <button
          className="text-gray-700 text-2xl font-light absolute left-4"
          onClick={() => navigate(-1)}
        >
          &#8249;
        </button>
        <h1 className="text-center text-lg font-bold text-gray-900 w-full">My Work</h1>
      </div>

      {/* Cards */}
      <div className="flex-1 p-4 space-y-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading work data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchWorkData}
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 active:scale-95 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-10">No work records found.</p>
        )}

        {!loading &&
          !error &&
          data.map((item, idx) => (
            <WorkCard key={idx} item={item} onDetails={handleOpenDetails} />
          ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          details={detailsData}
          loading={detailsLoading}
          error={detailsError}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}