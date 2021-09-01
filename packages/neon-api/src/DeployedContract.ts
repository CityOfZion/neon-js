import { rpc, sc, tx } from "@cityofzion/neon-core";

export class DeployedContract extends sc.BaseContract {
  private rpcClient: rpc.NeoServerRpcClient;
  private manifest: sc.ContractManifest;

  public get name(): string {
    return this.manifest.name;
  }

  constructor(
    rpcClient: rpc.NeoServerRpcClient,
    scriptHash: string,
    manifest: sc.ContractManifest
  ) {
    super(scriptHash, manifest.abi.methods);

    this.rpcClient = rpcClient;
    this.manifest = manifest;
  }

  public async invoke(
    operation: string,
    args: (
      | string
      | boolean
      | number
      | sc.ContractParam
      | sc.ContractParamJson
    )[],
    signers?: tx.Signer[]
  ): Promise<rpc.InvokeResult> {
    const contractCall = super.call(operation, ...args);
    return await this.rpcClient.invokeFunction(
      contractCall.scriptHash,
      contractCall.operation,
      contractCall.args,
      signers
    );
  }
}
