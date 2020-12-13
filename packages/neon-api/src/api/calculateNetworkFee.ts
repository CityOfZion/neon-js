import { tx, sc, u, wallet } from "@cityofzion/neon-core";

export function calculateNetworkFee(
  txn: tx.Transaction,
  feePerByte: number | u.BigInteger,
  signingAccts: wallet.Account[]
): u.BigInteger {
  const feePerByteBigInteger =
    feePerByte instanceof u.BigInteger
      ? feePerByte
      : u.BigInteger.fromNumber(feePerByte);

  const witnesses = signingAccts.map((acct) => {
    const verificationScript = u.HexString.fromBase64(
      acct.contract.script
    ).toBigEndian();
    if (acct.isMultiSig) {
      const threshold = wallet.getSigningThresholdFromVerificationScript(
        verificationScript
      );

      return new tx.Witness({
        invocationScript: generateFakeInvocationScript()
          .toScript()
          .repeat(threshold),
        verificationScript,
      });
    } else {
      return new tx.Witness({
        invocationScript: generateFakeInvocationScript().toScript(),
        verificationScript,
      });
    }
  });

  const txClone = new tx.Transaction(txn);
  txClone.witnesses = witnesses;
  const verificationExecutionFee = witnesses.reduce((totalFee, witness) => {
    return totalFee
      .add(sc.calculateExecutionFee(witness.invocationScript.toBigEndian()))
      .add(sc.calculateExecutionFee(witness.verificationScript.toBigEndian()));
  }, u.BigInteger.fromNumber(0));
  const sizeFee = feePerByteBigInteger.mul(txClone.serialize(true).length / 2);

  return sizeFee.add(verificationExecutionFee);
}

function generateFakeInvocationScript(): sc.OpToken {
  return new sc.OpToken(sc.OpCode.PUSHDATA1, "0".repeat(128));
}
