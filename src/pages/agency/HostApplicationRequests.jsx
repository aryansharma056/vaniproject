import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AVATAR_IMG from "../../assets/ht heaven place.webp";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .har-root { font-family: 'Nunito', sans-serif; background: #dce6f5; min-height: 100vh; }

  .har-header {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    position: relative;
    border-bottom: 1px solid #f0f0f0;
  }

  .har-back-btn {
    position: absolute;
    left: 16px;
    background: none;
    border: none;
    font-size: 28px;
    color: #1a1a2e;
    cursor: pointer;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: background 0.2s;
  }

  .har-back-btn:hover {
    background: #f5f5f5;
  }

  .har-title {
    font-size: 18px;
    font-weight: 800;
    color: #1a1a2e;
  }

  .har-body {
    flex: 1;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .har-card {
    background: #fff;
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .har-card-top {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .har-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background: #e0e0e0;
  }

  .har-info {
    flex: 1;
    min-width: 0;
  }

  .har-name {
    font-size: 15px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 4px;
  }

  .har-uid {
    font-size: 13px;
    font-weight: 600;
    color: #888;
  }

  .har-status {
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .har-status-pending {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
  }

  .har-status-approved {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .har-status-rejected {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .har-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }

  .har-date {
    font-size: 12px;
    font-weight: 600;
    color: #888;
  }

  .har-actions {
    display: flex;
    gap: 8px;
  }

  .har-action-btn {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .har-action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .har-accept-btn {
    background: #28a745;
    color: #fff;
  }

  .har-accept-btn:hover:not(:disabled) {
    background: #218838;
  }

  .har-reject-btn {
    background: #dc3545;
    color: #fff;
  }

  .har-reject-btn:hover:not(:disabled) {
    background: #c82333;
  }

  .har-loading {
    text-align: center;
    color: #888;
    margin-top: 40px;
    font-size: 15px;
  }

  .har-empty {
    text-align: center;
    color: #888;
    margin-top: 40px;
    font-size: 14px;
  }
`;

function RequestCard({ request, onAction, actionLoading }) {
  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'har-status-pending';
      case 'approved': return 'har-status-approved';
      case 'rejected': return 'har-status-rejected';
      default: return 'har-status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isPending = request.invite_status?.toLowerCase() === 'pending';

  return (
    <div className="har-card">
      <div className="har-card-top">
        <img
          src={request.image || AVATAR_IMG}
          alt={request.name}
          className="har-avatar"
          onError={(e) => { e.target.src = AVATAR_IMG; }}
        />
        <div className="har-info">
          <div className="har-name">{request.name}</div>
          <div className="har-uid">UID: {request.uid}</div>
        </div>
        <div className={`har-status ${getStatusClass(request.invite_status)}`}>
          {request.invite_status || 'Pending'}
        </div>
      </div>
      <div className="har-card-bottom">
        <div className="har-date">{formatDate(request.created_at)}</div>
        {isPending && (
          <div className="har-actions">
            <button
              className="har-action-btn har-accept-btn"
              onClick={() => onAction(request.host_id, 'approve')}
              disabled={actionLoading === request.host_id}
            >
              Accept
            </button>
            <button
              className="har-action-btn har-reject-btn"
              onClick={() => onAction(request.host_id, 'reject')}
              disabled={actionLoading === request.host_id}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HostApplicationRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const result = await api.get("/agency/host-application-list");
      console.log("Host Applications:", result);

      if (result?.status) {
        setRequests(result.data || []);
      }
    } catch (error) {
      console.error("Host applications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (hostId, action) => {
    try {
      setActionLoading(hostId);
      const actionValue = action === 'approve' ? 'accept' : 'reject';
      const result = await api.post("/agency/host-application-action", {
        host_id: hostId,
        action: actionValue
      });
      console.log("Action Result:", result);

      if (result?.status) {
        // Refresh the list after successful action
        await fetchRequests();
      }
    } catch (error) {
      console.error("Action error:", error);
      alert(`Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="har-root">
        {/* Header */}
        <div className="har-header">
          <button className="har-back-btn" onClick={() => navigate("/agency")}>
            ‹
          </button>
          <h1 className="har-title">Host Applications</h1>
        </div>

        {/* Body */}
        <div className="har-body">
          {loading ? (
            <p className="har-loading">Loading...</p>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <RequestCard
                key={request.host_id}
                request={request}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            ))
          ) : (
            <p className="har-empty">No host applications found</p>
          )}
        </div>
      </div>
    </>
  );
}
