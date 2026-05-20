/**
 * RoomRewardPage — fixed: ar11.png now renders at full natural height
 * via an <img> element instead of a CSS background with aspect-ratio.
 */

import HEADER_BG from "../../assets/ar11.webp";   // Image 1 — full banner + frame
import FRAME_BG  from "../../assets/ar111.webp";  // Image 2 — optional secondary frame

const REWARD_ROWS = [
  { contribution: "150K",  reward: "22.5K"  },
  { contribution: "300K",  reward: "45K"    },
  { contribution: "500K",  reward: "75K"    },
  { contribution: "700K",  reward: "105K"   },
  { contribution: "1M",    reward: "150K"   },
  { contribution: "1.5M",  reward: "225K"   },
  { contribution: "2M",    reward: "300K"   },
  { contribution: "2.5M",  reward: "375K"   },
  { contribution: "3M",    reward: "450K"   },
  { contribution: "3.5M",  reward: "525K"   },
  { contribution: "4M",    reward: "600K"   },
  { contribution: "4.5M",  reward: "675K"   },
  { contribution: "5M",    reward: "750K"   },
  { contribution: "6M",    reward: "900K"   },
  { contribution: "8M",    reward: "1.2M"   },
  { contribution: "10M",   reward: "1.5M"   },
  { contribution: "12M",   reward: "1.8M"   },
  { contribution: "15M",   reward: "2.25M"  },
  { contribution: "18M",   reward: "2.7M"   },
  { contribution: "20M",   reward: "3M"     },
  { contribution: "30M",   reward: "4.5M"   },
  { contribution: "50M",   reward: "7.5M"   },
];

const CoinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="url(#cg)" stroke="#c8860a" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="8"  fill="url(#cg2)" opacity="0.6"/>
    <text x="12" y="16.5" textAnchor="middle" fontSize="10"
          fontWeight="900" fill="#7a3f00" fontFamily="serif">$</text>
    <defs>
      <radialGradient id="cg"  cx="35%" cy="30%">
        <stop offset="0%"   stopColor="#ffe066"/>
        <stop offset="100%" stopColor="#c8860a"/>
      </radialGradient>
      <radialGradient id="cg2" cx="35%" cy="30%">
        <stop offset="0%"   stopColor="#fff5b0" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#c8860a" stopOpacity="0"/>
      </radialGradient>
    </defs>
  </svg>
);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Nunito:wght@500;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rr-root {
    font-family: 'Nunito', sans-serif;
    background: #1a0505;
    min-height: 100vh;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
    padding-bottom: 80px;
  }

  /* ── HEADER ─────────────────────────────────────────────────── */
  /*
   * KEY FIX: drop aspect-ratio and background-image entirely.
   * Use a real <img> so the browser respects the image's natural
   * dimensions. The nav and coin overlay are positioned absolutely
   * on top of it.
   */
  .rr-header {
    position: relative;
    width: 100%;
  }
  .rr-header-img {
    width: 100%;
    height: auto;       /* ← renders at the image's natural height */
    display: block;
    object-fit: contain;
  }

  /* Nav sits on top of the image */
  .rr-header-nav {
    position: absolute;
    top: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    z-index: 10;
  }
  .rr-nav-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(0,0,0,0.35);
    border: 1.5px solid rgba(255,210,80,0.4);
    color: #ffd84a;
    font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(4px);
    flex-shrink: 0;
  }
  // .rr-nav-title {
  //   font-family: 'Cinzel', serif;
  //   font-size: 17px;
  //   font-weight: 700;
  //   color: #ffe97a;
  //   text-shadow: 0 2px 8px rgba(0,0,0,0.6);
  //   letter-spacing: 1px;
  // }
  .rr-help-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: radial-gradient(circle,#c0392b,#8e0000);
    border: 2px solid rgba(255,160,80,0.5);
    color: #fff;
    font-weight: 900;
    font-size: 17px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(200,50,0,0.5);
  }

  /* Coin count floated over the "Available" ribbon */
  .rr-available-area {
    position: absolute;
    /* sits roughly over the ribbon — tweak % to match your image */
    bottom: 27%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .rr-coin-count {
    font-family: 'Cinzel', serif;
    font-size: 28px;
    font-weight: 900;
    color: #ffe97a;
    text-shadow: 0 0 16px rgba(255,180,0,0.8), 0 2px 4px rgba(0,0,0,0.8);
  }

  /* ── FRAMED SECTION ─────────────────────────────────────────── */
  .rr-frame-wrap {
    position: relative;
    width: 100%;
    padding: 0 6px;
    margin-top: -4px;
  }
  .rr-frame-inner {
    position: relative;
    z-index: 1;
    padding: 80px 42px 50px;
  }

  /* ── TABLE ───────────────────────────────────────────────────── */
  .rr-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
  }
  .rr-table thead tr {
    background: rgba(120,40,0,0.7);
    border-bottom: 1.5px solid rgba(255,180,60,0.35);
  }
  .rr-table thead th {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 700;
    color: #ffd9a0;
    letter-spacing: 0.5px;
    padding: 10px 8px;
    text-align: center;
  }
  .rr-table tbody tr {
    border-bottom: 1px solid rgba(255,180,60,0.1);
    transition: background 0.15s;
  }
  .rr-table tbody tr:nth-child(even) { background: rgba(255,255,255,0.03); }
  .rr-table tbody tr:nth-child(odd)  { background: rgba(0,0,0,0.18); }
  .rr-table tbody tr:hover           { background: rgba(255,180,60,0.1); }
  .rr-table td {
    padding: 10px 8px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color: #f0e8d0;
    vertical-align: middle;
  }
  .rr-table td:first-child {
    color: #ffe0a0;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 0.3px;
  }
  .rr-table tbody tr.milestone {
    background: linear-gradient(90deg,
      rgba(180,100,0,0.25),
      rgba(255,160,0,0.1),
      rgba(180,100,0,0.25)) !important;
    border-top: 1px solid rgba(255,200,60,0.3);
    border-bottom: 1px solid rgba(255,200,60,0.3);
  }
  .rr-table tbody tr.milestone td:first-child {
    color: #ffe566;
    text-shadow: 0 0 8px rgba(255,200,0,0.5);
    animation: shimmer 2.5s ease-in-out infinite;
  }
  @keyframes shimmer {
    0%,100% { opacity: 0.7 }
    50%      { opacity: 1   }
  }

  /* ── STICKY FOOTER ───────────────────────────────────────────── */
  .rr-footer {
    position: fixed;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: linear-gradient(180deg,#1f0a0a 0%,#120000 100%);
    border-top: 1.5px solid rgba(255,180,60,0.3);
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    z-index: 100;
    box-shadow: 0 -8px 24px rgba(0,0,0,0.6);
  }
  .rr-footer-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    flex: 1;
  }
  .rr-footer-item + .rr-footer-item {
    align-items: flex-end;
    border-left: 1px solid rgba(255,180,60,0.2);
    padding-left: 12px;
  }
  .rr-footer-label {
    font-size: 11px;
    color: rgba(255,220,150,0.6);
    font-weight: 600;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .rr-footer-value {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Cinzel', serif;
    font-size: 17px;
    font-weight: 900;
    color: #ffc840;
    text-shadow: 0 0 12px rgba(255,180,0,0.6);
  }
  .rr-footer-pill {
    background: linear-gradient(135deg,#c0392b,#8e0000);
    border: 1.5px solid rgba(255,120,60,0.5);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 15px;
    font-weight: 900;
    color: #fff;
    box-shadow: 0 2px 10px rgba(200,0,0,0.4);
  }
`;

export default function RoomRewardPage() {
  const milestoneIndexes = new Set([4, 7, 10, 14, 16, 19, 21]);

  return (
    <>
      <style>{css}</style>

      <div className="rr-root">

        {/* ══ HEADER — ar11.png at full natural height ═════════════ */}
        <div className="rr-header">

          {/* ✅ img tag — renders the full image without cropping */}
          <img
            src={HEADER_BG}
            alt="Room Reward Event banner"
            className="rr-header-img"
            draggable={false}
          />

          {/* Nav overlaid on top */}
          <div className="rr-header-nav">
            <button className="rr-nav-btn">&#8249;</button>
            {/* <span className="rr-nav-title">Room Reward</span> */}
            <div className="rr-help-btn">?</div>
          </div> 

          {/* Coin count over the "Available" ribbon */}
          <div className="rr-available-area">
            <span className="rr-coin-count">0</span>
            <CoinIcon size={28} />
          </div>
        </div>

        {/* ══ FRAMED SECTION — ar111.png ═══════════════════════════ */}
        <div className="rr-frame-wrap">
          <img
            src={FRAME_BG}
            alt=""
            aria-hidden="true"
            decoding="async"
            style={{
              width: "100%",
              display: "block",
              position: "absolute",
              top: 0, left: 0,
              height: "100%",
              objectFit: "fill",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <div className="rr-frame-inner">
            <table className="rr-table mt-7">
              <thead>
                <tr>
                  <th>Room Contribution</th>
                  <th>Cumulative Rewards</th>
                </tr>
              </thead>
              <tbody>
                {REWARD_ROWS.map((row, i) => (
                  <tr
                    key={row.contribution}
                    className={milestoneIndexes.has(i) ? "milestone" : ""}
                  >
                    <td>{row.contribution}</td>
                    <td>
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        color: "#ffc840",
                        fontWeight: 900,
                      }}>
                        {row.reward}
                        <CoinIcon size={16} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ STICKY FOOTER ════════════════════════════════════════ */}
        <div className="rr-footer">
          <div className="rr-footer-item">
            <span className="rr-footer-label">This week's contribution</span>
            <div className="rr-footer-value">
              <span className="rr-footer-pill">3.9K</span>
              <CoinIcon size={20} />
            </div>
          </div>
          <div className="rr-footer-item">
            <span className="rr-footer-label">This week's rewards</span>
            <div className="rr-footer-value">
              <span style={{ color: "#ffc840" }}>0</span>
              <CoinIcon size={20} />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}