import { rpc, sc, u, wallet } from "@cityofzion/neon-core";
import { getTokenInfos } from "./api";
import {
  TransactionBuilder,
  TransactionValidator,
  ValidationAttributes,
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
    this.magicNumber = response.magic;
  }

  public getRpcNode(): rpc.NeoServerRpcClient {
    return this.client;
  }
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

    return this.sign(txn, config);
  }

  public async validate(txn: tx.Transaction): Promise<ValidationResult> {
    const validator = new TransactionValidator(this.getRpcNode(), txn);
    return await validator.validate(
      ValidationAttributes.All,
      ValidationAttributes.All
    );
  }

  public async sign(
    txn: tx.Transaction,
    config: signingConfig
  ): Promise<string> {
    const txData = txn.getMessageForSigning(this.magicNumber);

    for (const w of txn.witnesses) {
      const signature = await config.signingCallback(
        txData,
        w.verificationScript.toString()
      );

      const invocationScript = new sc.OpToken(
        sc.OpCode.PUSHDATA1,
        signature
      ).toScript();
      w.invocationScript = u.HexString.fromHex(invocationScript);
    }

    const sendResult = await this.getRpcNode().sendRawTransaction(txn);
    return sendResult;
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
