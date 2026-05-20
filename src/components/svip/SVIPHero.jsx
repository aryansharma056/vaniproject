/**
 * SVIPHero.jsx
 * ─────────────────────────────────────────────────────────────
 * Top hero: level title + points needed  |  glowing diamond
 *
 * Props:
 *   level         number
 *   theme         object  (from getTheme)
 *   pointsNeeded  number
 *   isCurrentLevel boolean
 */

const SPARK_POSITIONS = [
  "top:-4px;left:50%;transform:translateX(-50%)",
  "bottom:-4px;left:50%;transform:translateX(-50%)",
  "left:-4px;top:50%;transform:translateY(-50%)",
  "right:-4px;top:50%;transform:translateY(-50%)",
];

const SVIPHero = ({ level, theme, pointsNeeded, isCurrentLevel }) => (
  <div className="flex items-center justify-between px-4 sm:px-6 pb-5">
    {/* ── Left: text ── */}
    <div className="flex flex-col">
      <h1
        className="text-[42px] sm:text-5xl font-black leading-none font-serif"
        style={{ color: theme.primary, textShadow: `0 0 28px ${theme.glow}` }}
      >
        SVIP {level}
      </h1>

      {isCurrentLevel ? (
        <p className="text-white/50 text-sm mt-2">🏆 Max level reached!</p>
      ) : (
        <>
          <p className="text-white/45 text-xs mt-2">To unlock, you still need</p>
          <p
            className="text-2xl sm:text-3xl font-black mt-1 tabular-nums"
            style={{ color: theme.primary, textShadow: `0 0 18px ${theme.glow}` }}
          >
            {pointsNeeded.toLocaleString()}
          </p>
        </>
      )}
    </div>

    {/* ── Right: glowing diamond ── */}
    <div className="relative flex items-center justify-center w-[108px] h-[108px] flex-shrink-0 mt-3">
      {/* Outer glow */}
      <div
        className="absolute inset-2 rounded-[14px] rotate-45"
        style={{ boxShadow: `0 0 36px 8px ${theme.glow}` }}
      />
      {/* Diamond border */}
      <div
        className="absolute inset-[10px] rounded-[10px] rotate-45 border-2"
        style={{
          borderColor: theme.primary,
          boxShadow:   `0 0 20px ${theme.glow}, inset 0 0 16px ${theme.glowSoft}`,
        }}
      />
      {/* Corner sparks */}
      {SPARK_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="absolute w-[7px] h-[7px] rounded-full"
          style={{
            cssText:    pos,        // inline style string via cssText trick
            background: theme.primary,
            boxShadow:  `0 0 7px ${theme.primary}`,
            // parse pos manually as inline style
            ...Object.fromEntries(
              pos.split(";").filter(Boolean).map((s) => {
                const [k, v] = s.split(":");
                return [k.trim(), v.trim()];
              })
            ),
          }}
        />
      ))}
      {/* Level number */}
      <span
        className="relative z-10 text-[44px] font-black"
        style={{ color: theme.primary, textShadow: `0 0 22px ${theme.glow}` }}
      >
        {level}
      </span>
    </div>
  </div>
);

export default SVIPHero;