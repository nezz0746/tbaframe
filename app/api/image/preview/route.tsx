import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { getTokenImage } from "../service";
import { dimensions, previewTitleFontSize } from "@/config";
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

  const { image, name } = await getTokenImage(params);

  const imageSize = 0.7 * height;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: 0,
          backgroundColor: "white",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            width: "100%",
            height: "70%",
            background: "linear-gradient(to bottom, #7C65C1, white)",
          }}
        ></div>
        <p
          style={{
            fontSize: previewTitleFontSize,
            color: "white",
            marginBottom: 5,
            marginTop: 0,
          }}
        >
          {name}
        </p>
        <img
          src={image}
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 10,
            boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.4)",
          }}
        />
      </div>
    ),
    {
      width,
      height,
    }
  );
};
