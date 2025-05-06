// app/(wallet)/Providers.tsx
"use client";

import WalletProvider from "@/app/(wallet)/wallet/wallet-provider";
import dynamic from "next/dynamic";

const SolanaWalletProviders = dynamic(
  () =>
    import("./solana-wallet-provider").then(
      (mod) => mod.SolanaWalletProviders
    ),
  {
    ssr: false,
    loading: () => <div className="p-4 text-center">Loading Wallet...</div>,
  }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaWalletProviders>
      <WalletProvider>{children}</WalletProvider>
    </SolanaWalletProviders>
  );
}