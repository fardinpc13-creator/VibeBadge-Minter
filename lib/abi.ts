export const VIBE_BADGE_ABI = [
  { name: "totalMinted", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "MAX_SUPPLY",  type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf",   type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "ownerOf",     type: "function", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  { name: "tokenURI",    type: "function", stateMutability: "pure", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "string" }] },
  { name: "mint",        type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }], outputs: [] },
  { name: "Minted",      type: "event", inputs: [{ name: "to", type: "address", indexed: true }, { name: "tokenId", type: "uint256", indexed: false }] },
  { name: "Transfer",    type: "event", inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "tokenId", type: "uint256", indexed: true }] },
] as const;

// ── V2: CustomVibeCreator (your actual deployed contract) ──────────────────
export const CUSTOM_VIBE_ABI = [
  { name: "totalMinted", type: "function", stateMutability: "view",     inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "mintPrice",   type: "function", stateMutability: "view",     inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf",   type: "function", stateMutability: "view",     inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "ownerOf",     type: "function", stateMutability: "view",     inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  {
    name: "mintCustom",
    type: "function",
    stateMutability: "payable",          // ← payable, not nonpayable
    inputs: [
      { name: "name",  type: "string" }, // ← no "to" arg
      { name: "desc",  type: "string" },
      { name: "image", type: "string" },
    ],
    outputs: [],
  },
  { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "Transfer", type: "event", inputs: [
    { name: "from",    type: "address", indexed: true },
    { name: "to",      type: "address", indexed: true },
    { name: "tokenId", type: "uint256", indexed: true },
  ]},
] as const;
