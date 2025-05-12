// components/NftGallery.tsx
"use client";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
// import { type Metadata, Metaplex } from "@metaplex-foundation/js";
import { useEffect, useState } from "react";
import Image from "next/image";

export const erc721Abi = [
    "function balanceOf(address owner) external view returns (uint256)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ] as const;
export const ERC721_CONTRACT = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

// ERC721 Card保持不变
function Erc721Card({ tokenId }: { tokenId: bigint }) {
  // ...原有实现
}

// 优化后的Metaplex Card组件（添加类型定义）
interface MetaplexMetadata {
  name?: string;
  description?: string;
  image?: string;
}

function MetaplexCard({ metadata }: { metadata: MetaplexMetadata }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {metadata?.image && (
        <Image
          src={metadata.image}
          alt={metadata.name || "NFT Image"}
          className="mb-3 h-48 w-full rounded-md object-cover"
        />
      )}
      <h3 className="text-lg font-semibold">
        {metadata?.name || "Unnamed NFT"}
      </h3>
      <p className="line-clamp-2 text-sm text-gray-600">
        {metadata?.description}
      </p>
    </div>
  );
}

// 优化元数据获取钩子（添加类型定义）
function useFetchMetadata(uri?: string) {
  const [metadata, setMetadata] = useState<MetaplexMetadata>();

  useEffect(() => {
    // ...原有实现
  }, [uri]);

  return { data: metadata };
}

export function EVMNfts() {
  const { address } = useAccount();
  const { data: balanceRes } = useReadContract({
    address: ERC721_CONTRACT,
    abi: erc721Abi,
    functionName: "balanceOf",
    args: [address!],
  });
  console.log("address", address);
  console.log("balanceRes", balanceRes);

  const balance = Number(balanceRes || 0n);
  const indexes = Array.from({ length: balance }, (_, i) => i);

  const tokenContracts = indexes.map((index) => ({
    address: ERC721_CONTRACT,
    abi: erc721Abi,
    functionName: "tokenOfOwnerByIndex" as const,
    args: [address!, BigInt(index)],
  }));

  const { data: tokensData } = useReadContracts({
    // @ts-ignore
    contracts: tokenContracts,
    query: { enabled: balance > 0 },
  });

  const tokenIds = tokensData?.map((res) => res.result).filter(Boolean) as
    | bigint[]
    | undefined;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {tokenIds?.map((tokenId, index) => (
        // @ts-ignore
        <Erc721Card key={`${tokenId}-${index}`} tokenId={tokenId} />
      ))}
    </div>
  );
}

// // 新版Solana NFT组件实现
// export function SolanaNfts() {
//   const { publicKey } = useWallet();
//   const { connection } = useConnection();
//   const [nfts, setNfts] = useState<Metadata[]>([]);

//   useEffect(() => {
//     if (!publicKey) return;

//     const metaplex = Metaplex.make(connection);
//     const fetchNfts = async () => {
//       try {
//         const nftItems = await metaplex
//           .nfts()
//           .findAllByOwner({ owner: publicKey });

//         const loadedNfts = await Promise.all(
//           nftItems.map((item) =>
//             // @ts-ignore
//             metaplex.nfts().load({ metadata: item }),
//           ),
//         );
//         // @ts-ignore
//         setNfts(loadedNfts);
//       } catch (error) {
//         console.error("Error fetching Solana NFTs:", error);
//       }
//     };

//     fetchNfts();
//   }, [publicKey, connection]);

//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//       {nfts.map((nft, index) => {
//         const metadata = nft.json as MetaplexMetadata;
//         return (
//           <MetaplexCard
//             // @ts-ignore
//             key={`${nft.mint.address.toString()}-${index}`}
//             metadata={metadata}
//           />
//         );
//       })}
//     </div>
//   );
// }
