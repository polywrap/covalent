export class Network {
  chainName: string;
  chainId: string;
}

export const networks = new Map<string, Network>()
  .set("1", {
    chainId: "eth-mainnet",
    chainName: "Ethereum Mainnet",
  })
  .set("56", {
    chainId: "bsc-mainnet",
    chainName: "Binance Smart Chain Mainnet",
  })
  .set("61", {
    chainId: "etc-mainnet",
    chainName: "Ethereum Classic Mainnet",
  })
  .set("137", {
    chainId: "matic-mainnet",
    chainName: "Matic Mainnet",
  })
  .set("42161", {
    chainId: "arbitrum-mainnet",
    chainName: "Arbitrum One",
  })
  .set("10", {
    chainId: "optimism-mainnet",
    chainName: "Optimistic Ethereum",
  })
  .set("43114", {
    chainId: "avalanche-mainnet",
    chainName: "Avalanche Mainnet C-Chain",
  })
  .set("8453", {
    chainId: "base-mainnet",
    chainName: "Base",
  })
  .set("100", {
    chainId: "gnosis-mainnet",
    chainName: "Gnosis Chain",
  })
  .set("250", {
    chainId: "fantom-mainnet",
    chainName: "Fantom Opera",
  });

export function getNetwork(chainId: string): Network {
  if (networks.has(chainId)) {
    return networks.get(chainId);
  }
  throw new Error(`Unknown chainId ${chainId}`);
}
