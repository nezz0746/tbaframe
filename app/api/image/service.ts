import { init } from "@airstack/node";
import { getTBAClient } from "./utils";
import { TokenParams } from "./types";
import { Address } from "viem";
import { alchemy_key } from "@/config";
import { Alchemy, Network } from "alchemy-sdk";

export const getAlchemyNFT = (chainId: number) => {
  const chainIdToNetwork: Record<number, Network> = {
    1: Network.ETH_MAINNET,
    8453: Network.BASE_MAINNET,
  };
  return new Alchemy({
    apiKey: alchemy_key,
    network: chainIdToNetwork[chainId],
  }).nft;
};

init(process.env.AIRSTACK_KEY ?? "");

export const getTokenImage = async (params: TokenParams) => {
  const nft = getAlchemyNFT(parseInt(params.chainId));
  const { image, name } = await nft.getNftMetadata(
    params.tokenContract,
    params.tokenId
  );
  return { image: image.cachedUrl, name };
};

export const getTBANfts = async (account: string, chainId: string) => {
  const nfts = await getAlchemyNFT(parseInt(chainId)).getNftsForOwner(account, {
    pageSize: 12,
  });

  return nfts;
};

export const getTBAContent = async (params: TokenParams, v2?: boolean) => {
  const account = getTBAClient(params?.chainId, v2).getAccount({
    tokenContract: params.tokenContract as Address,
    tokenId: params.tokenId,
  });

  console.log(account);

  const content = await getTBANfts(account, params.chainId);

  console.log(content.ownedNfts.map((nft) => [nft.name, nft.image]));

  return content.ownedNfts;
};
