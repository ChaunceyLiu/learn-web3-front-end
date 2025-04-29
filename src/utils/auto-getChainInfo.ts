import { useClient } from "wagmi";
import { BrowserProvider } from "ethers";
import { Connection } from "@solana/web3.js";

// 多链类型定义
type ChainType = "evm" | "solana" | "bitcoin" | "cosmos";

// 核心逻辑：获取当前Provider并检测链类型
export const useCurrentProvider = () => {
  const wagmiClient: any = useClient();

  const getProvider = async () => {
    // 优先检测非EVM链
    if (typeof window !== "undefined") {
      // Solana专用检测
      if ("phantom" in window && window.phantom?.solana?.isPhantom) {
        return {
          provider: window.phantom.solana,
          connection: new Connection("https://api.mainnet-beta.solana.com"),
          chainType: "solana" as const,
        };
      }

      // EVM通用检测
      const ethersProvider = new BrowserProvider(window.ethereum!);
      const network = await ethersProvider.getNetwork();

      console.log("当前链类型:", network, ethersProvider);

      return {
        provider: ethersProvider,
        chainId: network.chainId.toString(),
        chainType: detectEVNChainType(network.chainId),
      };
    }

    // 回退到Wagmi默认Provider
    return {
      provider: wagmiClient?.publicClient?.transport?.value?.provider,
      chainType: "evm" as const,
    };
  };

  return { getProvider };
};

// EVM链类型深度检测
const detectEVNChainType = (chainId: bigint): ChainType => {
  const evmChainId = Number(chainId);
  console.log("检测到的链ID:", evmChainId);
  switch (evmChainId) {
    case 1: // Ethereum
    case 137: // Polygon
      return "evm";
    case 101: // Solana（兼容旧标准）
      console.warn("ChainID 101已弃用，请使用专用Solana Provider");
      return "solana";
    default:
      throw new Error(`Unsupported EVM chainId: ${evmChainId}`);
  }
};

// 增强版链类型检测
export const detectChainType = (provider: any): ChainType => {
  console.log("检测到的Provider:", provider);
  const { ethereum, phantom, xfi } = window as unknown as Window & {
    ethereum?: { isMetaMask?: boolean };
    phantom?: { solana?: { isPhantom?: boolean } };
    xfi?: { binance?: boolean };
  };

  if (ethereum?.isMetaMask) return "evm";
  if (phantom?.solana?.isPhantom) return "solana";
  if (xfi?.binance) return "evm";

  // 优先通过钱包元数据检测
  const walletMetadata = provider?.provider?.metadata || provider?.metadata;
  if (walletMetadata) {
    if (walletMetadata.rdns === "io.metamask") return "evm";
    if (walletMetadata.rdns === "app.phantom") return "solana";
  }

  // 通过API特征检测
  if (provider?.isMetaMask || provider?._isMetaMask) return "evm";
  if (provider?.isPhantom || provider?.isConnected?.phantom) return "solana";
  if (provider?.isCoinbaseWallet || provider?.isCoinbaseBrowser) return "evm";

  // 深度ChainID检测（兼容十六进制/十进制）
  const chainId = Number(
    provider.chainId?.toString() || provider.networkVersion?.toString(),
  );

  if (chainId === 1) return "evm";
  if (chainId === 101) return "solana"; // 兼容旧版Solana标识
  console.log("未知链ID:", chainId);

  throw new Error(`Unknown chain type (chainId: ${chainId})`);
};
