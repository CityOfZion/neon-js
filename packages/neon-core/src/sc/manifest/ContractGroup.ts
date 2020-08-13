import { HexString } from "../../u";

export interface ContractGroupLike {
  pubKey: string;
  signature: string;
}

export interface ContractGroupJson {
  pubkey: string;
  /** base64-encoded */
  signature: string;
}
export class ContractGroup {
  public pubKey: string;
  public signature: string;

  public static fromJson(json: ContractGroupJson): ContractGroup {
    return new ContractGroup({
      pubKey: json.pubkey,
      signature: HexString.fromBase64(json.signature).toBigEndian(),
    });
  }
  public constructor(obj: Partial<ContractGroupLike>) {
    const { pubKey = "", signature = "" } = obj;
    this.pubKey = pubKey;
    this.signature = signature;
  }

  public toJson(): ContractGroupJson {
    return {
      pubkey: this.pubKey,
      signature: HexString.fromHex(this.signature).toBase64(),
    };
  }

  public export(): ContractGroupLike {
    return {
      pubKey: this.pubKey,
      signature: this.signature,
    };
  }
}
