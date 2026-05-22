"use client";

import { useState } from "react";
import { MintSection } from "./MintSection";
import { CustomMintTab } from "./CustomMintTab";
import { MyBadges } from "./MyBadges";
import { BadgeGallery } from "./BadgeGallery";

const TABS = [
  { id: "v1",     label: "VIBE BADGES",    sub: "V1 · OG",    accent: "#00f5ff" },
  { id: "v2",     label: "CUSTOM VIBES",   sub: "V2 · NEW",   accent: "#ff00a8" },
  { id: "mine",   label: "MY COLLECTION",  sub: "WALLET",     accent: "#00ff88" },
] as const;

type TabId = typeof TABS[number]["id"];

export function TabNav() {
  const [active, setActive] = useState<TabId>("v1");
  const tab = TABS.find(t => t.id === active)!;

  return (
    <div>
      {/* Tab bar */}
      <div className="sticky top-[57px] z-40 bg-dark-900/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 flex gap-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="relative flex-1 py-4 flex flex-col items-center gap-0.5 transition-all"
            >
              {/* Active indicator */}
              {active === t.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: t.accent, boxShadow: `0 0 8px ${t.accent}` }}
                />
              )}
              <span
                className="font-orbitron text-[10px] sm:text-xs font-bold tracking-widest transition-colors"
                style={{ color: active === t.id ? t.accent : "rgba(255,255,255,0.3)" }}
              >
                {t.label}
              </span>
              <span
                className="font-mono text-[8px] tracking-widest"
                style={{ color: active === t.id ? `${t.accent}80` : "rgba(255,255,255,0.15)" }}
              >
                {t.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {active === "v1" && (
          <>
            <BadgeGallery />
            <MintSection />
          </>
        )}
        {active === "v2" && <CustomMintTab />}
        {active === "mine" && <MyBadges />}
      </div>
    </div>
  );
}
