export const VIBE_BADGE_ABI = [
  { name: "totalMinted", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "MAX_SUPPLY",  type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf",   type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "ownerOf",     type: "function", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  { name: "tokenURI",    type: "function", stateMutability: "pure", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "string" }] },
  { name: "mint",        type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }], outputs: [] },
  { name: "Transfer",    type: "event", inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "tokenId", type: "uint256", indexed: true }] },
] as const;

export const CUSTOM_VIBE_ABI = [
  { name: "totalMinted", type: "function", stateMutability: "view",       inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf",   type: "function", stateMutability: "view",       inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "ownerOf",     type: "function", stateMutability: "view",       inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  { name: "mintCustom",  type: "function", stateMutability: "nonpayable", inputs: [{ name: "name", type: "string" }, { name: "desc", type: "string" }, { name: "image", type: "string" }], outputs: [] },
  { name: "Transfer",    type: "event", inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "tokenId", type: "uint256", indexed: true }] },
] as const;

export const PAY_LINKS_ABI = [
  { name: "createLink", type: "function", stateMutability: "payable",     inputs: [{ name: "id", type: "bytes32" }, { name: "note", type: "string" }], outputs: [] },
  { name: "claim",      type: "function", stateMutability: "nonpayable",  inputs: [{ name: "id", type: "bytes32" }], outputs: [] },
  { name: "cancel",     type: "function", stateMutability: "nonpayable",  inputs: [{ name: "id", type: "bytes32" }], outputs: [] },
  {
    name: "getLink", type: "function", stateMutability: "view",
    inputs: [{ name: "id", type: "bytes32" }],
    outputs: [
      { name: "creator",   type: "address" },
      { name: "amount",    type: "uint256" },
      { name: "note",      type: "string"  },
      { name: "claimed",   type: "bool"    },
      { name: "cancelled", type: "bool"    },
      { name: "claimedBy", type: "address" },
      { name: "createdAt", type: "uint256" }
    ],
  },
  { name: "isClaimable",  type: "function", stateMutability: "view", inputs: [{ name: "id", type: "bytes32" }], outputs: [{ name: "", type: "bool" }] },
  { name: "totalCreated", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "totalClaimed", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "totalVolume",  type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "LinkCreated", type: "event", inputs: [{ name: "id", type: "bytes32", indexed: true }, { name: "creator", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }, { name: "note", type: "string", indexed: false }] },
  { name: "LinkClaimed", type: "event", inputs: [{ name: "id", type: "bytes32", indexed: true }, { name: "claimer", type: "address", indexed: true }, { name: "amount", type: "uint256", indexed: false }] },
] as const;
