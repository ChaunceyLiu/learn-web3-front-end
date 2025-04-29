import { BrowserProvider } from "ethers";
import { Connection } from "@solana/web3.js";
import { createPublicClient, http } from "viem";
import { PRESET_CHAINS, type Chain } from "@/configs/chains";

export const getSDKInstance = (chainType: keyof typeof PRESET_CHAINS) => {
  const config: Chain | undefined = PRESET_CHAINS[chainType];

  switch (config?.sdk) {
    case "ethers":
      return new BrowserProvider(window.ethereum!, config);
    case "solana-web3":
      if (!config?.rpcUrls.default.http[0]) {
        throw new Error("RPC URL is undefined for the selected chain.");
      }
      return new Connection(config.rpcUrls.default.http[0], "confirmed");
    case "viem":
      return createPublicClient({
        chain: PRESET_CHAINS[chainType],
        transport: http(),
      });
    default:
      throw new Error(
        `Unsupported SDK type: ${config?.sdk ? config?.sdk : ""}`,
      );
  }
};
