import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .aac-root { 
    font-family: 'Nunito', sans-serif; 
    background: #ffffff; 
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  .aac-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 16px;
    position: relative;
    background: #ffffff;
  }

  .aac-back-btn {
    position: absolute;
    left: 16px;
    background: none;
    border: none;
    font-size: 28px;
    color: #1a1a2e;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .aac-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
  }

  /* Content */
  .aac-content {
    flex: 1;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
  }

  .aac-section-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 16px;
  }

  .aac-input-wrapper {
    margin-bottom: 12px;
  }

  .aac-input-row {
    display: flex;
    gap: 10px;
  }

  .aac-input {
    flex: 1;
    padding: 16px 18px;
    font-size: 15px;
    font-family: 'Nunito', sans-serif;
    font-weight: 500;
    color: #1a1a2e;
    background: #f5f5f5;
    border: none;
    border-radius: 12px;
    outline: none;
    transition: background 0.2s;
  }

  .aac-input::placeholder {
    color: #999;
    font-weight: 400;
  }

  .aac-input:focus {
    background: #ebebeb;
  }

  .aac-search-btn {
    padding: 0 24px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    color: #1a1a2e;
    background: #e5e5e5;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .aac-search-btn:hover {
    background: #d5d5d5;
  }

  .aac-search-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .aac-description {
    font-size: 14px;
    font-weight: 400;
    color: #666;
    line-height: 1.6;
    margin-bottom: auto;
  }

  .aac-error {
    font-size: 13px;
    font-weight: 500;
    color: #e53935;
    margin-top: 8px;
  }

  .aac-apply-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Search Results */
  .aac-results {
    margin-top: 16px;
    max-height: 200px;
    overflow-y: auto;
  }

  .aac-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    margin-bottom: 8px;
    background: #f5f5f5;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
    border: 2px solid transparent;
  }

  .aac-result-item:hover {
    background: #ebebeb;
  }

  .aac-result-item.selected {
    border-color: #3b82f6;
    background: #eef2ff;
  }

  .aac-result-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background: #ddd;
  }

  .aac-result-info {
    flex: 1;
    min-width: 0;
  }

  .aac-result-name {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .aac-result-uid {
    font-size: 13px;
    font-weight: 500;
    color: #666;
  }

  /* Button */
  .aac-button-container {
    padding: 20px;
    background: #ffffff;
  }

  .aac-apply-btn {
    width: 100%;
    padding: 16px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    color: #1a1a2e;
    background: #e5e5e5;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .aac-apply-btn:hover {
    background: #d5d5d5;
  }

  .aac-apply-btn:active {
    background: #c5c5c5;
  }
`;

export default function AgentAccountScreen() {
  const [agentAccount, setAgentAccount] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingHostStatus, setCheckingHostStatus] = useState(true);
  const navigate = useNavigate();

  const checkHostStatus = async () => {
    try {
      const result = await api.get("/user/profile");
      console.log("User Profile:", result);

      if (result?.status && result?.data?.user_roles) {
        // Check if user has "host" role
        if (result.data.user_roles.includes("host")) {
          navigate("/host/dashboard");
        }
      }
    } catch (error) {
      console.error("User profile check error:", error);
      // If check fails, continue to show the search screen
    } finally {
      setCheckingHostStatus(false);
    }
  };

  useEffect(() => {
    checkHostStatus();
  }, []);

  const handleSearch = async () => {
    if (!agentAccount.trim()) {
      setError("Please enter an Agent Account");
      return;
    }

    try {
      setSearchLoading(true);
      setError("");
      setSearchResults([]);
      setSelectedUser(null);

      const result = await api.post("/agency/search-user", {
        search: agentAccount.trim()
      });

      console.log("Search Result:", result);

      if (result.status && result.data && result.data.length > 0) {
        setSearchResults(result.data);
      } else {
        setError("No user found with this account");
      }
    } catch (err) {
      console.error("API Error:", err);
      console.error("Error response:", err.response);
      setError("Failed to search user. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedUser) {
      setError("Please select a user first");
      return;
    }

    try {
      setApplyLoading(true);
      setError("");

      const result = await api.post("/host/apply-for-host", {
        user_id: selectedUser.id,
        agency_uid: selectedUser.uid
      });

      console.log("Apply Result:", result);

      if (result.status) {
        // Success - navigate to dashboard
        navigate("/host/dashboard");
      } else {
        setError(result.message || "Failed to apply for host");
      }
    } catch (err) {
      console.error("API Error:", err);
      console.error("Error response:", err.response);
      setError("Failed to apply for host. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="aac-root">
        {/* Header */}
        <div className="aac-header">
          <button className="aac-back-btn">‹</button>
          <h1 className="aac-title">Host Center</h1>
        </div>

        {/* Content */}
        <div className="aac-content">
          {checkingHostStatus ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>Checking host status...</p>
          ) : (
            <>
              <h2 className="aac-section-title">Agent Account:</h2>
          
              <div className="aac-input-wrapper">
                <div className="aac-input-row">
                  <input
                    type="text"
                    className="aac-input"
                    placeholder="Please enter an Agent Account"
                    value={agentAccount}
                    onChange={(e) => {
                      setAgentAccount(e.target.value);
                      setError("");
                    }}
                    disabled={searchLoading || applyLoading}
                  />
                  <button 
                    className="aac-search-btn" 
                    onClick={handleSearch}
                    disabled={searchLoading || applyLoading}
                  >
                    {searchLoading ? "..." : "Search"}
                  </button>
                </div>
                {error && <p className="aac-error">{error}</p>}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="aac-results">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className={`aac-result-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <img
                        src={user.image || "https://via.placeholder.com/48"}
                        alt={user.name}
                        className="aac-result-avatar"
                      />
                      <div className="aac-result-info">
                        <div className="aac-result-name">{user.name}</div>
                        <div className="aac-result-uid">UID: {user.uid}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="aac-description">
                Enter your proxy account, and once the anchor application is approved, you will become a signed anchor.
              </p>
            </>
          )}
        </div>

        {/* Apply Button */}
        <div className="aac-button-container">
          <button 
            className="aac-apply-btn" 
            onClick={handleApply} 
            disabled={!selectedUser || applyLoading || searchLoading}
          >
            {applyLoading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
    </>
  );
}
