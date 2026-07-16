/**
 * PerkCard — Single cosmetic reward card
 * SVIPPerksGrid — 2-col grid of PerkCards
 */
import {
  Star, Type, MessageSquare, Maximize2,
  LogIn, Mic, Car, CreditCard,
} from "lucide-react";

const ICON_MAP = {
  Star, Type, MessageSquare, Maximize2, LogIn, Mic, Car, CreditCard,
};

// ─── PerkCard ────────────────────────────────────────────────────────────────
export const PerkCard = ({ perk, theme }) => {
  const Icon = ICON_MAP[perk.icon] ?? Star;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Icon bubble */}
      <div
  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
  style={{
    background: `radial-gradient(circle, ${theme.secondary}33 0%, ${theme.primary}22 100%)`,
    border: `2px solid ${theme.primary}66`,
    boxShadow: `0 0 12px ${theme.glowSoft}`,
  }}
>
  <img src={perk.icon} alt={perk.label} className="w-6 h-6 object-contain" />
</div>
      {/* Text */}
      <div className="min-w-0 overflow-hidden">
        <p className="text-white text-sm font-semibold leading-tight truncate">{perk.label}</p>
        <p className="text-white/45 text-xs leading-tight mt-0.5 truncate">{perk.description}</p>
      </div>
    </div>
  );
};

// ─── SVIPPerksGrid ────────────────────────────────────────────────────────────
const SVIPPerksGrid = ({ perks, theme }) => {
  return (
    /* auto-fit: 2 cols on mobile, up to 4 on wide screens */
    <div
      className="px-4 sm:px-6 py-3 grid gap-2.5"
      style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
    >
      {perks.map((perk) => (
        <PerkCard key={perk.id} perk={perk} theme={theme} />
      ))}
    </div>
  );
};

export default SVIPPerksGrid; 