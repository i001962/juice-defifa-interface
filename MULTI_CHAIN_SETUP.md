# Multi-Chain Defifa Configuration

This document describes the new multi-chain configuration for Defifa using the Juicebox SDK and Sucker contracts.

## Supported Chains

### Mainnets
- **Ethereum** (Chain ID: 1)
- **Optimism** (Chain ID: 10)
- **Arbitrum** (Chain ID: 42161)
- **Base** (Chain ID: 8453)

### Testnets
- **Sepolia** (Chain ID: 11155111)
- **Optimism Sepolia** (Chain ID: 11155420)
- **Arbitrum Sepolia** (Chain ID: 421614)
- **Base Sepolia** (Chain ID: 84532)

## Architecture

### Juicebox SDK Integration
The configuration uses the `juice-sdk-core` package to retrieve contract addresses and ABIs for all supported chains:

```typescript
import { 
  jbContractAddress, 
  jbControllerAbi,
  jbProjectsAbi,
  jb721TiersHookStoreAbi,
  jbMultiTerminalAbi,
  JBVersion 
} from "juice-sdk-core";
```

### Sucker Contracts
The configuration supports Juicebox v5 "Sucker" contracts for cross-chain functionality:
- `JBSuckerRegistry`
- `JBCCIPSuckerDeployer`
- `JBCCIPSuckerDeployer_1`
- `JBCCIPSuckerDeployer_2`

## Configuration Files

### `src/config/chains.ts`
Main configuration file that:
- Defines all supported chains
- Creates DefifaConfig objects for each chain
- Uses Juicebox SDK to get contract addresses
- Manages Defifa-specific contract addresses
- Provides subgraph URLs for each chain

### `src/config/index.ts`
Updated to:
- Support dynamic chain configuration
- Provide fallback to Sepolia for unsupported chains
- Export utility functions for chain management

### `src/pages/_app.tsx`
Updated to:
- Support all 8 chains in RainbowKit
- Configure RPC endpoints for each chain
- Enable multi-chain wallet connections

## Contract Addresses

### Juicebox v5 Contracts
All Juicebox v5 contract addresses are retrieved from the SDK:

```typescript
// Example for any chain
const jbProjectsAddress = jbContractAddress[5].JBProjects[chainId];
const jbControllerAddress = jbContractAddress[5].JBController[chainId];
const jbMultiTerminalAddress = jbContractAddress[5].JBMultiTerminal[chainId];
const jb721TiersHookStoreAddress = jbContractAddress[5].JB721TiersHookStore[chainId];
```

### Defifa Contracts
Defifa-specific contracts need to be deployed to each chain. The configuration uses `forge-run-parser` to extract contract addresses from deployment files:

```typescript
import { addressFor, ForgeDeploy } from "forge-run-parser";

// Extract addresses from deployment file
const defifaDelegateAddress = addressFor("DefifaDelegate", deployment as ForgeDeploy);
const defifaGovernorAddress = addressFor("DefifaGovernor", deployment as ForgeDeploy);
const defifaDeployerAddress = addressFor("DefifaDeployer", deployment as ForgeDeploy);
```

Currently configured:
- **Sepolia**: ✅ Deployed (using `DefifaDeployment` from deployer package)
- **Other chains**: ⏳ Pending deployment (will use deployment files once available)

## Usage

### Getting Chain Configuration
```typescript
import { getChainData } from "config";

// Get config for current chain
const config = getChainData(chainId);

// Get config for specific chain
const sepoliaConfig = getChainData(11155111);
```

### Checking Chain Support
```typescript
import { isChainSupported, getSupportedChainIds } from "config";

// Check if chain is supported
const isSupported = isChainSupported(chainId);

// Get all supported chain IDs
const chainIds = getSupportedChainIds();
```

## Deployment Status

### ✅ Completed
- [x] Multi-chain configuration architecture
- [x] Juicebox SDK integration
- [x] Sepolia testnet support
- [x] RainbowKit multi-chain setup

### ⏳ Pending
- [ ] Deploy Defifa contracts to all chains
- [ ] Update contract addresses in `DEFIFA_CONTRACT_ADDRESSES`
- [ ] Deploy subgraphs for each chain
- [ ] Update subgraph URLs in `SUBGRAPH_URLS`

## Next Steps

1. **Deploy Contracts**: Use the v5 deployer to deploy Defifa contracts to all chains
2. **Update Addresses**: Update `DEFIFA_CONTRACT_ADDRESSES` with deployed addresses
3. **Deploy Subgraphs**: Create and deploy subgraphs for each chain
4. **Update Subgraph URLs**: Update `SUBGRAPH_URLS` with deployed subgraph endpoints
5. **Test**: Test the application on all supported chains

## Environment Variables

The following environment variables are required:

```bash
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Custom RPC URLs (defaults to Infura)
NEXT_PUBLIC_ETHEREUM_RPC_URL=
NEXT_PUBLIC_OPTIMISM_RPC_URL=
NEXT_PUBLIC_ARBITRUM_RPC_URL=
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL=
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL=
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=
```

## Migration from v3 to v5

### Key Changes
- **Contract Architecture**: Moved from Juicebox v3 to v5
- **Multi-Chain**: Added support for 8 chains instead of 2
- **Sucker Integration**: Added support for cross-chain functionality
- **SDK Integration**: Uses `juice-sdk-core` for contract addresses and ABIs

### Breaking Changes
- Contract addresses have changed
- Some contract interfaces have been updated
- Subgraph endpoints need to be updated
- Chain-specific configurations are now required
