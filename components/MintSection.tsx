"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { vibeBadgeContract } from "@/lib/contract";
import { arcTestnet } from "@/lib/chain";

type TxStep = "idle" | "signing" | "pending" | "success" | "error";

export function MintSection() {
  const { address, isConnected } = useAccount();
  const chainId   = useChainId();
  const { switchChain } = useSwitchChain();

  const [step, setStep]   = useState<TxStep>("idle");
  const [mintedId, setMintedId] = useState<number | null>(null);

  const { data: totalMinted, refetch } = useReadContract({
    ...vibeBadgeContract,
    functionName: "totalMinted",
  });
  const { data: maxSupply } = useReadContract({
    ...vibeBadgeContract,
    functionName: "MAX_SUPPLY",
  });
  const { data: userBalance } = useReadContract({
    ...vibeBadgeContract,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isPending) setStep("signing");
  }, [isPending]);

  useEffect(() => {
    if (txHash && !isConfirmed) setStep("pending");
  }, [txHash, isConfirmed]);

  useEffect(() => {
    if (isConfirmed) {
      setStep("success");
      const next = totalMinted ? Number(totalMinted) + 1 : 1;
      setMintedId(next);
      refetch();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (writeError) setStep("error");
  }, [writeError]);

  const minted = totalMinted ? Number(totalMinted) : 0;
  const max    = maxSupply   ? Number(maxSupply)   : 1000;
  const isSoldOut = minted >= max;
  const onWrongChain = chainId !== arcTestnet.id;

  function handleMint() {
    if (!address) return;
    setStep("idle");
    writeContract({
      ...vibeBadgeContract,
      functionName: "mint",
      args: [address],
    });
  }

  function handleReset() {
    setStep("idle");
    setMintedId(null);
  }

  return (
    <section id="mint" className="py-24 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-3">◈ MINT PORTAL ◈</p>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">
            CLAIM YOUR <span className="neon-text-cyan">BADGE</span>
          </h2>
        </div>

        {/* Card */}
        <div className="gradient-border">
          <div className="relative z-10 p-8 sm:p-10 holo-shimmer rounded-xl">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "MINTED", value: minted, accent: "#00f5ff" },
                { label: "REMAINING", value: max - minted, accent: "#ff00a8" },
                { label: "YOUR BADGES", value: userBalance ? Number(userBalance) : 0, accent: "#00ff88" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-3 rounded-sm"
                  style={{
                    background: `${s.accent}08`,
                    border: `1px solid ${s.accent}30`,
                  }}
                >
                  <p className="font-orbitron text-2xl font-black" style={{ color: s.accent }}>
                    {s.value}
                  </p>
                  <p className="font-mono text-[9px] text-white/30 tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Supply bar */}
            <div className="mb-8">
              <div className="h-1.5 w-full bg-dark-600 overflow-hidden">
                <div
                  className="h-full progress-bar transition-all duration-700"
                  style={{ width: `${Math.round((minted / max) * 100)}%` }}
                />
              </div>
            </div>

            {/* Main action area */}
            {!isConnected ? (
              <div className="flex flex-col items-center gap-4">
                <p className="font-rajdhani text-white/50 text-center">
                  Connect your wallet to mint
                </p>
                <ConnectButton />
              </div>
            ) : onWrongChain ? (
              <div className="flex flex-col items-center gap-4">
                <p className="font-rajdhani text-neon-yellow text-center font-semibold">
                  ⚠ Switch to Arc Testnet to mint
                </p>
                <button
                  onClick={() => switchChain({ chainId: arcTestnet.id })}
                  className="btn-cyber btn-cyan px-8 py-4 text-sm w-full sm:w-auto"
                >
                  Switch Network
                </button>
              </div>
            ) : isSoldOut ? (
              <div className="text-center">
                <p className="font-orbitron text-neon-magenta text-xl font-bold">SOLD OUT</p>
                <p className="font-rajdhani text-white/40 mt-2">All 1000 badges have been minted.</p>
              </div>
            ) : step === "success" ? (
              <SuccessState tokenId={mintedId} onReset={handleReset} />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <MintButton step={step} onClick={handleMint} />
                {step === "error" && (
                  <p className="font-mono text-[11px] text-red-400 text-center max-w-xs">
                    {writeError?.message?.slice(0, 120) ?? "Transaction failed. Check wallet & try again."}
                  </p>
                )}
                {step === "pending" && (
                  <a
                    href={`${arcTestnet.blockExplorers.default.url}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-neon-cyan underline"
                  >
                    View on Explorer →
                  </a>
                )}
                <p className="font-mono text-[10px] text-white/20 text-center">
                  Gas paid in ARC · No mint price
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MintButton({ step, onClick }: { step: TxStep; onClick: () => void }) {
  const labels: Record<TxStep, string> = {
    idle:    "MINT BADGE",
    signing: "CONFIRM IN WALLET...",
    pending: "CONFIRMING TX...",
    success: "MINTED!",
    error:   "RETRY MINT",
  };

  const isLoading = step === "signing" || step === "pending";

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="btn-cyber btn-cyan w-full py-5 text-base relative disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2">
          <LoadingDots />
        </span>
      )}
      {labels[step]}
    </button>
  );
}

function SuccessState({ tokenId, onReset }: { tokenId: number | null; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative">
        <div className="h-24 w-24 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, #00ff8820 0%, transparent 70%)",
            border: "2px solid #00ff88",
            boxShadow: "0 0 30px #00ff8860",
          }}>
          <span className="text-4xl">✦</span>
        </div>
        <div className="absolute -inset-2 rounded-full border border-neon-green/30 animate-ping" />
      </div>
      <div className="text-center">
        <p className="font-orbitron text-2xl font-black neon-text-green">MINTED!</p>
        {tokenId && (
          <p className="font-mono text-sm text-white/50 mt-1">Badge #{tokenId} is yours</p>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={onReset} className="btn-cyber btn-cyan px-6 py-3 text-sm">
          Mint Another
        </button>
        <a href="#my-badges" className="btn-cyber btn-green px-6 py-3 text-sm">
          View Mine →
        </a>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-neon-cyan"
          style={{ animation: `pulseNeon 1s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}
