import BalancePanel from "./components/MultiChainBalance";
import { EVMTransfer, SolanaTransfer } from "./components/CrossChainTransfer";
import { EVMNfts } from "./components/NftGallery";
const Interaction = () => {
  return (
    <div className="flex flex-col gap-4 h-screen w-full overflow-y-auto px-4">
      <BalancePanel />
      <EVMTransfer></EVMTransfer>
      <SolanaTransfer></SolanaTransfer>
      <EVMNfts></EVMNfts>
      {/* <SolanaNfts></SolanaNfts> */}
    </div>
  );
};

export default Interaction;
