import { defineChain } from "viem";

// ── Arc Testnet ────────────────────────────────────────────────────────────────
// Arc's gas token is USDC. Keep decimals at 18 — EVM nativeCurrency display
// in MetaMask is unreliable with non-18 decimals for the native gas token.
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_ARC_RPC_URL ?? "https://rpc.testnet.arc.network",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      url: process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ?? "https://explorer.testnet.arc.network",
    },
  },
  testnet: true,
});
