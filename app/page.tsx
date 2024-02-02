import { appURL, dimensions } from "@/config";
import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}): Promise<Metadata> {
  const { tokenContract, tokenId, chainId, version } = searchParams;
  console.log(searchParams);
  let tbaParams;

  if (tokenContract && tokenId && chainId) {
    tbaParams = `tokenContract=${tokenContract}&tokenId=${tokenId}&chainId=${chainId}`;
  }

  if (version) {
    tbaParams += `&version=${version}`;
  }

  const imagePreviewURL = `${appURL}/api/image/preview?${tbaParams}`;
  const frameURL = `${appURL}/api/frame?${tbaParams}`;

  console.log("imagePreviewURL", imagePreviewURL);
  console.log("frameURL", frameURL);

  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Show",
      },
    ],
    image: imagePreviewURL,
    post_url: frameURL,
  });

  const metadata: Metadata = {
    title: "SHOW TBA FRAME",
    description: "Frame that shows TBA assets",
    openGraph: {
      images: [
        {
          url: imagePreviewURL,
          width: dimensions.width,
          height: dimensions.height,
          alt: "TBA Frame",
        },
      ],
    },
    other: {
      ...frameMetadata,
    },
  };

  return metadata;
}

export default function Home() {
  return <p>Show TBA Frame</p>;
}
