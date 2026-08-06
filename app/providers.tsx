"use client";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { arcTestnet } from "@/lib/chain";
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "Vibe",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [arcTestnet, mainnet],
  ssr: true,
});

const queryClient = new QueryClient();

const theme = darkTheme({
  accentColor: "#00f5ff",
  accentColorForeground: "#03030a",
  borderRadius: "none",
  fontStack: "system",
  overlayBlur: "large",
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme} initialChain={arcTestnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
