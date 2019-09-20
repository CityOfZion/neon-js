import NetProvider from "./NetProvider";
import { Account } from "@cityofzion/neon-core/lib/wallet";
import {
  ContractParam,
  createScript,
  ScriptIntent
} from "@cityofzion/neon-core/lib/sc";
import { ASSET_ID } from "@cityofzion/neon-core/lib/consts";
import { Transaction, WitnessScope } from "@cityofzion/neon-core/lib/tx";
import { TransactionBuilder, CosignerWithAccount } from "../transationBuilder";

export interface SendAssetIntent {
  asset: string;
  from?: Account;
  to: string;
  amount: number;
}

export class EntityProvider extends NetProvider {
  public sender: Account;
  private _txBuilder: TransactionBuilder;

  public constructor(url: string, sender: string | Account) {
    super(url);
    if (typeof sender === "string") {
      this.sender = new Account(sender);
    } else {
      this.sender = sender;
    }
    if (!this.sender.privateKey) {
      throw new Error(`Sender Account must have permission to sign`);
    }

    this._txBuilder = new TransactionBuilder(url, sender);
  }

  public async sendAssets(...intents: SendAssetIntent[]): Promise<boolean> {
    const cosigners: CosignerWithAccount[] = [];
    const scriptIntents: ScriptIntent[] = intents.map(intent => {
      const { asset, from, to, amount } = intent;
      if (from && from.address !== this.sender.address) {
        cosigners.push({
          account: from,
          scopes: WitnessScope.CalledByEntry
        });
      }
      return {
        scriptHash: asset,
        operation: "transfer",
        args: [
          ContractParam.hash160(from ? from.address : this.sender.address),
          ContractParam.hash160(to),
          amount
        ]
      };
    });

    await this._txBuilder
      .reset()
      .addCosigners(...cosigners)
      .addIntents(...scriptIntents)
      .useBestValidUntilBlock();
    await this._txBuilder.validate(true);
    return this._txBuilder.execute();
  }

  public async claimGas(
    account: Account | string = this.sender
  ): Promise<boolean> {
    if (typeof account === "string") {
      account = new Account(account);
    }
    return this.sendAssets({
      asset: "NEO",
      from: account,
      to: account.address,
      amount: await this.getBalance(account.address, ASSET_ID.NEO)
    });
  }
}
