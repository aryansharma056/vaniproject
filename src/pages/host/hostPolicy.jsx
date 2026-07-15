import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

/**
 * PolicyPage
 *
 * Displays host-level policy tiers (Time / Target / Host salary).
 *
 * DATA SOURCE
 * ------------------------------------------------------------------
 * Pulls from the live API:
 *   GET {{base_url}}/host/host-policies
 *   Authorization: Bearer {{token}}
 *
 * Response shape:
 *   { status, message, data: [{ id, level, target_value, host_salary }] }
 *
 * Note: the API doesn't return a "time hours" field, so it's shown
 * as 0 (the design still reserves a column for it). If a real
 * time_hours field gets added later, map it in `fetchPolicyLevels`.
 * ------------------------------------------------------------------
 */

const BASE_URL = "https://vanivoicechat.com/api";
// TODO: replace with your real auth token, e.g. pulled from context/storage.
const TOKEN = "V52rzcafZU3I12EKhMMqIls36rhAUuDZEeGKB9t8a14e11fd";

async function fetchPolicyLevels() {
  const res = await fetch(`${BASE_URL}/host/host-policies`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load policy levels (${res.status})`);
  }

  const json = await res.json();

  if (!json.status || !Array.isArray(json.data)) {
    throw new Error(json.message || "Unexpected response from server");
  }

  return json.data.map((item) => ({
    level: item.level,
    timeHours: item.time_hours ?? 0,
    targetGiftValue: item.target_value,
    hostSalary: item.host_salary,
  }));
}

function LevelCard({ level, timeHours, targetGiftValue, hostSalary }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-1.5 h-6 rounded-sm bg-violet-600" />
        <h2 className="text-lg font-bold text-gray-900">LEVEL:{level}</h2>
      </div>

      <div className="rounded-2xl bg-gray-50 px-4 py-5">
        <div className="grid grid-cols-3 text-center">
          <span className="text-sm text-gray-500">Time(Hours)</span>
          <span className="text-sm text-gray-500">Target(Gift Value)</span>
          <span className="text-sm text-gray-500">Host(Salary)</span>
        </div>
        <div className="grid grid-cols-3 text-center mt-2">
          <span className="text-xl font-bold text-green-600">{timeHours}</span>
          <span className="text-xl font-bold text-violet-700">
            {targetGiftValue.toLocaleString()}
          </span>
          <span className="text-xl font-bold text-amber-500">{hostSalary}</span>
        </div>
      </div>
    </div>
  );
}

function LevelCardSkeleton() {
  return (
    <div className="mb-6 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-1.5 h-6 rounded-sm bg-gray-200" />
        <span className="h-5 w-20 rounded bg-gray-200" />
      </div>
      <div className="rounded-2xl bg-gray-50 px-4 py-5 h-24" />
    </div>
  );
}

export default function PolicyPage({ onBack }) {
  const [levels, setLevels] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

  useEffect(() => {
    let cancelled = false;

    fetchPolicyLevels()
      .then((data) => {
        if (!cancelled) {
          setLevels(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 relative">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="p-1 text-gray-900"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-gray-900">
          Policy
        </h1>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {status === "loading" &&
          Array.from({ length: 3 }).map((_, i) => <LevelCardSkeleton key={i} />)}

        {status === "error" && (
          <p className="text-center text-sm text-red-500 mt-8">
            Couldn't load policy levels. Pull to refresh and try again.
          </p>
        )}

        {status === "ready" &&
          levels.map((item) => (
            <LevelCard
              key={item.level}
              level={item.level}
              timeHours={item.timeHours}
              targetGiftValue={item.targetGiftValue}
              hostSalary={item.hostSalary}
            />
          ))}
      </div>
    </div>
  );
}