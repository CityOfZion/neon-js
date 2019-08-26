export class ContractPermissionDescriptor {
  public hash?: string;
  public group?: string;

  public get isHash(): boolean {
    return !!this.hash;
  }

  public get isGroup(): boolean {
    return !!this.group;
  }

  public get isWildcard(): boolean {
    return !this.hash && !this.group;
  }

  private constructor(hash?: string, group?: string) {
    this.hash = hash;
    this.group = group;
  }

  public static fromHash(hash: string): ContractPermissionDescriptor {
    return new ContractPermissionDescriptor(hash);
  }

  public static fromGroup(group: string): ContractPermissionDescriptor {
    return new ContractPermissionDescriptor(group);
  }

  public static fromWildcard(): ContractPermissionDescriptor {
    return new ContractPermissionDescriptor();
  }

  public static fromString(contract: string): ContractPermissionDescriptor {
    if (contract.length === 42) {
      return ContractPermissionDescriptor.fromHash(contract);
    } else if (contract.length === 66) {
      return ContractPermissionDescriptor.fromGroup(contract);
    } else if (contract === "*") {
      return ContractPermissionDescriptor.fromWildcard();
    }
    throw new Error(`This is not a ContractPermissionDescriptor: ${contract}`);
  }

  public export(): string {
    return this.isHash ? this.hash! : this.isGroup ? this.group! : "*";
  }
}
