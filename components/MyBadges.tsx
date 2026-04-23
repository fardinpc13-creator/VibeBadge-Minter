"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { vibeBadgeContract } from "@/lib/contract";
import { VIBE_BADGE_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/contract";

const ACCENT_CYCLE = ["#00f5ff", "#ff00a8", "#00ff88", "#ffee00", "#bf00ff", "#ff6600"];
const SEEDS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export function MyBadges() {
  const { address, isConnected } = useAccount();

  const { data: totalMinted } = useReadContract({
    ...vibeBadgeContract,
    functionName: "totalMinted",
  });

  const { data: balance } = useReadContract({
    ...vibeBadgeContract,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Scan all minted tokens to find ones owned by this address.
  // For small supplies this is fine; for production use an indexer.
  const total = totalMinted ? Number(totalMinted) : 0;

  const tokenIds = Array.from({ length: total }, (_, i) => i + 1);

  const ownerCalls = tokenIds.map((id) => ({
    address: CONTRACT_ADDRESS,
    abi: VIBE_BADGE_ABI,
    functionName: "ownerOf" as const,
    args: [BigInt(id)] as [bigint],
  }));

  const { data: ownerResults } = useReadContracts({
    contracts: ownerCalls,
    query: { enabled: isConnected && !!address && total > 0 },
  });

  const myTokenIds = ownerResults
    ?.map((r, i) => ({ owner: r.result as string | undefined, tokenId: tokenIds[i] }))
    .filter(({ owner }) => owner?.toLowerCase() === address?.toLowerCase())
    .map(({ tokenId }) => tokenId) ?? [];

  return (
    <section id="my-badges" className="py-24 px-4 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-3">◈ YOUR COLLECTION ◈</p>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">
            MY <span className="neon-text-cyan">BADGES</span>
          </h2>
        </div>

        {!isConnected ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full"
              style={{ border: "1px solid #00f5ff30", background: "#00f5ff08" }}>
              <span className="text-3xl opacity-40">⬡</span>
            </div>
            <p className="font-rajdhani text-white/40 text-lg">Connect wallet to view your badges</p>
          </div>
        ) : myTokenIds.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full"
              style={{ border: "1px solid #ff00a830", background: "#ff00a808" }}>
              <span className="text-3xl opacity-40">◯</span>
            </div>
            <p className="font-rajdhani text-white/40 text-lg">No badges yet.</p>
            <a href="#mint" className="mt-4 inline-block btn-cyber btn-magenta px-6 py-3 text-sm">
              Mint One →
            </a>
          </div>
        ) : (
          <>
            <p className="text-center font-mono text-xs text-white/30 mb-8 tracking-widest">
              {myTokenIds.length} BADGE{myTokenIds.length !== 1 ? "S" : ""} OWNED
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {myTokenIds.map((id, i) => (
                <OwnedBadge key={id} tokenId={id} accent={ACCENT_CYCLE[i % ACCENT_CYCLE.length]} seed={SEEDS[i % SEEDS.length]} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function OwnedBadge({ tokenId, accent, seed }: { tokenId: number; accent: string; seed: number }) {
  const { data: uri } = useReadContract({
    ...vibeBadgeContract,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  return (
    <div
      className="badge-card group relative rounded-lg overflow-hidden"
      style={{
        border: `1px solid ${accent}40`,
        background: `linear-gradient(160deg, ${accent}08 0%, #0d0d1a 100%)`,
        boxShadow: `0 0 20px ${accent}20`,
      }}
    >
      <div className="p-3">
        <div
          className="relative w-full aspect-square rounded-md overflow-hidden mb-3"
          style={{ boxShadow: `0 0 15px ${accent}30` }}
        >
          <Image
            src={`https://picsum.photos/seed/${seed + tokenId}/200/200`}
            alt={`Badge #${tokenId}`}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            sizes="(max-width: 640px) 45vw, 20vw"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
            style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }} />
        </div>

        <div className="flex items-center justify-between">
          <p className="font-orbitron text-xs font-bold" style={{ color: accent }}>
            #{tokenId}
          </p>
          {uri && (
            <a
              href={uri as string}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[8px] text-white/30 hover:text-white/60 transition-colors"
            >
              META →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
