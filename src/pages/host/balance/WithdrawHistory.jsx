import { useNavigate } from "react-router-dom";

// TODO: Replace with real API data
const HISTORY = []; // e.g. [{ id: 1, method: "Bank", amount: 10.00, status: "Success", date: "2025-06-01" }]

export default function WithdrawalHistoryPage() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                fontFamily: "'Inter', sans-serif",
                maxWidth: 430,
                margin: "0 auto",
                backgroundColor: "#f0f1f6",
            }}
        >
            {/* ── Header ── */}
            <div className="bg-white px-4 py-4 flex items-center relative shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 text-gray-700 text-2xl font-light leading-none"
                >
                    &#8249;
                </button>
                <h1 className="w-full text-center text-lg font-bold text-gray-900">
                    Withdrawal History
                </h1>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 flex flex-col px-4 pt-5">

                {/* Page title + Back link */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-gray-900 font-extrabold text-2xl">Withdrawal History</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-indigo-500 font-semibold text-base"
                    >
                        Back
                    </button>
                </div>

                {/* Content card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {HISTORY.length === 0 ? (
                        // ── Empty state ──
                        <div className="py-12 flex items-center justify-center">
                            <p className="text-gray-400 font-medium text-base">
                                No withdrawal history
                            </p>
                        </div>
                    ) : (
                        // ── History list ──
                        <ul className="divide-y divide-gray-100">
                            {HISTORY.map((item) => (
                                <li key={item.id} className="flex items-center justify-between px-5 py-4">
                                    <div>
                                        <p className="text-gray-900 font-semibold text-sm">{item.method}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{item.date}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-gray-900 font-bold text-sm">
                                            ${item.amount.toFixed(2)}
                                        </p>
                                        <span
                                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                item.status === "Success"
                                                    ? "bg-green-100 text-green-600"
                                                    : item.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-red-100 text-red-500"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}