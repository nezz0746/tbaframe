import { init, fetchQuery } from "@airstack/node";

type TokenParams = {
  chainId: string;
  tokenId: string;
  tokenContract: string;
};

init(process.env.AIRSTACK_KEY ?? "");

export const getTokenImage = async (params: TokenParams) => {
  const { data, error } = await fetchQuery(
    `
  query TokenImageQuery($network: TokenBlockchain!, $tokenId: String!, $tokenContract: Address!) {
    Ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: $tokenContract}, tokenId: {_eq: $tokenId}}, blockchain: $network}
    ) {
      TokenBalance {
        tokenNfts {
          tokenURI
          metaData {
            image
          }
        }
      }
    }
  }`,
    {
      network: (() => {
        switch (params.chainId) {
          case "1":
            return "ethereum";
          case "8453":
            return "base";
          case "7777777":
            return "zora";
          default:
            return "ethereum";
        }
      })(),
      tokenId: params.tokenId,
      tokenContract: params.tokenContract,
    }
  );

  return data.Ethereum.TokenBalance[0].tokenNfts.metaData.image;
};
