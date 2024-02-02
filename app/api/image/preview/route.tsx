import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { getTokenImage } from "../service";
import { dimensions } from "@/config";
import { WronParams } from "../components";

export const GET = async (req: NextRequest) => {
  const s_params = req.nextUrl.searchParams;
  const tokenContract = s_params.get("tokenContract");
  const tokenId = s_params.get("tokenId");
  const chainId = s_params.get("chainId");
  // no need for version here

  const { width, height } = dimensions;

  if (!tokenContract || !tokenId || !chainId) {
    return new ImageResponse(<WronParams />, {
      width,
      height,
    });
  }

  const params = { tokenContract, tokenId, chainId };

  const { image } = await getTokenImage(params);

  const imageSize = 0.8 * height;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <img src={image} style={{ width: imageSize, height: imageSize }} />
      </div>
    ),
    {
      width,
      height,
    }
  );
};
