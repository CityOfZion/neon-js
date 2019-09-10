import { logging } from "@cityofzion/neon-core";
import { PastTransaction, Provider, Balance, SendAssetConfig } from "../common";
import { RPCClient, IntegerParser } from "@cityofzion/neon-core/lib/rpc";
import { ScriptIntent, createScript, ContractParam } from "@cityofzion/neon-core/lib/sc";
import { ASSET_ID } from "@cityofzion/neon-core/lib/consts";

const log = logging.default("api");

export class NeoCli implements Provider {
  private _url: string;
  private rpc: RPCClient;

  public constructor(url: string) {
    this._url = url;
    this.rpc = new RPCClient(url);
    log.info(`Created NeoCli Provider: ${this._url}`);
  }

  public get name() {
    return `NeoCli[${this._url}]`;
  }

  public get node() {
    return this._url;
  }

  public set node(url: string) {
    this._url = url;
    this.rpc = new RPCClient(url);
  }

  public getRPCEndpoint(noCache?: boolean | undefined): Promise<string> {
    return Promise.resolve(this._url);
  }
  public getHeight(): Promise<number> {
    return this.rpc.getBlockCount();
  }
  public getTransactionHistory(address: string): Promise<PastTransaction[]> {
    throw new Error("Method not implemented.");
  }

  public async getBalance(addr: string, assets?: Array<string>): Promise<Array<Balance>> {
    if (!assets) {
      assets = [ASSET_ID.NEO, ASSET_ID.GAS];
    }
    const addrInHash160 = ContractParam.hash160(addr);
    const script = createScript(...assets.map(asset => {
      return {
        scriptHash: asset,
        operation: 'balanceOf',
        args: [addrInHash160]
      };
    }));
    const { state, stack } = await this.rpc.invokeScript(script);
    if (state === "FAULT") {
      return Promise.reject(`Error Happenned!`);
    }
    return stack.map((item, index) => {
      return {
        [assets![index]] : IntegerParser(item)
      }
    });
  }

  public async getMaxClaimAmount(addr: string, untilBlockHeight?: number): Promise<number> {
    if (!untilBlockHeight) {
      untilBlockHeight = await this.getHeight();
    }
    const addrInHash160 = ContractParam.hash160(addr);
    const script = createScript({
      scriptHash: ASSET_ID.NEO,
      operation: 'unClaimGas',
      args: [
        addrInHash160,
        untilBlockHeight
      ]
    });
    const { state, stack } = await this.rpc.invokeScript(script);
    if (state === "FAULT") {
      return Promise.reject(`Error Happenned!`)
    }
    return IntegerParser(stack[0]);
  }

  public claimGas(account: Account | string): Promise<boolean> {
    
  }
  public sendAsset(...configs: SendAssetConfig[]): Promise<boolean> {

  };
  public readInvoke(...intents: (string | ScriptIntent)[]): Promise<any> {

  };
  public invoke(...intents: (string | ScriptIntent)[]): Promise<boolean> {
    
  };
}

export default NeoCli;
