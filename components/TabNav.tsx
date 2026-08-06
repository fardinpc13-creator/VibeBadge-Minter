"use client";
import { useState } from "react";
import { BadgesTab }      from "./BadgesTab";
import { SendTab }        from "./SendTab";
import { PaymentLinkTab } from "./PaymentLinkTab";
import { DashboardTab }   from "./DashboardTab";

const TABS = [
  { id: "badges",  label: "BADGES",   icon: "⬡", accent: "#00f5ff" },
  { id: "send",    label: "SEND",     icon: "→", accent: "#00ff88" },
  { id: "link",    label: "PAY LINK", icon: "⛓", accent: "#7000ff" },
  { id: "dash",    label: "DASHBOARD",icon: "◈", accent: "#ff00a8" },
] as const;

type TabId = typeof TABS[number]["id"];

export function TabNav() {
  const [active, setActive] = useState<TabId>("badges");
  const tab = TABS.find(t => t.id === active)!;

  return (
    <div>
      {/* Tab bar */}
      <div className="sticky top-[57px] z-40 bg-dark-900/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 flex gap-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className="relative flex-1 py-4 flex flex-col items-center gap-0.5 transition-all">
              {active === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: t.accent, boxShadow: `0 0 8px ${t.accent}` }}/>
              )}
              <span className="text-sm" style={{ opacity: active === t.id ? 1 : 0.3 }}>{t.icon}</span>
              <span className="font-orbitron text-[9px] sm:text-[10px] font-bold tracking-widest transition-colors"
                style={{ color: active === t.id ? t.accent : "rgba(255,255,255,0.3)" }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[60vh]">
        {active === "badges" && <BadgesTab />}
        {active === "send"   && <SendTab />}
        {active === "link"   && <PaymentLinkTab />}
        {active === "dash"   && <DashboardTab />}
      </div>
    </div>
  );
}
