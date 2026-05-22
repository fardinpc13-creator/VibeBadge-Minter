// V1 — original VibeBadge
export const VIBE_BADGE_ABI = [
  { name: "totalMinted", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "MAX_SUPPLY",  type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf",   type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "tokenURI",    type: "function", stateMutability: "pure", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "string" }] },
  { name: "ownerOf",     type: "function", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  { name: "mint",        type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }], outputs: [] },
  { name: "Transfer",    type: "event",    inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "tokenId", type: "uint256", indexed: true }] },
] as const;

// V2 — Custom Vibes contract
export const CUSTOM_VIBE_ABI = [
  { name: "totalMinted",  type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "MAX_SUPPLY",   type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf",    type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "ownerOf",      type: "function", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  { name: "tokenURI",     type: "function", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "string" }] },
  {
    name: "mintCustom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to",          type: "address" },
      { name: "name",        type: "string"  },
      { name: "description", type: "string"  },
      { name: "imageURI",    type: "string"  },
    ],
    outputs: [],
  },
  { name: "getTokenData", type: "function", stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "name",        type: "string" },
      { name: "description", type: "string" },
      { name: "imageURI",    type: "string" },
      { name: "creator",     type: "address" },
    ],
  },
  { name: "CustomMinted", type: "event", inputs: [
    { name: "to", type: "address", indexed: true },
    { name: "tokenId", type: "uint256", indexed: false },
    { name: "name", type: "string", indexed: false },
  ]},
  { name: "Transfer", type: "event", inputs: [
    { name: "from", type: "address", indexed: true },
    { name: "to",   type: "address", indexed: true },
    { name: "tokenId", type: "uint256", indexed: true },
  ]},
] as const;
