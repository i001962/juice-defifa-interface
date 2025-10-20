import { mainnet, sepolia } from "wagmi/chains";
import { DEFIFA_CONFIG_SEPOLIA } from "./sepolia";
import { DEFIFA_CONFIG_MAINNET } from "./mainnet";

export function getChainData(chainId?: number) {
  if (chainId === mainnet.id) {
    return DEFIFA_CONFIG_MAINNET;
  }
  return DEFIFA_CONFIG_SEPOLIA;
}
