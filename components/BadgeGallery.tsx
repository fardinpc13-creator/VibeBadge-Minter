"use client";

import Image from "next/image";
import { BADGE_THEMES } from "@/lib/contract";

const RARITY = ["LEGENDARY", "EPIC", "RARE", "UNCOMMON", "COMMON", "GENESIS"];
const SEEDS  = [42, 77, 13, 99, 56, 33];

export function BadgeGallery() {
  return (
    <section id="gallery" className="relative py-24 px-4">
      {/* Section header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-3">◈ ON-CHAIN COLLECTION ◈</p>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">
            BADGE <span className="neon-text-magenta">GALLERY</span>
          </h2>
          <p className="font-rajdhani text-white/50 text-lg max-w-lg mx-auto">
            Each badge is a unique on-chain artefact. Placeholder previews shown below —
            final art lives in your metadata JSON.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BADGE_THEMES.map((badge, i) => (
            <BadgeCard
              key={badge.id}
              label={badge.label}
              accent={badge.accent}
              seed={SEEDS[i]}
              rarity={RARITY[i]}
              tokenId={badge.id}
            />
          ))}
        </div>

        {/* Bottom label */}
        <p className="mt-10 text-center font-mono text-[10px] text-white/20 tracking-widest">
          VISUAL VARIANTS ARE ILLUSTRATIVE — FINAL ART DEFINED IN TOKEN METADATA
        </p>
      </div>
    </section>
  );
}

function BadgeCard({
  label,
  accent,
  seed,
  rarity,
  tokenId,
}: {
  label: string;
  accent: string;
  seed: number;
  rarity: string;
  tokenId: number;
}) {
  return (
    <div
      className="badge-card group relative gradient-border overflow-hidden cursor-pointer"
      style={{ "--glow": accent } as React.CSSProperties}
    >
      <div
        className="relative z-10 p-3 flex flex-col gap-3"
        style={{ background: `linear-gradient(160deg, ${accent}08 0%, #0d0d1a 100%)` }}
      >
        {/* Badge image */}
        <div
          className="relative w-full aspect-square rounded-md overflow-hidden scan-overlay"
          style={{ boxShadow: `0 0 20px ${accent}40` }}
        >
          <Image
            src={`https://picsum.photos/seed/${seed}/200/200`}
            alt={`Badge ${label}`}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
          />
          {/* Holo overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${accent}60 0%, transparent 50%, #ff00a830 100%)`,
            }}
          />
          {/* Token ID pip */}
          <div className="absolute top-1.5 right-1.5 bg-dark-900/80 font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
            style={{ color: accent, border: `1px solid ${accent}40` }}>
            #{tokenId}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="font-orbitron text-[10px] font-bold tracking-widest" style={{ color: accent }}>
            {label}
          </p>
          <p className="font-mono text-[9px] text-white/30 mt-0.5">{rarity}</p>
        </div>

        {/* Bottom bar */}
        <div
          className="h-px w-full opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px ${accent}10` }}
      />
    </div>
  );
}
