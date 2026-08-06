"use client";
import { useState, useEffect } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { parseEther, isAddress } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { arcTestnet } from "@/lib/chain";

type Step = "idle" | "signing" | "pending" | "success" | "error";

interface Props { amount: string; note: string; onClose: () => void; }

export function PaymentClaimModal({ amount, note, onClose }: Props) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const wrongChain = chainId !== arcTestnet.id;

  const [recipient, setRecipient] = useState("");
  const [step, setStep] = useState<Step>("idle");

  const { sendTransaction, data: txHash, isPending, error, reset } = useSendTransaction();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => { if (isPending) setStep("signing"); }, [isPending]);
  useEffect(() => { if (txHash && !isSuccess) setStep("pending"); }, [txHash, isSuccess]);
  useEffect(() => { if (isSuccess) setStep("success"); }, [isSuccess]);
  useEffect(() => { if (error) setStep("error"); }, [error]);

  const validRecipient = isAddress(recipient);
  const busy = step === "signing" || step === "pending";

  function handlePay() {
    if (!validRecipient) return;
    reset(); setStep("idle");
    sendTransaction({ to: recipient as `0x${string}`, value: parseEther(amount) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,3,10,0.9)" }}>
      <div className="w-full max-w-md gradient-border">
        <div className="relative z-10 p-6 holo-shimmer rounded-xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white font-mono text-xs">✕</button>

          <p className="font-mono text-xs tracking-[0.3em] text-neon-violet mb-4">◈ PAYMENT REQUEST ◈</p>
          <h2 className="font-orbitron text-3xl font-black neon-text-cyan mb-1">{amount} USDC</h2>
          {note && <p className="font-rajdhani text-white/50 mb-6">"{note}"</p>}

          {step === "success" ? (
            <div className="text-center py-4">
              <p className="font-orbitron text-xl font-black neon-text-green mb-2">PAYMENT SENT!</p>
              <a href={`${arcTestnet.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-[11px] text-neon-cyan underline">View on ArcScan →</a>
              <button onClick={onClose} className="btn-cyber btn-green w-full py-3 text-sm mt-4">Close</button>
            </div>
          ) : !isConnected ? (
            <div className="flex flex-col items-center gap-3">
              <p className="font-rajdhani text-white/40 text-sm">Connect wallet to pay</p>
              <ConnectButton />
            </div>
          ) : wrongChain ? (
            <button onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="btn-cyber btn-cyan w-full py-4 text-sm">Switch to Arc</button>
          ) : (
            <>
              <div className="mb-4">
                <label className="font-mono text-[10px] tracking-widest text-neon-cyan block mb-1">PAYING TO (ADDRESS)</label>
                <input value={recipient} onChange={e => setRecipient(e.target.value)}
                  placeholder="0x... recipient address"
                  className={`cyber-input font-mono text-sm ${recipient && !validRecipient ? "border-red-500/50" : ""}`} />
                {recipient && !validRecipient && <p className="font-mono text-[9px] text-red-400 mt-1">Invalid address</p>}
              </div>
              <button onClick={handlePay} disabled={busy || !validRecipient}
                className="btn-cyber btn-violet w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {step === "signing" ? "CONFIRM IN WALLET..." : step === "pending" ? "PROCESSING..." : `PAY ${amount} USDC`}
              </button>
              {step === "error" && (
                <p className="font-mono text-[10px] text-red-400 mt-2 text-center">
                  {error?.message?.includes("rejected") ? "Rejected." : "Transaction failed."}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
