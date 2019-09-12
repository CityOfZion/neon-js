import { RPCClient, IntegerParser } from "@cityofzion/neon-core/lib/rpc";
import { createScript, ContractParam } from "@cityofzion/neon-core/lib/sc";
import { ASSET_ID } from "@cityofzion/neon-core/lib/consts";
import { Transaction } from "@cityofzion/neon-core/lib/tx";
import { Account } from "@cityofzion/neon-core/lib/wallet";

export interface Balance {
  [index: string]: number;
}

export class NetProvider {
  private _url: string;
  private rpc: RPCClient;

  public constructor(url: string) {
    this._url = url;
    this.rpc = new RPCClient(url);
  }

  public get node() {
    return this._url;
  }

  public set node(url: string) {
    this._url = url;
    this.rpc = new RPCClient(url);
  }

  public getHeight(): Promise<number> {
    return this.rpc.getBlockCount();
  }

  public async getBalance(addr: string, asset: string): Promise<number> {
    const addrInHash160 = ContractParam.hash160(addr);
    const script = createScript({
      scriptHash: asset,
      operation: "balanceOf",
      args: [addrInHash160]
    });
    const { state, stack } = await this.rpc.invokeScript(script);
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
    const { state, stack } = await this.rpc.invokeScript(script);
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
    const { state, stack } = await this.rpc.invokeScript(script);
    if (state === "FAULT") {
      return Promise.reject(`Error Happenned!`);
    }
    return IntegerParser(stack[0]);
  }

  public async claimGas(account: Account | string): Promise<boolean> {
    if (typeof account === "string") {
      account = new Account(account);
    }
    const addressInHash160 = ContractParam.hash160(account.address);
    const amount = await this.getBalance(account.address, ASSET_ID.NEO);
    const script = createScript({
      scriptHash: ASSET_ID.NEO,
      operation: "transfer",
      args: [addressInHash160, addressInHash160, ContractParam.integer(amount)]
    });
    const transaction = new Transaction({
      sender: account.scriptHash,
      script,
      validUntilBlock:
        Transaction.MAX_TRANSACTION_LIFESPAN + (await this.getHeight())
    }).sign(account);
    return this.rpc.sendRawTransaction(transaction);
  }
}

export default NetProvider;
