// components/CrossChainTransfer.tsx
/**
 * @fileoverview 跨链转账功能
 */
"use client";
import { useSendTransaction, useSwitchChain } from "wagmi";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Tabs } from "antd-mobile";
import { TransferForm } from "./TransferForm";
import { parseEther } from "viem";
import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

export function EVMTransfer() {
  const { chains, switchChain } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();

  const handleTransfer = async (chainId: number, amount: string) => {
    // 自动切换网络
    await switchChain({ chainId });

    await sendTransactionAsync({
      to: "0x01536398b4c9a36155E579871A7ae7115C4eD6C9",
      value: parseEther(amount),
      chainId,
    });
  };

  return (
    <Tabs defaultActiveKey="ethereum" className="text-white">
      <Tabs.Tab title="Ethereum" key="ethereum">
        <TransferForm onSend={(amount) => handleTransfer(1, amount)} />
      </Tabs.Tab>
      <Tabs.Tab title="polygon" key="polygon">
        <TransferForm onSend={(amount) => handleTransfer(137, amount)} />
      </Tabs.Tab>
    </Tabs>
  );
}

export function SolanaTransfer() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const handleTransfer = async (amount: string) => {
    if (!publicKey) {
      console.error("钱包未连接");
      return;
    }

    // 需要获取最近的区块哈希
    const recentBlockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      ...recentBlockhash,
      feePayer: publicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey("CZdUHCvkDbhuLefF7p76aRSJEdkJc75BdwGPX9fkE61m"),
        lamports: parseFloat(amount) * 1e9, // 1 SOL = 1e9 lamports
      }),
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      console.log("交易已发送，签名:", signature);

      // 确认交易
      await connection.confirmTransaction(signature);
      console.log("交易已确认");
    } catch (error) {
      console.error("交易失败:", error);
    }
  };

  return (
    <div className="text-white p-4">
      <TransferForm onSend={handleTransfer} />
    </div>
  );
}
