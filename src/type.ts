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
