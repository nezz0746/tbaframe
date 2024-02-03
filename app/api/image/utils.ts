import { alchemy_key } from "@/config";
import { Address, Chain, createPublicClient, http } from "viem";
import { base, mainnet } from "viem/chains";
import { TokenboundClient } from "@tokenbound/sdk";
import { Alchemy, Network } from "alchemy-sdk";

const chainIdToNetwork: Record<number, Network> = {
  1: Network.ETH_MAINNET,
  8453: Network.BASE_MAINNET,
};

const getRPCUrl = (chainId: number) => {
  switch (chainId) {
    case 1:
      return `https://eth-mainnet.g.alchemy.com/v2/${alchemy_key}`;
    case 8453:
      return `https://base-mainnet.g.alchemy.com/v2/${alchemy_key}`;
    default:
      return `https://eth-mainnet.g.alchemy.com/v2/${alchemy_key}`;
  }
};

const getChain = (chainId: number): Chain => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 8453:
      return base;
    default:
      return mainnet;
  }
};

/**
 * Returns a TBAClient instance based on the provided chain ID and version.
 * @param chainIdString - The chain ID as a string.
 * @param v2 - Optional parameter indicating whether to use V2 configuration. Default is false.
 * @returns A TBAClient instance.
 */
export const getTBAClient = (chainIdString: string, v2: boolean = false) => {
  const customV2Config: { implementationAddress: Address } = {
    implementationAddress: "0x2d25602551487c3f3354dd80d76d54383a243358", // V2
  };

  const chainId = parseInt(chainIdString);

  return new TokenboundClient({
    chain: getChain(chainId),
    publicClient: createPublicClient({
      chain: getChain(chainId),
      transport: http(getRPCUrl(chainId)),
    }),
    ...(v2 ? customV2Config : {}),
  });
};

/**
 * Retrieves the Alchemy NFT instance based on the provided chain ID.
 * @param chainId The chain ID of the network.
 * @returns The Alchemy NFT instance.
 */
export const getAlchemyNFT = (chainId: number) => {
  return new Alchemy({
    apiKey: alchemy_key,
    network: chainIdToNetwork[chainId],
  }).nft;
};
