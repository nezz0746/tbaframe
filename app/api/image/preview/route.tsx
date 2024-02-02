import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { getTokenImage } from "../service";

const aspectRatio = 1.91;

const width = 1500;

const height = width / aspectRatio;

export const GET = async (req: NextRequest) => {
  const params = {
    tokenContract: "0x26727Ed4f5BA61d3772d1575Bca011Ae3aEF5d36",
    tokenId: "195",
    chainId: "1",
  };

  const image = await getTokenImage(params);

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
