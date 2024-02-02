import { appURL } from "@/config";
import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Show",
    },
  ],
  image: `${appURL}/api/preview`,
  post_url: `${appURL}/api/frame`,
});

export const metadata: Metadata = {
  title: "SHOW TBA FRAME",
  description: "Frame that shows TBA assets",
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return <p>Show TBA Frame</p>;
}
