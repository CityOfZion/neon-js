import { tx, sc, u, wallet } from "@cityofzion/neon-core";
import RPCClient from "@cityofzion/neon-core/lib/rpc/RPCClient";

/**
 * Calculates the network fee required to process the transaction.
 * The fields signers, attributes and script needs to be fully populated for this to work.
 *
 * @param txn - A partially filled out transaction.
 * @param feePerByte - The current feePerByte in Policy contract.
 * @param signingAccts - The accounts that will be signing this.
 *
 * @deprecated use the smartCalculateNetworkFee helper instead.
 */
export function calculateNetworkFee(
  txn: tx.Transaction,
  feePerByte: number | u.BigInteger,
  executionFeeFactor: number | u.BigInteger
): u.BigInteger {
  const feePerByteBigInteger =
    feePerByte instanceof u.BigInteger
      ? feePerByte
      : u.BigInteger.fromNumber(feePerByte);

  const txClone = new tx.Transaction(txn);
  txClone.witnesses = txn.witnesses.map((w) => {
    const verificationScript = w.verificationScript;
    if (sc.isMultisigContract(verificationScript)) {
      const threshold = wallet.getSigningThresholdFromVerificationScript(
        verificationScript.toBigEndian()
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
  const verificationExecutionFee = txClone.witnesses.reduce(
    (totalFee, witness) => {
      return totalFee
        .add(
          sc.calculateExecutionFee(
            witness.invocationScript.toBigEndian(),
            executionFeeFactor
          )
        )
        .add(
          sc.calculateExecutionFee(
            witness.verificationScript.toBigEndian(),
            executionFeeFactor
          )
        );
    },
    u.BigInteger.fromNumber(0)
  );
  const sizeFee = feePerByteBigInteger.mul(txClone.serialize(true).length / 2);

  return sizeFee.add(verificationExecutionFee);
}

function generateFakeInvocationScript(): sc.OpToken {
  return new sc.OpToken(sc.OpCode.PUSHDATA1, "0".repeat(128));
}

export async function smartCalculateNetworkFee(
  txn: tx.Transaction,
  client: RPCClient
): Promise<u.BigInteger> {
  const txClone = new tx.Transaction(txn);

  txClone.witnesses = txn.witnesses.map((w) => {
    const verificationScript = w.verificationScript;
    if (sc.isMultisigContract(verificationScript)) {
      const threshold = wallet.getSigningThresholdFromVerificationScript(
        verificationScript.toBigEndian()
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
  const result = await client.calculateNetworkFee(txn);

  return u.BigInteger.fromNumber(result);
}
