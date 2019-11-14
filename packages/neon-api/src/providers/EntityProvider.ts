import NetProvider from "./NetProvider";
import { TransactionBuilder } from "../transaction";
import { rpc, wallet } from "@cityofzion/neon-core";

export interface SendAssetIntent {
  asset: string;
  from?: Account;
  to: string;
  amount: number;
}

export class EntityProvider extends NetProvider {
  public sender: wallet.Account;

  public constructor(url: string, sender: string | wallet.Account) {
    super(url);
    if (typeof sender === "string") {
      this.sender = new wallet.Account(sender);
    } else {
      this.sender = sender;
    }
    if (!this.sender.privateKey) {
      throw new Error(`Sender Account must have permission to sign`);
    }
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
