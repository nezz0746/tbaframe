import { appURL } from "@/config";
import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Show",
    },
  ],
  image: `${appURL}/api/image/preview`,
  post_url: `${appURL}/api/frame`,
});

export const metadata: Metadata = {
  title: "SHOW TBA FRAME",
  description: "Frame that shows TBA assets",
  openGraph: {
    images: [
      {
        url: `${appURL}/api/image/preview`,
        width: 1200,
        height: 630,
        alt: "TBA Frame",
      },
    ],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return <p>Show TBA Frame</p>;
}
