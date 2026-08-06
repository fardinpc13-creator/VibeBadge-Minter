"use client";
import Image from "next/image";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { vibeBadgeContract, CONTRACT_ADDRESS, BADGE_THEMES } from "@/lib/contract";
import { VIBE_BADGE_ABI } from "@/lib/abi";

export function BadgesTab() {
  const { address, isConnected } = useAccount();

  const { data: totalMinted } = useReadContract({ ...vibeBadgeContract, functionName: "totalMinted" });
  const { data: maxSupply }   = useReadContract({ ...vibeBadgeContract, functionName: "MAX_SUPPLY" });
  const { data: myBalance }   = useReadContract({
    ...vibeBadgeContract, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const minted = totalMinted ? Number(totalMinted) : 0;
  const max    = maxSupply   ? Number(maxSupply)   : 1000;
  const pct    = Math.round((minted / max) * 100);
  const isVerified = myBalance ? Number(myBalance) > 0 : false;

  // Scan for owned badges
  const tokenIds = Array.from({ length: minted }, (_, i) => i + 1);
  const ownerCalls = tokenIds.map(id => ({
    address: CONTRACT_ADDRESS,
    abi: VIBE_BADGE_ABI,
    functionName: "ownerOf" as const,
    args: [BigInt(id)] as [bigint],
  }));
  const { data: ownerResults } = useReadContracts({
    contracts: ownerCalls,
    query: { enabled: isConnected && !!address && minted > 0 },
  });
  const myTokenIds = ownerResults
    ?.map((r, i) => ({ owner: r.result as string | undefined, tokenId: tokenIds[i] }))
    .filter(({ owner }) => owner?.toLowerCase() === address?.toLowerCase())
    .map(({ tokenId }) => tokenId) ?? [];

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-2">◈ GENESIS COLLECTION ◈</p>
          <h2 className="font-orbitron text-4xl font-black text-white mb-2">
            VIBE <span className="neon-text-cyan">BADGES</span>
          </h2>
          {isVerified && <span className="verified-badge">✓ GENESIS HOLDER · VERIFIED</span>}
        </div>

        {/* Supply bar */}
        <div className="mx-auto max-w-sm mb-10">
          <div className="flex justify-between font-mono text-[10px] text-white/40 mb-2">
            <span>GENESIS SUPPLY</span>
            <span><span className="text-neon-cyan">{minted}</span> / {max}</span>
          </div>
          <div className="h-2 w-full bg-dark-600 overflow-hidden rounded-none corner-cut">
            <div className="h-full progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <p className="font-mono text-[9px] text-white/20 mt-1 text-right">
            {pct === 100 ? "SOLD OUT" : `${pct}% CLAIMED`}
          </p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {BADGE_THEMES.map(badge => (
            <div key={badge.id} className="badge-card gradient-border overflow-hidden cursor-pointer group">
              <div className="relative z-10 p-3"
                style={{ background: `linear-gradient(160deg,${badge.accent}08 0%,#0d0d1a 100%)` }}>
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 scan-overlay"
                  style={{ boxShadow: `0 0 16px ${badge.accent}30` }}>
                  <Image src={`https://picsum.photos/seed/${badge.seed}/200/200`} alt={badge.label}
                    fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width:640px) 45vw, 16vw" />
                </div>
                <p className="font-orbitron text-[10px] font-bold tracking-widest" style={{ color: badge.accent }}>{badge.label}</p>
                <div className="mt-2 h-px w-full opacity-40"
                  style={{ background: `linear-gradient(90deg,transparent,${badge.accent},transparent)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* My badges */}
        <div className="border-t border-white/5 pt-10">
          <h3 className="font-orbitron text-2xl font-black text-white mb-6 text-center">
            MY <span className="neon-text-violet">COLLECTION</span>
          </h3>
          {!isConnected ? (
            <p className="text-center font-rajdhani text-white/40">Connect wallet to view your badges</p>
          ) : myTokenIds.length === 0 ? (
            <p className="text-center font-rajdhani text-white/40">No Genesis Badges in this wallet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {myTokenIds.map((id, i) => {
                const accent = BADGE_THEMES[i % BADGE_THEMES.length].accent;
                return (
                  <div key={id} className="badge-card rounded-lg overflow-hidden"
                    style={{ border: `1px solid ${accent}40`, background: `linear-gradient(160deg,${accent}08 0%,#0d0d1a 100%)` }}>
                    <div className="p-3">
                      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2">
                        <Image src={`https://picsum.photos/seed/${id * 7}/200/200`} alt={`#${id}`}
                          fill className="object-cover" sizes="(max-width:640px) 45vw, 16vw" />
                      </div>
                      <p className="font-orbitron text-[10px] font-bold text-center" style={{ color: accent }}>#{id}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
