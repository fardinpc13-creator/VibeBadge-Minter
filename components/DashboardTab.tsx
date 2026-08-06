"use client";
import { useAccount, useBalance, useReadContract, useReadContracts } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { vibeBadgeContract, customVibeContract, CONTRACT_ADDRESS, V2_ADDRESS } from "@/lib/contract";
import { VIBE_BADGE_ABI, CUSTOM_VIBE_ABI } from "@/lib/abi";
import { arcTestnet } from "@/lib/chain";

export function DashboardTab() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const { data: v1Balance } = useReadContract({
    ...vibeBadgeContract, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { data: v2Balance } = useReadContract({
    ...customVibeContract, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { data: v1Total } = useReadContract({ ...vibeBadgeContract, functionName: "totalMinted" });
  const { data: v2Total } = useReadContract({ ...customVibeContract, functionName: "totalMinted" });

  const isVerified = v1Balance ? Number(v1Balance) > 0 : false;
  const usdc       = balance ? parseFloat(balance.formatted).toFixed(4) : "—";

  if (!isConnected) {
    return (
      <section className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-4">◈ DASHBOARD ◈</p>
          <h2 className="font-orbitron text-4xl font-black text-white mb-6">
            CONNECT <span className="neon-text-magenta">WALLET</span>
          </h2>
          <ConnectButton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-2">◈ DASHBOARD ◈</p>
          <h2 className="font-orbitron text-4xl font-black text-white mb-2">
            MY <span className="neon-text-magenta">VIBE</span>
          </h2>
          {isVerified && <span className="verified-badge">✓ GENESIS HOLDER · VERIFIED</span>}
        </div>

        {/* Wallet address */}
        <div className="mb-4 p-4 rounded-sm" style={{ background: "#ffffff05", border: "1px solid #ffffff10" }}>
          <p className="font-mono text-[10px] text-white/30 tracking-widest mb-1">WALLET</p>
          <p className="font-mono text-sm text-white/70 break-all">{address}</p>
          <a href={`${arcTestnet.blockExplorers.default.url}/address/${address}`}
            target="_blank" rel="noopener noreferrer"
            className="font-mono text-[10px] text-neon-cyan hover:underline">View on ArcScan →</a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "USDC BALANCE",    value: `${usdc}`,                          accent: "#00ff88", sub: "USDC" },
            { label: "GENESIS BADGES",  value: v1Balance ? Number(v1Balance) : 0,  accent: "#00f5ff", sub: "V1" },
            { label: "CUSTOM VIBES",    value: v2Balance ? Number(v2Balance) : 0,  accent: "#7000ff", sub: "V2" },
            { label: "STATUS",          value: isVerified ? "VERIFIED" : "UNVERIFIED", accent: isVerified ? "#00ff88" : "#ffffff30", sub: "" },
          ].map(s => (
            <div key={s.label} className="text-center p-4 rounded-sm"
              style={{ background: `${s.accent}08`, border: `1px solid ${s.accent}30` }}>
              <p className="font-orbitron text-xl font-black" style={{ color: s.accent }}>
                {typeof s.value === "number" ? s.value : s.value}
              </p>
              {s.sub && <p className="font-mono text-[9px] text-white/20">{s.sub}</p>}
              <p className="font-mono text-[8px] text-white/30 tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Network stats */}
        <div className="gradient-border">
          <div className="relative z-10 p-6 holo-shimmer rounded-xl">
            <p className="font-mono text-[10px] text-white/40 tracking-widest mb-4">NETWORK OVERVIEW</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[9px] text-white/30 mb-1">GENESIS TOTAL MINTED</p>
                <p className="font-orbitron text-2xl neon-text-cyan">{v1Total ? Number(v1Total) : 0} <span className="text-sm text-white/30">/ 1000</span></p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-white/30 mb-1">CUSTOM VIBES MINTED</p>
                <p className="font-orbitron text-2xl neon-text-violet">{v2Total ? Number(v2Total) : 0}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-white/30 mb-1">CHAIN</p>
                <p className="font-mono text-sm text-neon-green">Arc Testnet</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-white/30 mb-1">GAS TOKEN</p>
                <p className="font-mono text-sm text-neon-green">USDC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Identity card */}
        {isVerified && (
          <div className="mt-4 p-4 rounded-sm"
            style={{ background: "#00ff8808", border: "1px solid #00ff8840" }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-orbitron text-sm neon-text-green">GENESIS HOLDER</p>
                <p className="font-rajdhani text-white/40 text-sm">Your wallet holds a Genesis Vibe Badge — you're part of the OG collection.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
