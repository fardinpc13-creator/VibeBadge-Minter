"use client";

import { useState, useEffect, useRef } from "react";
import {
  useAccount, useWriteContract, useWaitForTransactionReceipt,
  useReadContract, useChainId, useSwitchChain
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { customVibeContract } from "@/lib/contract";
import { arcTestnet } from "@/lib/chain";

type Step = "idle" | "signing" | "pending" | "success" | "error";
type ImgMode = "upload" | "url";

export function CustomMintTab() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const onWrongChain = chainId !== arcTestnet.id;

  const [name, setName]         = useState("");
  const [desc, setDesc]         = useState("");
  const [imgSrc, setImgSrc]     = useState("");
  const [imgMode, setImgMode]   = useState<ImgMode>("upload");
  const [urlInput, setUrlInput] = useState("");
  const [fileWarn, setFileWarn] = useState("");
  const [step, setStep]         = useState<Step>("idle");
  const [mintedId, setMintedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: totalMinted, refetch } = useReadContract({
    ...customVibeContract,
    functionName: "totalMinted",
  });
  const { data: balance } = useReadContract({
    ...customVibeContract,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract();
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileWarn("");
    const sizeKB = file.size / 1024;
    if (sizeKB > 500) { setFileWarn("File too large (max 500KB). Use URL instead."); return; }
    if (sizeKB > 80) setFileWarn(`Large image (${Math.round(sizeKB)}KB) = higher gas.`);
    const reader = new FileReader();
    reader.onload = ev => setImgSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const finalImg = imgMode === "url" ? urlInput.trim() : imgSrc;
  const valid    = name.trim().length > 0 && finalImg.length > 0;
  const busy     = step === "signing" || step === "pending";

  function handleMint() {
    if (!valid) return;
    reset();
    setStep("idle");
    writeContract({
      ...customVibeContract,
      functionName: "mintCustom",
      args: [name.trim(), desc.trim(), finalImg],
    });
  }

  function handleReset() {
    setStep("idle"); setName(""); setDesc("");
    setImgSrc(""); setUrlInput(""); setMintedId(null);
    setFileWarn(""); reset();
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-2">◈ V2 CONTRACT ◈</p>
        <h2 className="font-orbitron text-4xl font-black neon-text-magenta mb-2">CREATE CUSTOM VIBE</h2>
        <p className="font-rajdhani text-white/40">Your name. Your image. Your on-chain identity.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { l: "V2 MINTED",  v: totalMinted ? Number(totalMinted) : 0, a: "#ff00a8" },
          { l: "YOUR VIBES", v: balance     ? Number(balance)     : 0, a: "#00ff88" },
        ].map(s => (
          <div key={s.l} className="text-center p-3 rounded-sm"
            style={{ background: `${s.a}08`, border: `1px solid ${s.a}30` }}>
            <p className="font-orbitron text-2xl font-black" style={{ color: s.a }}>{s.v}</p>
            <p className="font-mono text-[9px] text-white/30 tracking-widest mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="gradient-border">
        <div className="relative z-10 p-6 sm:p-8 rounded-xl holo-shimmer">
          {finalImg && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-36 h-36 rounded-lg overflow-hidden corner-cut"
                style={{ border: "2px solid #ff00a8", boxShadow: "0 0 20px #ff00a840" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={finalImg} alt="preview" className="w-full h-full object-cover"
                  onError={e => (e.currentTarget.style.display = "none")}/>
                {name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-dark-900/80 px-2 py-1">
                    <p className="font-orbitron text-[9px] truncate text-neon-magenta">{name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex mb-4 rounded-sm overflow-hidden" style={{ border: "1px solid #ff00a830" }}>
            {(["upload", "url"] as ImgMode[]).map(m => (
              <button key={m}
                onClick={() => { setImgMode(m); setImgSrc(""); setFileWarn(""); if (fileRef.current) fileRef.current.value = ""; }}
                className="flex-1 py-2 font-mono text-[10px] tracking-widest transition-all"
                style={{
                  background: imgMode === m ? "#ff00a820" : "transparent",
                  color: imgMode === m ? "#ff00a8" : "rgba(255,255,255,0.3)",
                  borderRight: m === "upload" ? "1px solid #ff00a830" : "none",
                }}>
                {m === "upload" ? "📁 UPLOAD FILE" : "🔗 PASTE URL"}
              </button>
            ))}
          </div>

          {imgMode === "upload" ? (
            <div className="mb-4">
              <div className="relative w-full py-8 flex flex-col items-center justify-center cursor-pointer rounded-sm"
                style={{ border: "1px dashed #ff00a840", background: "#ff00a808" }}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
                <span className="text-2xl mb-2">🖼️</span>
                <p className="font-mono text-xs text-white/40">Click to upload image</p>
                <p className="font-mono text-[9px] text-white/20 mt-1">PNG · JPG · GIF · Max 500KB</p>
                {imgSrc && <p className="font-mono text-[9px] text-neon-green mt-2">✓ Image loaded</p>}
              </div>
              {fileWarn && <p className="font-mono text-[10px] text-yellow-400 mt-2">{fileWarn}</p>}
            </div>
          ) : (
            <div className="mb-4">
              <label className="font-mono text-[10px] tracking-widest text-neon-magenta block mb-1">IMAGE URL *</label>
              <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                placeholder="https://i.imgur.com/abc123.png"
                className="w-full bg-dark-700 font-rajdhani text-sm text-white placeholder-white/20 px-3 py-2.5 outline-none"
                style={{ border: "1px solid #ff00a830", borderRadius: "4px" }}/>
              <p className="font-mono text-[9px] text-white/20 mt-1">Tip: imgur.com → right-click → copy image address</p>
            </div>
          )}

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="font-mono text-[10px] tracking-widest text-neon-cyan">VIBE NAME *</label>
              <span className="font-mono text-[9px] text-white/20">{name.length}/32</span>
            </div>
            <input value={name} onChange={e => setName(e.target.value.slice(0, 32))}
              placeholder="e.g. ARC PIONEER"
              className="w-full bg-dark-700 font-rajdhani text-sm text-white placeholder-white/20 px-3 py-2.5 outline-none"
              style={{ border: "1px solid #00f5ff30", borderRadius: "4px" }}/>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <label className="font-mono text-[10px] tracking-widest text-white/30">DESCRIPTION (optional)</label>
              <span className="font-mono text-[9px] text-white/20">{desc.length}/120</span>
            </div>
            <textarea value={desc} onChange={e => setDesc(e.target.value.slice(0, 120))}
              placeholder="What's your vibe?" rows={2}
              className="w-full bg-dark-700 font-rajdhani text-sm text-white placeholder-white/20 px-3 py-2.5 outline-none resize-none"
              style={{ border: "1px solid #ffffff10", borderRadius: "4px" }}/>
          </div>

          {!isConnected ? (
            <div className="flex flex-col items-center gap-3">
              <p className="font-rajdhani text-white/40 text-sm">Connect wallet to mint</p>
              <ConnectButton />
            </div>
          ) : onWrongChain ? (
            <button onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="btn-cyber btn-magenta w-full py-4 text-sm">Switch to Arc Testnet</button>
          ) : step === "success" ? (
            <SuccessCard tokenId={mintedId} name={name} onReset={handleReset}/>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={handleMint} disabled={busy || !valid}
                className="btn-cyber btn-magenta w-full py-4 text-sm relative disabled:opacity-50 disabled:cursor-not-allowed">
                {busy && <span className="absolute left-5 top-1/2 -translate-y-1/2"><Dots/></span>}
                {step === "signing" ? "CONFIRM IN WALLET..." :
                 step === "pending" ? "CONFIRMING TX..."     :
                 step === "error"   ? "RETRY MINT"           : "MINT CUSTOM VIBE →"}
              </button>
              {!valid && isConnected && !onWrongChain && (
                <p className="font-mono text-[10px] text-white/20 text-center">
                  {!name.trim() ? "Name required" : "Image required"}
                </p>
              )}
              {step === "error" && writeError && (
                <div className="rounded-sm p-3" style={{ background: "#ff000010", border: "1px solid #ff000030" }}>
                  <p className="font-mono text-[10px] text-red-400">
                    ❌ {writeError.message?.includes("user rejected")
                      ? "Rejected in wallet."
                      : writeError.message?.slice(0, 120) ?? "TX failed."}
                  </p>
                </div>
              )}
              {step === "pending" && txHash && (
                <a href={`${arcTestnet.blockExplorers.default.url}/tx/${txHash}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[11px] text-neon-cyan underline text-center">
                  View TX on Explorer →
                </a>
              )}
              <p className="font-mono text-[9px] text-white/15 text-center">Free mint · Gas paid in USDC</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessCard({ tokenId, name, onReset }: { tokenId: number | null; name: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="relative h-20 w-20 rounded-full flex items-center justify-center"
        style={{ border: "2px solid #00ff88", boxShadow: "0 0 30px #00ff8860", background: "#00ff8808" }}>
        <span className="text-3xl">✦</span>
        <div className="absolute -inset-2 rounded-full border border-neon-green/30 animate-ping"/>
      </div>
      <div>
        <p className="font-orbitron text-xl font-black neon-text-green">VIBE MINTED!</p>
        {tokenId && <p className="font-mono text-xs text-white/40 mt-1">Token #{tokenId}{name ? ` · ${name}` : ""}</p>}
      </div>
      <div className="flex gap-3">
        <button onClick={onReset} className="btn-cyber btn-magenta px-6 py-3 text-sm">Create Another →</button>
        <a href="#my-badges" className="btn-cyber btn-green px-6 py-3 text-sm">View Mine →</a>
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="flex gap-1">
      {[0,1,2].map(i => (
        <span key={i} className="w-1 h-1 rounded-full bg-neon-magenta"
          style={{ animation: `pulseNeon 1s ease-in-out ${i * 0.2}s infinite` }}/>
      ))}
    </span>
  );
}
