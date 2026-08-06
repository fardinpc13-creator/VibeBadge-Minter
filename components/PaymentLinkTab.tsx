"use client";
import { useState } from "react";

export function PaymentLinkTab() {
  const [amount, setAmount]     = useState("");
  const [note, setNote]         = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied]     = useState(false);

  function generateLink() {
    if (!amount || parseFloat(amount) <= 0) return;
    const base  = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({ amount, note });
    const link  = `${base}/?${params.toString()}`;
    setGenerated(link);
    setCopied(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() { setAmount(""); setNote(""); setGenerated(""); setCopied(false); }

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-neon-green mb-2">◈ PAYMENT LINK ◈</p>
          <h2 className="font-orbitron text-4xl font-black text-white mb-2">
            CREATE <span className="neon-text-violet">LINK</span>
          </h2>
          <p className="font-rajdhani text-white/40">Generate a shareable link. Anyone who opens it can pay you in USDC.</p>
        </div>

        <div className="gradient-border">
          <div className="relative z-10 p-6 sm:p-8 holo-shimmer rounded-xl">

            {/* Amount */}
            <div className="mb-4">
              <label className="font-mono text-[10px] tracking-widest text-neon-violet block mb-1">REQUEST AMOUNT (USDC) *</label>
              <div className="relative">
                <input value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00" type="number" min="0" step="0.01"
                  className="cyber-input text-lg font-orbitron pr-20" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-neon-violet">USDC</span>
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className="font-mono text-[10px] tracking-widest text-white/40 block mb-1">NOTE (optional)</label>
              <input value={note} onChange={e => setNote(e.target.value.slice(0, 80))}
                placeholder="e.g. For design work, pizza, etc."
                className="cyber-input" />
              <p className="font-mono text-[9px] text-white/20 mt-1 text-right">{note.length}/80</p>
            </div>

            <button onClick={generateLink} disabled={!amount || parseFloat(amount) <= 0}
              className="btn-cyber btn-violet w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              GENERATE LINK →
            </button>

            {/* Generated link */}
            {generated && (
              <div className="mt-6 p-4 rounded-sm" style={{ background: "#7000ff10", border: "1px solid #7000ff40" }}>
                <p className="font-mono text-[9px] text-white/40 tracking-widest mb-2">YOUR PAYMENT LINK</p>
                <p className="font-mono text-xs text-neon-violet break-all mb-3">{generated}</p>
                <div className="flex gap-2">
                  <button onClick={copyLink}
                    className={`btn-cyber flex-1 py-2.5 text-xs ${copied ? "btn-green" : "btn-violet"}`}>
                    {copied ? "✓ COPIED!" : "COPY LINK"}
                  </button>
                  <button onClick={reset}
                    className="btn-cyber btn-magenta px-4 py-2.5 text-xs">
                    RESET
                  </button>
                </div>
                <p className="font-mono text-[9px] text-white/20 mt-3 text-center">
                  Share this link · Recipient opens it · Pays you {amount} USDC
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 p-4 rounded-sm" style={{ background: "#ffffff05", border: "1px solid #ffffff10" }}>
          <p className="font-mono text-[10px] text-white/40 tracking-widest mb-3">HOW IT WORKS</p>
          {[
            ["1", "Enter amount + optional note"],
            ["2", "Copy the generated link"],
            ["3", "Send link to anyone"],
            ["4", "They open it → connect wallet → pay you USDC"],
          ].map(([n, txt]) => (
            <div key={n} className="flex gap-3 mb-2">
              <span className="font-orbitron text-[10px] neon-text-violet w-4 shrink-0">{n}</span>
              <p className="font-rajdhani text-sm text-white/50">{txt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
