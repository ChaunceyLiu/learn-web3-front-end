import { http, createConfig } from "wagmi";
import {
  mainnet,
  arbitrum,
  optimism,
  immutableZkEvm,
  polygon,
  sepolia,
} from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "your_project_id"; // Replace with your actual project ID

export const WCConnector = walletConnect({
  projectId,
  metadata: {
    icons: ["https://cdn-icons-png.flaticon.com/512/18717/18717265.png"],
    name: "My DApp",
    description: "Multi-chain DApp",
    url: "http://localhost:3001",
  },
});

export const config = createConfig({
  chains: [mainnet, optimism, arbitrum, immutableZkEvm, polygon, sepolia],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [immutableZkEvm.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [WCConnector, injected()],
});
