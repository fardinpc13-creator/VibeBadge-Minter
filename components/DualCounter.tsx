"use client";

import { useReadContract } from "wagmi";
import { vibeBadgeContract, customVibeContract } from "@/lib/contract";

export function DualCounter() {
  const { data: v1Minted } = useReadContract({ ...vibeBadgeContract, functionName: "totalMinted" });
  const { data: v1Max }    = useReadContract({ ...vibeBadgeContract, functionName: "MAX_SUPPLY" });
  const { data: v2Minted } = useReadContract({ ...customVibeContract, functionName: "totalMinted" });
  const { data: v2Max }    = useReadContract({ ...customVibeContract, functionName: "MAX_SUPPLY" });

  const v1m = v1Minted ? Number(v1Minted) : 0;
  const v1x = v1Max    ? Number(v1Max)    : 1000;
  const v2m = v2Minted ? Number(v2Minted) : 0;
  const v2x = v2Max    ? Number(v2Max)    : 1000;

  return (
    <div className="mx-auto max-w-3xl grid grid-cols-2 gap-4 px-4 py-6">
      <ContractStat label="VIBE BADGES V1" minted={v1m} max={v1x} accent="#00f5ff" tag="OG" />
      <ContractStat label="CUSTOM VIBES V2" minted={v2m} max={v2x} accent="#ff00a8" tag="NEW" />
    </div>
  );
}

function ContractStat({ label, minted, max, accent, tag }: {
  label: string; minted: number; max: number; accent: string; tag: string;
}) {
  const pct = Math.min(Math.round((minted / max) * 100), 100);
  return (
    <div className="relative rounded-lg p-4 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${accent}08 0%, #0d0d1a 100%)`, border: `1px solid ${accent}30`, boxShadow: `0 0 20px ${accent}15` }}>
      <span className="absolute top-2 right-2 font-mono text-[9px] px-1.5 py-0.5 rounded-sm"
        style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}>{tag}</span>
      <p className="font-mono text-[9px] tracking-widest text-white/30 mb-1">{label}</p>
      <p className="font-orbitron text-2xl font-black" style={{ color: accent }}>
        {minted}<span className="text-sm font-normal text-white/30"> / {max}</span>
      </p>
      <div className="mt-2 h-1 w-full bg-dark-600 overflow-hidden">
        <div className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}80)`, boxShadow: `0 0 8px ${accent}` }} />
      </div>
      <p className="font-mono text-[9px] text-white/20 mt-1 text-right">{pct}% minted</p>
    </div>
  );
}
