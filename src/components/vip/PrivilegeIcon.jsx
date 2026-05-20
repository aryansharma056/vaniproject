import { useState } from "react";
import { Eye, UserPlus, ArrowUp, Rocket, Home, Glasses, DoorOpen, Star } from "lucide-react";

const LUCIDE_FALLBACKS = {
  "view-visitors":      Eye,
  "unlimited-follow":   UserPlus,
  "friends-priority":   ArrowUp,
  "level-acceleration": Rocket,
  "cant-find-me":       Home,
  "hide-online":        Glasses,
  "anti-kick":          DoorOpen,
};

function slugify(str = "") {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function PrivilegeIcon({ icon, name }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 p-4 text-center">

      <img
        src={icon}
        alt={name}
        className="h-10 w-10 object-contain"
      />

      <span className="text-xs text-white">
        {name}
      </span>

    </div>
  );
}