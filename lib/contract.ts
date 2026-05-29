export const CONTRACT_ADDRESS = "0xEE23d56C3280C14aA9A791E67a89FC7D623EB79A";

import { VIBE_BADGE_ABI, CUSTOM_VIBE_ABI } from "./abi";



export const V1_ADDRESS = CONTRACT_ADDRESS;

export const vibeBadgeContract = {
  address: CONTRACT_ADDRESS,
  abi: VIBE_BADGE_ABI,
} as const;

export const V2_ADDRESS =
  (process.env.NEXT_PUBLIC_V2_CONTRACT_ADDRESS as `0x${string}`) ??
  "0xA4AaCb4F47E700Df36F73fd4288f7276cfF6f5aB";

export const customVibeContract = {
  address: V2_ADDRESS,
  abi: CUSTOM_VIBE_ABI,
} as const;

export const BADGE_THEMES = [
  { id: 1, label: "GENESIS", accent: "#00f5ff", img: "10/200/200" },
  { id: 2, label: "PHANTOM", accent: "#ff00a8", img: "20/200/200" },
  { id: 3, label: "AURORA",  accent: "#00ff88", img: "30/200/200" },
  { id: 4, label: "VOLTAGE", accent: "#ffee00", img: "40/200/200" },
  { id: 5, label: "VOID",    accent: "#bf00ff", img: "50/200/200" },
  { id: 6, label: "REACTOR", accent: "#ff6600", img: "60/200/200" },
] as const;
