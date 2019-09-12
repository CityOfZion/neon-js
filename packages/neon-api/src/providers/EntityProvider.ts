import NetProvider from "./NetProvider";
import { Account } from "@cityofzion/neon-core/lib/wallet";

export class EntityProvider extends NetProvider {
  private _sender: Account;

  public constructor(url: string, sender: string | Account) {
    super(url);
    if (typeof sender === "string") {
      this._sender = new Account(sender);
    } else {
      this._sender = sender;
    }
    if (!this._sender.privateKey) {
      throw new Error(`Sender Account must have permission to sign`);
    }
  }

  public get sender() {
    return this._sender;
  }
}
