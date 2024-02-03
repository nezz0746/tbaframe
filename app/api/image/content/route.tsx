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

  const { image, name } = await getTokenImage(params);

  const nft_images = await getTBAContent(params, version === 2);

  const padding = 20;
  const header_content_gap = 20;
  const containerWidth = width - padding * 2 - header_content_gap;
  const headerWidth = containerWidth * 0.3;
  const contentWidth = containerWidth - headerWidth;

  const image_grid_gap = 10;
  const images_per_row = 4;

  const imageWidth =
    (contentWidth -
      (images_per_row - 1) * image_grid_gap -
      header_content_gap) /
      images_per_row -
    5;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: header_content_gap,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            width: "100%",
            height: "50%",
            backgroundColor: "black",
          }}
        ></div>
        <div
          style={{
            padding,
            display: "flex",
            flexDirection: "row",
            gap: header_content_gap,
          }}
        >
          <div
            style={{
              display: "flex",
              width: headerWidth,
              flexDirection: "column",
              position: "relative",
            }}
          >
            <img
              src={image}
              width={headerWidth}
              height={headerWidth}
              style={{
                width: "100%",
                aspectRatio: 1,
                boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.4)",
              }}
            />
            <p style={{ fontSize: 50, fontWeight: "bold" }}>{name}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              paddingLeft: 20,
              paddingTop: 10,
              width: contentWidth,
              gap: image_grid_gap,
              backgroundColor: "white",
              boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.4)",
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
                    width={imageWidth}
                    height={imageWidth}
                    style={{
                      width: imageWidth,
                      aspectRatio: 1,
                    }}
                  />
                </div>
              );
            })}
          </div>
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
