/**
 * SVIP Data — API-Ready Structure
 *
 * When connecting to a real API, replace the static arrays below
 * with your fetch calls. The shape of each object matches what the
 * backend is expected to return so UI components need zero changes.
 *
 * Expected API endpoint: GET /api/svip/levels
 * Response: { data: SVIPLevel[] }
 */

// ─── Types (JSDoc for IDE hints) ────────────────────────────────────────────
/**
 * @typedef {Object} SVIPPerk
 * @property {string} id
 * @property {string} icon        - icon name (maps to <Icon> component)
 * @property {string} label
 * @property {string} description
 */

/**
 * @typedef {Object} SVIPPrivilege
 * @property {string} id
 * @property {string} icon
 * @property {string} label
 * @property {number} unlockedAtLevel  - which SVIP level unlocks this
 * @property {boolean} isUnlocked      - computed on client based on currentLevel
 * @property {string|null} detail      - e.g. "5 Broadcast"
 */

/**
 * @typedef {Object} SVIPLevel
 * @property {number} level
 * @property {string} label
 * @property {number} pointsRequired
 * @property {SVIPPerk[]} perks
 * @property {number} totalPrivileges
 */

// ─── Perks (cosmetic rewards per level) ─────────────────────────────────────
const PERKS = {
  medal:        { id: "medal",        icon: "Star",         label: "Medal",        description: "Exclusive medal for your profile" },
  title:        { id: "title",        icon: "Type",         label: "Title",        description: "Unlock exclusive name title" },
  chatBubble:   { id: "chatBubble",   icon: "MessageSquare",label: "Chat Bubble",  description: "Unlock exclusive chat bubble" },
  frame:        { id: "frame",        icon: "Maximize2",    label: "Frame",        description: "Unlock exclusive profile frame" },
  entrance:     { id: "entrance",     icon: "LogIn",        label: "Entrance",     description: "Unlock exclusive entrance effect" },
  micWave:      { id: "micWave",      icon: "Mic",          label: "Mic Wave",     description: "Unlock exclusive mic wave effect" },
  vehicle:      { id: "vehicle",      icon: "Car",          label: "Vehicle",      description: "Unlock exclusive vehicle" },
  profileCard:  { id: "profileCard",  icon: "CreditCard",   label: "Profile Card", description: "Unlock exclusive profile card" },
};

// ─── Privileges (feature unlocks, cumulative across levels) ──────────────────
export const ALL_PRIVILEGES = [
  // Row 1 — unlocked at SVIP1
  { id: "roomNameColourful", icon: "R",        label: "Room Name Colourful",  unlockedAtLevel: 1, detail: null },
  { id: "nicknameColourful", icon: "person",   label: "Nickname Colourful",   unlockedAtLevel: 1, detail: null },
  { id: "roomListTag",       icon: "tag",      label: "Room List Tag",        unlockedAtLevel: 1, detail: null },
  // Row 2 — unlocked at SVIP3/4
  { id: "gifProfileDp",      icon: "R",        label: "GIF Profile DP",       unlockedAtLevel: 3, detail: null },
  { id: "gifRoomDp",         icon: "home",     label: "GIF Room DP",          unlockedAtLevel: 4, detail: null },
  { id: "giftRoomTheme",     icon: "gift",     label: "Gift Room Theme",      unlockedAtLevel: 4, detail: null },
  // Row 3 — unlocked at SVIP4/5/6
  { id: "freeBroadcast",     icon: "megaphone",label: "Free Broadcast",       unlockedAtLevel: 4, detail: { 4: "5 Broadcast", 5: "10 Broadcast", 6: "15 Broadcast" } },
  { id: "levelHidden",       icon: "shield",   label: "Level Hidden",         unlockedAtLevel: 5, detail: null },
  { id: "doNotTrack",        icon: "eyeOff",   label: "Do Not Track",         unlockedAtLevel: 6, detail: null },
  // Row 4
  { id: "charmLevel",        icon: "crown",    label: "Charm Level",          unlockedAtLevel: 6, detail: "Charm Level 0" },
];

// ─── SVIP Levels ─────────────────────────────────────────────────────────────
export const SVIP_LEVELS = [
  {
    level: 1,
    label: "SVIP1",
    pointsRequired: 0,            // already unlocked baseline
    perks: [PERKS.medal, PERKS.title, PERKS.chatBubble, PERKS.frame, PERKS.entrance, PERKS.micWave, PERKS.vehicle, PERKS.profileCard],
    totalPrivileges: 3,
    description: "Enjoy 3 exclusive privileges",
  },
  {
    level: 2,
    label: "SVIP2",
    pointsRequired: 500000,
    perks: [PERKS.medal, PERKS.title, PERKS.chatBubble, PERKS.frame, PERKS.entrance, PERKS.micWave, PERKS.vehicle, PERKS.profileCard],
    totalPrivileges: 3,
    description: "Enjoy 3 exclusive privileges",
  },
  {
    level: 3,
    label: "SVIP3",
    pointsRequired: 2000000,
    perks: [PERKS.medal, PERKS.title, PERKS.chatBubble, PERKS.frame, PERKS.entrance, PERKS.micWave, PERKS.vehicle, PERKS.profileCard],
    totalPrivileges: 4,
    description: "Enjoy 4 exclusive privileges",
  },
  {
    level: 4,
    label: "SVIP4",
    pointsRequired: 8000000,
    perks: [PERKS.medal, PERKS.title, PERKS.chatBubble, PERKS.frame, PERKS.entrance, PERKS.micWave, PERKS.vehicle, PERKS.profileCard],
    totalPrivileges: 7,
    description: "Enjoy 7 exclusive privileges",
  },
  {
    level: 5,
    label: "SVIP5",
    pointsRequired: 15000000,
    perks: [PERKS.medal, PERKS.title, PERKS.chatBubble, PERKS.frame, PERKS.entrance, PERKS.micWave, PERKS.vehicle, PERKS.profileCard],
    totalPrivileges: 8,
    description: "Enjoy 8 exclusive privileges",
  },
  {
    level: 6,
    label: "SVIP6",
    pointsRequired: 30000000,
    perks: [PERKS.medal, PERKS.title, PERKS.chatBubble, PERKS.frame, PERKS.entrance, PERKS.micWave, PERKS.vehicle, PERKS.profileCard],
    totalPrivileges: 10,
    description: "Enjoy all 10 exclusive privileges",
  },
];

// ─── Footer privilege strip (Image 1 bottom) ─────────────────────────────────
// These appear as small icons with checkmarks in the main page footer
export const FOOTER_QUICK_PRIVILEGES = [
  { id: "honorSeat",      icon: "armchair",   label: "Honor Seat",      unlockedAtLevel: 1 },
  { id: "micWaveQuick",   icon: "mic",        label: "Mic Wave",        unlockedAtLevel: 3 },
  { id: "upgradeBanner",  icon: "play",       label: "Upgrade Banner",  unlockedAtLevel: 3 },
  { id: "gifEffects",     icon: "gif",        label: "GIF Effects",     unlockedAtLevel: 4 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns a privilege list enriched with isUnlocked flag
 * for a given current user level
 */
export const getPrivilegesForLevel = (currentLevel) =>
  ALL_PRIVILEGES.map((p) => ({
    ...p,
    isUnlocked: currentLevel >= p.unlockedAtLevel,
    detail:
      p.detail && typeof p.detail === "object"
        ? p.detail[currentLevel] ?? null
        : p.detail,
  }));

/**
 * Simulate API fetch — replace body with real fetch() call
 * @returns {Promise<{ levels: SVIPLevel[], currentLevel: number, pointsNeeded: number }>}
 */
export const fetchSVIPData = async () => {
  // TODO: Replace with real API call:
  // const res = await fetch('/api/svip/levels', { headers: { Authorization: `Bearer ${token}` } });
  // return res.json();

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          levels: SVIP_LEVELS,
          currentLevel: 6,        // user's current level
          pointsNeeded: 30000000, // points needed for current tab level
        }),
      400
    )
  );
};