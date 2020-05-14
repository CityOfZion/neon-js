import { CONST, logging, tx, wallet } from "@cityofzion/neon-core";
import { extractDump, modifyTransactionForEmptyTransaction } from "./common";
import {
  createClaimTx,
  createContractTx,
  createInvocationTx,
  createStateTx,
} from "./create";
import { fillBalance, fillClaims, fillSigningFunction, fillUrl } from "./fill";
import { addAttributeForMintToken, addSignatureForMintToken } from "./mint";
import { applyTxToBalance, sendTx } from "./send";
import { signTx } from "./sign";
import {
  addAttributeIfExecutingAsSmartContract,
  addSignatureIfExecutingAsSmartContract,
} from "./smartcontract";
import {
  ClaimGasConfig,
  DoInvokeConfig,
  SendAssetConfig,
  SetupVoteConfig,
} from "./types";

const log = logging.default("api");

/**
 * The core API methods are series of methods defined to aid conducting core functionality while making it easy to modify any parts of it.
 * The core functionality are sendAsset, claimGas and doInvoke.
 * These methods are designed to be modular in nature and intended for developers to create their own custom methods.
 * The methods revolve around a configuration object in which everything is placed. Each method will take in the configuration object, check for its required fields and perform its operations, adding its results to the configuration object and returning it.
 * For example, the getBalanceFrom function requires net and address fields and appends the url and balance fields to the object.
 */

/**
 * Function to construct and execute a ContractTransaction.
 * @param config Configuration object.
 * @return Configuration object.
 */
export async function sendAsset(
  config: SendAssetConfig
): Promise<SendAssetConfig> {
  return fillSigningFunction(config)
    .then(fillUrl)
    .then(fillBalance)
    .then(createContractTx)
    .then(addAttributeIfExecutingAsSmartContract)
    .then(signTx)
    .then(addSignatureIfExecutingAsSmartContract)
    .then(sendTx)
    .then(applyTxToBalance)
    .catch((err: Error) => {
      const dump = extractDump(config);
      log.error(`sendAsset failed with: ${err.message}. Dumping config`, dump);
      throw err;
    });
}

/**
 * Perform a ClaimTransaction for all available GAS based on API
 * @param config Configuration object.
 * @return Configuration object.
 */
export async function claimGas(
  config: ClaimGasConfig
): Promise<ClaimGasConfig> {
  return fillSigningFunction(config)
    .then(fillUrl)
    .then(fillClaims)
    .then(createClaimTx)
    .then(addAttributeIfExecutingAsSmartContract)
    .then(signTx)
    .then(addSignatureIfExecutingAsSmartContract)
    .then(sendTx)
    .catch((err: Error) => {
      const dump = extractDump(config);
      log.error(`claimGas failed with: ${err.message}. Dumping config`, dump);
      throw err;
    });
}

/**
 * Perform a InvocationTransaction based on config given.
 * @param config Configuration object.
 * @return Configuration object.
 */
export async function doInvoke(
  config: DoInvokeConfig
): Promise<DoInvokeConfig> {
  return fillSigningFunction(config)
    .then(fillUrl)
    .then(fillBalance)
    .then(createInvocationTx)
    .then(addAttributeIfExecutingAsSmartContract)
    .then(addAttributeForMintToken)
    .then(modifyTransactionForEmptyTransaction)
    .then(signTx)
    .then(addSignatureIfExecutingAsSmartContract)
    .then(addSignatureForMintToken)
    .then(sendTx)
    .then(applyTxToBalance)
    .catch((err: Error) => {
      const dump = extractDump(config);
      log.error(`doinvoke failed with: ${err.message}. Dumping config`, dump);
      throw err;
    });
}

/**
 * Perform a StateTransaction based on config given.
 * @param config Configuration object.
 * @return modified configuration object.
 */
export async function setupVote(
  config: SetupVoteConfig
): Promise<SetupVoteConfig> {
  return fillSigningFunction(config)
    .then(fillUrl)
    .then(fillBalance)
    .then(createStateTx)
    .then(addAttributeIfExecutingAsSmartContract)
    .then(modifyTransactionForEmptyTransaction)
    .then(signTx)
    .then(addSignatureIfExecutingAsSmartContract)
    .then(sendTx)
    .then(applyTxToBalance)
    .catch((err: Error) => {
      const dump = extractDump(config);
      log.error(`setupVote failed with: ${err.message}. Dumping config`, dump);
      throw err;
    });
}

export function makeIntent(
  assetAmts: { [k: string]: number },
  address: string
): tx.TransactionOutput[] {
  const acct = new wallet.Account(address);
  return Object.keys(assetAmts).map((key) => {
    return new tx.TransactionOutput({
      assetId: CONST.ASSET_ID[key],
      value: assetAmts[key],
      scriptHash: acct.scriptHash,
    });
  });
}
