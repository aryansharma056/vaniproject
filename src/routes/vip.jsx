import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useVIPData } from "../context/VIPContext";

const BASE = "https://vanivoicechat.kotiboxglobaltech.online";
const DEFAULT_USER  = `${BASE}/storage/defaul-user.png`;
const DEFAULT_BADGE = `${BASE}/public/uploads/vip/1715428644.png`;

const DEFAULTS = {
  entry:         `${BASE}/storage/vip/1777613995_8206.png`,
  chat_card:     `${BASE}/storage/vip/1777612812_4730.png`,
  voice_frame:   `${BASE}/storage/vip/1777893236_6626.png`,
  image_frame:   `${BASE}/storage/vip/1777613995_1230.png`,
  profile_frame: `${BASE}/storage/vip/1777613995_6826.png`,
};

const DEFAULT_PRIVILEGES = [
  { id: 1, name: "View visitors",    icon: `${BASE}/public/visitor_icon.png` },
  { id: 2, name: "Unlimited follow", icon: `${BASE}/public/follow_icon.png` },
  { id: 3, name: "Premium Badge",    icon: `${BASE}/storage/vip/privilege/1774524756_1840.png` },
];

const DOT_BG = {
  backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)",
  backgroundSize: "24px 24px",
};

export default function VipPage() {
  const { vipList, loading } = useVIPData();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    skipSnaps: false,
  });

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (loading || !vipList.length) return null;

  const selectedVip = vipList[selectedIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 font-sans overflow-x-hidden selection:bg-yellow-500/30">
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0" style={DOT_BG} />

      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-black/40 backdrop-blur-xl">
        <IconBtn icon="fa-chevron-left" />
        <h1 className="text-xl font-bold tracking-[0.2em] text-[#F9E49B] font-cinzel">VIP</h1>
        <div className="flex gap-2">
          <IconBtn icon="fa-shopping-bag" iconStyle="fas" />
          <IconBtn icon="fa-question-circle" iconStyle="far" />
        </div>
      </header>

      <div className="max-w-md mx-auto relative z-10">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {vipList.map((vip, idx) => (
              <VipSlide key={vip.id} vip={vip} isActive={selectedIndex === idx} />
            ))}
          </div>
        </div>

        <section className="mt-6 pb-12 px-5">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-[#F9E49B] opacity-40 text-lg">༒</span>
            <h3 className="text-sm font-bold tracking-[0.25em] uppercase text-[#F9E49B] font-cinzel">
              Other Privileges
            </h3>
            <span className="text-[#F9E49B] opacity-40 text-lg">༒</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(selectedVip?.privileges ?? DEFAULT_PRIVILEGES).map((p) => (
              <PrivilegeCard key={p.id} privilege={p} />
            ))}
          </div>
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/5 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <CoinIcon />
            <div className="flex items-baseline gap-1.5 overflow-hidden">
              <span className="text-sm font-black text-[#F9E49B] tracking-tight">
                {selectedVip?.coins?.toLocaleString() ?? "120,000"}
              </span>
              <span className="text-[11px] text-white/40 font-bold font-cinzel whitespace-nowrap">
                /{selectedVip?.days ?? 30} days
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-all hover:bg-white/10">
              <i className="fas fa-gift text-xl text-[#F9E49B]" />
            </button>
            <button className="h-11 px-7 rounded-full bg-gradient-to-r from-[#F9E49B] via-[#D4AF37] to-[#B8860B] text-black font-black text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 transition-all">
              Purchase
            </button>
          </div>
        </div>
      </footer>

      <style>{GLOBAL_STYLES}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
//  VIP SLIDE
// ─────────────────────────────────────────────
function VipSlide({ vip, isActive }) {
  const user          = vip.user?.image    ?? DEFAULT_USER;
  const userName      = vip.user?.name     ?? "Username";
  const usernameColor = vip.username_color ?? "#2DDA93";
  const cardBgFrom    = vip.bg_color       ?? "#1a1a1a";

  const badge        = vip.badge         ?? DEFAULT_BADGE;
  const entry        = vip.entry         ?? DEFAULTS.entry;
  const chatCard     = vip.chat_card     ?? DEFAULTS.chat_card;
  const voiceFrame   = vip.voice_frame   ?? DEFAULTS.voice_frame;
  const imageFrame   = vip.image_frame   ?? DEFAULTS.image_frame;
  const profileFrame = vip.profile_frame ?? DEFAULTS.profile_frame;

  return (
    <div className="embla__slide flex-[0_0_90%] min-w-0 px-2 mt-6">
      <div
        className={`
          relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]
          border border-white/10 transition-all duration-500
          ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-40"}
        `}
        style={{ background: `linear-gradient(to bottom, ${cardBgFrom}55, #0a0a0a)` }}
      >
        {/* Card dot-pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* ── 1. Title row + decorative frame ── */}
        <div className="relative px-4 pt-10 pb-0">

          {/* Badge */}
          <div
            className="absolute z-30 flex-shrink-0"
            style={{
              top: 4,
              right: "2rem",
              width: "clamp(80px, 32vw, 120px)",
              height: "clamp(80px, 35vw, 120px)",
              filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.7))",
            }}
          >
            <img src={badge} className="w-full h-full object-contain" alt="VIP Badge" />
          </div>

          {/* Frame top */}
          <div
            className="relative flex items-center rounded-t-xl p-4"
            style={{
              border: `1.5px solid ${cardBgFrom}99`,
              borderBottom: "none",
              background: `linear-gradient(135deg, ${cardBgFrom}22 0%, ${cardBgFrom}08 50%, transparent 100%)`,
              boxShadow: `0 0 16px ${cardBgFrom}44, inset 0 0 20px ${cardBgFrom}11`,
              minHeight: "72px",
              paddingRight: "clamp(88px, 30vw, 132px)",
            }}
          >
            <svg className="absolute -top-[1px] -left-[1px] w-5 h-5" viewBox="0 0 20 20">
              <path d="M0 10 L0 2 Q0 0 2 0 L10 0" fill="none" stroke={cardBgFrom} strokeWidth="1.5"/>
              <circle cx="2" cy="2" r="1.5" fill={cardBgFrom}/>
            </svg>
            <svg className="absolute -top-[1px] -right-[1px] w-5 h-5" viewBox="0 0 20 20">
              <path d="M10 0 L18 0 Q20 0 20 2 L20 10" fill="none" stroke={cardBgFrom} strokeWidth="1.5"/>
              <circle cx="18" cy="2" r="1.5" fill={cardBgFrom}/>
            </svg>

            <div className="space-y-1 z-10">
              <h2 className="text-5xl font-black italic tracking-tighter text-white leading-none vip-text-silver">
                {vip.name}
              </h2>
              <div className="flex items-center gap-2 pl-1">
                <span style={{ color: cardBgFrom }} className="opacity-80 text-base">༺</span>
                <span className="text-[10px] text-white/60 font-bold tracking-widest uppercase font-cinzel">
                  Privileges {vip.privileges?.length ?? 2}
                </span>
                <span style={{ color: cardBgFrom }} className="opacity-80 text-base">༻</span>
              </div>
            </div>
          </div>

          {/* Ornate bottom bar */}
          <div
            className="relative flex items-center overflow-hidden"
            style={{
              borderLeft: `1.5px solid ${cardBgFrom}99`,
              borderRight: `1.5px solid ${cardBgFrom}99`,
              borderBottom: `1.5px solid ${cardBgFrom}99`,
              borderBottomLeftRadius: "0.75rem",
              borderBottomRightRadius: "0.75rem",
              background: `linear-gradient(90deg, ${cardBgFrom}44 0%, ${cardBgFrom}88 50%, ${cardBgFrom}44 100%)`,
              boxShadow: `0 4px 20px ${cardBgFrom}66, inset 0 1px 0 ${cardBgFrom}55`,
              height: "10px",
            }}
          >
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] mx-4"
              style={{
                background: `linear-gradient(90deg, transparent, ${cardBgFrom}cc, ${cardBgFrom}, ${cardBgFrom}cc, transparent)`,
                boxShadow: `0 0 8px ${cardBgFrom}`,
              }}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: cardBgFrom, boxShadow: `0 0 6px ${cardBgFrom}` }} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: cardBgFrom, boxShadow: `0 0 6px ${cardBgFrom}` }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45" style={{ background: cardBgFrom, boxShadow: `0 0 8px ${cardBgFrom}` }} />
          </div>

          <svg className="absolute bottom-[10px] -left-[1px] w-5 h-5" viewBox="0 0 20 20">
            <path d="M0 10 L0 18 Q0 20 2 20 L10 20" fill="none" stroke={cardBgFrom} strokeWidth="1.5"/>
            <circle cx="2" cy="18" r="1.5" fill={cardBgFrom}/>
          </svg>
          <svg className="absolute bottom-[10px] -right-[1px] w-5 h-5" viewBox="0 0 20 20">
            <path d="M10 20 L18 20 Q20 20 20 18 L20 10" fill="none" stroke={cardBgFrom} strokeWidth="1.5"/>
            <circle cx="18" cy="18" r="1.5" fill={cardBgFrom}/>
          </svg>
        </div>

        {/* ── 2. Card body ── */}
        <div className="relative px-4 pt-5">

          {/* ─────────────────────────────────────────────────────────────
              2a. ENTRY BAR
              Strategy:
              • The entry PNG circle sits at a fixed % of the image width.
              • We use TWO layers:
                  1. PNG background (inner div, overflow-hidden, clips to 62px)
                  2. Overlay flex row (overflow visible so avatar pops out)
              • Avatar: fixed 54×54 px — matches the ~62px bar height.
              • avatarLeft (% of container) keeps avatar centred on the PNG
                circle regardless of card width (280 px → 403 px max-w-md).
              • Text row: fixed ml so it never drifts relative to avatar.
          ───────────────────────────────────────────────────────────── */}
          <div
            className="relative w-full -my-1"
            style={{ height: 62, overflow: "visible" }}
          >
            {/* ① PNG background – own div with overflow-hidden */}
            <div className="absolute inset-0 overflow-hidden rounded-sm">
              <img
                src={entry}
                className="absolute w-full h-auto left-0"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                alt="Entry bar"
              />
            </div>

            {/* ② Overlay: avatar + text as flex row
                paddingLeft % = matches left edge of circle in PNG
                ── adjust this ONE value if circle position differs ── */}
          {/* ── 2a. ENTRY BAR ── */}
<div
  className="relative w-full -my-1"
  style={{ height: 62, overflow: "visible" }}
>
  {/* ① PNG background */}
  <div className="absolute inset-0 overflow-hidden rounded-sm">
    <img
      src={entry}
      className="absolute w-full h-auto left-0"
      style={{ top: "50%", transform: "translateY(-50%)" }}
      alt="Entry bar"
    />
  </div>

  {/* ② Overlay: Centered avatar on PNG circle + text */}
  <div
    className="absolute inset-0 z-20"
    style={{ 
      display: "flex", 
      alignItems: "center",
      // Calculate left position based on percentage + fixed offset
      paddingLeft: "clamp(8px, 3.5%, 16px)",
      paddingRight: "4%" 
    }}
  >
    {/* Avatar with percentage-based positioning wrapper */}
    <div
      className="flex-shrink-0"
      style={{
        width: "clamp(48px, 17vw, 56px)",  // Responsive avatar size
        height: "clamp(48px, 17vw, 56px)",
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 0 1.5px rgba(255,255,255,0.08), 0 4px 18px rgba(0,0,0,0.65)",
      }}
    >
      <img
        src={user}
        className="w-full h-full object-cover"
        style={{ borderRadius: "50%" }}
        alt="User avatar"
      />
    </div>

    {/* Text content with fixed gap */}
    <div
      className="flex items-center flex-wrap gap-x-[5px] gap-y-0 ml-2.5"
      style={{ minWidth: 0 }}
    >
      <span
        className="text-[clamp(9px,3vw,11px)] leading-none font-black tracking-wide italic uppercase"
        style={{ color: usernameColor, whiteSpace: "nowrap" }}
      >
        {userName}
      </span>
      <span
        className="text-[clamp(7px,2.5vw,9px)] font-black leading-none px-[5px] py-[2px] rounded-[4px]"
        style={{
          color: usernameColor,
          background: "rgba(0,0,0,0.45)",
          border: `1px solid ${usernameColor}66`,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        •{vip.name}•
      </span>
      <span
        className="text-[clamp(9px,3vw,11px)] leading-none font-semibold text-white/90 tracking-wide"
        style={{ whiteSpace: "nowrap" }}
      >
        Enter
      </span>
    </div>
  </div>
</div>
          </div>
          {/* ── end entry bar ── */}

          {/* 2b. Middle row */}
          <div className="grid gap-3 items-center mt-4" style={{ gridTemplateColumns: "2fr 1.4fr 1.4fr" }}>

            <div className="relative w-full" style={{ paddingTop: "75%" }}>
              <img src={chatCard} className="absolute inset-0 w-full h-full object-contain z-10" alt="Chat card" />
              <span className="absolute inset-0 z-20 flex items-center justify-center text-white font-semibold">Hello</span>
            </div>

            <div className="relative w-full" style={{ paddingTop: "100%" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={user} className="w-[55%] h-[55%] rounded-full object-cover" alt="User" />
              </div>
              <img src={voiceFrame} className="absolute inset-0 w-full h-full object-contain z-10" alt="Voice frame" />
            </div>

            <div className="relative w-full" style={{ paddingTop: "100%" }}>
              <div className="absolute inset-[10%] flex items-center justify-center">
                <img src={user} className="w-[65%] h-[65%] rounded-full object-cover" alt="User" />
              </div>
              <img src={imageFrame} className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" alt="Image frame" />
            </div>
          </div>

          {/* 2c. Profile row */}
          <div className="relative flex items-center -mt-8 mb-2">
            <div className="flex flex-col items-center gap-1 flex-shrink-0 z-20" style={{ width: 76 }}>
              <img src={user} className="w-[68px] h-[68px] rounded-full object-cover border-2 border-white/10 shadow-2xl" alt="User" />
              <span className="text-[11px] font-black tracking-[0.15em] font-cinzel italic" style={{ color: usernameColor }}>
                {userName}
              </span>
            </div>
            <div className="flex-1 flex items-center z-10 overflow-hidden">
              <img src={profileFrame} className="bg-transparent" alt="Profile frame" style={{ width: "100%", maxHeight: 180 }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PRIVILEGE CARD
// ─────────────────────────────────────────────
function PrivilegeCard({ privilege }) {
  return (
    <div className="relative aspect-[0.7/1] bg-gradient-to-b from-[#111] to-[#030303] rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center p-3 shadow-2xl group active:scale-95 transition-all cursor-pointer">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-14 h-14 mb-3 relative">
        <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-2xl opacity-50" />
        <img src={privilege.icon} className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]" alt={privilege.name} />
      </div>
      <p className="text-white/70 text-[9px] font-black tracking-[0.1em] uppercase text-center font-cinzel group-hover:text-[#F9E49B] transition-colors px-1 line-clamp-2">
        {privilege.name}
      </p>
    </div>
  );
}

function IconBtn({ icon, iconStyle = "fas" }) {
  return (
    <button className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
      <i className={`${iconStyle} ${icon} text-xl text-[#F9E49B]`} />
    </button>
  );
}

function CoinIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] flex-shrink-0">
      <i className="fas fa-coins text-black text-[14px]" />
    </div>
  );
}

const GLOBAL_STYLES = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  .vip-text-silver {
    background: linear-gradient(180deg, #fff 0%, #aaa 50%, #666 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%       { transform: translateY(-10px) rotate(2deg); }
  }
  .animate-float { animation: float 5s ease-in-out infinite; }

  .embla { --slide-spacing: 1rem; --slide-size: 90%; }
  .embla__container {
    backface-visibility: hidden;
    display: flex;
    touch-action: pan-y;
  }
  .embla__slide {
    flex: 0 0 var(--slide-size);
    min-width: 0;
    padding-left: var(--slide-spacing);
  }
`;