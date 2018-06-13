import { tx, u, wallet } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
import { ManagedApiBasicConfig } from "./types";

/**
 * Signs a transaction within the config object.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export async function signTx<T extends ManagedApiBasicConfig>(
  config: T
): Promise<T> {
  checkProperty(config, "signingFunction", "tx");
  const signatures = await config.signingFunction!(
    config.tx!.serialize(),
    config.account!.publicKey
  );
  if (signatures instanceof Array) {
    signatures.forEach(sig => {
      addSignature(config.tx!, sig);
    });
  } else {
    addSignature(config.tx!, signatures);
  }

  return config;
}

function addSignature(transaction: tx.Transaction, signature: string): void {
  transaction.scripts.push(
    tx.deserializeWitness(new u.StringStream(signature))
  );
}

export function signWithPrivateKey(
  privateKey: string
): (tx: string, publicKey: string) => Promise<string | string[]> {
  return async (txString: string, publicKey: string) => {
    const txObj = tx.Transaction.deserialize(txString);
    const signedTx = tx.signTransaction(txObj, privateKey);
    return tx.serializeWitness(signedTx.scripts[0]);
  };
}
