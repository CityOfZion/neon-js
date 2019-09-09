export class ContractPermissionDescriptor {
  public descriptor?: string;

  public get isHash(): boolean {
    return !!this.descriptor && this.descriptor.length === 40;
  }

  public get isGroup(): boolean {
    return !!this.descriptor && this.descriptor.length === 66;
  }

  public get isWildcard(): boolean {
    return !this.descriptor || this.descriptor === "*";
  }

  public constructor(descriptor?: string) {
    if (
      !!descriptor &&
      descriptor.length === 42 &&
      descriptor.indexOf("0x") === 0
    ) {
      descriptor = descriptor.slice(2);
    }
    if (
      !!descriptor &&
      descriptor.length !== 40 &&
      descriptor.length !== 66 &&
      descriptor !== "*"
    ) {
      throw new Error(
        `This is not a ContractPermissionDescriptor: ${descriptor}`
      );
    }
    this.descriptor = descriptor;
  }

  public export(): string {
    /* Add "0x" to match standard */
    return this.isHash ? `0x${this.descriptor}` : this.descriptor || "*";
  }
}
