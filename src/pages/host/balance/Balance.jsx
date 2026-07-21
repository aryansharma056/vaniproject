import { useState, useEffect } from "react";
import BG_IMG from "../../../assets/bg_img.webp"
import EXCHANGE_ICON from "../../../assets/exchange_img.webp"
import TRANSFER_ICON from "../../../assets/transfer_img.webp"
import WITHDRAW_ICON from "../../../assets/withdraw_img.webp"
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://vanivoicechat.com/api";
// TODO: replace with your real auth token, e.g. pulled from context/storage.
// const TOKEN = "V52rzcafZU3I12EKhMMqIls36rhAUuDZEeGKB9t8a14e11fd";

async function fetchWalletBalance() {
  const token = localStorage.getItem("token"); // ⚠️ confirm this key name matches what you use at login

  if (!token) {
    throw new Error("No token found — user not logged in");
  }

  const res = await fetch(`${BASE_URL}/host/wallet-balance`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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

const ACTIONS = [
  {
    id: "exchange",
    label: "Exchange",
    sub: "Convert coins",
    icon: EXCHANGE_ICON,
  },
  {
    id: "transfer",
    label: "Transfer",
    sub: "Send money",
    icon: TRANSFER_ICON,
  },
  {
    id: "withdraw",
    label: "Withdraw",
    sub: "Bank withdrawal",
    icon: WITHDRAW_ICON,
  },
];

// ── Action Card ───────────────────────────────────────────────────────────────
function ActionCard({ action, onClick }) {
  return (
    <button
      onClick={() => onClick(action)}
      className="flex-1 bg-white rounded-2xl p-4 shadow-sm flex flex-col items-start gap-3 active:scale-95 transition-transform"
      style={{ minWidth: 0 }}
    >
      <div className="bg-gray-100 rounded-xl p-2.5 w-12 h-12 flex items-center justify-center">
        <img src={action.icon} alt={action.label} className="w-7 h-7 object-contain" />
      </div>
      <div className="text-left">
        <p className="font-bold text-gray-900 text-base leading-tight">{action.label}</p>
        <p className="text-gray-400 text-sm mt-0.5 leading-tight">{action.sub}</p>
      </div>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WalletPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [balanceStatus, setBalanceStatus] = useState("loading"); // loading | error | ready
  const [toast, setToast] = useState(null);

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

  const handleAction = (action) => {
    const routes = {
      exchange: "/host/exchange",
      transfer: "/host/transfer",
      withdraw: "/host/withdraw",
    };
    navigate(routes[action.id]);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: 430, margin: "0 auto" }}
    >
      {/* ── Header ── */}
      <div className="bg-white px-4 py-4 flex items-center relative shadow-sm">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-700 text-2xl font-light leading-none">
          &#8249;
        </button>
        <h1 className="w-full text-center text-lg font-bold text-gray-900">Wallet</h1>
      </div>

      {/* ── Balance Card ── */}
      <div className="mx-4 mt-4 rounded-3xl overflow-hidden shadow-lg relative" style={{ minHeight: 220 }}>
        {/* Purple BG image */}
        <img
          src={BG_IMG}
          alt="wallet background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Text overlay */}
        <div className="relative z-10 px-6 pt-8 pb-0">
          <p className="text-white text-4xl font-bold tracking-tight">
            {balanceStatus === "loading" && (
              <span className="inline-block w-28 h-9 bg-white/30 rounded-lg animate-pulse align-middle" />
            )}
            {balanceStatus === "error" && "—"}
            {balanceStatus === "ready" && `$ ${balance.toFixed(2)}`}
          </p>
          <p className="text-white text-base font-medium mt-2 opacity-90">
            {balanceStatus === "error" ? "Couldn't load balance" : "Wallet Balance - USD"}
          </p>
        </div>
      </div>

      {/* ── Action Cards ── */}
      <div className="mx-4 mt-4 flex gap-3">
        {ACTIONS.map((action) => (
          <ActionCard key={action.id} action={action} onClick={handleAction} />
        ))}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2 rounded-full shadow-lg z-50">
          {toast} tapped
        </div>
      )}
    </div>
  );
}