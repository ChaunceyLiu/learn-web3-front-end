import type { Chain as BaseChain } from "viem";

export interface Chain extends BaseChain {
  sdk?: string; // Extend the Chain type to include the sdk property
  explorer?: string; // Add explorer property
}
// 预设主流链配置
export const PRESET_CHAINS: Record<string, Chain> = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    rpcUrls: {
      default: { http: ["https://mainnet.infura.io/v3/YOUR_KEY"] },
      public: { http: ["https://eth.llamarpc.com"] },
    },
    sdk: "ethers", // 指定SDK类型
    explorer: "https://etherscan.io",
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
      name: "Ethereum",
    },
  },
  solana: {
    id: 101,
    name: "Solana",
    rpcUrls: {
      default: {
        http: [
          "https://api.mainnet-beta.solana.com",
          "https://solana-api.projectserum.com",
        ],
      },
    },
    sdk: "solana-web3",
    explorer: "https://solscan.io",
    nativeCurrency: {
      symbol: "SOL",
      decimals: 9,
      name: "Solana",
    },
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum One",
    rpcUrls: {
      default: { http: ["https://arb1.arbitrum.io/rpc"] },
    },
    sdk: "viem",
    explorer: "https://arbiscan.io",
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
      name: "Arbitrum One",
    },
  },
  // 其他链...
} as const;
