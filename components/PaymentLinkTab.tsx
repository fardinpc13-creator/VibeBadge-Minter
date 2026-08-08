"use client";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance, useChainId, useSwitchChain, useReadContract } from "wagmi";
import { parseEther, formatEther, toHex } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { payLinksContract, PAY_LINKS_ADDRESS } from "@/lib/contract";
import { arcTestnet } from "@/lib/chain";

type Step = "idle" | "signing" | "pending" | "success" | "error";

const STORAGE_KEY = "vibe_my_links";

interface SavedLink { id: string; amount: string; note: string; url: string; created: number; }

function randomId(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes) as `0x${string}`;
}

export function PaymentLinkTab() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const wrongChain = chainId !== arcTestnet.id;
  const { data: balance, refetch: refetchBal } = useBalance({ address });

  const [amount, setAmount] = useState("");
  const [note, setNote]     = useState("");
  const [linkId, setLinkId] = useState<`0x${string}` | null>(null);
  const [step, setStep]     = useState<Step>("idle");
  const [copied, setCopied] = useState(false);
  const [myLinks, setMyLinks] = useState<SavedLink[]>([]);

  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const notDeployed = PAY_LINKS_ADDRESS === "0x0000000000000000000000000000000000000000";

  // Load saved links
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMyLinks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => { if (isPending) setStep("signing"); }, [isPending]);
  useEffect(() => { if (txHash && !isSuccess) setStep("pending"); }, [txHash, isSuccess]);
  useEffect(() => {
    if (isSuccess && linkId) {
      setStep("success");
      refetchBal();
      const url = `${window.location.origin}/?claim=${linkId}`;
      const entry: SavedLink = { id: linkId, amount, note, url, created: Date.now() };
      const next = [entry, ...myLinks].slice(0, 20);
      setMyLinks(next);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    }
  }, [isSuccess]);
  useEffect(() => { if (error) setStep("error"); }, [error]);

  const validAmount = parseFloat(amount) > 0;
  const busy = step === "signing" || step === "pending";
  const generatedUrl = linkId ? `${typeof window !== "undefined" ? window.location.origin : ""}/?claim=${linkId}` : "";

  function handleCreate() {
    if (!validAmount || notDeployed) return;
    const id = randomId();
    setLinkId(id);
    reset(); setStep("idle");
    writeContract({
      ...payLinksContract,
      functionName: "createLink",
      args: [id, note.trim()],
      value: parseEther(amount),
    });
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setStep("idle"); setAmount(""); setNote(""); setLinkId(null); setCopied(false); reset();
  }

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-2">◈ CLAIMABLE LINK ◈</p>
          <h2 className="font-orbitron text-4xl font-black text-white mb-2">
            SEND A <span className="neon-text-violet">LINK</span>
          </h2>
          <p className="font-rajdhani text-white/40">
            Lock USDC into a link. Whoever opens it claims the money — no address needed.
          </p>
        </div>

        {notDeployed && (
          <div className="mb-6 p-4 rounded-sm" style={{ background: "#ffee0010", border: "1px solid #ffee0040" }}>
            <p className="font-mono text-[10px] text-yellow-400 leading-relaxed">
              ⚠ PayLinks contract not deployed yet. Deploy VibePayLinks.sol in Remix,
              then paste the address into lib/contract.ts → PAY_LINKS_ADDRESS
            </p>
          </div>
        )}

        {!isConnected ? (
          <div className="text-center"><ConnectButton /></div>
        ) : wrongChain ? (
          <div className="text-center">
            <button onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="btn-cyber btn-cyan px-8 py-4 text-sm">Switch to Arc</button>
          </div>
        ) : step === "success" ? (
          <div className="gradient-border">
            <div className="relative z-10 p-6 holo-shimmer rounded-xl text-center">
              <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
                style={{ border: "2px solid #00ff88", boxShadow: "0 0 24px #00ff8850", background: "#00ff8808" }}>
                <span className="text-2xl">✓</span>
              </div>
              <p className="font-orbitron text-xl font-black neon-text-green mb-1">LINK FUNDED</p>
              <p className="font-mono text-xs text-white/40 mb-5">{amount} USDC locked and ready to claim</p>

              <div className="p-3 rounded-sm mb-4" style={{ background: "#7000ff10", border: "1px solid #7000ff40" }}>
                <p className="font-mono text-[10px] text-neon-violet break-all">{generatedUrl}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => copyLink(generatedUrl)}
                  className={`btn-cyber flex-1 py-3 text-xs ${copied ? "btn-green" : "btn-violet"}`}>
                  {copied ? "✓ COPIED" : "COPY LINK"}
                </button>
                <button onClick={handleReset} className="btn-cyber btn-cyan px-4 py-3 text-xs">NEW LINK</button>
              </div>

              <a href={`${arcTestnet.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] text-neon-cyan underline block mt-3">View TX on ArcScan →</a>
            </div>
          </div>
        ) : (
          <div className="gradient-border">
            <div className="relative z-10 p-6 sm:p-8 holo-shimmer rounded-xl">
              <div className="mb-6 p-3 rounded-sm flex items-center justify-between"
                style={{ background: "#00ff8808", border: "1px solid #00ff8830" }}>
                <p className="font-mono text-[10px] text-white/40 tracking-widest">AVAILABLE</p>
                <p className="font-orbitron text-lg font-black neon-text-green">
                  {balance ? parseFloat(balance.formatted).toFixed(4) : "—"} USDC
                </p>
              </div>

              <div className="mb-4">
                <label className="font-mono text-[10px] tracking-widest text-neon-violet block mb-1">AMOUNT TO LOCK *</label>
                <div className="relative">
                  <input value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" type="number" min="0" step="0.01"
                    className="cyber-input text-lg font-orbitron pr-20" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-neon-violet">USDC</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="font-mono text-[10px] tracking-widest text-white/40 block mb-1">NOTE (optional)</label>
                <input value={note} onChange={e => setNote(e.target.value.slice(0, 60))}
                  placeholder="e.g. Coffee money, thanks!" className="cyber-input" />
                <p className="font-mono text-[9px] text-white/20 mt-1 text-right">{note.length}/60</p>
              </div>

              <button onClick={handleCreate} disabled={busy || !validAmount || notDeployed}
                className="btn-cyber btn-violet w-full py-4 text-sm relative disabled:opacity-50 disabled:cursor-not-allowed">
                {busy && <span className="absolute left-5 top-1/2 -translate-y-1/2"><Dots color="#7000ff"/></span>}
                {step === "signing" ? "CONFIRM IN WALLET..." :
                 step === "pending" ? "LOCKING USDC..." :
                 step === "error"   ? "RETRY" : "LOCK & CREATE LINK →"}
              </button>

              {step === "error" && error && (
                <p className="font-mono text-[10px] text-red-400 mt-3 text-center">
                  ❌ {error.message?.includes("rejected") ? "Rejected in wallet." : error.message?.slice(0, 100)}
                </p>
              )}

              <p className="font-mono text-[9px] text-white/15 text-center mt-3">
                USDC is held in escrow · You can cancel and refund anytime before it's claimed
              </p>
            </div>
          </div>
        )}

        {/* My links */}
        {myLinks.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-[10px] text-white/40 tracking-widest mb-3">MY LINKS</p>
            <div className="flex flex-col gap-2">
              {myLinks.map(l => (
                <MyLinkRow key={l.id} link={l} onCopy={() => copyLink(l.url)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MyLinkRow({ link, onCopy }: { link: SavedLink; onCopy: () => void }) {
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: state, refetch } = useReadContract({
    ...payLinksContract,
    functionName: "getLink",
    args: [link.id as `0x${string}`],
  });

  useEffect(() => { if (isSuccess) refetch(); }, [isSuccess]);

  const claimed   = state ? (state[3] as boolean) : false;
  const cancelled = state ? (state[4] as boolean) : false;
  const status    = claimed ? "CLAIMED" : cancelled ? "REFUNDED" : "OPEN";
  const color     = claimed ? "#00ff88" : cancelled ? "#ffffff40" : "#7000ff";

  return (
    <div className="p-3 rounded-sm flex items-center justify-between gap-2"
      style={{ background: `${color}08`, border: `1px solid ${color}30` }}>
      <div className="min-w-0">
        <p className="font-orbitron text-sm" style={{ color }}>{link.amount} USDC</p>
        {link.note && <p className="font-rajdhani text-xs text-white/40 truncate">{link.note}</p>}
        <p className="font-mono text-[8px] text-white/20">{status}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={onCopy} className="btn-cyber btn-violet px-3 py-1.5 text-[9px]">COPY</button>
        {!claimed && !cancelled && (
          <button
            onClick={() => writeContract({ ...payLinksContract, functionName: "cancel", args: [link.id as `0x${string}`] })}
            disabled={isPending}
            className="btn-cyber btn-magenta px-3 py-1.5 text-[9px] disabled:opacity-50">
            {isPending ? "..." : "CANCEL"}
          </button>
        )}
      </div>
    </div>
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
