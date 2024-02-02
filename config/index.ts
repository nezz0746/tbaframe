export const appURL = (() => {
  let protocol = "http";
  let domain = "localhost:3022";

  if (typeof process.env.VERCEL_URL === "string") {
    protocol = "https";
    domain = process.env.VERCEL_URL;
  } else if (typeof process.env.VERCEL_BRANCH_URL === "string") {
    protocol = "https";
    domain = process.env.VERCEL_BRANCH_URL;
  }

  return `${protocol}://${domain}`;
})();

export const alchemy_key = process.env.ALCHEMY_KEY ?? "";

export const aspectRatio = 1.91;

const WIDTH = 1500;

export const dimensions = {
  width: WIDTH,
  height: WIDTH / aspectRatio,
};
