export class ContractPermissionDescriptor {
  public descriptor?: string;

  public get isHash(): boolean {
    return !!this.descriptor && this.descriptor.length === 42;
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
      descriptor.length !== 42 &&
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
    return this.descriptor || "*";
  }
}
