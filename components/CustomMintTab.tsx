"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId, useSwitchChain } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { customVibeContract } from "@/lib/contract";
import { arcTestnet } from "@/lib/chain";

type Step = "idle" | "signing" | "pending" | "success" | "error";

const ACCENTS = ["#00f5ff","#ff00a8","#00ff88","#ffee00","#bf00ff","#ff6600"];

export function CustomMintTab() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const onWrongChain = chainId !== arcTestnet.id;

  const [name, setName]        = useState("");
  const [desc, setDesc]        = useState("");
  const [img, setImg]          = useState("");
  const [step, setStep]        = useState<Step>("idle");
  const [mintedId, setMintedId] = useState<number|null>(null);
  const [accent]               = useState(() => ACCENTS[Math.floor(Math.random() * ACCENTS.length)]);

  const { data: totalMinted, refetch } = useReadContract({ ...customVibeContract, functionName: "totalMinted" });
  const { data: maxSupply }            = useReadContract({ ...customVibeContract, functionName: "MAX_SUPPLY" });
  const { data: balance }              = useReadContract({
    ...customVibeContract, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => { if (isPending) setStep("signing"); }, [isPending]);
  useEffect(() => { if (txHash && !isConfirmed) setStep("pending"); }, [txHash, isConfirmed]);
  useEffect(() => {
    if (isConfirmed) {
      setStep("success");
      setMintedId(totalMinted ? Number(totalMinted) + 1 : 1);
      refetch();
    }
  }, [isConfirmed]);
  useEffect(() => { if (writeError) setStep("error"); }, [writeError]);

  const minted = totalMinted ? Number(totalMinted) : 0;
  const max    = maxSupply   ? Number(maxSupply)   : 1000;
  const valid  = name.trim().length > 0 && img.trim().length > 0;
  const busy   = step === "signing" || step === "pending";

  function handleMint() {
    if (!address || !valid) return;
    writeContract({ ...customVibeContract, functionName: "mintCustom", args: [address, name.trim(), desc.trim(), img.trim()] });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-2">◈ V2 CONTRACT ◈</p>
        <h2 className="font-orbitron text-4xl font-black neon-text-magenta mb-2">CREATE CUSTOM VIBE</h2>
        <p className="font-rajdhani text-white/40">Your name. Your image. Your on-chain identity.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { l: "V2 MINTED", v: minted, a: "#ff00a8" },
          { l: "REMAINING", v: max - minted, a: "#00f5ff" },
          { l: "YOUR VIBES", v: balance ? Number(balance) : 0, a: "#00ff88" },
        ].map(s => (
          <div key={s.l} className="text-center p-3 rounded-sm"
            style={{ background: `${s.a}08`, border: `1px solid ${s.a}30` }}>
            <p className="font-orbitron text-xl font-black" style={{ color: s.a }}>{s.v}</p>
            <p className="font-mono text-[9px] text-white/30 tracking-widest mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="gradient-border">
        <div className="relative z-10 p-6 sm:p-8 rounded-xl holo-shimmer">

          {/* Preview box */}
          {img && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden corner-cut"
                style={{ border: `2px solid ${accent}`, boxShadow: `0 0 20px ${accent}40` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display="none")}/>
                <div className="absolute inset-0 opacity-20"
                  style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}/>
                {name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-dark-900/80 px-2 py-1">
                    <p className="font-orbitron text-[9px] truncate" style={{ color: accent }}>{name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-4 mb-6">
            <Field label="VIBE NAME *" placeholder="e.g. ARC PIONEER" value={name}
              onChange={setName} accent="#ff00a8" maxLen={32}/>
            <Field label="DESCRIPTION" placeholder="What's your vibe?" value={desc}
              onChange={setDesc} accent="#00f5ff" maxLen={120} textarea/>
            <Field label="IMAGE URL *" placeholder="https://..." value={img}
              onChange={setImg} accent="#00ff88" maxLen={500}/>
          </div>

          {/* URL tip */}
          <p className="font-mono text-[9px] text-white/20 mb-6 leading-relaxed">
            TIP: use imgur.com, ipfs, or any direct image link ending in .png/.jpg/.gif
          </p>

          {/* Action */}
          {!isConnected ? (
            <div className="flex flex-col items-center gap-3">
              <p className="font-rajdhani text-white/40 text-sm">Connect wallet to mint</p>
              <ConnectButton />
            </div>
          ) : onWrongChain ? (
            <button onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="btn-cyber btn-magenta w-full py-4 text-sm">
              Switch to Arc Testnet
            </button>
          ) : step === "success" ? (
            <SuccessCard tokenId={mintedId} name={name} accent={accent} onReset={() => { setStep("idle"); setName(""); setDesc(""); setImg(""); setMintedId(null); }}/>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={handleMint} disabled={busy || !valid}
                className="btn-cyber btn-magenta w-full py-4 text-sm relative disabled:opacity-50 disabled:cursor-not-allowed">
                {busy && <span className="absolute left-5 top-1/2 -translate-y-1/2"><Dots/></span>}
                {step === "signing" ? "CONFIRM IN WALLET..." : step === "pending" ? "CONFIRMING..." : step === "error" ? "RETRY MINT" : "MINT CUSTOM VIBE →"}
              </button>
              {!valid && (isConnected && !onWrongChain) && (
                <p className="font-mono text-[10px] text-white/20 text-center">Name + Image URL required</p>
              )}
              {step === "error" && (
                <p className="font-mono text-[10px] text-red-400 text-center">
                  {writeError?.message?.slice(0, 100) ?? "TX failed"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, accent, maxLen, textarea }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; accent: string; maxLen: number; textarea?: boolean;
}) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="font-mono text-[10px] tracking-widest" style={{ color: accent }}>{label}</label>
        <span className="font-mono text-[9px] text-white/20">{value.length}/{maxLen}</span>
      </div>
      <Tag
        value={value}
        onChange={e => onChange(e.target.value.slice(0, maxLen))}
        placeholder={placeholder}
        rows={textarea ? 3 : undefined}
        className="w-full bg-dark-700 font-rajdhani text-sm text-white placeholder-white/20 px-3 py-2.5 outline-none resize-none"
        style={{ border: `1px solid ${accent}30`, boxShadow: value ? `0 0 8px ${accent}20` : "none", borderRadius: "4px" }}
      />
    </div>
  );
}

function SuccessCard({ tokenId, name, accent, onReset }: { tokenId: number|null; name: string; accent: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="h-20 w-20 rounded-full flex items-center justify-center"
        style={{ border: `2px solid #00ff88`, boxShadow: "0 0 30px #00ff8860", background: "#00ff8808" }}>
        <span className="text-3xl">✦</span>
      </div>
      <div>
        <p className="font-orbitron text-xl font-black neon-text-green">VIBE MINTED!</p>
        {tokenId && <p className="font-mono text-xs text-white/40 mt-1">Token #{tokenId} · {name}</p>}
      </div>
      <button onClick={onReset} className="btn-cyber btn-magenta px-6 py-3 text-sm">Create Another →</button>
    </div>
  );
}

function Dots() {
  return (
    <span className="flex gap-1">
      {[0,1,2].map(i => (
        <span key={i} className="w-1 h-1 rounded-full bg-neon-magenta"
          style={{ animation: `pulseNeon 1s ease-in-out ${i*0.2}s infinite` }}/>
      ))}
    </span>
  );
}
