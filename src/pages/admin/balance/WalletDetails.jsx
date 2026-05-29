import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Transaction data ──────────────────────────────────────────────────────────
// Each entry has a type label, ISO-style datetime string, display amount,
// and a boolean so we can colour positive vs negative values differently.
const ALL_TRANSACTIONS = [
  { id: 1, type: "Transfer",          datetime: "2026-05-02 15:51:39", amount: "-500.00",  isNegative: true  },
  { id: 2, type: "Receive Transfer",  datetime: "2026-05-02 09:57:22", amount: "+500.00",  isNegative: false },
  { id: 3, type: "Transfer",          datetime: "2026-05-01 17:19:22", amount: "-150.00",  isNegative: true  },
  { id: 4, type: "System Compensate", datetime: "2026-05-01 17:08:44", amount: "+150.00",  isNegative: false },
  { id: 5, type: "Transfer",          datetime: "2026-05-01 14:42:32", amount: "-630.18",  isNegative: true  },
  { id: 6, type: "System Compensate", datetime: "2026-05-01 13:39:31", amount: "+630.18",  isNegative: false },
  { id: 7, type: "System Import",     datetime: "2026-05-01 11:10:17", amount: "+30.16",   isNegative: false },
  { id: 8, type: "Transfer",          datetime: "2026-04-30 10:22:01", amount: "-200.00",  isNegative: true  },
  { id: 9, type: "Receive Transfer",  datetime: "2026-04-30 08:15:44", amount: "+200.00",  isNegative: false },
];

// How many transactions to show per "page"
const PAGE_SIZE = 5;

export default function WalletDetails() {
  const navigate = useNavigate();

  // Track how many items are currently visible.
  // Starting at PAGE_SIZE means the user sees 5 items on first load.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Slice the full list down to however many should be visible right now
  const visibleTransactions = ALL_TRANSACTIONS.slice(0, visibleCount);

  // Are there still more items hidden beyond what's shown?
  const hasMore = visibleCount < ALL_TRANSACTIONS.length;

  // Reveal the next batch of items
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, ALL_TRANSACTIONS.length));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] font-sans antialiased">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between
                         px-4 py-4 bg-white border-b border-gray-100 shadow-sm">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex items-center justify-center w-9 h-9 rounded-full
                     text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                  d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-lg font-bold text-[#1a1a2e]">Wallet Details</h1>

        {/* Empty div keeps the title visually centred */}
        <div className="w-9" aria-hidden="true" />
      </header>

      {/* ── TRANSACTION LIST ───────────────────────────────────────────────── */}
      {/*
        NOTE: "Load more" lives HERE, outside the map() loop.
        Placing it inside the map caused it to render once per card —
        the fix is simply to move it to a sibling element after the list.
      */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">

        {/* Transaction cards */}
        <div className="space-y-3">
          {visibleTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4
                         bg-white border border-gray-100 rounded-2xl
                         shadow-sm shadow-gray-100/40"
            >
              {/* Left — type name + timestamp */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-800 tracking-wide">
                  {tx.type}
                </span>
                <span className="text-xs font-medium text-gray-400 tracking-tight">
                  {tx.datetime}
                </span>
              </div>

              {/* Right — amount, coloured by direction */}
              <span
                className={`text-sm font-bold tracking-tight ${
                  tx.isNegative ? "text-blue-500" : "text-orange-500"
                }`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>

        {/* ── LOAD MORE BUTTON ────────────────────────────────────────────── */}
        {/*
          Only rendered when there are hidden items remaining.
          When all items are loaded this block disappears automatically.
        */}
        {hasMore && (
          <div className="text-center pt-5 pb-2">
            <button
              onClick={handleLoadMore}
              className="text-sky-500 font-bold text-sm
                         hover:text-sky-600 active:opacity-60 transition-colors"
            >
              Load more
            </button>
          </div>
        )}

        {/* Shown once every transaction is visible — confirms nothing is hidden */}
        {!hasMore && (
          <p className="text-center text-xs text-gray-400 pt-5 pb-2">
            You've reached the end
          </p>
        )}

      </main>
    </div>
  );
}