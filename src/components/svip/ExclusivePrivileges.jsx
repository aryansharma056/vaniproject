/**
 * PrivilegeCard — Individual privilege tile (locked/unlocked)
 * ExclusivePrivileges — Full privilege grid section (Image 2 layout)
 */
import { Lock, Check, Mic, Eye, EyeOff, Shield, Crown, Gift, Megaphone, Home } from "lucide-react";
import { SVIP_LEVELS } from "../../data/svipData";

// Map icon string → Lucide component
const ICON_MAP = {
  R: ({ color, size }) => (
    <span style={{ color, fontSize: size ?? 18, fontWeight: 900, fontFamily: "serif" }}>R</span>
  ),
  person: ({ color, size }) => (
    <svg width={size ?? 18} height={size ?? 18} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="7" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  tag: ({ color, size }) => (
    <svg width={size ?? 18} height={size ?? 18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  home: Home,
  gift: Gift,
  megaphone: Megaphone,
  shield: Shield,
  eyeOff: EyeOff,
  crown: Crown,
  mic: Mic,
  gif: ({ color, size }) => (
    <span style={{ color, fontSize: (size ?? 14) - 2, fontWeight: 900, letterSpacing: "-0.5px" }}>GIF</span>
  ),
};

const renderIcon = (iconKey, color, size = 18) => {
  const Comp = ICON_MAP[iconKey];
  if (!Comp) return null;
  // Lucide components take { size, color } as props
  return typeof Comp === "function" && Comp.displayName?.includes("Icon")
    ? <Comp size={size} color={color} />
    : <Comp color={color} size={size} />;
};

// ─── PrivilegeCard ────────────────────────────────────────────────────────────
export const PrivilegeCard = ({ privilege, theme }) => {
  const { isUnlocked, label, icon, unlockedAtLevel, detail } = privilege;
  const lockLabel = `SVIP${unlockedAtLevel}`;

  return (
    <div
      className="relative flex flex-col items-center justify-center p-3 rounded-xl gap-2 min-h-[90px] transition-all duration-200"
      style={{
        background: isUnlocked ? theme.bgCard : "rgba(255,255,255,0.04)",
        border: `1px solid ${isUnlocked ? theme.border : "rgba(255,255,255,0.08)"}`,
        opacity: isUnlocked ? 1 : 0.65,
      }}
    >
      {/* Check / Lock badge */}
      <div
        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
        style={{
          background: isUnlocked ? theme.primary : "rgba(255,255,255,0.15)",
        }}
      >
        {isUnlocked
          ? <Check size={10} color="#fff" strokeWidth={3} />
          : <Lock size={9} color="rgba(255,255,255,0.5)" />}
      </div>

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          background: isUnlocked
            ? `radial-gradient(circle, ${theme.secondary}33, ${theme.primary}22)`
            : "rgba(255,255,255,0.06)",
          border: `1.5px solid ${isUnlocked ? theme.primary + "66" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        {renderIcon(icon, isUnlocked ? theme.primary : "rgba(255,255,255,0.35)")}
      </div>

      {/* Label */}
      <p
        className="text-center text-xs font-semibold leading-tight"
        style={{ color: isUnlocked ? "#fff" : "rgba(255,255,255,0.4)" }}
      >
        {label}
      </p>

      {/* Detail or "Unlock at SVIPX" */}
      {detail ? (
        <p className="text-xs font-bold" style={{ color: theme.primary }}>{detail}</p>
      ) : !isUnlocked ? (
        <p className="text-xs" style={{ color: theme.primary + "cc" }}>
          Unlock at {lockLabel}
        </p>
      ) : null}
    </div>
  );
};

// ─── ExclusivePrivileges ──────────────────────────────────────────────────────
const ExclusivePrivileges = ({ privileges, theme, levelData }) => {
  const isMaxLevel = levelData?.level === 6;

  return (
    <div className="px-4 sm:px-6 pb-6">
      {/* Section header */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.primary}66)` }} />
        <span
          className="text-[10px] font-black tracking-widest uppercase whitespace-nowrap"
          style={{ color: theme.primary, textShadow: `0 0 10px ${theme.glow}` }}
        >
          ✦ Exclusive Privileges ✦
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${theme.primary}66)` }} />
      </div>

      {/* Privileges grid — 3 cols mobile, 4 cols sm, 5 cols md+ */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        {privileges.map((p) => (
          <PrivilegeCard key={p.id} privilege={p} theme={theme} />
        ))}
      </div>

      {/* Upgrade bar */}
      <div
        className="flex items-center justify-between mt-4 px-4 py-3 rounded-2xl"
        style={{
          background: `linear-gradient(90deg, ${theme.glowSoft}, transparent)`,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-black flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          >
            {levelData?.level}
          </div>
          <div>
            <p className="text-white text-xs font-bold">{levelData?.label}</p>
            <p className="text-white/40 text-[10px]">{levelData?.description}</p>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          style={
            isMaxLevel
              ? { background: "rgba(255,255,255,0.07)", color: theme.primary, border: `1.5px solid ${theme.border}` }
              : { background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, color: "#000" }
          }
        >
          {isMaxLevel ? "Current Level ✓" : "Upgrade SVIP →"}
        </button>
      </div>
    </div>
  );
};

export default ExclusivePrivileges;