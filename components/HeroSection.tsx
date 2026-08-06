"use client";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { vibeBadgeContract } from "@/lib/contract";

export function HeroSection() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: badgeBalance } = useReadContract({
    ...vibeBadgeContract, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { data: totalMinted } = useReadContract({ ...vibeBadgeContract, functionName: "totalMinted" });

  const isVerified = badgeBalance ? Number(badgeBalance) > 0 : false;
  const usdc = balance ? parseFloat(balance.formatted).toFixed(2) : "—";

  return (
    <section className="relative py-20 px-4 text-center scan-overlay">
      {/* Corner brackets */}
      <div className="pointer-events-none absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-neon-cyan opacity-50" />
      <div className="pointer-events-none absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-neon-cyan opacity-50" />
      <div className="pointer-events-none absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-neon-magenta opacity-50" />
      <div className="pointer-events-none absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-neon-magenta opacity-50" />

      <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-4 animate-pulse">◈ ARC TESTNET ◈</p>

      <h1 className="font-orbitron text-6xl sm:text-8xl font-black tracking-tight mb-3 neon-text-cyan">VIBE</h1>
      <p className="font-rajdhani text-lg sm:text-xl text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
        Verified Identity and Instant <span className="text-neon-cyan font-semibold">USDC Payments</span> on Arc
      </p>

      {isConnected ? (
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <div className="px-6 py-3 rounded-sm"
            style={{ background: "#00f5ff08", border: "1px solid #00f5ff30" }}>
            <p className="font-orbitron text-2xl font-black neon-text-cyan">{usdc}</p>
            <p className="font-mono text-[9px] text-white/30 tracking-widest mt-0.5">USDC BALANCE</p>
          </div>
          <div className="px-6 py-3 rounded-sm"
            style={{ background: "#7000ff08", border: "1px solid #7000ff30" }}>
            <p className="font-orbitron text-2xl font-black neon-text-violet">{badgeBalance ? Number(badgeBalance) : 0}</p>
            <p className="font-mono text-[9px] text-white/30 tracking-widest mt-0.5">GENESIS BADGES</p>
          </div>
          <div className="px-6 py-3 rounded-sm"
            style={{ background: "#00ff8808", border: "1px solid #00ff8830" }}>
            <p className="font-orbitron text-2xl font-black neon-text-green">{totalMinted ? Number(totalMinted) : 0}</p>
            <p className="font-mono text-[9px] text-white/30 tracking-widest mt-0.5">TOTAL MINTED</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="font-rajdhani text-white/40">Connect to see your USDC balance and identity</p>
          <ConnectButton />
        </div>
      )}

      {isVerified && (
        <div className="mt-4 flex justify-center">
          <span className="verified-badge">✓ GENESIS HOLDER · VERIFIED</span>
        </div>
      )}
    </section>
  );
}
