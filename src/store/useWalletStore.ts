import { create } from "zustand";
import { BrowserProvider, type Signer } from "ethers";

interface WalletState {
  provider: BrowserProvider | null;
  signer: Signer | null;
  chainId: number | null;
  address: string | null;
  setProvider: (provider: BrowserProvider) => void;
  setSigner: (signer: Signer | null) => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  provider: null,
  signer: null,
  chainId: null,
  address: null,

  // 初始化 Provider 并监听事件
  setProvider: async (provider) => {
    // 获取初始网络和账户
    const network = await provider.getNetwork();
    const signer = await provider.getSigner();
    set({
      provider,
      signer,
      chainId: Number(network.chainId),
      address: await signer.getAddress(),
    });

    // 监听 MetaMask 事件
    window.ethereum.on("chainChanged", async (hexChainId: string) => {
      const newChainId = parseInt(hexChainId, 16);
      const newProvider = new BrowserProvider(window.ethereum);
      set({
        chainId: newChainId,
        provider: newProvider,
        signer: await newProvider.getSigner(),
      });
    });

    window.ethereum.on("accountsChanged", async (accounts: string[]) => {
      if (accounts.length === 0) {
        set({ signer: null, address: null });
      } else {
        const newProvider = new BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        set({
          signer: newSigner,
          address: await newSigner.getAddress(),
        });
      }
    });
  },

  // 核心：触发 MetaMask 网络切换
  switchNetwork: async (targetChainId: number) => {
    window.focus(); // 解决部分浏览器弹窗被抑制问题

    const { provider } = get();
    console.log("当前Provider:", provider);
    if (!provider) throw new Error("Provider 未初始化");

    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${targetChainId.toString(16)}` },
      ]);

      // 切换成功后自动更新 Zustand 状态
      const newNetwork = await provider.getNetwork();
      set({
        chainId: Number(newNetwork.chainId),
        signer: await provider.getSigner(),
      });
    } catch (error: any) {
      // 如果网络未添加，调用 wallet_addEthereumChain
      if (error.error.code === 4902) {
        const chainParams = getChainParams(targetChainId); // 需要实现链参数配置
        await provider.send("wallet_addEthereumChain", [chainParams]);
        await get().switchNetwork(targetChainId);
      } else {
        throw error;
      }
    }
  },

  setSigner: (signer) => set({ signer }),
}));

// 网络参数配置示例（以 Polygon 为例）
const getChainParams = (chainId: number) => {
  switch (chainId) {
    case 137:
      return {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      };
    // 添加其他支持的链...
  }
};
