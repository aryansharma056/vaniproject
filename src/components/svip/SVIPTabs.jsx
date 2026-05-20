/**
 * SVIPTabs.jsx
 * ─────────────────────────────────────────────────────────────
 * Updated to match the "God UI" from reference images.
 * Features a high-gloss active state and muted inactive state.
 */

import { getTheme } from "../../constants/svipThemes";

const SVIPTabs = ({ levels, activeLevel, onSelect }) => (
  <nav className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/5">
    <div className="flex gap-1 py-3 overflow-x-auto no-scrollbar items-center">
      {levels.map((lvl) => {
        const t = getTheme(lvl.level);
        const isActive = lvl.level === activeLevel;

        return (
          <button
            key={lvl.level}
            onClick={() => onSelect(lvl.level)}
            className={`
              flex-shrink-0 px-5 py-1.5 rounded-full text-[13px] font-bold tracking-tight 
              transition-all duration-300 ease-out active:scale-95
            `}
            style={
              isActive
                ? {
                    color: "#FFFFFF",
                    border: `1px solid ${t.primary}`,
                    boxShadow: `0 0 12px ${t.glow}, inset 0 0 4px ${t.glow}`,
                    background: t.glowSoft,
                  }
                : {
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid transparent",
                    background: "transparent",
                  }
            }
          >
            {lvl.label || `SVIP${lvl.level}`}
          </button>
        );
      })}
    </div>
  </nav>
);

export default SVIPTabs;