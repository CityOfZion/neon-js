import { CommonConfig } from "./types";
import { rpc, tx, sc, u } from "@cityofzion/neon-core";
import { addFees, setBlockExpiry } from "./helpers";

export class SmartContract {
  /**
   * A class for communicating with smart contracts on the block chain.
   */
  public contractHash: u.HexString;
  protected config: CommonConfig;
  protected rpcClient: rpc.RPCClient;

  public constructor(contractHash: u.HexString, config: CommonConfig) {
    this.contractHash = contractHash;
    this.config = config;
    this.rpcClient = new rpc.RPCClient(config.rpcAddress);
  }

  /**
   * Run a test invocation on the smart contract.
   *
   * Note: The results are not persisted to the blockchain. To persist use `invoke` instead.
   * @param operation - name of operation to call
   * @param params - parameters to pass
   * @param signers - script hashes of witnesses that should sign the transaction containing this script
   */
  public async testInvoke(
    operation: string,
    params?: sc.ContractParam[],
    signers?: tx.Signer[]
  ): Promise<rpc.InvokeResult> {
    return this.rpcClient.invokeFunction(
      this.contractHash.toString(),
      operation,
      params,
      signers
    );
  }

  /**
   * Run an invocation on the smart contract.
   * Requires the contract to be created with a valid CommonConfig.account
   *
   * Note:
   * - results are persisted to the blockchain.
   * - currently only supports Sender as signer
   * Tip: use `testInvoke` for querying data without needing to pay GAS.
   * @param operation - name of operation to call
   * @param params - parameters to pass.
   * @param callFlags - call flag required for the operation to call.
   * @returns transaction id
   */
  public async invoke(
    operation: string,
    params?: sc.ContractParam[]
  ): Promise<string> {
    const builder = new sc.ScriptBuilder();
    builder.emitAppCall(this.contractHash.toString(), operation, params);

    const transaction = new tx.Transaction();
    transaction.script = u.HexString.fromHex(builder.build());

    await setBlockExpiry(
      transaction,
      this.config,
      this.config.blocksTillExpiry
    );

    // add a sender
    if (this.config.account === undefined)
      throw new Error("Account in your config cannot be undefined");

    transaction.addSigner({
      account: this.config.account.scriptHash,
      scopes: "CalledByEntry",
    });

    await addFees(transaction, this.config);

    transaction.sign(this.config.account, this.config.networkMagic);
    const rpcClient = new rpc.RPCClient(this.config.rpcAddress);
    return await rpcClient.sendRawTransaction(transaction);
  }
}
