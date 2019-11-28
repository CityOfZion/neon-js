import { NetProvider } from "./NetProvider";
import { TransactionBuilder, TransactionSigner } from "../transaction";
import { wallet, tx, sc, u, CONST } from "@cityofzion/neon-core";

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

  public async sendAssets(...intents: SendAssetIntent[]): Promise<string> {
    const cosigners: tx.CosignerLike[] = [];
    const signers: wallet.Account[] = [this.sender];
    const scriptIntents: sc.ScriptIntent[] = intents.map(intent => {
      const { asset, from, to, amount } = intent;
      if (from && from.address !== this.sender.address) {
        this._checkAccountAccess(from);
        signers.push(from);
        cosigners.push({
          account: u.reverseHex(from.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        });
      }
      return {
        scriptHash: asset,
        operation: "transfer",
        args: [
          sc.ContractParam.hash160(from ? from.address : this.sender.address),
          sc.ContractParam.hash160(to),
          amount
        ]
      };
    });

    const transaction = new TransactionBuilder({
      sender: u.reverseHex(this.sender.scriptHash),
      cosigners,
      systemFee: 1
    })
      .addIntents(...scriptIntents)
      .build();

    const signer = new TransactionSigner(transaction);
    signer.signWithAccount(...signers);

    // const validator = new TransactionValidator(this.rpcClient, transaction);
    // validator.validateNetworkFee(true);
    // validator.validateValidUntilBlock(true);
    return this.rpcClient.sendRawTransaction(transaction);
  }

  public async claimGas(
    account: wallet.Account | string = this.sender
  ): Promise<string> {
    if (typeof account === "string") {
      account = new wallet.Account(account);
    }
    const balance = await this.getBalances(account.address, CONST.ASSET_ID.NEO);
    return this.sendAssets({
      asset: "NEO",
      from: account,
      to: account.address,
      amount: balance[CONST.ASSET_ID.NEO]
    });
  }

  public async writeInvoke(
    scriptsIntents: (string | sc.ScriptIntent)[]
  ): Promise<string> {
    const script = sc.createScript(...scriptsIntents);
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(this.sender.scriptHash),
      systemFee: 1,
      script
    }).build();

    const signer = new TransactionSigner(transaction);
    signer.signWithAccount(this.sender);

    // const validator = new TransactionValidator(this.rpcClient, transaction);
    // validator.validateNetworkFee(true);
    // validator.validateValidUntilBlock(true);
    return this.rpcClient.sendRawTransaction(transaction);
  }

  private _checkAccountAccess(account: wallet.Account): void {
    if (!account.privateKey) {
      throw new Error(
        `Account with address ${account.address} doesn't have permission to sign`
      );
    }
  }
}
