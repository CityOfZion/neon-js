export interface ContractFeaturesLike {
  storage: boolean;
  payable: boolean;
}

export class ContractFeatures {
  public hasStorage: boolean;
  public payable: boolean;

  public constructor(hasStorage?: boolean, payable?: boolean) {
    this.hasStorage = !!hasStorage;
    this.payable = !!payable;
  }

  public export(): ContractFeaturesLike {
    return {
      storage: this.hasStorage,
      payable: this.payable
    };
  }
}
