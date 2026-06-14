import { defineChain } from "viem";

// ── Arc Testnet ────────────────────────────────────────────────────────────────
// Arc (by Circle) uses USDC as the native gas currency — NOT a token called "ARC".
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,   // ← USDC uses 6 decimals, not 18 — critical for correct balance display
  },
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
