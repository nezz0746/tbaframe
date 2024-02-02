import { appURL } from "@/config";
import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";

enum RequestType {
  PREVIEW,
  SHOW,
}

async function getResponse(
  req: NextRequest,
  type: RequestType
): Promise<NextResponse> {
  let image;

  if (type === RequestType.PREVIEW) {
    image = `${appURL}/api/image/preview`;
  } else {
    image = `${appURL}/api/image/content`;
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `We love BOAT`,
        },
      ],
      image,
      post_url: `${appURL}/api/frame`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();

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
      button === 1 ? RequestType.SHOW : RequestType.PREVIEW
    );
  }
}

export const dynamic = "force-dynamic";
