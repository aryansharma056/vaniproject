import { useState } from "react";
import ICON_MY_COIN  from "../../assets/my coin.webp";
import ICON_MERCHANT from "../../assets/merchant.webp";
import ICON_BALANCE  from "../../assets/Balance.webp";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .sel-root { font-family:'Nunito',sans-serif; background:#eef0f8; min-height:100vh; overflow:hidden; }

  /* Header */
  .sel-header { background:#0d1020; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; }
  .hbtn { background:rgba(255,255,255,0.1); border:none; color:#fff; width:38px; height:38px; border-radius:10px; cursor:pointer; font-size:20px; display:flex; align-items:center; justify-content:center; }

  /* ── Coin Card ── */
  .coin-card {
    background: linear-gradient(135deg,#0e1ecc 0%,#1a35e8 30%,#1c2fe0 55%,#2318c8 85%);
    border: 2.5px solid #f7a800;
    border-radius: 22px;
    margin: 14px 14px 12px;
    padding: 18px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    min-height: 145px;
    gap: 6px;
    box-shadow: 0 8px 32px rgba(15,30,200,0.55), inset 0 1px 0 rgba(255,255,255,0.08);
  }

  /* radial glow behind wallet */
  .coin-glow {
    position:absolute; top:50%; left:55%;
    transform:translate(-50%,-50%);
    width:65%; height:190px;
    background:radial-gradient(ellipse,rgba(80,130,255,0.38) 0%,transparent 70%);
    pointer-events:none;
  }
  /* dot pattern */
  .coin-dots {
    position:absolute; inset:0;
    background-image:radial-gradient(circle,rgba(180,200,255,0.16) 1px,transparent 1px);
    background-size:20px 20px;
    pointer-events:none;
  }
  /* diagonal lines */
  .coin-wave {
    position:absolute; bottom:0; left:0; right:0; height:55%;
    opacity:0.07; pointer-events:none;
    background:repeating-linear-gradient(170deg,transparent 0,transparent 10px,rgba(160,180,255,0.6) 11px,transparent 12px);
  }
  /* gold floor glow */
  .wallet-floor-glow {
    position:absolute; bottom:-4px; left:50%; transform:translateX(-50%);
    width:95%; height:26px;
    background:radial-gradient(ellipse,rgba(255,185,40,0.8) 0%,transparent 70%);
  }

  /* sparkle dot */
  .spark {
    position:absolute; border-radius:50%; background:#fff;
    animation:sparkle var(--d,2s) ease-in-out infinite;
    animation-delay:var(--delay,0s);
    opacity:0; pointer-events:none; z-index:1;
  }
  @keyframes sparkle {
    0%,100%{opacity:0;transform:scale(0.3);}
    50%{opacity:0.9;transform:scale(1);}
  }
  /* cross sparkle */
  .spark-cross {
    position:absolute; pointer-events:none; z-index:1;
    animation:sparkle var(--d,2s) ease-in-out infinite;
    animation-delay:var(--delay,0s); opacity:0;
  }

  /* responsive sizes via clamp */
  .coin-amount {
    font-weight:900; color:#fff; line-height:1; letter-spacing:-1px;
    font-size:clamp(28px,8vw,44px);
  }
  .coin-icon {
    border-radius:50%; object-fit:cover; flex-shrink:0;
    width:clamp(38px,10vw,52px);
    height:clamp(38px,10vw,52px);
    box-shadow:0 0 0 2.5px rgba(247,199,0,0.65), 0 4px 18px rgba(247,199,0,0.5);
  }
  .wallet-img {
    object-fit:contain; display:block; position:relative; z-index:1;
    width:clamp(80px,23vw,124px);
    height:clamp(72px,21vw,114px);
  }
  .divider-v {
    width:1.5px;
    background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.45),transparent);
    height:75px; flex-shrink:0; position:relative; z-index:2; margin:0 2px;
  }
  .hist-btn {
    display:flex; flex-direction:column; align-items:center; gap:7px;
    cursor:pointer; position:relative; z-index:2; flex-shrink:0; padding:0 4px;
  }
  .hist-circle {
    border-radius:50%;
    background:rgba(255,255,255,0.13);
    border:1.5px solid rgba(255,255,255,0.35);
    display:flex; align-items:center; justify-content:center;
    box-shadow:inset 0 1px 0 rgba(255,255,255,0.2);
    width:clamp(46px,12vw,62px);
    height:clamp(46px,12vw,62px);
  }
  .hist-label {
    font-weight:800; color:#fff; letter-spacing:0.2px;
    font-size:clamp(10px,2.8vw,13px);
  }

  /* Form card */
  .form-card { background:#fff; border-radius:20px; margin:0 16px; padding:20px 18px; box-shadow:0 2px 16px rgba(100,120,200,0.08); border:1px solid rgba(0,0,0,0.04); }
  .field-label { font-size:15px; font-weight:800; color:#1a1a2e; margin-bottom:10px; }
  .input-row { background:#f4f6fb; border-radius:50px; display:flex; align-items:center; padding:10px 10px 10px 14px; gap:10px; border:1.5px solid transparent; transition:border .2s; }
  .input-row:focus-within { border-color:#3355ff; }
  .input-row input { flex:1; border:none; background:transparent; outline:none; font-size:14px; color:#333; font-family:'Nunito',sans-serif; min-width:0; }
  .input-row input::placeholder { color:#aaa; }
  .search-btn { background:linear-gradient(135deg,#2244ee,#1133cc); color:#fff; border:none; border-radius:40px; padding:9px 18px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; white-space:nowrap; font-family:'Nunito',sans-serif; flex-shrink:0; }
  .send-btn { width:100%; background:linear-gradient(135deg,#1a44ee 0%,#2255ff 60%,#3366ff 100%); color:#fff; border:none; border-radius:50px; padding:16px; font-size:16px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; letter-spacing:1px; font-family:'Nunito',sans-serif; box-shadow:0 4px 16px rgba(34,68,238,0.4); position:relative; overflow:hidden; }
  .send-dots { position:absolute; right:0; top:0; bottom:0; width:40%; opacity:0.1; background-image:radial-gradient(circle,#fff 1px,transparent 1px); background-size:8px 8px; }

  /* Balance card */
  .bal-card { background:#fff; border-radius:20px; margin:12px 16px; padding:10px 18px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 2px 16px rgba(100,120,200,0.08); border:1px solid rgba(0,0,0,0.04); }
`;

const SPARKS = [
  [14, 50, 5, "1.8s", "0s"],
  [8,  63, 4, "2.3s", "0.4s"],
  [22, 74, 6, "1.6s", "0.7s"],
  [55, 79, 4, "2.1s", "0.2s"],
  [72, 67, 5, "1.9s", "1.0s"],
  [62, 47, 3, "2.4s", "0.5s"],
  [18, 41, 4, "1.7s", "0.9s"],
];

const CROSS_SPARKS = [
  [10, 55, 12, "2.0s", "0.1s"],
  [50, 77, 10, "2.5s", "0.6s"],
  [76, 57, 11, "1.8s", "1.2s"],
  [32, 83,  9, "2.2s", "0.8s"],
];

function CrossSpark({ top, left, size, d, delay }) {
  return (
    <div className="spark-cross" style={{ top:`${top}%`, left:`${left}%`, "--d":d, "--delay":delay }}>
      <svg width={size} height={size} viewBox="0 0 10 10">
        <line x1="5" y1="0" x2="5" y2="10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="0" y1="5" x2="10" y2="5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      </svg>
    </div>
  );
}

export default function SellerPage() {
  const [userId, setUserId] = useState("");
  const [quantity, setQuantity] = useState("");

  return (
    <>
      <style>{styles}</style>
      <div className="sel-root">

        {/* ── Header ── */}
        <div className="sel-header">
          <button className="hbtn">&#8249;</button>
          <span style={{ color:"#fff", fontSize:19, fontWeight:800, letterSpacing:"0.3px" }}>Seller</span>
          <button className="hbtn">&#10005;</button>
        </div>

        {/* ── My Coins Card ── */}
        <div className="coin-card">
          <div className="coin-glow"/>
          <div className="coin-dots"/>
          <div className="coin-wave"/>

          {SPARKS.map(([t,l,s,d,delay],i) => (
            <div key={i} className="spark" style={{
              top:`${t}%`, left:`${l}%`, width:s, height:s, "--d":d, "--delay":delay,
            }}/>
          ))}
          {CROSS_SPARKS.map(([t,l,s,d,delay],i) => (
            <CrossSpark key={i} top={t} left={l} size={s} d={d} delay={delay}/>
          ))}

          {/* Left: label + amount + balance */}
          <div style={{ position:"relative", zIndex:2, flex:"1 1 0", minWidth:0 }}>
            <p style={{
              fontWeight:800, color:"rgba(255,255,255,0.92)",
              marginBottom:12, letterSpacing:"0.2px",
              fontSize:"clamp(12px,3.5vw,15px)"
            }}>
              My Coins
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9, flexWrap:"nowrap" }}>
              <img src={ICON_MY_COIN} alt="coin" className="coin-icon"/>
              <span className="coin-amount">0.00</span>
            </div>
            <p style={{
              color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:"0.3px",
              fontSize:"clamp(10px,2.8vw,13px)"
            }}>
              Available Balance
            </p>
          </div>

          {/* Center: Wallet image */}
          <div style={{ position:"relative", zIndex:2, flexShrink:0 }}>
            <div className="wallet-floor-glow"/>
            <img src={ICON_MERCHANT} alt="wallet" className="wallet-img"/>
          </div>

          {/* Divider */}
          <div className="divider-v"/>

          {/* Right: History */}
          <div className="hist-btn">
            <div className="hist-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="2.5" width="13" height="16" rx="2.5" stroke="white" strokeWidth="1.5"/>
                <line x1="6.5" y1="7.5"  x2="13.5" y2="7.5"  stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="6.5" y1="10.5" x2="13.5" y2="10.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="6.5" y1="13.5" x2="10"   y2="13.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="17.5" cy="17.5" r="5" fill="#1428d4" stroke="white" strokeWidth="1.3"/>
                <line x1="17.5" y1="15.5" x2="17.5" y2="17.5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="17.5" y1="17.5" x2="19.2" y2="18.8" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="hist-label">History</span>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="form-card">

          <p className="field-label">User ID</p>
          <div className="input-row" style={{ marginBottom:20 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#aaa" strokeWidth="1.8"/>
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              placeholder="Please enter user ID"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <button className="search-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2"/>
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Search
            </button>
          </div>

          <p className="field-label">Quantity</p>
          <div className="input-row" style={{ marginBottom:6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="10" width="18" height="11" rx="3" stroke="#f7a800" strokeWidth="1.8"/>
              <path d="M7 10V8a5 5 0 0110 0v2" stroke="#f7a800" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="15.5" r="1.5" fill="#f7a800"/>
            </svg>
            <input
              placeholder="Please enter the amount of gold coins"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
            <img src={ICON_MY_COIN} alt="coin" style={{ width:34, height:34, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>
          </div>
          <p style={{ textAlign:"right", fontSize:13, color:"#aaa", marginBottom:16 }}>0 USD</p>

          <button className="send-btn">
            <div className="send-dots"/>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position:"relative", zIndex:1 }}>
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span style={{ position:"relative", zIndex:1, letterSpacing:2 }}>SEND</span>
          </button>
        </div>

        {/* ── Balance Card ── */}
        <div className="bal-card">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src={ICON_BALANCE} alt="Balance" style={{ width:70, height:60, objectFit:"contain" }}/>
            <span style={{ fontSize:17, fontWeight:800, color:"#1a1a2e" }}>Balance</span>
          </div>
          <span style={{ fontSize:22, color:"#999" }}>›</span>
        </div>

      </div>
    </>
  );
}