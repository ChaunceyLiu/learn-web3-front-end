export const TESTNET_CONFIG = {
    sepolia: {
      id: 11155111,
      rpcUrls: [
        'https://sepolia.infura.io/v3/YOUR_API_KEY', // 需替换
        'https://rpc.sepolia.ethpandaops.io' // 公共节点
      ],
      faucet: 'https://sepoliafaucet.com'
    },
    arbitrum_goerli: {
      id: 421613,
      rpcUrls: [
        'https://arbitrum-goerli.publicnode.com'
      ],
      faucet: 'https://faucet.quicknode.com/arbitrum/goerli'
    },
    solana_devnet: {
      id: 103,
      rpcUrls: [
        'https://api.devnet.solana.com'
      ],
      faucet: 'https://spl-token-faucet.com'
    }
  } as const;