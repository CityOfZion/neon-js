import {
  OpCodePrices,
  OpCode,
  getInteropServicePrice,
  InteropServiceCode,
  ScriptBuilder
} from "@cityofzion/neon-core/lib/sc";
import { Transaction } from "@cityofzion/neon-core/lib/tx";
import {
  Account,
  getPublicKeysFromVerificationScript,
  getSigningThresholdFromVerificationScript,
  getScriptHashFromPublicKey
} from "@cityofzion/neon-core/lib/wallet";
import { Fixed8 } from "@cityofzion/neon-core/lib/u";
import { POLICY_FEE_PERBYTE } from "@cityofzion/neon-core/lib/consts";

export function getNetworkFeeForSig(): number {
  return (
    OpCodePrices[OpCode.PUSHBYTES64] +
    OpCodePrices[OpCode.PUSHBYTES33] +
    getInteropServicePrice(InteropServiceCode.NEO_CRYPTO_CHECKSIG)
  );
}

export function getNetworkFeeForMultiSig(
  signingThreshold: number,
  pubkeysNum: number
): number {
  const sb = new ScriptBuilder();
  return (
    OpCodePrices[OpCode.PUSHBYTES64] * signingThreshold +
    OpCodePrices[sb.emitPush(signingThreshold).str.slice(0, 2) as OpCode] +
    OpCodePrices[OpCode.PUSHBYTES33] * pubkeysNum +
    OpCodePrices[sb.emitPush(pubkeysNum).str.slice(0, 2) as OpCode] +
    getInteropServicePrice(InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG, {
      size: pubkeysNum
    })
  );
}

export function getNetworkFee(transaction: Transaction): Fixed8 {
  const networkFee = new Fixed8(0);
  const signers = transaction.getScriptHashesForVerifying();
  signers.forEach(signer => {
    const account = new Account(signer);
    if (!account.isMultiSig) {
      networkFee.add(getNetworkFeeForSig());
    } else {
      const n = getPublicKeysFromVerificationScript(account.contract.script)
        .length;
      const m = getSigningThresholdFromVerificationScript(
        account.contract.script
      );
      networkFee.add(getNetworkFeeForMultiSig(m, n));
    }
    // TODO: consider about contract verfication script
  });
  const size = transaction.serialize(true).length / 2;
  networkFee.add(new Fixed8(size).multipliedBy(POLICY_FEE_PERBYTE));
  return networkFee;
}

export function getScriptHashesFromTxWitnesses(
  transaction: Transaction
): string[] {
  const scriptHashes: string[] = [];
  transaction.scripts.forEach(script =>
    scriptHashes.push(
      ...getPublicKeysFromVerificationScript(script.verificationScript).map(
        publicKey => getScriptHashFromPublicKey(publicKey)
      )
    )
  );
  return scriptHashes;
}
