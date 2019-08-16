import { logging } from "@cityofzion/neon-core";
import { PastTransaction, Provider, Balance, SendAssetConfig } from "../common";
import { RPCClient } from "@cityofzion/neon-core/lib/rpc";
import { ScriptIntent } from "@cityofzion/neon-core/lib/sc";

const log = logging.default("api");

export class NeoCli implements Provider {
  private url: string;
  private rpc: RPCClient;

  public constructor(url: string) {
    this.url = url;
    this.rpc = new RPCClient(url);
    log.info(`Created NeoCli Provider: ${this.url}`);
  }

  public get name() {
    return `NeoCli[${this.url}]`;
  }

  public get node() {
    return this.url;
  }

  public set node(url: string) {
    this.url = url;
    this.rpc = new RPCClient(url);
  }

  public getRPCEndpoint(noCache?: boolean | undefined): Promise<string> {
    return Promise.resolve(this.url);
  }
  public getHeight(): Promise<number> {
    return this.rpc.getBlockCount();
  }
  public getTransactionHistory(address: string): Promise<PastTransaction[]> {
    throw new Error("Method not implemented.");
  }

  public getBalance(addr: string): Promise<Balance> {
    const result = this.rpc.invokeScript();
  }

  getMaxClaimAmount(addr: string): Promise<number>;
  claimGas(account: Account | string): Promise<boolean>;
  sendAsset(...configs: SendAssetConfig[]): Promise<boolean>;
  readInvoke(...intents: (string | ScriptIntent)[]): Promise<any>;
  invoke(...intents: (string | ScriptIntent)[]): Promise<boolean>;
}

export default NeoCli;
