import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BANK_IMG from "../../../assets/bank.webp";
import HISTORY_IMG from "../../../assets/history.webp";
import USDT_IMG from "../../../assets/usdt.webp";
import BG_IMG from "../../../assets/withdraw_bg_img.webp";

const WALLET_DATA = {
    balance: 0.80,
    currency: "USD",
};

export default function WithdrawPage() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("bank"); // "bank" | "usdt"
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");

    // Bank fields
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [holderName, setHolderName] = useState("");

    // USDT fields
    const [walletAddress, setWalletAddress] = useState("");

    // Shared
    const [amount, setAmount] = useState("");

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleWithdraw = async () => {
        if (method === "bank") {
            if (!bankName.trim()) return showToast("Please enter Bank Name");
            if (!accountNumber.trim()) return showToast("Please enter Account Number");
            if (!ifscCode.trim()) return showToast("Please enter IFSC Code");
            if (!holderName.trim()) return showToast("Please enter Account Holder Name");
        } else {
            if (!walletAddress.trim()) return showToast("Please enter Wallet Address");
        }
        if (!amount || parseFloat(amount) <= 0) return showToast("Please enter a valid amount");
        if (parseFloat(amount) > WALLET_DATA.balance) return showToast("Insufficient balance");

        setLoading(true);
        // TODO: replace with real API call
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        showToast("Withdrawal request submitted!");
        setAmount("");
        setBankName(""); setAccountNumber(""); setIfscCode(""); setHolderName("");
        setWalletAddress("");
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
                    className="absolute left-4 text-gray-700 text-2xl font-light leading-none"
                >
                    &#8249;
                </button>
                <h1 className="w-full text-center text-lg font-bold text-gray-900">Withdraw</h1>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="flex-1 flex flex-col px-4 pt-4 pb-8 gap-4">

                {/* ── Balance Card ── */}
                <div
                    className="rounded-3xl p-5 relative overflow-hidden"
                    style={{ minHeight: 190 }}
                >
                    {/* Background image */}
                    <img
                        src={BG_IMG}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* History button */}
                    <div className="flex justify-end relative z-10">
                        <button
                            onClick={() => navigate("/host/withdraw/history")}
                            className="bg-white bg-opacity-80 text-gray-800 font-semibold text-sm px-3 py-2 rounded-full flex items-center gap-1.5 shadow-sm"
                        >
                            <img src={HISTORY_IMG} alt="history" className="w-5 h-6 object-contain" />
                            History
                        </button>
                    </div>

                    {/* Balance info */}
                    <div className="relative z-10 mt-1">
                        <p className="text-gray-800 font-semibold text-sm">Available Balance</p>
                        <p className="text-gray-900 font-extrabold text-4xl leading-tight mt-0.5">
                            ${WALLET_DATA.balance.toFixed(2)}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">Choose a method & amount to withdraw</p>
                    </div>

                    {/* Method toggle */}
                    <div
                        className="flex mt-4 rounded-full p-1 relative z-10"
                        style={{ background: "rgba(255,255,255,0.35)" }}
                    >
                        <button
                            onClick={() => setMethod("bank")}
                            className={`flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                                method === "bank"
                                    ? "bg-white text-gray-900 shadow"
                                    : "text-gray-700"
                            }`}
                        >
                            <img src={BANK_IMG} alt="bank" className="w-5 h-5 object-contain" />
                            Bank
                        </button>
                        <button
                            onClick={() => setMethod("usdt")}
                            className={`flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                                method === "usdt"
                                    ? "bg-white text-gray-900 shadow"
                                    : "text-gray-700"
                            }`}
                        >
                            <img src={USDT_IMG} alt="usdt" className="w-5 h-5 object-contain" />
                            USDT
                        </button>
                    </div>
                </div>

                {/* ── Withdrawal Details Card ── */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                        <h2 className="text-gray-900 font-bold text-lg">Withdrawal Details</h2>
                        <span className="text-indigo-400 text-sm font-medium">
                            {method === "bank" ? "Bank transfer" : "USDT payout"}
                        </span>
                    </div>

                    <div className="px-5 pb-5 flex flex-col gap-0">
                        {method === "bank" ? (
                            <>
                                <Field label="Bank Name">
                                    <input
                                        type="text"
                                        placeholder="e.g., HDFC Bank"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        className="w-full outline-none text-gray-900 text-base placeholder-gray-400 bg-transparent"
                                    />
                                </Field>
                                <Field label="Account Number">
                                    <input
                                        type="text"
                                        placeholder="Account Number"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        className="w-full outline-none text-gray-900 text-base placeholder-gray-400 bg-transparent"
                                    />
                                </Field>
                                <Field label="IFSC Code">
                                    <input
                                        type="text"
                                        placeholder="e.g., HDFC0001234"
                                        value={ifscCode}
                                        onChange={(e) => setIfscCode(e.target.value)}
                                        className="w-full outline-none text-gray-900 text-base placeholder-gray-400 bg-transparent"
                                    />
                                </Field>
                                <Field label="Account Holder Name">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={holderName}
                                        onChange={(e) => setHolderName(e.target.value)}
                                        className="w-full outline-none text-gray-900 text-base placeholder-gray-400 bg-transparent"
                                    />
                                </Field>
                            </>
                        ) : (
                            <Field label="USDT Wallet Address">
                                <input
                                    type="text"
                                    placeholder="Wallet Address"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    className="w-full outline-none text-gray-900 text-base placeholder-gray-400 bg-transparent"
                                />
                            </Field>
                        )}

                        <Field label="Withdrawal Amount" last>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full outline-none text-gray-900 text-base placeholder-gray-400 bg-transparent"
                            />
                        </Field>

                        {/* ── Withdraw Button ── */}
                        <button
                            onClick={handleWithdraw}
                            disabled={loading}
                            className="mt-5 w-full py-4 rounded-2xl text-white font-bold text-lg shadow-md active:scale-95 transition-transform disabled:opacity-70"
                            style={{ background: "linear-gradient(135deg, #5b6df8 0%, #7b8cf9 100%)" }}
                        >
                            {loading ? "Processing…" : "Withdraw"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2 rounded-full shadow-lg z-50 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
}

// Reusable field row
function Field({ label, children, last = false }) {
    return (
        <div className={`py-4 ${!last ? "border-b border-gray-100" : ""}`}>
            <p className="text-indigo-500 font-semibold text-sm mb-2">{label}</p>
            <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                {children}
            </div>
        </div>
    );
}