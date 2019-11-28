import { rpc, sc, CONST } from "@cityofzion/neon-core";

export interface Balance {
  [index: string]: number;
}

/**
 * NetProvider is to read on-chain info without sending transactions
 */
export class NetProvider {
  public rpcClient: rpc.RPCClient;

  public constructor(rpcClient: string | rpc.RPCClient) {
    if (typeof rpcClient === "string") {
      this.rpcClient = new rpc.RPCClient(rpcClient);
    } else {
      this.rpcClient = rpcClient;
    }
  }

  public getHeight(): Promise<number> {
    return this.rpcClient.getBlockCount();
  }

  public async getBalances(
    addr: string,
    ...assets: Array<string>
  ): Promise<Balance> {
    if (assets.length === 0) {
      assets = [CONST.ASSET_ID.NEO, CONST.ASSET_ID.GAS];
    }
    const addrInHash160 = sc.ContractParam.hash160(addr);
    const script = sc.createScript(
      ...assets.map(asset => {
        return {
          scriptHash: asset,
          operation: "balanceOf",
          args: [addrInHash160]
        };
      })
    );
    const { state, stack } = await this.rpcClient.invokeScript(script);
    if (state.indexOf("FAULT") >= 0) {
      return Promise.reject(`Error Happenned!`);
    }
    return stack
      .map((item, index) => {
        return {
          [assets[index]]: rpc.IntegerParser(item)
        };
      })
      .reduce((totalBalance, balance) => {
        return {
          ...totalBalance,
          ...balance
        };
      });
  }

  public async getClaimable(
    addr: string,
    untilBlockHeight?: number
  ): Promise<number> {
    if (!untilBlockHeight) {
      untilBlockHeight = await this.getHeight();
    }
    const addrInHash160 = sc.ContractParam.hash160(addr);
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "unClaimGas",
      args: [addrInHash160, untilBlockHeight]
    });
    const { state, stack } = await this.rpcClient.invokeScript(script);
    if (state.indexOf("FAULT") >= 0) {
      return Promise.reject(`Error Happenned!`);
    }
    return rpc.IntegerParser(stack[0]);
  }

  public async readInvoke(
    scriptsIntents: (string | sc.ScriptIntent)[]
  ): Promise<sc.StackItemLike[]> {
    const script = sc.createScript(...scriptsIntents);
    const { state, stack } = await this.rpcClient.invokeScript(script);
    if (state.indexOf("FAULT") >= 0) {
      return Promise.reject(stack);
    } else {
      return stack;
    }
  }
}
