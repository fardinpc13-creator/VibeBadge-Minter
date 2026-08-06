"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChainId, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/lib/chain";

export function Navbar() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const wrongChain = chainId !== arcTestnet.id;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-dark-900/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-sm" style={{ background: "linear-gradient(135deg,#00f5ff,#7000ff)" }} />
            <span className="relative font-orbitron font-black text-sm text-dark-900 z-10">V</span>
          </div>
          <div>
            <span className="font-orbitron text-xl font-black tracking-widest neon-text-cyan">VIBE</span>
            <p className="font-mono text-[8px] text-white/30 tracking-widest leading-none">ON ARC</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {wrongChain && (
            <button onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="hidden sm:flex btn-cyber btn-magenta px-3 py-1.5 text-[10px]">
              Switch to Arc
            </button>
          )}
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        </div>
      </div>
    </header>
  );
}
