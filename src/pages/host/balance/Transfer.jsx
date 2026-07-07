import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BG_IMG from "../../../assets/exchange_bd_img.webp";
import WALLET_IMG from "../../../assets/wallet_img.webp";

const WALLET_DATA = {
    balance: 0.80,
    currency: "USD",
    coinsPerDollar: 8700,
};

export default function ExchangePage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");

    const coinsPreview = amount
        ? (parseFloat(amount) * WALLET_DATA.coinsPerDollar).toLocaleString()
        : null;

    const handleSearch = () => {
        if (!userId.trim()) {
            setToast("Please enter a User ID");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        // TODO: replace with real user search API call
        // await fetch(`/api/users/search?id=${userId}`)
        setToast(`Searching for @${userId}…`);
        setTimeout(() => setToast(""), 2000);
    };

    const handleExchange = async () => {
        if (!userId.trim()) {
            setToast("Please enter a User ID");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setToast("Please enter a valid amount");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        if (parseFloat(amount) > WALLET_DATA.balance) {
            setToast("Insufficient balance");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        setLoading(true);
        // TODO: replace with real API call
        // await fetch("/api/exchange", { method: "POST", body: JSON.stringify({ userId, amount }) });
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setToast("Exchange successful!");
        setAmount("");
        setUserId("");
        setTimeout(() => setToast(""), 2500);
    };

    return (
        <div
            className="min-h-screen bg-gray-100 flex flex-col"
            style={{ fontFamily: "'Inter', sans-serif", maxWidth: 430, margin: "0 auto" }}
        >
            {/* ── Header ── */}
            <div className="bg-white px-4 py-4 flex items-center relative shadow-sm">
                <button 
               onClick={() => navigate(-1)}
                className="absolute left-4 text-gray-700 text-2xl font-light leading-none">
                    &#8249;
                </button>
                <h1 className="w-full text-center text-lg font-bold text-gray-900">Transfer</h1>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="flex-1 flex flex-col px-4 pt-4 pb-28 gap-5">

                {/* ── Balance Card ── */}
                <div
                    className="rounded-2xl overflow-hidden relative shadow-lg"
                    style={{ minHeight: 160, background: "linear-gradient(135deg, #1a1a6e 0%, #3a3abf 60%, #4b4bdd 100%)" }}
                >
                    <img
                        src={BG_IMG}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                        <div className="flex items-start gap-3">
                            <img src={WALLET_IMG} alt="wallet" className="w-14 h-14 object-contain" />
                            <div>
                                <p className="text-white text-sm font-medium opacity-80">Wallet Balance</p>
                                <p className="text-white text-3xl font-bold leading-tight">
                                    ${WALLET_DATA.balance.toFixed(2)}
                                    <span className="text-base font-semibold ml-1 opacity-80">{WALLET_DATA.currency}</span>
                                </p>
                                <p className="text-white text-sm opacity-70 mt-0.5">Available Balance</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => navigate("/host/transfer/history")}
                                className="text-white font-semibold text-sm underline underline-offset-2 opacity-90 active:opacity-60"
                            >
                                History
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Transfer To ── */}
                <div>
                    <p className="text-gray-900 font-bold text-lg mb-3">Transfer To</p>
                    <div className="flex items-center gap-3">
                        {/* User ID input */}
                        <div className="flex-1 bg-white rounded-2xl flex items-center px-4 py-3 shadow-sm gap-2">
                            <span className="text-gray-400 text-base font-medium">@</span>
                            <input
                                type="text"
                                placeholder="Enter User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="flex-1 outline-none text-gray-900 text-base bg-transparent placeholder-gray-400"
                            />
                        </div>
                        {/* Search button */}
                        <button
                            onClick={handleSearch}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #3b2fa0 0%, #5b4dd4 100%)" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Transfer Amount ── */}
                <div>
                    <p className="text-gray-900 font-bold text-lg mb-3">Transfer Amount</p>
                    <div className="bg-white rounded-2xl flex items-center px-4 py-3 shadow-sm gap-3">
                        <span className="text-gray-400 text-lg font-medium">$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex-1 outline-none text-gray-900 text-base bg-transparent placeholder-gray-400"
                        />
                    </div>
                    {coinsPreview && (
                        <p className="text-indigo-600 text-sm mt-1 ml-1 font-medium">
                            &#8776; {coinsPreview} Coins
                        </p>
                    )}
                </div>

            </div>

            {/* ── Transfer Button ── */}
            <div
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full px-4 pb-6 bg-gray-100 pt-2"
                style={{ maxWidth: 430 }}
            >
                <button
                    onClick={handleExchange}
                    disabled={loading}
                    className="w-full py-4 rounded-full text-white font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #3b2fa0 0%, #5b4dd4 100%)" }}
                >
                    {loading ? "Processing…" : "Transfer Dollars"}
                </button>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2 rounded-full shadow-lg z-50 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
}