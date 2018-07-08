import { tx, wallet } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
import { ManagedApiBasicConfig } from "./types";

/**
 * Signs a transaction within the config object.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export async function signTx<T extends ManagedApiBasicConfig<tx.BaseTransaction>>(
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
    tx.Witness.deserialize(signature)
  );
}

export function signWithPrivateKey(
  privateKey: string
): (tx: string, publicKey: string) => Promise<string | string[]> {
  const pubKey = new wallet.Account(privateKey).publicKey;
  return async (txString: string, publicKey: string) => {
    const sig = wallet.sign(txString, privateKey);
    const witness = tx.Witness.fromSignature(sig, pubKey);
    return witness.serialize();
  };
}
