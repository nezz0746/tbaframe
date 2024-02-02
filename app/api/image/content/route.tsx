import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { getTBAContent, getTokenImage } from "../service";
import { dimensions } from "@/config";
import { WronParams } from "../components";

export const GET = async (req: NextRequest) => {
  const s_params = req.nextUrl.searchParams;
  const tokenContract = s_params.get("tokenContract");
  const tokenId = s_params.get("tokenId");
  const chainId = s_params.get("chainId");
  const version = parseInt(s_params.get("version") ?? "3");

  const { width, height } = dimensions;

  if (!tokenContract || !tokenId || !chainId) {
    return new ImageResponse(<WronParams />, {
      width,
      height,
    });
  }

  const params = { tokenContract, tokenId, chainId, version };

  const image = await getTokenImage(params);

  const content = await getTBAContent(params, version === 2);

  const padding = 20;
  const containerWidth = width - padding * 2;
  const headerWidth = containerWidth * 0.25;
  const contentWidth = containerWidth - headerWidth;

  const header_content_gap = 20;

  const image_grid_gap = 10;
  const images_per_row = 6;

  const imageWidth =
    (contentWidth -
      (images_per_row - 1) * image_grid_gap -
      header_content_gap) /
    images_per_row;

  const nft_images = content
    .map((nft) => {
      const imageURL = nft.image.thumbnailUrl ?? nft.image.originalUrl;
      return {
        tokenId: nft.tokenId,
        contract: nft.contract.address,
        image: imageURL,
      };
    })
    .filter((nft) => nft.image);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          padding,
          gap: header_content_gap,
        }}
      >
        <div style={{ display: "flex", width: headerWidth }}>
          <img src={image} style={{ width: "100%", aspectRatio: 1 }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flexGrow: 1,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: contentWidth,
            gap: image_grid_gap,
          }}
        >
          {nft_images.map(({ image, tokenId, contract }) => {
            const key = tokenId + "_" + contract;
            return (
              <div
                style={{
                  display: "flex",
                }}
                key={key}
              >
                <img
                  src={image}
                  style={{ width: imageWidth, aspectRatio: 1 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
};

export const dynamic = "force-dynamic";
