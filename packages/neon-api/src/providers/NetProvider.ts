import { RPCClient, IntegerParser, Query } from "@cityofzion/neon-core/lib/rpc";
import {
  createScript,
  ContractParam,
  ScriptIntent,
  StackItemLike
} from "@cityofzion/neon-core/lib/sc";
import { ASSET_ID } from "@cityofzion/neon-core/lib/consts";

export interface Balance {
  [index: string]: number;
}

export class NetProvider {
  private _url: string;
  protected _rpc: RPCClient;

  public constructor(url: string) {
    this._url = url;
    this._rpc = new RPCClient(url);
  }

  public get node() {
    return this._url;
  }

  public set node(url: string) {
    this._url = url;
    this._rpc = new RPCClient(url);
  }

  public getHeight(): Promise<number> {
    return this._rpc.getBlockCount();
  }

  public async getBalance(addr: string, asset: string): Promise<number> {
    const addrInHash160 = ContractParam.hash160(addr);
    const script = createScript({
      scriptHash: asset,
      operation: "balanceOf",
      args: [addrInHash160]
    });
    const { state, stack } = await this._rpc.invokeScript(script);
    if (state === "FAULT") {
      return Promise.reject(`Error Happenned!`);
    }
    return IntegerParser(stack[0]);
  }

  public async getBalances(
    addr: string,
    ...assets: string[]
  ): Promise<Balance[]> {
    if (assets.length === 0) {
      assets = [ASSET_ID.NEO, ASSET_ID.GAS];
    }
    const addrInHash160 = ContractParam.hash160(addr);
    const script = createScript(
      ...assets.map(asset => {
        return {
          scriptHash: asset,
          operation: "balanceOf",
          args: [addrInHash160]
        };
      })
    );
    const { state, stack } = await this._rpc.invokeScript(script);
    if (state === "FAULT") {
      return Promise.reject(`Error Happenned!`);
    }
    return stack.map((item, index) => {
      return {
        [assets![index]]: IntegerParser(item)
      };
    });
  }

  public async getMaxClaimAmount(
    addr: string,
    untilBlockHeight?: number
  ): Promise<number> {
    if (!untilBlockHeight) {
      untilBlockHeight = await this.getHeight();
    }
    const addrInHash160 = ContractParam.hash160(addr);
    const script = createScript({
      scriptHash: ASSET_ID.NEO,
      operation: "unClaimGas",
      args: [addrInHash160, untilBlockHeight]
    });
    const { state, stack } = await this._rpc.invokeScript(script);
    if (state === "FAULT") {
      return Promise.reject(`Error Happenned!`);
    }
    return IntegerParser(stack[0]);
  }

  public async readInvoke(
    scriptsIntents: (string | ScriptIntent)[]
  ): Promise<StackItemLike[]> {
    const script = createScript(...scriptsIntents);
    const { state, stack } = await this._rpc.invokeScript(script);
    if (state.indexOf("FAULT") >= 0) {
      return Promise.reject(stack);
    } else {
      return stack;
    }
  }
}

export default NetProvider;
