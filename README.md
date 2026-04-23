# ⬡ Arc Vibe Badge Minter

> A cyberpunk-themed ERC-721 NFT minting dApp built for Arc Testnet.  
> Stack: **Next.js 14** · **Tailwind CSS** · **wagmi v2** · **viem** · **RainbowKit**

---

## ✦ Features

- **Hero section** with live supply counter and progress bar
- **Badge gallery** — 6 example badge variants with holographic hover effects
- **Mint portal** — full tx lifecycle: signing → pending → success/error states
- **My Badges** — reads owned token IDs directly from the contract
- **Wallet support** — MetaMask, WalletConnect, Coinbase Wallet via RainbowKit
- **Auto network switch** — prompts user to switch to Arc Testnet
- Fully responsive · Cyber-neon design system · No backend required

---

## ⬡ Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm / yarn / pnpm | any |
| MetaMask | latest |

---

## ⚡ Quick Start

```bash
# 1. Clone / download the project
cd arc-vibe-badge-minter

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# → edit .env.local with your values (see below)

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

---

## 🔧 Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
# Your deployed VibeBadge contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xEE23d56C3280C14aA9A791E67a89FC7D623EB79A

# Arc Testnet RPC endpoint (check Arc docs for the real URL)
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.arc-testnet.io

# Arc block explorer base URL
NEXT_PUBLIC_ARC_EXPLORER_URL=https://explorer.arc-testnet.io

# WalletConnect project ID — free at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
```

---

## 🚀 Contract Deploy (Hardhat)

### 1. Install Hardhat

```bash
mkdir vibe-badge-contracts && cd vibe-badge-contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init  # choose TypeScript project
```

### 2. Install OpenZeppelin

```bash
npm install @openzeppelin/contracts
```

### 3. Add contract

Save the `VibeBadge.sol` contract to `contracts/VibeBadge.sol`.

### 4. Configure `hardhat.config.ts`

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    arcTestnet: {
      url: process.env.ARC_RPC_URL ?? "https://rpc.arc-testnet.io",
      chainId: 741,  // ← replace with real Arc testnet chain ID
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
```

### 5. Write deploy script

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const baseURI = "https://your-metadata-host.com/metadata/";
  const VibeBadge = await ethers.getContractFactory("VibeBadge");
  const badge = await VibeBadge.deploy(baseURI);
  await badge.waitForDeployment();
  console.log("VibeBadge deployed to:", await badge.getAddress());
}

main().catch(console.error);
```

### 6. Deploy

```bash
PRIVATE_KEY=0x... ARC_RPC_URL=https://rpc.arc-testnet.io \
  npx hardhat run scripts/deploy.ts --network arcTestnet
```

Copy the deployed address into `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

---

## 🌐 Production Build

```bash
npm run build
npm run start
```

Or deploy to **Vercel** in one click:

```bash
npx vercel
```

Make sure to add all `NEXT_PUBLIC_*` env vars in your Vercel project settings.

---

## 🔗 Arc Testnet Setup (MetaMask)

| Field | Value |
|-------|-------|
| Network Name | Arc Testnet |
| RPC URL | `https://rpc.arc-testnet.io` |
| Chain ID | `741` *(verify in Arc docs)* |
| Currency Symbol | `ARC` |
| Block Explorer | `https://explorer.arc-testnet.io` |

---

## 📁 Project Structure

```
arc-vibe-badge-minter/
├── app/
│   ├── globals.css       # Cyber neon design system
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Main page composition
│   └── providers.tsx     # wagmi + RainbowKit providers
├── components/
│   ├── Navbar.tsx        # Sticky nav + connect button
│   ├── HeroSection.tsx   # Hero + live supply counter
│   ├── BadgeGallery.tsx  # 6-card gallery grid
│   ├── MintSection.tsx   # Full mint flow with tx states
│   ├── MyBadges.tsx      # On-chain badge reader
│   └── Footer.tsx        # Contract address + links
├── lib/
│   ├── abi.ts            # VibeBadge contract ABI
│   ├── chain.ts          # Arc Testnet chain definition
│   └── contract.ts       # Address + badge themes
├── .env.local.example    # Environment template
└── README.md
```

---

## 🎨 Customisation

| What | Where |
|------|-------|
| Neon colours | `app/globals.css` CSS variables + `tailwind.config.ts` |
| Badge themes | `lib/contract.ts` → `BADGE_THEMES` |
| Chain config | `lib/chain.ts` |
| Metadata base URL | `VibeBadge.sol` constructor arg |
| Max supply | `VibeBadge.sol` → `MAX_SUPPLY` constant |

---

## 📜 License

MIT
