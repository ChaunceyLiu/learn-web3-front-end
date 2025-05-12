// components/MultiChainBalance.tsx
/**
 * @fileoverview 多链资产仪表盘
 */

"use client";
import { useAccount, useBalance } from "wagmi";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Button, Card } from "antd-mobile";
import { EthLogo } from "./icons/eth-logo";
import { PolygonLogo } from "./icons/polygon-logo";
import { SolanaLogo } from "./icons/solana-logo";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

export default function BalancePanel() {
  // EVM 链
  const { address: evmAddress } = useAccount();
  const { data: ethBalance } = useBalance({ address: evmAddress });
  const { data: polygonBalance } = useBalance({
    address: evmAddress,
    chainId: 137, // Polygon 链ID
  });

  // Solana
  const { publicKey, connected, connecting, wallet, select, connect } =
    useWallet();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState(0);

  const handleConnect = async () => {
    console.log("连接钱包");
    try {
      // 显式选择钱包（示例使用 Phantom）
      await select(new PhantomWalletAdapter().name);
      await connect();
    } catch (error) {
      console.error("连接失败:", error);
    }
  };

  useEffect(() => {
    if (publicKey) {
      connection
        .getBalance(publicKey)
        .then(setSolBalance)
        .catch((e) => {
          console.error("获取余额失败", e);
        });
    }
  }, [publicKey, connection]);

  return (
    <>
      <Card title="跨链资产总览">
        {/* Ethereum */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EthLogo className="h-6 w-6" />
            <span>Ethereum</span>
          </div>
          <span>{ethBalance?.formatted || "0"} ETH</span>
        </div>

        {/* Polygon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PolygonLogo className="h-6 w-6" />
            <span>Polygon</span>
          </div>
          <span>{polygonBalance?.formatted || "0"} MATIC</span>
        </div>

        {/* Solana */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SolanaLogo className="h-6 w-6" />
            <span>Solana</span>
            {connected && <span className="text-gray-200"> connected✅</span>}
          </div>
          <span>{solBalance / 1e9} SOL</span>
        </div>
      </Card>
      <div className="mt-4">
        {!connected && (
          <Button onClick={handleConnect}>connect solana wallet</Button>
        )}
      </div>
    </>
  );
}
