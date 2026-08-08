"use client";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { payLinksContract } from "@/lib/contract";
import { arcTestnet } from "@/lib/chain";

type Step = "idle" | "signing" | "pending" | "success" | "error";

export function PaymentClaimModal({ linkId, onClose }: { linkId: string; onClose: () => void }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const wrongChain = chainId !== arcTestnet.id;
  const [step, setStep] = useState<Step>("idle");

  const { data: link, isLoading, refetch } = useReadContract({
    ...payLinksContract,
    functionName: "getLink",
    args: [linkId as `0x${string}`],
  });

  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => { if (isPending) setStep("signing"); }, [isPending]);
  useEffect(() => { if (txHash && !isSuccess) setStep("pending"); }, [txHash, isSuccess]);
  useEffect(() => { if (isSuccess) { setStep("success"); refetch(); } }, [isSuccess]);
  useEffect(() => { if (error) setStep("error"); }, [error]);

  const creator   = link ? (link[0] as string) : "";
  const amountWei = link ? (link[1] as bigint) : 0n;
  const note      = link ? (link[2] as string) : "";
  const claimed   = link ? (link[3] as boolean) : false;
  const cancelled = link ? (link[4] as boolean) : false;

  const exists    = creator && creator !== "0x0000000000000000000000000000000000000000";
  const amount    = amountWei ? parseFloat(formatEther(amountWei)).toFixed(4) : "0";
  const busy      = step === "signing" || step === "pending";
  const claimable = exists && !claimed && !cancelled;
  const isCreator = address?.toLowerCase() === creator?.toLowerCase();

  function handleClaim() {
    reset(); setStep("idle");
    writeContract({ ...payLinksContract, functionName: "claim", args: [linkId as `0x${string}`] });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,3,10,0.92)" }}>
      <div className="w-full max-w-md gradient-border">
        <div className="relative z-10 p-6 holo-shimmer rounded-xl">
          <button onClick={onClose}
            className="absolute top-4 right-4 text-white/30 hover:text-white font-mono text-xs">✕</button>

          <p className="font-mono text-xs tracking-[0.3em] text-neon-violet mb-4">◈ CLAIM USDC ◈</p>

          {isLoading ? (
            <p className="font-rajdhani text-white/40 py-8 text-center">Loading link…</p>
          ) : !exists ? (
            <div className="py-6 text-center">
              <p className="font-orbitron text-lg text-white/60 mb-2">LINK NOT FOUND</p>
              <p className="font-rajdhani text-white/40 text-sm">This payment link doesn't exist on Arc.</p>
              <button onClick={onClose} className="btn-cyber btn-cyan w-full py-3 text-sm mt-4">Close</button>
            </div>
          ) : step === "success" ? (
            <div className="py-4 text-center">
              <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-4"
                style={{ border: "2px solid #00ff88", boxShadow: "0 0 30px #00ff8850", background: "#00ff8808" }}>
                <span className="text-3xl">✓</span>
              </div>
              <p className="font-orbitron text-2xl font-black neon-text-green mb-1">CLAIMED!</p>
              <p className="font-mono text-sm text-white/50 mb-4">{amount} USDC is now in your wallet</p>
              <a href={`${arcTestnet.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-[11px] text-neon-cyan underline">View on ArcScan →</a>
              <button onClick={onClose} className="btn-cyber btn-green w-full py-3 text-sm mt-4">Done</button>
            </div>
          ) : (
            <>
              <h2 className="font-orbitron text-4xl font-black neon-text-cyan mb-1">{amount} USDC</h2>
              {note && <p className="font-rajdhani text-white/50 mb-4">&ldquo;{note}&rdquo;</p>}
              <p className="font-mono text-[10px] text-white/25 mb-5">
                FROM {creator.slice(0,10)}…{creator.slice(-6)}
              </p>

              {claimed ? (
                <div className="p-4 rounded-sm text-center" style={{ background: "#ffffff05", border: "1px solid #ffffff15" }}>
                  <p className="font-orbitron text-sm text-white/50">ALREADY CLAIMED</p>
                  <p className="font-rajdhani text-white/30 text-sm mt-1">Someone got here first.</p>
                </div>
              ) : cancelled ? (
                <div className="p-4 rounded-sm text-center" style={{ background: "#ffffff05", border: "1px solid #ffffff15" }}>
                  <p className="font-orbitron text-sm text-white/50">LINK CANCELLED</p>
                  <p className="font-rajdhani text-white/30 text-sm mt-1">The sender refunded this link.</p>
                </div>
              ) : !isConnected ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="font-rajdhani text-white/40 text-sm">Connect your wallet to claim</p>
                  <ConnectButton />
                </div>
              ) : wrongChain ? (
                <button onClick={() => switchChain({ chainId: arcTestnet.id })}
                  className="btn-cyber btn-cyan w-full py-4 text-sm">Switch to Arc</button>
              ) : (
                <>
                  <button onClick={handleClaim} disabled={busy}
                    className="btn-cyber btn-green w-full py-4 text-sm disabled:opacity-50">
                    {step === "signing" ? "CONFIRM IN WALLET…" :
                     step === "pending" ? "CLAIMING…" :
                     step === "error"   ? "RETRY CLAIM" : `CLAIM ${amount} USDC →`}
                  </button>
                  {isCreator && (
                    <p className="font-mono text-[9px] text-yellow-400/60 text-center mt-2">
                      This is your own link — claiming returns the funds to you.
                    </p>
                  )}
                  {step === "error" && (
                    <p className="font-mono text-[10px] text-red-400 mt-3 text-center">
                      {error?.message?.includes("rejected") ? "Rejected in wallet."
                        : error?.message?.includes("Already claimed") ? "This link was just claimed by someone else."
                        : "Claim failed. Try again."}
                    </p>
                  )}
                  <p className="font-mono text-[9px] text-white/15 text-center mt-3">
                    Gas paid in USDC · Arc Testnet
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
