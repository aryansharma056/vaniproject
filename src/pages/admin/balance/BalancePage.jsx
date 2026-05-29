import React from "react";
import { useNavigate } from "react-router-dom";
import wallet from "../../../assets/wallet.webp";

export default function WalletPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] font-sans antialiased">
      
      {/* 1. HEADER ZONE */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        {/* Back Button */}
        <button 
          className="flex items-center justify-center w-8 h-8 text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => navigate(-1)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-lg font-bold text-[#1a1a2e]">Wallet</h1>

        {/* Layout Spacer (keeps title perfectly centered) */}
        <div className="w-8" />
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 space-y-4">
        
        {/* WALLET BANNER CARD */}
       <div
  className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl min-h-[220px] bg-cover bg-center"
  style={{
    backgroundImage: `url(${wallet})`,
  }}
>
  {/* Optional Dark Overlay */}
  <div className="absolute inset-0 bg-black/10 z-0" />

  {/* Card Content */}
  <div className="relative z-10 flex items-end justify-between h-full">
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium opacity-80">Amount</span>
      <span className="text-4xl font-extrabold tracking-tight">$ 0</span>
    </div>

    <button
      className="px-4 py-1.5 mb-8 text-xs font-semibold text-white bg-white/20 border border-white/40 rounded-full"
      onClick={() => navigate("/wallet/details")}
    >
      Details
    </button>
  </div>
</div>

        {/* 3. LOWER TIMELINE/ACTION PLACEHOLDER */}
        {/* <div className="flex-1 rounded-2xl bg-white border border-gray-100 p-4 min-h-[200px] flex items-center justify-center text-gray-400 text-sm">
          Transaction history and activity will show up here
        </div> */}

      </main>
    </div>
  );
}