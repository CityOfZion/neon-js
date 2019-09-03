export interface ContractFeaturesLike {
  storage: boolean;
  payable: boolean;
}

export class ContractFeatures {
  public hasStorage: boolean;
  public payable: boolean;

  public constructor(obj: Partial<ContractFeaturesLike>) {
    const { storage = false, payable = false } = obj;
    this.hasStorage = !!storage;
    this.payable = !!payable;
  }

  public export(): ContractFeaturesLike {
    return {
      storage: this.hasStorage,
      payable: this.payable
    };
  }
}
