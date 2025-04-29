import type { ChainType } from "@/type";
import { getSDKInstance } from "@/utils/sdk-loader";

// hooks/useSyncAssets.ts
export const syncAssets = async (chainType: ChainType, address: string) => {
  const sdk = getSDKInstance(chainType);

  switch (chainType) {
    // case "ethereum":
    //   const balance = await sdk.getBalance(address);
    //   const erc20Tokens = await fetchErc20Balances(address, sdk);
    //   return { native: balance, tokens: erc20Tokens };

    // case "solana":
    //   const solBalance = await sdk.getBalance(new PublicKey(address));
    //   const splTokens = await sdk.getTokenAccountsByOwner(
    //     new PublicKey(address),
    //   );
    //   return { native: solBalance, tokens: splTokens };

    // case "arbitrum":
    //   const viemClient = sdk as ReturnType<typeof createPublicClient>;
    //   const arbBalance = await viemClient.getBalance({ address });
    //   return { native: arbBalance };
  }
};
