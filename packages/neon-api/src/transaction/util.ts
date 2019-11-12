import { tx, wallet, u, sc, CONST } from "@cityofzion/neon-core";

export function getNetworkFeeForSig(): number {
  return (
    sc.OpCodePrices[sc.OpCode.PUSHBYTES64] +
    sc.OpCodePrices[sc.OpCode.PUSHBYTES33] +
    sc.getInteropServicePrice(sc.InteropServiceCode.NEO_CRYPTO_CHECKSIG)
  );
}

export function getNetworkFeeForMultiSig(
  signingThreshold: number,
  pubkeysNum: number
): number {
  const sb = new sc.ScriptBuilder();
  return (
    sc.OpCodePrices[sc.OpCode.PUSHBYTES64] * signingThreshold +
    sc.OpCodePrices[
      sb.emitPush(signingThreshold).str.slice(0, 2) as sc.OpCode
    ] +
    sc.OpCodePrices[sc.OpCode.PUSHBYTES33] * pubkeysNum +
    sc.OpCodePrices[sb.emitPush(pubkeysNum).str.slice(0, 2) as sc.OpCode] +
    sc.getInteropServicePrice(sc.InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG, {
      size: pubkeysNum
    })
  );
}

export function getNetworkFee(transaction: tx.Transaction): u.Fixed8 {
  const networkFee = new u.Fixed8(0);
  const signers = transaction.getScriptHashesForVerifying();
  signers.forEach(signer => {
    const account = new wallet.Account(signer);
    if (!account.isMultiSig) {
      networkFee.add(getNetworkFeeForSig());
    } else {
      const n = wallet.getPublicKeysFromVerificationScript(
        account.contract.script
      ).length;
      const m = wallet.getSigningThresholdFromVerificationScript(
        account.contract.script
      );
      networkFee.add(getNetworkFeeForMultiSig(m, n));
    }
    // TODO: consider about contract verfication script
  });
  const size = transaction.serialize(true).length / 2;
  networkFee.add(new u.Fixed8(size).multipliedBy(CONST.POLICY_FEE_PERBYTE));
  return networkFee;
}

export function getScriptHashesFromTxWitnesses(
  transaction: tx.Transaction
): string[] {
  const scriptHashes: string[] = [];
  transaction.scripts.forEach(script =>
    scriptHashes.push(
      ...wallet
        .getPublicKeysFromVerificationScript(script.verificationScript)
        .map(publicKey => wallet.getScriptHashFromPublicKey(publicKey))
    )
  );
  return scriptHashes;
}
