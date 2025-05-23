"use client";
import { useBalance, useChains, useDisconnect, useSignMessage } from "wagmi";
import ChainCard from "./components/ChainCard";
import AutoCheckChain from "./components/AutoCheckChain";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { useWalletStore } from "@/store/useWalletStore";
import { useConnect, useAccount } from "wagmi";
import { Button, Space } from "antd-mobile";
import { DemoBlock } from "@/app/components/demoBlock";
import TransferTokens from "./components/TransferTokens";

export default function Wallet() {
  const [mounted, setMounted] = useState(false);
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chains = useChains();
  const { switchNetwork } = useWalletStore();
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedChain = chains.find((t) => t.id === Number(selectedId));
  const { setProvider } = useWalletStore();
  const { data: balance } = useBalance({
    address: address, // 用户地址
  });

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (signature) => {
        console.log(`签名成功 授权登录:`, signature);
      },
    },
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  const init = useCallback(async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "wallet_getPermissions" });
        const provider = new BrowserProvider(window.ethereum);
        await setProvider(provider);
      } catch (e) {
        console.error("Wallet init error:", e);
      }
    }
  }, [setProvider]);

  useEffect(() => {
    init().catch((error) => {
      console.error("初始化失败", error);
    });
  }, [init]);

  const handleConnect = () => {
    const metamaskConnector = connectors.find((c) => c.id === "io.metamask");
    if (metamaskConnector) connect({ connector: metamaskConnector });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedId(value);
    switchNetwork(Number(value)).catch((error) => {
      console.error("切换网络失败", error);
    });
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen w-full flex-col bg-gradient-to-b from-[#fff] to-[#fff] text-black">
      <DemoBlock title="连接MetaMask">
        <Space wrap>
          <Button
            onClick={() => (isConnected ? disconnect() : handleConnect())}
          >
            {isConnected && address
              ? `已连接: ${address.slice(0, 6)}...`
              : "连接MetaMask"}
          </Button>
        </Space>
      </DemoBlock>
      <DemoBlock title="实时链上数据查询">
        <Space wrap>
          <div>余额: {balance?.decimals} ETH</div>
        </Space>
      </DemoBlock>
      <DemoBlock title="自动检测链">
        <Space wrap>
          <AutoCheckChain />
        </Space>
      </DemoBlock>
      <DemoBlock title="跨链操作">
        <Space wrap>
          {chains.length > 0 && (
            <div className="flex flex-row items-center justify-center">
              选择一个链:
              <Select
                value={selectedId}
                onChange={handleChange}
                displayEmpty
                className="mx-2"
                style={{ width: 120, color: "black" }}
              >
                <MenuItem value="">未选择</MenuItem>
                {chains.map((chain) => (
                  <MenuItem key={chain.id} value={String(chain.id)}>
                    {chain.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          {selectedId && <ChainCard chain={selectedChain} />}
        </Space>
      </DemoBlock>
      <DemoBlock title="代币转账">
        <Space wrap>
          <TransferTokens />
        </Space>
      </DemoBlock>
      <DemoBlock title="消息签名">
        <Space wrap>
          <Button
            onClick={() => signMessage({ message: new Date().toString() })}
          >
            签名消息
          </Button>
        </Space>
      </DemoBlock>

      <Button onClick={init}>手动初始化</Button>
    </main>
  );
}
