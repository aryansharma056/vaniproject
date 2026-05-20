import avatar from "@/assets/vip-avatar.jpg";
import { Crown } from "lucide-react";

export function VipTierCard({ tier }) {
  const labelClass = tier.textStyle === "gold" ? "vip-text-gold" : "vip-text-metallic";

  return (
    <div className="space-y-5">

      {/* ── Top card ── */}
      <div className="vip-tier-card">
        <div className="vip-tier-inner relative overflow-hidden">
          <div className="relative flex items-end px-6 pt-10 pb-8">

            <div className="flex-1">
              <h2
                className={`font-serif-display text-3xl sm:text-5xl lg:text-[64px] font-bold leading-none tracking-wider ${labelClass}`}
                style={{ fontStyle: "italic" }}
              >
                {tier.name ?? `VIP${tier.level}`}
              </h2>
              <div className="mt-2 sm:mt-3 flex items-center gap-2 pl-1">
                <span className="text-[8px] sm:text-[10px]" style={{ color: "var(--vip-text-soft, rgba(255,255,255,0.6))" }}>❦</span>
                <span
                  className="font-serif-display text-xs sm:text-sm italic"
                  style={{ color: "var(--vip-text-soft, rgba(255,255,255,0.6))" }}
                >
                  Privileges {tier.privilegeCount ?? 0}
                </span>
                <span className="text-[8px] sm:text-[10px]" style={{ color: "var(--vip-text-soft, rgba(255,255,255,0.6))" }}>❦</span>
              </div>
            </div>

            {/* ✅ Null-guarded badge — remote URL from API */}
            {tier.badge && (
              <img
                src={tier.badge}
                alt={`${tier.name ?? `VIP${tier.level}`} badge`}
                loading="lazy"
                width={768}
                height={768}
                className="pointer-events-none absolute -right-2 sm:-right-4 -top-2 sm:-top-4 h-24 sm:h-44 w-24 sm:w-44 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
              />
            )}
          </div>
        </div>
        <div className="vip-tier-ribbon mt-[1px] rounded-b-[17px]" />
      </div>

      {/* ── Cosmetic showcase ── */}
      <div className="vip-tier-card">
        <div className="vip-tier-inner space-y-5 p-5">

          {/* Username capsule — entry as overlay */}
          <div className="vip-capsule relative flex items-center overflow-hidden  p-2">
            {tier.entry && (
              <img
                src={tier.entry}
                alt="entry"
                className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"
              />
            )}
            <img
              src={avatar}
              alt="avatar"
              loading="lazy"
              width={512}
              height={512}
              className="absolute left-1.5 top-1/2 z-[1] h-11 w-11 -translate-y-1/2 rounded-full border-2 object-cover"
              style={{ borderColor: "var(--vip-accent, #4caf50)" }}
            />
            <span
              className="z-[1] pl-14 font-serif-display text-[15px]"
              style={{ color: tier.usernameColor ?? "var(--vip-gold, #d4af37)" }}
            >
              {tier.username ?? "Username"}
            </span>
            <span className="z-[1] mx-2 inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-bold" style={{ color: "var(--vip-gold, #d4af37)" }}>
              ◂{tier.name ?? `VIP${tier.level}`}▸
            </span>
         
          </div>

          {/* Hello + frames row */}
          <div className="grid grid-cols-3 items-center gap-3 m-9">

            {/* Nameplate */}
            <div className="vip-nameplate relative">
              <Crown
                className="absolute -right-1 -top-3 h-6 w-6 rotate-12"
                style={{ fill: "var(--vip-gold, #d4af37)", color: "var(--vip-gold, #d4af37)" }}
                strokeWidth={1.5}
              />
              <div
                className="absolute -bottom-2 -left-2 h-6 w-6 rotate-45 rounded-sm"
                style={{ background: "var(--vip-accent-deep, #1b5e20)" }}
              />
              <div className="text-center font-serif-display text-2xl text-white drop-shadow">
                {tier.greeting ?? "Hello"}
              </div>
            </div>

            {/* ✅ Profile frame — API image as ring, fallback accent color */}
            <div className="flex items-center justify-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full p-[6px]"
                style={
                  tier.profileFrame
                    ? {
                        backgroundImage:    `url(${tier.profileFrame})`,
                        backgroundSize:     "cover",
                        backgroundPosition: "center",
                      }
                    : { background: "var(--vip-accent, #4caf50)" }
                }
              >
                <img
                  src={avatar}
                  alt="frame avatar"
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-full w-full rounded-full border-2 border-black object-cover"
                />
              </div>
            </div>

            {/* ✅ Image frame — API image replaces gradient entirely, no conflict */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  // ✅ Single `background` shorthand — no gradient+image conflict
                  background: tier.imageFrame
                    ? `url(${tier.imageFrame}) center / contain no-repeat`
                    : `linear-gradient(180deg, var(--vip-accent-deep, #1b5e20), #000)`,
                  clipPath: "polygon(15% 0, 85% 0, 100% 25%, 100% 75%, 85% 100%, 15% 100%, 0 75%, 0 25%)",
                  boxShadow: "0 0 18px var(--vip-aura, rgba(76,175,80,0.4))",
                }}
              />
              {/* Crown topper */}
              <div
                className="absolute -top-2 left-1/2 z-10 h-6 w-12 -translate-x-1/2 rounded-t-md"
                style={{
                  background: "linear-gradient(180deg, #fff3b0, #b8862f)",
                  clipPath: "polygon(10% 100%, 0 0, 30% 40%, 50% 0, 70% 40%, 100% 0, 90% 100%)",
                }}
              />
              <img
                src={avatar}
                alt="trophy avatar"
                loading="lazy"
                width={512}
                height={512}
                className="relative z-[1] mt-2 h-14 w-14 rounded-full border border-white/40 object-cover"
              />
              <div className="absolute -bottom-2 left-1/2 z-10 w-max -translate-x-1/2">
                <div className="rounded-md border border-[#ffffff40] bg-gradient-to-b from-[#FFF3B0] via-[#D4AF37] to-[#B8862F] px-2 py-0.5 shadow-md shadow-black/50">
                  <div className="flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-tighter text-[#3A230A] sm:text-[10px]">
                    <span className="scale-75">✦</span>
                    <span>{tier.name ?? `VIP${tier.level}`}</span>
                    <span className="scale-75">✦</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Avatar + divider */}
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="avatar"
              loading="lazy"
              width={512}
              height={512}
              className="h-16 w-16 shrink-0 rounded-full border-2 border-white/20 object-cover"
            />
            <div className="flex-1">
              <svg viewBox="0 0 1200 120" className="w-full h-[26px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="120" y1="60" x2="1080" y2="60" stroke="var(--vip-accent, #4caf50)" strokeWidth="5" />
                <path d="M560 60 C580 25 620 25 640 60 C620 95 580 95 560 60" stroke="var(--vip-accent, #4caf50)" strokeWidth="4" />
                <circle cx="1080" cy="60" r="12" fill="var(--vip-accent, #4caf50)" stroke="var(--vip-gold, #d4af37)" strokeWidth="4" />
                <path d="M1058 42 L1068 22 L1080 42 L1092 22 L1102 42" stroke="var(--vip-gold, #d4af37)" strokeWidth="3" />
                <path d="M120 60 C70 10 30 25 20 60 C30 95 70 110 120 60" stroke="var(--vip-accent, #4caf50)" strokeWidth="4" />
              </svg>
              <div
                className="font-serif-display mt-3 text-lg"
                style={{ color: "var(--vip-accent, #4caf50)" }}
              >
                Username
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}