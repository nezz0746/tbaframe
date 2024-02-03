import { getAlchemyNFT, getTBAClient } from "./utils";
import { FrameNFT, TokenParams } from "./types";
import { Address } from "viem";
import { appURL } from "@/config";
import https from "https";

const testFallbackImage = appURL + "/placeholder.png";

export const getTokenImage = async (params: TokenParams) => {
  const nft = getAlchemyNFT(parseInt(params.chainId));
  const { image, name } = await nft.getNftMetadata(
    params.tokenContract,
    params.tokenId
  );
  return { image: image.cachedUrl, name };
};

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
            img_req.abort();
            resolve({ ...nft, image: testFallbackImage });
          });
        })
    )
  );
};
