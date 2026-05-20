# SVIP App - Elite Membership Showcase

Yeh ek React-based web application hai jo VIP aur SVIP membership tiers ko beautifully showcase karta hai. Yeh app users ko diamonds (virtual currency) se tiers unlock karne ka experience deta hai, shayad kisi live streaming ya social platform ka part.

## Features

- **SVIP Tiers (1-12):** Har tier mein unique cosmetics (medals, titles, bubbles) aur privileges (mic wave, invisible mode, etc.) hote hain.
- **VIP Tiers (5 levels):** Emerald se Gold tak, carousel mein dikhaaye jaate hain with badges aur perks.
- **Responsive UI:** Dark theme, custom gradients, animations, aur Tailwind CSS se styled.
- **Navigation:** React Router se smooth routing, auto-redirects.
- **Fast Development:** Vite se hot reload aur optimized builds.

## Tech Stack

- **Frontend:** React 18, React Router DOM
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** Lucide React
- **Carousel:** Embla Carousel React
- **Fonts:** Google Fonts (Cinzel, Raleway)

## Installation aur Setup

1. **Clone ya Download:** Project folder ko apne system pe lao.
2. **Dependencies Install:** Terminal mein `npm install` run karo.
3. **Development Server:** `npm run dev` se local server start karo (http://localhost:5173).
4. **Build:** Production ke liye `npm run build` (files `dist/` mein banenge).
5. **Preview:** Built app ko `npm run preview` se test karo.

## Project Structure

```
svip-final/
├── public/                 # Static assets (favicon.ico, favicon.svg)
├── src/
│   ├── assets/             # Images (badges: emerald.png, etc.)
│   ├── components/
│   │   ├── SVIP/           # SVIP components (SVIPDetail, SVIPHeader, etc.)
│   │   └── vip/            # VIP components (VipTierCard, PrivilegeIcon)
│   ├── data/
│   │   └── svipData.js     # SVIP tiers ka data (colors, cosmetics, privileges)
│   ├── routes/
│   │   └── vip.jsx         # VIP page component
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles (Tailwind imports)
├── index.html              # Root HTML
├── package.json            # Dependencies aur scripts
├── vite.config.js          # Vite config (aliases, plugins)
├── tailwind.config.js      # Tailwind config (fonts, colors)
└── postcss.config.js       # PostCSS config
```

## Workflow (Kaise Kaam Karta Hai?)

1. **Entry:** `index.html` load karta hai `src/main.jsx`, jo React app mount karta hai.
2. **Routing:** `App.jsx` mein React Router routes define:
   - `/` → Redirect to `/svip/1`
   - `/svip/:id` → SVIPDetail component (tier details show karta hai)
   - `/vip` → VipPage component (carousel se VIP tiers)
   - Invalid routes → `/svip/1` pe redirect
3. **Data Flow:** SVIP data `svipData.js` se aata hai (12 objects, har mein tier info). VIP data inline hai.
4. **Components:** Reusable parts (grids, cards) se UI build hota hai. Cosmetics aur privileges conditionally render (locked/unlocked).
5. **Styling:** Tailwind classes se responsive design. Custom CSS variables aur gradients per tier.
6. **Build:** Vite se ES modules bundle, static assets serve.

## Important Points (Samajhne Ke Liye)

- **Membership Logic:** SVIP mein 12 levels, har unlock hone pe zyada perks. Diamonds count show karta hai kitne chahiye. VIP 5 levels, carousel mein slide.
- **UI Highlights:** Dark bg (#070509), gem colors (amber, silver, etc.), shimmer buttons, hover effects. Fonts bold headings ke liye.
- **Data Customization:** Naye tiers add karne ke liye `svipData.js` mein object dalo. Layouts (big/stacked/med) se cosmetics arrange.
- **Performance:** Vite se fast dev, Tailwind se optimized CSS. Images lazy load nahi, but small hain.
- **Extensions:** Agar backend add karna ho (e.g., user auth), API calls add karo. Currently static data.
- **Browser Support:** Modern browsers (Chrome, Firefox). Favicon fix hai, 404 error nahi aayega.
- **Deployment:** `dist/` folder ko hosting pe upload karo (Vercel, Netlify, etc.).

## Contributing

- Code changes ke baad `npm run build` test karo.
- New features add karne se pehle components check karo.
- Issues? Console logs check karo ya data validate karo.

Agar koi doubt ho, code dekh lo ya poocho! 🚀