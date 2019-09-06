import { logging, rpc, u, wallet } from "@cityofzion/neon-core";
import { PastTransaction, Provider } from "../common";

const log = logging.default("api");

export class NeoCli implements Provider {
  public get name() {
    return `NeoCli[${this.url}]`;
  }
  private url: string;

  private rpc: rpc.RPCClient;

  public constructor(url: string) {
    this.url = url;
    this.rpc = new rpc.RPCClient(url);
    log.info(`Created NeoCli Provider: ${this.url}`);
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
}

export default NeoCli;
