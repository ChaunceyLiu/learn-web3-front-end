"use client";

import { type ReactNode, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export function SolanaWalletProviders({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = `https://solana-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_SOLANA_API_KEY}`;

  // 动态生成钱包实例
  const wallets = useMemo(
    () =>
      [
        typeof window !== "undefined" ? new PhantomWalletAdapter() : null,
        typeof window !== "undefined" ? new SolflareWalletAdapter() : null,
      ].filter(
        (wallet): wallet is PhantomWalletAdapter | SolflareWalletAdapter =>
          wallet !== null,
      ),
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
