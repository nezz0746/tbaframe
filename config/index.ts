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
