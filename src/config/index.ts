import { 
  mainnet, 
  sepolia, 
  optimism, 
  optimismSepolia, 
  arbitrum, 
  arbitrumSepolia, 
  base, 
  baseSepolia 
} from "wagmi/chains";
import { ALL_DEFIFA_CONFIGS, createDefifaConfig, SUPPORTED_CHAINS } from "./chains";
import { DefifaConfig } from "./types";

/**
 * Gets the Defifa configuration for the specified chain ID
 * Falls back to Sepolia if chain is not supported
 */
export function getChainData(chainId?: number): DefifaConfig {
  if (!chainId) {
    return ALL_DEFIFA_CONFIGS[sepolia.id]; // Default to Sepolia
  }

  // Check if we have a pre-configured config
  const config = ALL_DEFIFA_CONFIGS[chainId as keyof typeof ALL_DEFIFA_CONFIGS];
  if (config) {
    return config;
  }

  // Check if it's a supported chain but not yet configured
  const chain = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
  if (chain) {
    console.warn(`Chain ${chainId} (${chain.name}) is supported but not yet configured. Creating dynamic config.`);
    return createDefifaConfig(chainId);
  }

  // Fallback to Sepolia for unsupported chains
  console.warn(`Unsupported chain ID: ${chainId}. Falling back to Sepolia.`);
  return ALL_DEFIFA_CONFIGS[sepolia.id];
}

/**
 * Gets all supported chain IDs
 */
export function getSupportedChainIds(): number[] {
  return Object.keys(SUPPORTED_CHAINS).map(Number);
}

/**
 * Checks if a chain ID is supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in SUPPORTED_CHAINS;
}

// Re-export for backward compatibility
export { ALL_DEFIFA_CONFIGS, SUPPORTED_CHAINS, createDefifaConfig } from "./chains";
