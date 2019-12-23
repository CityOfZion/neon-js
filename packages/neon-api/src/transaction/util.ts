import { tx, wallet, u, sc, CONST } from "@cityofzion/neon-core";

export function getNetworkFeeForSig(): u.Fixed8 {
  return new u.Fixed8(
    sc.OpCodePrices[sc.OpCode.PUSHBYTES64] +
      sc.OpCodePrices[sc.OpCode.PUSHBYTES33] +
      sc.getInteropServicePrice(sc.InteropServiceCode.NEO_CRYPTO_CHECKSIG)
  );
}

export function getNetworkFeeForMultiSig(
  signingThreshold: number,
  pubkeysNum: number
): u.Fixed8 {
  const sb = new sc.ScriptBuilder();
  return new u.Fixed8(
    sc.OpCodePrices[sc.OpCode.PUSHBYTES64] * signingThreshold +
      sc.OpCodePrices[
        sb.emitPush(signingThreshold).str.slice(0, 2) as sc.OpCode
      ] +
      sc.OpCodePrices[sc.OpCode.PUSHBYTES33] * pubkeysNum +
      sc.OpCodePrices[sb.emitPush(pubkeysNum).str.slice(0, 2) as sc.OpCode] +
      sc.getInteropServicePrice(
        sc.InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG,
        {
          size: pubkeysNum
        }
      )
  );
}

function isMultiSig(verificationScript: string): boolean {
  return (
    verificationScript.slice(verificationScript.length - 8) ===
    sc.InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG
  );
}

export function getNetworkFee(
  transaction: tx.Transaction,
  verificationScripts: Array<string>
): u.Fixed8 {
  let networkFee = new u.Fixed8(0e-8);
  let size = transaction.serialize().length / 2;
  verificationScripts.forEach(verificationScript => {
    if (!isMultiSig(verificationScript)) {
      networkFee = networkFee.add(getNetworkFeeForSig());
      size +=
        66 +
        (u.num2VarInt(verificationScript.length / 2) + verificationScript)
          .length /
          2;
    } else {
      const n = wallet.getPublicKeysFromVerificationScript(verificationScript)
        .length;
      const m = wallet.getSigningThresholdFromVerificationScript(
        verificationScript
      );
      const sizeInv = 66 * m;
      size +=
        u.num2VarInt(sizeInv).length / 2 +
        sizeInv +
        (u.num2VarInt(verificationScript.length / 2) + verificationScript)
          .length /
          2;
      networkFee = networkFee.add(getNetworkFeeForMultiSig(m, n));
    }
    // TODO: consider about contract verfication script
  });
  networkFee = networkFee.add(
    new u.Fixed8(CONST.POLICY_FEE_PERBYTE).times(size)
  );
  return networkFee;
}

export function getScriptHashesFromTxWitnesses(
  transaction: tx.Transaction
): string[] {
  const scriptHashes: string[] = [];
  transaction.scripts.forEach(script =>
    scriptHashes.push(
      ...wallet
        .getPublicKeysFromVerificationScript(
          script.verificationScript.toBigEndian()
        )
        .map(publicKey => wallet.getScriptHashFromPublicKey(publicKey))
    )
  );
  return scriptHashes;
}
