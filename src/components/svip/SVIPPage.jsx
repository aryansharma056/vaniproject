/**
 * SVIPPage — Single-scroll layout
 *
 * Layout (top → bottom, all on one page):
 *   NavBar → Tabs → VIP Badge → Hero → PerksGrid → ExclusivePrivileges → UpgradeBar
 *
 * No toggle bar. QuickPrivilegesFooter removed.
 * Fully responsive via Tailwind grid utilities.
 */
import { useSVIP } from "../../hooks/useSVIP";
import SVIPTabs from "./SVIPTabs";
import SVIPHero from "./SVIPHero";
import SVIPPerksGrid from "./SVIPPerksGrid";
import ExclusivePrivileges from "./ExclusivePrivileges";

const SVIPPage = () => {
  const {
    activeLevel, setActiveLevel,
    levels, currentLevelData, theme,
    privileges, isCurrentLevel, pointsNeeded,
    loading, error,
  } = useSVIP();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-2 animate-spin"
            style={{ borderColor: theme.primary, borderTopColor: "transparent" }}
          />
          <p className="text-white/40 text-sm">Loading SVIP...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
        <p className="text-red-400 text-sm text-center">
          Failed to load SVIP data: {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#080808] text-white"
      style={{
        background: `radial-gradient(ellipse 100% 30% at 50% 0%, ${theme.glowSoft}, #080808 52%)`,
      }}
    >
      {/* ── Top Nav Bar ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2 sticky top-0 z-50"
        style={{ background: "rgba(8,8,8,0.9)", backdropFilter: "blur(14px)" }}
      >
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          ‹
        </button>

        <h2
          className="text-lg font-black tracking-[0.22em] uppercase font-serif"
          style={{ color: theme.primary, textShadow: `0 0 22px ${theme.glow}` }}
        >
          ✦ SVIP ✦
        </h2>

        <button
          className="flex items-center justify-center text-xs font-bold"
          style={{ color: theme.primary, border: ` ${theme.border}` }}
        >
          DETAILS
        </button>
      </div>

      {/* ── Level Tabs ──────────────────────────────────────── */}
      <SVIPTabs levels={levels} activeLevel={activeLevel} onSelect={setActiveLevel} />

      {/* ── All content in a single scroll ──────────────────── */}
      <div key={activeLevel} style={{ animation: "fadeSlideIn 0.28s ease forwards" }}>

        {/* VIP badge */}
        {/* <div className="flex justify-end px-4 sm:px-6 pb-1">
          <div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-black"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 4px 16px ${theme.glow}`,
            }}
          >
            ★ VIP
          </div>
        </div> */}

        {/* Hero */}
        <SVIPHero
          level={activeLevel}
          theme={theme}
          pointsNeeded={pointsNeeded}
          isCurrentLevel={isCurrentLevel}
        />

        {/* Divider */}
        <div
          className="mx-4 sm:mx-6 h-px mb-1"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}44, transparent)` }}
        />

        {/* Perks grid — 2 cols on mobile, auto-fit on wider screens */}
        <SVIPPerksGrid perks={currentLevelData?.perks ?? []} theme={theme} />

        {/* Divider */}
        <div
          className="mx-4 sm:mx-6 h-px mt-1"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}44, transparent)` }}
        />

        {/* Exclusive Privileges grid + upgrade bar */}
        <ExclusivePrivileges
          privileges={privileges}
          theme={theme}
          levelData={currentLevelData}
        />

      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SVIPPage;