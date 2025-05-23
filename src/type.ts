import type { PRESET_CHAINS } from "./configs/chains";

export interface IChainData {
  name: string;
  logoUrl: string;
  shortName: string;
  chainIndex: string;
}

export interface IChainPrice {
  chainIndex: string;
  tokenAddress: string;
}

export interface ICurrentPrice {
  chainIndex: string;
  price: string;
  time: string;
  tokenAddress: string;
}

export type ChainType = keyof typeof PRESET_CHAINS;

declare global {
  interface Window {
    // ethereum?: EthereumProvider;
    // phantom?: PhantomSolanaProvider;
    phantom?: {
      solana?: {
        isPhantom?: boolean;
      };
    };
  }
}