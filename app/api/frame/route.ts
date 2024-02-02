import { appURL } from "@/config";
import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(
  req: NextRequest,
  contentURL: string
): Promise<NextResponse> {
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Reload`,
        },
      ],
      image: contentURL,
      post_url: `${appURL}/api/frame?${contentURL.split("?")[1]}`,
      refresh_period: 30,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();
  const s_params = req.nextUrl.searchParams;
  const tokenContract = s_params.get("tokenContract");
  const tokenId = s_params.get("tokenId");
  const chainId = s_params.get("chainId");
  const version = parseInt(s_params.get("version") ?? "3");

  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY || "",
  });

  if (!isValid) {
    return new NextResponse(message, { status: 400 });
  } else {
    if (!message) throw new Error("Message is undefined");
    const { button } = message;

    return getResponse(
      req,
      `${appURL}/api/image/content?tokenContract=${tokenContract}&tokenId=${tokenId}&chainId=${chainId}&version=${version}&timestamp=${Date.now()}`
    );
  }
}

export const dynamic = "force-dynamic";
