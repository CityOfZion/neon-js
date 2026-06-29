import { rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";

import type {
  Argument,
  Integer,
  InvocationArguments,
  Signer,
  Transaction,
  TransactionAttribute,
  TransactionOptions,
  UInt160,
  WitnessRule,
  WitnessScope,
} from "./types.js";

export type TransactionToTransform = tx.TransactionJson & {
  blockhash: string;
  blocktime: number;
  confirmations: number;
};

export type SendInvokeParams = {
  invocations: InvocationArguments[];
  signers: Signer[];
};

export function transformTransaction(
  transaction: TransactionToTransform,
): Transaction {
  const signers: Signer[] = transaction.signers.map((signer) => {
    return {
      account: signer.account,
      scopes: signer.scopes as WitnessScope,
      allowedContracts: signer.allowedcontracts,
      allowedGroups: signer.allowedgroups,
      rules: signer.rules as WitnessRule[],
    };
  });

  const attributes = transaction.attributes as TransactionAttribute[];

  return {
    hash: transaction.hash ?? "",
    size: transaction.size,
    version: transaction.version,
    nonce: transaction.nonce,
    systemFee: transaction.sysfee,
    networkFee: transaction.netfee,
    validUntilBlock: transaction.validuntilblock,
    sender: transaction.sender,
    signers,
    attributes,
    script: transaction.script,
    blockHash: transaction.blockhash,
    blockTime: transaction.blocktime,
    confirmations: transaction.confirmations,
  };
}

export function getScriptBuilder(
  invocations: InvocationArguments[],
): sc.ScriptBuilder {
  const scriptBuilder = new sc.ScriptBuilder();

  for (const invocation of invocations) {
    const args = invocation.args?.map((arg) =>
      sc.ContractParam.fromJson({ type: arg.type, value: arg.value }),
    );
    scriptBuilder.emitContractCall({
      operation: invocation.operation,
      scriptHash: invocation.hash,
      args,
    });

    if (invocation.abortOnFail) {
      scriptBuilder.emit(sc.OpCode.ASSERT);
    }
  }

  return scriptBuilder;
}

export async function getValidUntilBlock(
  rpcClient: rpc.RPCClient,
  options?: TransactionOptions,
): Promise<number> {
  let validUntilBlock = options?.validUntilBlock;
  if (validUntilBlock === undefined) {
    const blockCount = await rpcClient.getBlockCount();
    validUntilBlock = blockCount + 100;
  }

  return validUntilBlock;
}

export function getAttributes(
  attributes?: TransactionAttribute[],
): tx.TransactionAttribute[] {
  const transactionAttributes: tx.TransactionAttribute[] = [];

  attributes?.forEach((attribute) => {
    if (attribute.type === "HighPriority") {
      transactionAttributes.push(new tx.HighPriorityAttribute());
    }

    if (attribute.type === "OracleResponse") {
      transactionAttributes.push(
        new tx.OracleResponseAttribute(
          attribute.id,
          tx.OracleResponseCode[attribute.code],
          attribute.result ?? "",
        ),
      );
    }
  });

  return transactionAttributes;
}

export async function getSystemFee(
  rpcClient: rpc.RPCClient,
  scriptBuilder: sc.ScriptBuilder,
  signers: tx.Signer[],
  options?: TransactionOptions,
): Promise<u.BigInteger> {
  let systemFee: u.BigInteger;

  if (options?.suggestedSystemFee) {
    systemFee = u.BigInteger.fromNumber(options.suggestedSystemFee);
  } else {
    const result = await rpcClient.invokeScript(
      u.HexString.fromHex(scriptBuilder.build()),
      signers,
    );
    systemFee = u.BigInteger.fromNumber(result.gasconsumed);
  }

  if (options?.extraSystemFee) {
    systemFee = systemFee.add(u.BigInteger.fromNumber(options.extraSystemFee));
  }

  return systemFee;
}

export async function getNetworkFee(
  rpcClient: rpc.RPCClient,
  transaction: tx.Transaction,
): Promise<u.BigInteger> {
  const txClone = new tx.Transaction(transaction);

  // Remove all witnesses from the transaction
  txClone.witnesses = [];

  // Add one witness for each signer and use placeholder accounts to calculate the network fee.
  // This is needed to calculate the network fee, since the signer is considered to calculate the fee and we need
  // the same number of witnesses as signers, otherwise the fee calculation will fail
  for (let i = 0; i < txClone.signers.length; i++) {
    const placeholderAccount = new wallet.Account();
    const signer = txClone.signers[i];
    if (signer) {
      signer.account = u.HexString.fromHex(placeholderAccount.scriptHash);
    }

    const verificationScript = u.HexString.fromHex(
      wallet.getVerificationScriptFromPublicKey(placeholderAccount.publicKey),
    );

    // Fake invocation script
    let invocationScript = new sc.OpToken(
      sc.OpCode.PUSHDATA1,
      "0".repeat(128),
    ).toScript();

    if (sc.isMultisigContract(verificationScript)) {
      const threshold = wallet.getSigningThresholdFromVerificationScript(
        verificationScript.toBigEndian(),
      );

      invocationScript = invocationScript.repeat(threshold);
    }

    txClone.addWitness(
      new tx.Witness({ invocationScript, verificationScript }),
    );
  }

  const networkFee = await rpcClient.calculateNetworkFee(txClone);
  return u.BigInteger.fromNumber(networkFee);
}

export function getWitnesses(
  account: wallet.Account,
  signers: Signer[],
): tx.Witness[] {
  const witnesses: tx.Witness[] = [];

  for (const signer of signers) {
    witnesses.push(
      new tx.Witness({
        invocationScript: "",
        verificationScript:
          signer.account === account.scriptHash
            ? wallet.getVerificationScriptFromPublicKey(account.publicKey)
            : "",
      }),
    );
  }

  return witnesses;
}

export async function calculateFee(
  account: wallet.Account,
  rpcClient: rpc.RPCClient,
  invocations: InvocationArguments[],
  signers?: Signer[],
  attributes?: TransactionAttribute[],
  options?: TransactionOptions,
): Promise<number> {
  const transaction = new tx.Transaction();

  const scriptBuilder = getScriptBuilder(invocations);

  transaction.script = u.HexString.fromHex(scriptBuilder.build());

  transaction.validUntilBlock = await getValidUntilBlock(rpcClient, options);

  transaction.signers = signers?.map((signer) => new tx.Signer(signer)) || [];

  transaction.witnesses = await getWitnesses(account, signers || []);

  transaction.attributes = await getAttributes(attributes);

  transaction.systemFee = await getSystemFee(
    rpcClient,
    scriptBuilder,
    transaction.signers,
    options,
  );

  transaction.networkFee = await getNetworkFee(rpcClient, transaction);

  return Number(transaction.networkFee.add(transaction.systemFee).toDecimal(8));
}

export function buildSendInvokeParams(
  account: wallet.Account,
  asset: UInt160,
  from: UInt160,
  to: UInt160,
  amount: Integer,
  data?: Argument,
): SendInvokeParams {
  return {
    invocations: [
      {
        hash: asset,
        operation: "transfer",
        args: [
          { type: "Hash160", value: from },
          { type: "Hash160", value: to },
          { type: "Integer", value: amount },
          data ?? { type: "Any" },
        ],
      },
    ],
    signers: [{ account: account.scriptHash, scopes: "CalledByEntry" }],
  };
}
