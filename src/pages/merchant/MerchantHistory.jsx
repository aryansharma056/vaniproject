import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const PAGE_SIZE = 10;

export default function MerchantHistory() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchMerchantHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await api.get("/merchant/merchant-history");
      console.log("Merchant History:", result);

      if (result?.status && result?.data) {
        setHistoryData(result.data);
      } else {
        let errorMessage = "Failed to fetch history";
        if (result?.message) {
          if (typeof result.message === 'string') {
            errorMessage = result.message;
          } else if (typeof result.message === 'object') {
            const errorKeys = Object.keys(result.message);
            if (errorKeys.length > 0) {
              errorMessage = result.message[errorKeys[0]][0] || errorMessage;
            }
          }
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Merchant history API error:", err);
      let errorMessage = "Failed to fetch history. Please try again.";
      if (err.response?.data?.message) {
        if (typeof err.response.data.message === 'string') {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data.message === 'object') {
          const errorKeys = Object.keys(err.response.data.message);
          if (errorKeys.length > 0) {
            errorMessage = err.response.data.message[errorKeys[0]][0] || errorMessage;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantHistory();
  }, []);

  const visibleHistory = historyData.slice(0, visibleCount);
  const hasMore = visibleCount < historyData.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, historyData.length));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeLabel = (transactionType) => {
    switch (transactionType) {
      case 'merchant_to_user':
        return 'To User';
      case 'merchant_to_seller':
        return 'To Seller';
      case 'recharge':
        return 'Recharge';
      default:
        return transactionType;
    }
  };

  const getTransactionColor = (transactionType) => {
    switch (transactionType) {
      case 'merchant_to_user':
      case 'merchant_to_seller':
        return 'text-blue-500';
      case 'recharge':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] font-sans antialiased">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between
                         px-4 py-4 bg-white border-b border-gray-100 shadow-sm">
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

        <h1 className="text-lg font-bold text-[#1a1a2e]">Merchant History</h1>

        <div className="w-9" aria-hidden="true" />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500 text-center px-4">{error}</p>
          </div>
        ) : historyData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No history found</p>
          </div>
        ) : (
          <>
            {/* History cards */}
            <div className="space-y-3">
              {visibleHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4
                             bg-white border border-gray-100 rounded-2xl
                             shadow-sm shadow-gray-100/40"
                >
                  {/* Left - type name + timestamp */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-gray-800 tracking-wide">
                      {getTransactionTypeLabel(item.transaction_type)}
                    </span>
                    <span className="text-xs font-medium text-gray-400 tracking-tight">
                      {formatDate(item.created_at)}
                    </span>
                    {item.remark && (
                      <span className="text-xs text-gray-500 mt-1">
                        {item.remark}
                      </span>
                    )}
                  </div>

                  {/* Right - amount */}
                  <span
                    className={`text-sm font-bold tracking-tight ${getTransactionColor(item.transaction_type)}`}
                  >
                    {item.coin > 0 ? '+' : ''}{item.coin}
                  </span>
                </div>
              ))}
            </div>

            {/* Load More Button */}
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

            {/* End of list message */}
            {!hasMore && (
              <p className="text-center text-xs text-gray-400 pt-5 pb-2">
                You've reached the end
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
