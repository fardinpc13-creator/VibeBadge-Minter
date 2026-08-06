"use client";
import { useState, useEffect } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useBalance, useChainId, useSwitchChain } from "wagmi";
import { parseEther, isAddress } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { arcTestnet } from "@/lib/chain";

type Step = "idle" | "signing" | "pending" | "success" | "error";

export function SendTab() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const wrongChain = chainId !== arcTestnet.id;

  const { data: balance, refetch } = useBalance({ address });
  const [to, setTo]       = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep]   = useState<Step>("idle");

  const { sendTransaction, data: txHash, isPending, error, reset } = useSendTransaction();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => { if (isPending) setStep("signing"); }, [isPending]);
  useEffect(() => { if (txHash && !isSuccess) setStep("pending"); }, [txHash, isSuccess]);
  useEffect(() => { if (isSuccess) { setStep("success"); refetch(); } }, [isSuccess]);
  useEffect(() => { if (error) setStep("error"); }, [error]);

  const validAddress = isAddress(to);
  const validAmount  = parseFloat(amount) > 0;
  const canSend      = validAddress && validAmount;
  const busy         = step === "signing" || step === "pending";

  function handleSend() {
    if (!canSend) return;
    reset(); setStep("idle");
    sendTransaction({ to: to as `0x${string}`, value: parseEther(amount) });
  }

  function handleReset() { setStep("idle"); setTo(""); setAmount(""); reset(); }

  const usdc = balance ? parseFloat(balance.formatted).toFixed(4) : "—";

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-2">◈ SEND ◈</p>
          <h2 className="font-orbitron text-4xl font-black text-white mb-2">
            SEND <span className="neon-text-green">USDC</span>
          </h2>
          <p className="font-rajdhani text-white/40">Instant USDC transfers on Arc. No ETH needed.</p>
        </div>

        {!isConnected ? (
          <div className="text-center">
            <ConnectButton />
          </div>
        ) : wrongChain ? (
          <div className="text-center">
            <button onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="btn-cyber btn-cyan px-8 py-4 text-sm">Switch to Arc</button>
          </div>
        ) : step === "success" ? (
          <div className="gradient-border">
            <div className="relative z-10 p-8 holo-shimmer rounded-xl text-center flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full flex items-center justify-center"
                style={{ border: "2px solid #00ff88", boxShadow: "0 0 30px #00ff8850", background: "#00ff8808" }}>
                <span className="text-3xl">✓</span>
              </div>
              <div>
                <p className="font-orbitron text-xl font-black neon-text-green">SENT!</p>
                <p className="font-mono text-xs text-white/40 mt-1">{amount} USDC to {to.slice(0,8)}...{to.slice(-6)}</p>
              </div>
              <a href={`${arcTestnet.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-[11px] text-neon-cyan underline">View on ArcScan →</a>
              <button onClick={handleReset} className="btn-cyber btn-green px-6 py-3 text-sm">Send Again</button>
            </div>
          </div>
        ) : (
          <div className="gradient-border">
            <div className="relative z-10 p-6 sm:p-8 holo-shimmer rounded-xl">
              {/* Balance */}
              <div className="mb-6 p-3 rounded-sm flex items-center justify-between"
                style={{ background: "#00ff8808", border: "1px solid #00ff8830" }}>
                <p className="font-mono text-[10px] text-white/40 tracking-widest">YOUR BALANCE</p>
                <p className="font-orbitron text-lg font-black neon-text-green">{usdc} USDC</p>
              </div>

              {/* Recipient */}
              <div className="mb-4">
                <label className="font-mono text-[10px] tracking-widest text-neon-cyan block mb-1">RECIPIENT ADDRESS *</label>
                <input value={to} onChange={e => setTo(e.target.value)}
                  placeholder="0x..."
                  className={`cyber-input font-mono text-sm ${to && !validAddress ? "border-red-500/50" : ""}`} />
                {to && !validAddress && (
                  <p className="font-mono text-[9px] text-red-400 mt-1">Invalid address</p>
                )}
              </div>

              {/* Amount */}
              <div className="mb-6">
                <label className="font-mono text-[10px] tracking-widest text-neon-green block mb-1">AMOUNT (USDC) *</label>
                <div className="relative">
                  <input value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" type="number" min="0" step="0.01"
                    className="cyber-input text-lg font-orbitron pr-20" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-neon-green">USDC</span>
                </div>
                {balance && (
                  <button onClick={() => setAmount(parseFloat(balance.formatted).toFixed(4))}
                    className="font-mono text-[9px] text-white/30 hover:text-neon-green mt-1 transition-colors">
                    MAX: {parseFloat(balance.formatted).toFixed(4)}
                  </button>
                )}
              </div>

              <button onClick={handleSend} disabled={busy || !canSend}
                className="btn-cyber btn-green w-full py-4 text-sm relative disabled:opacity-50 disabled:cursor-not-allowed">
                {busy && <span className="absolute left-5 top-1/2 -translate-y-1/2"><Dots color="#00ff88"/></span>}
                {step === "signing" ? "CONFIRM IN WALLET..." :
                 step === "pending" ? "SENDING..." :
                 step === "error"   ? "RETRY" : "SEND USDC →"}
              </button>

              {step === "error" && error && (
                <p className="font-mono text-[10px] text-red-400 mt-3 text-center">
                  ❌ {error.message?.includes("rejected") ? "Rejected in wallet." : error.message?.slice(0, 100)}
                </p>
              )}
              {step === "pending" && txHash && (
                <a href={`${arcTestnet.blockExplorers.default.url}/tx/${txHash}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[11px] text-neon-cyan underline text-center block mt-3">
                  View TX →
                </a>
              )}
              <p className="font-mono text-[9px] text-white/15 text-center mt-3">Gas paid in USDC · Arc Testnet</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Dots({ color }: { color: string }) {
  return (
    <span className="flex gap-1">
      {[0,1,2].map(i => (
        <span key={i} className="w-1 h-1 rounded-full"
          style={{ background: color, animation: `pulseNeon 1s ease-in-out ${i*0.2}s infinite` }}/>
      ))}
    </span>
  );
}
