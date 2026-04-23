"use client";

import { useReadContract } from "wagmi";
import { vibeBadgeContract } from "@/lib/contract";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function HeroSection() {
  const { data: totalMinted } = useReadContract({
    ...vibeBadgeContract,
    functionName: "totalMinted",
  });
  const { data: maxSupply } = useReadContract({
    ...vibeBadgeContract,
    functionName: "MAX_SUPPLY",
  });

  const minted = totalMinted ? Number(totalMinted) : 0;
  const max    = maxSupply   ? Number(maxSupply)   : 1000;
  const pct    = Math.round((minted / max) * 100);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 text-center scan-overlay">
      {/* Corner decorations */}
      <div className="pointer-events-none absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-neon-cyan opacity-60" />
      <div className="pointer-events-none absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-neon-cyan opacity-60" />
      <div className="pointer-events-none absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-neon-magenta opacity-60" />
      <div className="pointer-events-none absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-neon-magenta opacity-60" />

      {/* Eyebrow */}
      <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-4 animate-pulse">
        ◈ ARC TESTNET EXCLUSIVE ◈
      </p>

      {/* Title */}
      <h1
        className="glitch-text font-orbitron text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-2 leading-none"
        data-text="VIBE"
      >
        <span className="neon-text-cyan">VIBE</span>
      </h1>
      <h2 className="font-orbitron text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-white mb-6">
        BADGES
      </h2>

      {/* Subtitle */}
      <p className="font-rajdhani text-lg sm:text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
        Prove your Arc testnet presence. Mint a limited-edition on-chain badge —{" "}
        <span className="text-neon-cyan font-semibold">1000 ever</span>, none more.
      </p>

      {/* Supply bar */}
      <div className="w-full max-w-sm mb-10">
        <div className="flex justify-between font-mono text-xs text-white/40 mb-2">
          <span>MINTED</span>
          <span>
            <span className="text-neon-cyan">{minted}</span> / {max}
          </span>
        </div>
        <div className="h-2 w-full rounded-none bg-dark-600 overflow-hidden corner-cut">
          <div
            className="h-full progress-bar rounded-none transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="font-mono text-[10px] text-white/30 mt-1 text-right">{pct}% CLAIMED</p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <a href="#mint" className="btn-cyber btn-cyan px-8 py-4 text-sm">
          Mint Now →
        </a>
        <a href="#gallery" className="btn-cyber btn-magenta px-8 py-4 text-sm">
          View Gallery
        </a>
      </div>

      {/* Floating hex decoration */}
      <div className="absolute right-12 top-1/3 hidden lg:block animate-[float_6s_ease-in-out_infinite] opacity-20">
        <svg width="120" height="140" viewBox="0 0 120 140">
          <polygon
            points="60,5 115,32 115,108 60,135 5,108 5,32"
            fill="none"
            stroke="#00f5ff"
            strokeWidth="1"
          />
          <polygon
            points="60,20 100,42 100,98 60,120 20,98 20,42"
            fill="none"
            stroke="#ff00a8"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <div className="absolute left-12 bottom-1/4 hidden lg:block animate-[float_8s_ease-in-out_infinite_1s] opacity-15">
        <svg width="80" height="92" viewBox="0 0 80 92">
          <polygon
            points="40,4 76,22 76,70 40,88 4,70 4,22"
            fill="none"
            stroke="#bf00ff"
            strokeWidth="1"
          />
        </svg>
      </div>
    </section>
  );
}
