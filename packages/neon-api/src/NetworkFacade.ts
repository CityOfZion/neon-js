import { rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";
import { getTokenInfos } from "./api";
import { Candidate, getCandidates } from "./api/getCandidates";
import {
  TransactionBuilder,
  TransactionValidator,
  ValidationAttributes,
  ValidationResult,
} from "./transaction";
import { SigningFunction } from "./transaction/signing";

export interface NetworkFacadeConfig {
  node: string | rpc.NeoServerRpcClient;
}

export interface Nep17TransferIntent {
  from: wallet.Account;
  to: string;
  integerAmt?: number | string | u.BigInteger;

  decimalAmt?: number | string;
  contractHash: string;
}

export interface signingConfig {
  signingCallback: SigningFunction;
}

export class NetworkFacade {
  public magicNumber = 0;
  public client: rpc.NeoServerRpcClient;

  public static async fromConfig(
    config: NetworkFacadeConfig
  ): Promise<NetworkFacade> {
    const i = new NetworkFacade(config);
    await i.initialize();
    return i;
  }
  private constructor(config: NetworkFacadeConfig) {
    this.client =
      typeof config.node === "string"
        ? new rpc.NeoServerRpcClient(config.node)
        : config.node;
  }

  async initialize(): Promise<void> {
    const response = await this.client.getVersion();
    this.magicNumber = response.protocol.network;
  }

  public getRpcNode(): rpc.NeoServerRpcClient {
    return this.client;
  }

  /**
   * Constructs and executes a transaction of multiple token transfers
   * @param intents - Token transfers
   * @param config - Configuration
   */
  public async transferToken(
    intents: Nep17TransferIntent[],
    config: signingConfig
  ): Promise<string> {
    const client = this.getRpcNode();
    const txBuilder = new TransactionBuilder();
    for (const intent of intents) {
      if (intent.decimalAmt) {
        const [tokenInfo] = await getTokenInfos([intent.contractHash], client);
        const amt = u.BigInteger.fromDecimal(
          intent.decimalAmt,
          tokenInfo.decimals
        );
        txBuilder.addNep17Transfer(
          intent.from,
          intent.to,
          intent.contractHash,
          amt
        );
      } else if (intent.integerAmt) {
        txBuilder.addNep17Transfer(
          intent.from,
          intent.to,
          intent.contractHash,
          intent.integerAmt
        );
      } else {
        throw new Error("no amount specified!");
      }
    }

    const txn = txBuilder.build();

    const validateResult = await this.validate(txn);

    if (!validateResult.valid) {
      throw new Error("Unable to validate transaction");
    }

    const signedTxn = await this.sign(txn, config);
    const sendResult = await this.getRpcNode().sendRawTransaction(signedTxn);
    return sendResult;
  }

  /**
   * Claims all the gas available for the specified account. Do note that GAS is automatically claimed when you perform a transaction involving NEO.
   * @param acct - The account to claim gas on
   * @param config - Configuration
   */
  public async claimGas(
    acct: wallet.Account,
    config: signingConfig
  ): Promise<string> {
    const txn = TransactionBuilder.newBuilder().addGasClaim(acct).build();
    const validateResult = await this.validate(txn);

    if (!validateResult.valid) {
      throw new Error("Unable to validate transaction");
    }

    const signedTxn = await this.sign(txn, config);
    const sendResult = await this.getRpcNode().sendRawTransaction(signedTxn);
    return sendResult;
  }

  /**
   * Convenience method for getting list of candidates.
   */
  public async getCandidates(): Promise<Candidate[]> {
    return getCandidates(this.getRpcNode());
  }
  public async vote(
    acct: wallet.Account,
    candidatePublicKey: string,
    config: signingConfig
  ): Promise<string> {
    const txn = TransactionBuilder.newBuilder()
      .addVote(acct, candidatePublicKey)
      .build();

    const validateResult = await this.validate(txn);

    if (!validateResult.valid) {
      throw new Error("Unable to validate transaction");
    }

    const signedTxn = await this.sign(txn, config);
    const sendResult = await this.getRpcNode().sendRawTransaction(signedTxn);
    return sendResult;
  }

  /**
   * Performs validation of all attributes on the given transaction.
   * @param txn - Transaction to validate
   */
  public async validate(txn: tx.Transaction): Promise<ValidationResult> {
    const validator = new TransactionValidator(this.getRpcNode(), txn);
    return await validator.validate(
      ValidationAttributes.All,
      ValidationAttributes.All
    );
  }

  /**
   *  Signs a transaction according to the signing configuration. The input transaction is modified with the signatures and returned.
   * @param txn - Transaction to sign
   * @param config - Configuration
   * @returns
   */
  public async sign(
    txn: tx.Transaction,
    config: signingConfig
  ): Promise<tx.Transaction> {
    for (const [idx, w] of txn.witnesses.entries()) {
      const signature = await config.signingCallback(txn, {
        network: this.magicNumber,
        witnessIndex: idx,
      });

      const invocationScript = new sc.OpToken(
        sc.OpCode.PUSHDATA1,
        signature
      ).toScript();
      w.invocationScript = u.HexString.fromHex(invocationScript);
    }

    return txn;
  }

  public async invoke(
    contractCall: sc.ContractCall
  ): Promise<rpc.InvokeResult> {
    return this.getRpcNode().invokeFunction(
      contractCall.scriptHash,
      contractCall.operation,
      contractCall.args
    );
  }
}
