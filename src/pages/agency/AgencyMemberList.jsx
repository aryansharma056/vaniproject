import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AVATAR_IMG from "../../assets/ht heaven place.webp";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .aml-root { font-family: 'Nunito', sans-serif; background: #dce6f5; min-height: 100vh; }

  .aml-header {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    position: relative;
    border-bottom: 1px solid #f0f0f0;
  }

  .aml-back-btn {
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

  .aml-back-btn:hover {
    background: #f5f5f5;
  }

  .aml-title {
    font-size: 18px;
    font-weight: 800;
    color: #1a1a2e;
  }

  .aml-body {
    flex: 1;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .aml-card {
    background: #fff;
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .aml-card-top {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .aml-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background: #e0e0e0;
  }

  .aml-info {
    flex: 1;
    min-width: 0;
  }

  .aml-name {
    font-size: 15px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 4px;
  }

  .aml-uid {
    font-size: 13px;
    font-weight: 600;
    color: #888;
  }

  .aml-status {
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .aml-status-active {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .aml-status-inactive {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .aml-card-bottom {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #f0f0f0;
  }

  .aml-date {
    font-size: 12px;
    font-weight: 600;
    color: #888;
  }

  .aml-loading {
    text-align: center;
    color: #888;
    margin-top: 40px;
    font-size: 15px;
  }

  .aml-empty {
    text-align: center;
    color: #888;
    margin-top: 40px;
    font-size: 14px;
  }
`;

function MemberCard({ member }) {
  const getStatusClass = (status) => {
    return status ? 'aml-status-active' : 'aml-status-inactive';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="aml-card">
      <div className="aml-card-top">
        <img
          src={member.image || AVATAR_IMG}
          alt={member.name}
          className="aml-avatar"
          onError={(e) => { e.target.src = AVATAR_IMG; }}
        />
        <div className="aml-info">
          <div className="aml-name">{member.name}</div>
          <div className="aml-uid">UID: {member.uid}</div>
        </div>
        <div className={`aml-status ${getStatusClass(member.status)}`}>
          {member.status ? 'Active' : 'Inactive'}
        </div>
      </div>
      <div className="aml-card-bottom">
        <div className="aml-date">{formatDate(member.created_at)}</div>
      </div>
    </div>
  );
}

export default function AgencyMemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const result = await api.get("/agency/host-list");
      console.log("Host List:", result);

      if (result?.status) {
        setMembers(result.data || []);
      }
    } catch (error) {
      console.error("Host list error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="aml-root">
        {/* Header */}
        <div className="aml-header">
          <button className="aml-back-btn" onClick={() => navigate("/agency")}>
            ‹
          </button>
          <h1 className="aml-title">Members List</h1>
        </div>

        {/* Body */}
        <div className="aml-body">
          {loading ? (
            <p className="aml-loading">Loading...</p>
          ) : members.length > 0 ? (
            members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))
          ) : (
            <p className="aml-empty">No members found</p>
          )}
        </div>
      </div>
    </>
  );
}
