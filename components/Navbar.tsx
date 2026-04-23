"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChainId, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/lib/chain";

export function Navbar() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const onWrongChain = chainId !== arcTestnet.id;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neon-cyan bg-dark-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 animate-pulse rounded-sm bg-neon-cyan/20" />
            <div
              className="absolute inset-1 rounded-sm"
              style={{
                background: "linear-gradient(135deg, #00f5ff, #bf00ff)",
              }}
            />
          </div>
          <span
            className="font-orbitron text-lg font-bold tracking-widest neon-text-cyan hidden sm:block"
          >
            ARC<span className="text-white/40">_</span>VIBE
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs tracking-widest text-white/50">
          <a href="#gallery" className="hover:text-neon-cyan transition-colors">GALLERY</a>
          <a href="#mint"    className="hover:text-neon-cyan transition-colors">MINT</a>
          <a href="#my-badges" className="hover:text-neon-cyan transition-colors">MY BADGES</a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {onWrongChain && (
            <button
              onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="hidden sm:flex btn-cyber btn-magenta px-3 py-1.5 text-xs"
            >
              Switch to Arc
            </button>
          )}
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </div>
      </div>
    </header>
  );
}
