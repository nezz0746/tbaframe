import { getAlchemyNFT, getTBAClient } from "./utils";
import { FrameNFT, TokenParams } from "./types";
import { Address } from "viem";
import { appURL } from "@/config";
import https from "https";

const testFallbackImage = appURL + "/placeholder.png";

/**
 * Retrieves the token image and name from the specified token contract and token ID.
 * @param params - The parameters for retrieving the token image.
 * @returns An object containing the token image URL and name.
 */
export const getTokenImage = async (params: TokenParams) => {
  const nft = getAlchemyNFT(parseInt(params.chainId));
  const { image, name } = await nft.getNftMetadata(
    params.tokenContract,
    params.tokenId
  );
  return { image: image.cachedUrl, name };
};

/**
 * Retrieves TBA content for a given set of parameters.
 * @param params - The token parameters.
 * @param v2 - Optional parameter indicating whether to use v2 implementation.
 * @returns A promise that resolves to an array of FrameNFT objects.
 */
export const getTBAContent = async (params: TokenParams, v2?: boolean) => {
  const account = getTBAClient(params?.chainId, v2).getAccount({
    tokenContract: params.tokenContract as Address,
    tokenId: params.tokenId,
  });

  console.log(account);

  const content = await getAlchemyNFT(parseInt(params.chainId)).getNftsForOwner(
    account,
    {
      pageSize: 12,
    }
  );

  console.log(content.ownedNfts.map((nft) => [nft.name, nft.image]));

  const frame_nfts = content.ownedNfts
    .map((nft) => {
      const imageURL = nft.image.thumbnailUrl ?? nft.image.originalUrl;
      return {
        tokenId: nft.tokenId,
        contract: nft.contract.address,
        image: imageURL,
      };
    })
    .filter((nft) => nft.image) as FrameNFT[];

  return Promise.all(
    frame_nfts.map(
      (nft) =>
        new Promise<FrameNFT>(async (resolve) => {
          const img_req = https.get(nft.image, (res) => {
            if (res.statusCode === 200) {
              resolve(nft);
            } else {
              resolve({ ...nft, image: testFallbackImage });
            }
          });

          img_req.on("error", (e) => {
            console.error(e);
            resolve({ ...nft, image: testFallbackImage });
          });

          img_req.setTimeout(500, () => {
            img_req.destroy();
            resolve({ ...nft, image: testFallbackImage });
          });
        })
    )
  );
};
