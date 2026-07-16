import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BG_IMG from "../../../assets/exchange_bd_img.webp";
import WALLET_IMG from "../../../assets/wallet_img.webp";

const BASE_URL = "https://vanivoicechat.com/api";
// TODO: replace with your real auth token, e.g. pulled from context/storage.
const TOKEN = "V52rzcafZU3I12EKhMMqIls36rhAUuDZEeGKB9t8a14e11fd";

async function fetchWalletBalance() {
    const res = await fetch(`${BASE_URL}/host/wallet-balance`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to load wallet balance (${res.status})`);
    }

    const json = await res.json();

    if (!json.status) {
        throw new Error(json.message || "Unexpected response from server");
    }

    return json.data; // { balance, formatted_balance }
}

// Not returned by the wallet-balance API — keep as a display-only constant
// until there's a real source for the exchange rate.
const COINS_PER_DOLLAR = 8700;

async function searchTransferUser(uid) {
    const res = await fetch(`${BASE_URL}/host/search-transfer-user?uid=${encodeURIComponent(uid)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
        },
    });

    const json = await res.json();

    if (!res.ok || !json.status) {
        throw new Error(json.message || `User not found (${res.status})`);
    }

    return json.data; // { user_id, uid, name, role, image }
}

async function transferDollar({ uid, amount }) {
    // NOTE: the Postman example doesn't show a Body tab filled in, so this
    // assumes uid/amount are sent as form-data like the other POST
    // endpoints (e.g. exchange-salary-to-coins). Adjust field names here
    // if your backend expects different keys.
    const formData = new FormData();
    formData.append("uid", uid);
    formData.append("amount", amount);

    const res = await fetch(`${BASE_URL}/host/transfer-dollar`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
        },
        body: formData,
    });

    const json = await res.json();

    if (!res.ok || !json.status) {
        throw new Error(json.message || `Transfer failed (${res.status})`);
    }

    return json; // { status, message }
}

export default function ExchangePage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");

    const [balance, setBalance] = useState(0);
    const [balanceStatus, setBalanceStatus] = useState("loading"); // loading | error | ready

    const [foundUser, setFoundUser] = useState(null); // { user_id, uid, name, role, image }
    const [searchStatus, setSearchStatus] = useState("idle"); // idle | loading | found | error

    useEffect(() => {
        let cancelled = false;

        fetchWalletBalance()
            .then((data) => {
                if (!cancelled) {
                    setBalance(data.balance);
                    setBalanceStatus("ready");
                }
            })
            .catch(() => {
                if (!cancelled) setBalanceStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const coinsPreview = amount
        ? (parseFloat(amount) * COINS_PER_DOLLAR).toLocaleString()
        : null;

    const handleSearch = async () => {
        if (!userId.trim()) {
            setToast("Please enter a User ID");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        setSearchStatus("loading");
        setFoundUser(null);
        try {
            const data = await searchTransferUser(userId.trim());
            setFoundUser(data);
            setSearchStatus("found");
        } catch (err) {
            setSearchStatus("error");
            setToast(err.message || "User not found");
            setTimeout(() => setToast(""), 2000);
        }
    };

    const handleExchange = async () => {
        if (!foundUser) {
            setToast("Please search and select a User ID first");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setToast("Please enter a valid amount");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        if (parseFloat(amount) > balance) {
            setToast("Insufficient balance");
            setTimeout(() => setToast(""), 2000);
            return;
        }
        setLoading(true);
        try {
            await transferDollar({ uid: foundUser.uid, amount });
            setToast(`Transferred to ${foundUser.name}!`);
            setAmount("");
            setUserId("");
            setFoundUser(null);
            setSearchStatus("idle");

            // API doesn't return a remaining balance, so refetch it.
            setBalanceStatus("loading");
            try {
                const data = await fetchWalletBalance();
                setBalance(data.balance);
                setBalanceStatus("ready");
            } catch {
                setBalanceStatus("error");
            }
        } catch (err) {
            setToast(err.message || "Transfer failed. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => setToast(""), 2500);
        }
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
                                    {balanceStatus === "loading" && (
                                        <span className="inline-block w-24 h-7 bg-white/30 rounded-lg animate-pulse align-middle" />
                                    )}
                                    {balanceStatus === "error" && "—"}
                                    {balanceStatus === "ready" && (
                                        <>
                                            ${balance.toFixed(2)}
                                            <span className="text-base font-semibold ml-1 opacity-80">USD</span>
                                        </>
                                    )}
                                </p>
                                <p className="text-white text-sm opacity-70 mt-0.5">
                                    {balanceStatus === "error" ? "Couldn't load balance" : "Available Balance"}
                                </p>
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
                                onChange={(e) => {
                                    setUserId(e.target.value);
                                    setFoundUser(null);
                                    setSearchStatus("idle");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="flex-1 outline-none text-gray-900 text-base bg-transparent placeholder-gray-400"
                            />
                        </div>
                        {/* Search button */}
                        <button
                            onClick={handleSearch}
                            disabled={searchStatus === "loading"}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform flex-shrink-0 disabled:opacity-60"
                            style={{ background: "linear-gradient(135deg, #3b2fa0 0%, #5b4dd4 100%)" }}
                        >
                            {searchStatus === "loading" ? (
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
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
                            )}
                        </button>
                    </div>

                    {/* Found user confirmation card */}
                    {searchStatus === "found" && foundUser && (
                        <div className="mt-3 bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                            <img
                                src={foundUser.image}
                                alt={foundUser.name}
                                className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{foundUser.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">UID: {foundUser.uid}</p>
                            </div>
                            <span className="text-green-500 text-lg flex-shrink-0">&#10003;</span>
                        </div>
                    )}
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
                    disabled={loading || !foundUser}
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