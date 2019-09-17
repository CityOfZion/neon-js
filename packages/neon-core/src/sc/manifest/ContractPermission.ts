export interface ContractPermissionLike {
  contract: string;
  methods: "*" | string[];
}

export class ContractPermission {
  public contract: string;
  public methods: "*" | string[];

  public constructor(obj: Partial<ContractPermissionLike> = {}) {
    const { contract = "*", methods = "*" } = obj;
    this.contract = this._formatContract(contract);
    this.methods = methods;
  }

  public get isHash(): boolean {
    return this.contract.length === 40;
  }

  public get isGroup(): boolean {
    return this.contract.length === 66;
  }

  public get isWildcard(): boolean {
    return this.contract === "*";
  }

  private _formatContract(contract: string): string {
    switch (true) {
      case contract.length === 66: // public key of contract manifest group
      case contract.length === 40: // contract scripthash
      case contract === "*": // wildcard, means it accept any contract
        return contract;
      case contract.length === 42 && contract.indexOf("0x") === 0: // contract with "0x" prefix
        return contract.slice(2);
      default:
        throw new Error(
          `This is not a ContractPermissionDescriptor: ${contract}`
        );
    }
  }

  public export(): ContractPermissionLike {
    return {
      contract: this.isHash ? `0x${this.contract}` : this.contract,
      methods: this.methods
    };
  }
}
