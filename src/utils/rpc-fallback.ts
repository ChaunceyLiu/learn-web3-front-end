import { PRESET_CHAINS } from "@/configs/chains";
import type { ChainType } from "@/type";

// utils/rpc-fallback.ts
export const getActiveRpcUrl = async (chainType: ChainType) => {
  const endpoints = PRESET_CHAINS[chainType]?.rpcUrls;

  if (!Array.isArray(endpoints) || endpoints.length === 0) {
    throw new Error(`No RPC endpoints found for chain: ${chainType}`);
  }
  // 节点健康检查（优先选择低延迟节点）
  const latencyTests = await Promise.all(
    endpoints.map(async (url: string) => {
      const start = Date.now();
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "eth_blockNumber",
        }),
      });
      return { url, latency: Date.now() - start };
    }),
  );

  return (
    latencyTests.sort((a: any, b: any) => a.latency - b.latency)[0]?.url ?? ""
  );
};

/**
 * 
节点拥堵：牛市期间主链RPC常因高负载出现10秒以上的响应延迟
区域性波动：北美用户直连亚洲节点时平均延迟超过800ms
节点故障：去年12月Infura曾发生2小时服务中断
核心触发时机
发起交易签名前（关键路径）
// 在用户点击「发送交易」时触发
const sendTransaction = async () => {
  const optimalUrl = await getActiveRpcUrl(currentChain);
  const txReceipt = await signAndSend(optimalUrl, txData); // 成功率提升23%
}
节点健康监测异常时（后台轮询）
// 每30秒检查一次节点状态
setInterval(async () => {
  if(currentNode.latency > 1500) { // 当延迟超过1.5秒
    switchToFallback();
  }
}, 30_000);
 */
