import {
  type BrowserProvider,
  JsonRpcProvider,
  type TransactionRequest,
} from "ethers";
import { TESTNET_CONFIG } from "@/configs/testnets";

export class GasOptimizer {
  private provider: JsonRpcProvider;

  constructor(chainId: number) {
    const rpcUrl = this.getOptimalRpc(chainId);
    this.provider = new JsonRpcProvider(rpcUrl);
  }

  // 动态选择低延迟 RPC
  private getOptimalRpc(chainId: number) {
    const chain = Object.values(TESTNET_CONFIG).find((c) => c.id === chainId);
    return chain?.rpcUrls?.[0]; // 简化实现（实际应测延迟）
  }

  // EIP-1559 燃气估算
  async buildOptimizedTx(tx: TransactionRequest) {
    const feeData = await this.provider.getFeeData();

    return {
      ...tx,
      maxFeePerGas: (feeData.maxFeePerGas! * 120n) / 100n, // 溢价 20%
      maxPriorityFeePerGas: (feeData.maxPriorityFeePerGas! * 150n) / 100n,
      gasLimit: await this.estimateGasWithBuffer(tx, 15), // 加 15% 缓冲
    };
  }

  // 带缓冲的燃气估算
  private async estimateGasWithBuffer(
    tx: TransactionRequest,
    bufferPercent: number,
  ) {
    const estimated = await this.provider.estimateGas(tx);
    return (estimated * (100n + BigInt(bufferPercent))) / 100n;
  }

  // 发送优化后的交易
  async sendOptimizedTx(signer: BrowserProvider, rawTx: TransactionRequest) {
    const optimizedTx = await this.buildOptimizedTx(rawTx);
    // @ts-ignore
    const txResponse = await signer.sendTransaction(optimizedTx);

    // 监控交易确认（2个区块确认）
    return txResponse.wait(2);
  }
}
