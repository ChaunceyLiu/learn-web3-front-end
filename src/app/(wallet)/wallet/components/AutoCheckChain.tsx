import { useCurrentProvider, detectChainType } from "@/utils/auto-getChainInfo";
import { Button } from "@mui/material";
import { useState } from "react";

const AutoCheckChain = () => {
  const { getProvider } = useCurrentProvider();
  const [detectedType, setDetectedType] = useState("");
  const checkChain = async () => {
    try {
      const { provider, chainType } = await getProvider();
      setDetectedType(detectChainType(provider));

      // // 执行链相关操作
      // if (detectedType === "solana") {
      //   const solanaConn = provider as PhantomProvider;
      //   const { publicKey } = await solanaConn.connect();
      //   // Solana特定逻辑...
      // } else {
      //   const evmProvider = provider as BrowserProvider;
      //   const signer = await evmProvider.getSigner();
      //   // EVM通用逻辑...
      // }
    } catch (error) {
      console.error("链检测失败:", error);
    }
  };
  return (
    <div className="mb-4 flex items-center justify-between px-16">
      <Button
        variant="outlined"
        onClick={checkChain}
      >{`自动检测当前链`}</Button>
      <span>{`当前链 ： ${detectedType}`}</span>
    </div>
  );
};

export default AutoCheckChain;
