import DefifaDeployment from "@ballkidz/defifa-collection-deployer/broadcast/Deploy.s.sol/5/run-latest.json";
import DefifaDelegate from "@ballkidz/defifa-collection-deployer/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "@ballkidz/defifa-collection-deployer/out/DefifaGovernor.sol/DefifaGovernor.json";
import { addressFor, ForgeDeploy } from "forge-run-parser";
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
import { DefifaConfig } from "./types";
import { EthereumAddress } from "types/defifa";
import { 
  jbContractAddress, 
  jbControllerAbi,
  jbProjectsAbi,
  jb721TiersHookAbi,
  jb721TiersHookStoreAbi,
  jbMultiTerminalAbi,
  JBVersion 
} from "juice-sdk-core";

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  // Mainnets
  [mainnet.id]: mainnet,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [base.id]: base,
  // Testnets
  [sepolia.id]: sepolia,
  [optimismSepolia.id]: optimismSepolia,
  [arbitrumSepolia.id]: arbitrumSepolia,
  [baseSepolia.id]: baseSepolia,
} as const;

// Chain-specific Defifa deployment files
// These will be updated once contracts are deployed to each chain
const DEFIFA_DEPLOYMENTS = {
  // Sepolia (already deployed)
  [sepolia.id]: DefifaDeployment,
  // Other chains - will be updated after deployment
  [mainnet.id]: null, // TODO: Import deployment file after deployment
  [optimism.id]: null, // TODO: Import deployment file after deployment
  [arbitrum.id]: null, // TODO: Import deployment file after deployment
  [base.id]: null, // TODO: Import deployment file after deployment
  [optimismSepolia.id]: null, // TODO: Import deployment file after deployment
  [arbitrumSepolia.id]: null, // TODO: Import deployment file after deployment
  [baseSepolia.id]: null, // TODO: Import deployment file after deployment
} as const;

/**
 * Gets Defifa contract addresses for a specific chain
 */
function getDefifaAddresses(chainId: number) {
  const deployment = DEFIFA_DEPLOYMENTS[chainId as keyof typeof DEFIFA_DEPLOYMENTS];
  
  if (!deployment) {
    // Return placeholder addresses for chains not yet deployed
    return {
      DefifaDelegate: "0x0000000000000000000000000000000000000000" as EthereumAddress,
      DefifaGovernor: "0x0000000000000000000000000000000000000000" as EthereumAddress,
      DefifaDeployer: "0x0000000000000000000000000000000000000000" as EthereumAddress,
    };
  }

  // Use forge-run-parser to extract addresses from deployment
  return {
    DefifaDelegate: addressFor("DefifaDelegate", deployment as ForgeDeploy) as EthereumAddress,
    DefifaGovernor: addressFor("DefifaGovernor", deployment as ForgeDeploy) as EthereumAddress,
    DefifaDeployer: addressFor("DefifaDeployer", deployment as ForgeDeploy) as EthereumAddress,
  };
}

// Subgraph URLs for each chain
const SUBGRAPH_URLS = {
  [sepolia.id]: "https://api.thegraph.com/subgraphs/name/tomquirk/defifa-subgrap-hosted",
  [mainnet.id]: "", // TODO: Update after subgraph deployment
  [optimism.id]: "", // TODO: Update after subgraph deployment
  [arbitrum.id]: "", // TODO: Update after subgraph deployment
  [base.id]: "", // TODO: Update after subgraph deployment
  [optimismSepolia.id]: "", // TODO: Update after subgraph deployment
  [arbitrumSepolia.id]: "", // TODO: Update after subgraph deployment
  [baseSepolia.id]: "", // TODO: Update after subgraph deployment
} as const;

/**
 * Creates a DefifaConfig for the specified chain ID
 */
export function createDefifaConfig(chainId: number): DefifaConfig {
  const chain = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const defifaAddresses = getDefifaAddresses(chainId);

  return {
    chainId: chain.id,

    // Use Juicebox v5 contracts from SDK
    JBProjects: {
      address: (jbContractAddress[5].JBProjects as any)[chain.id] as EthereumAddress,
      interface: jbProjectsAbi,
    },

    JBController: {
      address: (jbContractAddress[5].JBController as any)[chain.id] as EthereumAddress,
      interface: jbControllerAbi,
    },

    // Note: JBSingleTokenPaymentTerminalStore is now part of JBMultiTerminal in v5
    JBSingleTokenPaymentTerminalStore: {
      interface: jbMultiTerminalAbi, // Updated to use JBMultiTerminal ABI
    },

    // Note: JBETHPaymentTerminal is now part of JBMultiTerminal in v5
    JBETHPaymentTerminal: {
      address: (jbContractAddress[5].JBMultiTerminal as any)[chain.id] as EthereumAddress,
      interface: jbMultiTerminalAbi, // Updated to use JBMultiTerminal ABI
    },

    // Use v5 721 Tiers Hook instead of v3 delegate
    JBTiered721DelegateStore: {
      address: (jbContractAddress[5].JB721TiersHookStore as any)[chain.id] as EthereumAddress,
      interface: jb721TiersHookStoreAbi,
    },

    // Defifa-specific contracts
    DefifaDelegate: {
      address: defifaAddresses.DefifaDelegate,
      interface: DefifaDelegate.abi,
    },
    DefifaGovernor: {
      address: defifaAddresses.DefifaGovernor,
      interface: DefifaGovernor.abi,
    },
    DefifaDeployer: {
      address: defifaAddresses.DefifaDeployer,
      interface: DefifaDeployer.abi,
    },
    subgraph: SUBGRAPH_URLS[chainId as keyof typeof SUBGRAPH_URLS] || "",
  };
}

// Pre-configured configs for easy access
export const DEFIFA_CONFIG_SEPOLIA = createDefifaConfig(sepolia.id);
export const DEFIFA_CONFIG_MAINNET = createDefifaConfig(mainnet.id);
export const DEFIFA_CONFIG_OPTIMISM = createDefifaConfig(optimism.id);
export const DEFIFA_CONFIG_ARBITRUM = createDefifaConfig(arbitrum.id);
export const DEFIFA_CONFIG_BASE = createDefifaConfig(base.id);
export const DEFIFA_CONFIG_OPTIMISM_SEPOLIA = createDefifaConfig(optimismSepolia.id);
export const DEFIFA_CONFIG_ARBITRUM_SEPOLIA = createDefifaConfig(arbitrumSepolia.id);
export const DEFIFA_CONFIG_BASE_SEPOLIA = createDefifaConfig(baseSepolia.id);

// All configs for easy iteration
export const ALL_DEFIFA_CONFIGS = {
  [sepolia.id]: DEFIFA_CONFIG_SEPOLIA,
  [mainnet.id]: DEFIFA_CONFIG_MAINNET,
  [optimism.id]: DEFIFA_CONFIG_OPTIMISM,
  [arbitrum.id]: DEFIFA_CONFIG_ARBITRUM,
  [base.id]: DEFIFA_CONFIG_BASE,
  [optimismSepolia.id]: DEFIFA_CONFIG_OPTIMISM_SEPOLIA,
  [arbitrumSepolia.id]: DEFIFA_CONFIG_ARBITRUM_SEPOLIA,
  [baseSepolia.id]: DEFIFA_CONFIG_BASE_SEPOLIA,
} as const;

console.info("Multi-chain Defifa configs loaded:", Object.keys(ALL_DEFIFA_CONFIGS));
