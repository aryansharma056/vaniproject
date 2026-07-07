import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BG_IMG from "../../../assets/exchange_bd_img.webp";
import WALLET_IMG from "../../../assets/wallet_img.webp";
import Exchange_Amount from "../../../assets/exchange_amount.webp";

// ── Mock data – replace with API ──────────────────────────────────────────
const WALLET_DATA = {
    balance: 0.80,
    currency: "USD",
    coinsPerDollar: 8700,
};

export default function ExchangePage() {
      const navigate = useNavigate(); 
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");

    const coinsPreview = amount
        ? (parseFloat(amount) * WALLET_DATA.coinsPerDollar).toLocaleString()
        : null;

    const handleExchange = async () => {
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
        // await fetch("/api/exchange", { method: "POST", body: JSON.stringify({ amount }) });
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setToast("Exchange successful!");
        setAmount("");
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
                <h1 className="w-full text-center text-lg font-bold text-gray-900">Exchange</h1>
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
                            
                            onClick={() => navigate("/host/exchange/history")}
                            className="text-white font-semibold text-sm underline underline-offset-2 opacity-90 active:opacity-60">
                                History
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Exchange Amount ── */}
                <div>
                    {/* FIX 1: Added missing label */}
                    <p className="text-gray-900 font-bold text-lg mb-3">
                        <span className="text-red-500 mr-1">*</span>Exchange Amount
                    </p>

                    <div className="relative bg-white rounded-2xl flex items-center px-4 py-3 shadow-sm gap-3 overflow-hidden">
         
                        <div className="relative z-10 flex items-center w-full gap-3">
                            {/* FIX 2: changed bg-indigo-600 → bg-amber-400 to match screenshot */}
                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img src={Exchange_Amount} alt="coin" className="w-6 h-6 object-contain" />
                            </div>
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
                    </div>

                    <p className="text-gray-400 text-sm mt-2 ml-1">
                        *1$ = {WALLET_DATA.coinsPerDollar.toLocaleString()} Coins
                    </p>

                    {coinsPreview && (
                        <p className="text-indigo-600 text-sm mt-1 ml-1 font-medium">
                            &#8776; {coinsPreview} Coins
                        </p>
                    )}
                </div>

            </div>
            {/* FIX 3: flex-1 wrapper properly closed here — button/toast are now outside */}

            {/* ── Exchange Button ── */}
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
                    {loading ? "Processing…" : "Exchange"}
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