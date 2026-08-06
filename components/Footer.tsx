import { CONTRACT_ADDRESS, V2_ADDRESS } from "@/lib/contract";
import { arcTestnet } from "@/lib/chain";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4 mt-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00f5ff,#7000ff)" }}>
              <span className="font-orbitron font-black text-xs text-dark-900">V</span>
            </div>
            <span className="font-orbitron text-sm font-black tracking-widest neon-text-cyan">VIBE</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 font-mono text-[10px] text-white/25">
            <span>
              <span className="text-neon-green">V1 </span>
              <a href={`${arcTestnet.blockExplorers.default.url}/address/${CONTRACT_ADDRESS}`}
                target="_blank" rel="noopener noreferrer"
                className="hover:text-neon-cyan transition-colors">{CONTRACT_ADDRESS.slice(0,10)}...</a>
            </span>
            <span>
              <span className="text-neon-violet">V2 </span>
              <a href={`${arcTestnet.blockExplorers.default.url}/address/${V2_ADDRESS}`}
                target="_blank" rel="noopener noreferrer"
                className="hover:text-neon-cyan transition-colors">{V2_ADDRESS.slice(0,10)}...</a>
            </span>
          </div>

          <div className="flex gap-5 font-mono text-[10px] text-white/30">
            <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer"
              className="hover:text-neon-cyan transition-colors">ARCSCAN</a>
            <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-neon-green transition-colors">FAUCET</a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 text-center font-mono text-[9px] text-white/15 tracking-widest">
          BUILT ON ARC · USDC AS GAS · ZERO BACKEND · {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
