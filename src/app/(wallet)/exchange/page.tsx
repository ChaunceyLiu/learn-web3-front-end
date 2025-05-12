"use client";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { createTestClient, http } from "viem";
import { sepolia } from "viem/chains";

// Sepolia测试网合约示例
const SEPOLIA_CONTRACT_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const CONTRACT_ABI = [
  {
    inputs: [{ type: "uint256", name: "_value" }],
    name: "setValue",
    outputs: [],
    type: "function",
  },
] as const;

export default function Exchange() {
  const sepoliaRpc = "http://localhost:3001/wallet-data/rpcSepolia";
  const provider = useMemo(() => new ethers.JsonRpcProvider(sepoliaRpc), []);
  const [baseFee, setBaseFee] = useState("0");
  const [currentFee, setCurrentFee] = useState("0");

  useEffect(() => {
    const fetchBlockNumber = async () => {
      // 获取最新区块号（测试连接）
      const blockNumber = await provider.getBlockNumber();
      console.log(`当前区块高度：${blockNumber}`);
      return Promise.resolve(blockNumber);
    };

    fetchBlockNumber().catch((error) => {
      console.error("获取区块号失败", error);
    });

    // 在控制台显示实时燃气价格
    const intervalId = setInterval(async () => {
      const feeData = await provider.getFeeData();
      setCurrentFee(`[${new Date().toLocaleTimeString()}] 
      当前燃气价格 | 基础费: ${ethers.formatUnits(feeData.gasPrice ?? 0n, "gwei")} gwei
      建议小费: ${ethers.formatUnits(feeData.maxPriorityFeePerGas ?? 0n, "gwei")} gwei
    `);
      return Promise.resolve(feeData);
    }, 1500); // 每15秒更新
    return () => clearInterval(intervalId);
  }, [provider]);

  const getBaseFee = async () => {
    const demoTx = {
      to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // 测试网地址
      value: ethers.parseEther("0.001"), // 转账金额
    };

    // 估算燃气费用
    const gasEstimate = await provider.estimateGas(demoTx);
    console.log(`基础燃气估算：${gasEstimate.toString()}`);
    setBaseFee(gasEstimate.toString());
  };

  const trade = async () => {
    const client = createTestClient({
      chain: sepolia,
      mode: "anvil", // 本地测试模式
      transport: http("https://rpc.sepolia.xyz"), // 使用 viem 的 http 方法创建有效的 transport
    });
    console.log("client", client);
    //@ts-ignore
    // @ts-ignore
    const { result } = await client.impersonateAccount({
      address: SEPOLIA_CONTRACT_ADDRESS,
      //   abi: CONTRACT_ABI,
      //   functionName: "setValue",
      //   args: [42],
    });
    console.log("模拟交易结果：", result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Button>初始化以太坊链接</Button>
      <Button onClick={getBaseFee}>基础燃气估算</Button>
      {baseFee !== "0" && <span>基础燃气估算：{baseFee}</span>}
      <div>实时燃气价格</div>
      <div>{currentFee}</div>
      <Button onClick={trade}>模拟交易</Button>
    </main>
  );
}
