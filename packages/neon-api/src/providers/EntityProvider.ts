import NetProvider from "./NetProvider";
import { TransactionBuilder } from "../transaction";
import { rpc, wallet, tx, sc } from "@cityofzion/neon-core";

export interface SendAssetIntent {
  asset: string;
  from?: wallet.Account;
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
    this._checkAccountAccess(this.sender);
  }

  public async sendAssets(...intents: SendAssetIntent[]): Promise<boolean> {
    let cosigners: tx.CosignerLike[] = [];
    let signers: wallet.Account[] = [];
    const scriptIntents: sc.ScriptIntent[] = intents.map(intent => {
      const { asset, from, to, amount } = intent;
      if (from && from.address !== this.sender.address) {

        cosigners.push({
          account: ,
          scopes: tx.WitnessScope.CalledByEntry
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

  private _checkAccountAccess(account: wallet.Account) {
    if (!account.privateKey) {
      throw new Error(`Account with address ${account.address} doesn't have permission to sign`);
    }
  }
}
