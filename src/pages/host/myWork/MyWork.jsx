import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Mock data (swap fetch() here when API is ready) ───────────────────────
const WORK_DATA = [
  {
    id: 1,
    period: "2026-06",
    status: "Unsettled",
    target: 0,
    duration: "0s",
    targetLV: 0,
    salary: 0,
    // Detail tab rows – replace with API response fields
    dateRows: [],
    durationRows: [],
    targetRows: [],
  },
];

// ─── Detail Modal ───────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  const [activeTab, setActiveTab] = useState("Date");

  const tabs = ["Date", "Duration", "Target"];

  const tabContent = {
    Date: item.dateRows,
    Duration: item.durationRows,
    Target: item.targetRows,
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
          <span className="text-blue-500 text-lg font-bold">{item.period}</span>
          <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            {item.status}
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Target:</span>
              <span className="text-blue-500 font-bold text-sm ml-2">{item.target}</span>
            </div>
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Duration:</span>
              <span className="text-gray-900 font-bold text-sm ml-2">{item.duration}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Target LV:</span>
              <span className="text-yellow-500 font-bold text-sm ml-2">{item.targetLV}</span>
            </div>
            <div className="flex items-center w-1/2">
              <span className="text-gray-500 text-sm font-medium">Salary:</span>
              <span className="text-yellow-500 font-bold text-sm ml-2">${item.salary}</span>
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
        <div className="mt-4 min-h-16">
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
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-blue-500 text-lg font-bold">{item.period}</span>
        <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">
          {item.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <div className="flex items-center w-1/2">
            <span className="text-gray-400 text-sm">Target:</span>
            <span className="text-blue-500 font-bold text-sm ml-2">{item.target}</span>
          </div>
          <div className="flex items-center w-1/2">
            <span className="text-gray-400 text-sm">Duration:</span>
            <span className="text-gray-900 font-bold text-sm ml-2">{item.duration}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center w-1/2">
            <span className="text-gray-400 text-sm">Target LV:</span>
            <span className="text-gray-900 font-bold text-sm ml-2">{item.targetLV}</span>
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
  const [data] = useState(WORK_DATA);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: 430, margin: "0 auto" }}
    >
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center relative shadow-sm">
        <button className="text-gray-700 text-2xl font-light absolute left-4"
        onClick={() => navigate(-1)}>&#8249;</button>
        <h1 className="text-center text-lg font-bold text-gray-900 w-full">My Work</h1>
      </div>

      {/* Cards */}
      <div className="flex-1 p-4 space-y-3">
        {data.map((item) => (
          <WorkCard key={item.id} item={item} onDetails={setSelectedItem} />
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}