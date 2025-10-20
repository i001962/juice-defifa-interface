import DefifaDeployment from "@ballkidz/defifa-collection-deployer/broadcast/Deploy.s.sol/5/run-latest.json";
import DefifaDelegate from "@ballkidz/defifa-collection-deployer/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "@ballkidz/defifa-collection-deployer/out/DefifaGovernor.sol/DefifaGovernor.json";
import { addressFor, ForgeDeploy } from "forge-run-parser";
import { sepolia } from "wagmi/chains";
import { DefifaConfig } from "./types";
import { EthereumAddress } from "types/defifa";
import { 
  jbContractAddress, 
  jbControllerAbi,
  jbProjectsAbi,
  jb721TiersHookAbi,
  jb721TiersHookStoreAbi,
  JBVersion 
} from "juice-sdk-core";

export const DEFIFA_CONFIG_SEPOLIA: DefifaConfig = {
  chainId: sepolia.id,

  // Use Juicebox v5 contracts from SDK
  JBProjects: {
    address: (jbContractAddress[5].JBProjects as any)[sepolia.id] as EthereumAddress,
    interface: jbProjectsAbi,
  },

  JBController: {
    address: (jbContractAddress[5].JBController as any)[sepolia.id] as EthereumAddress,
    interface: jbControllerAbi,
  },

  // Note: JBSingleTokenPaymentTerminalStore is now part of JBMultiTerminal in v5
  JBSingleTokenPaymentTerminalStore: {
    interface: [], // This will need to be updated to use JBMultiTerminal
  },

  // Note: JBETHPaymentTerminal is now part of JBMultiTerminal in v5
  JBETHPaymentTerminal: {
    address: (jbContractAddress[5].JBMultiTerminal as any)[sepolia.id] as EthereumAddress,
    interface: [], // This will need to be updated to use JBMultiTerminal
  },

  // Use v5 721 Tiers Hook instead of v3 delegate
  JBTiered721DelegateStore: {
    address: (jbContractAddress[5].JB721TiersHookStore as any)[sepolia.id] as EthereumAddress,
    interface: jb721TiersHookStoreAbi,
  },

  // Defifa-specific contracts (still using deployer package)
  DefifaDelegate: {
    address: addressFor("DefifaDelegate", DefifaDeployment as ForgeDeploy)!,
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: addressFor("DefifaGovernor", DefifaDeployment as ForgeDeploy)!,
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: addressFor("DefifaDeployer", DefifaDeployment as ForgeDeploy)!,
    interface: DefifaDeployer.abi,
  },
  subgraph:
    "https://api.thegraph.com/subgraphs/name/tomquirk/defifa-subgrap-hosted",
};

console.info("sepolia chain data::", DEFIFA_CONFIG_SEPOLIA);