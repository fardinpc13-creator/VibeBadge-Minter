import { CONTRACT_ADDRESS } from "@/lib/contract";
import { arcTestnet } from "@/lib/chain";

export function Footer() {
  const explorerUrl = `${arcTestnet.blockExplorers.default.url}/address/${CONTRACT_ADDRESS}`;

  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="h-6 w-6 rounded-sm"
              style={{ background: "linear-gradient(135deg, #00f5ff, #bf00ff)" }}
            />
            <span className="font-orbitron text-sm font-bold tracking-widest neon-text-cyan">
              ARC_VIBE
            </span>
          </div>

          {/* Contract address */}
          <div className="font-mono text-[11px] text-white/30 flex items-center gap-2">
            <span className="text-neon-green">CONTRACT</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-neon-cyan transition-colors truncate max-w-[200px]"
            >
              {CONTRACT_ADDRESS}
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-6 font-mono text-xs text-white/30">
            <a href="#mint"    className="hover:text-neon-cyan transition-colors">MINT</a>
            <a href="#gallery" className="hover:text-neon-cyan transition-colors">GALLERY</a>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-cyan transition-colors"
            >
              EXPLORER
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center font-mono text-[10px] text-white/20 tracking-widest">
          BUILT ON ARC TESTNET · ERC-721 · {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
