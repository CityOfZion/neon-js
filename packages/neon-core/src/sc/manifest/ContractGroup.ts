export interface ContractGroupLike {
  pubKey: string;
  signature: string;
}

export class ContractGroup {
  public pubKey: string;
  public signature: string;

  public constructor(obj: Partial<ContractGroupLike>) {
    const { pubKey = "", signature = "" } = obj;
    this.pubKey = pubKey;
    this.signature = signature;
  }

  // TODO
  public isValid(hash: string): boolean {
    return true;
  }

  public export(): ContractGroupLike {
    return {
      pubKey: this.pubKey,
      signature: this.signature
    };
  }
}
