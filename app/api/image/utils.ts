import { alchemy_key } from "@/config";
import { Address, Chain, createPublicClient, http } from "viem";
import { base, mainnet } from "viem/chains";
import { TokenboundClient } from "@tokenbound/sdk";

export const getNetwork = (chainId: string) => {
  switch (chainId) {
    case "1":
      return "ethereum";
    case "8453":
      return "base";
    default:
      return "ethereum";
  }
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

const getPublicClient = (chainId: number) =>
  createPublicClient({
    chain: getChain(chainId),
    transport: http(getRPCUrl(chainId)),
  });

export const getTBAClient = (chainId: string, v2: boolean = false) => {
  const customV2Config: { implementationAddress: Address } = {
    implementationAddress: "0x2d25602551487c3f3354dd80d76d54383a243358", // V2
  };

  return new TokenboundClient({
    chain: getChain(parseInt(chainId)),
    publicClient: getPublicClient(parseInt(chainId)),
    ...(v2 ? customV2Config : {}),
  });
};
