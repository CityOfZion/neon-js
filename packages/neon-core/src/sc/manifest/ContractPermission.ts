export interface ContractPermissionLike {
  contract: string;
  methods: "*" | string[];
}

export interface ContractPermissionJson {
  /**
   * 0x-prefixed contract hash (42 characters), public key (66 characters) or '*'.
   */
  contract: string;
  methods: "*" | string[];
}

export class ContractPermission {
  /**
   * Contract hash (40 characters), public key (66 characters) or '*'
   */
  public contract: string;
  public methods: "*" | string[];

  /**
   *  Parses a ContractPermissionDescriptor.
   * @param jsonDescriptor - descriptor found in JSON format.
   * @returns a sanitized string
   */
  public static parseJsonDescriptor(jsonDescriptor: string): string {
    switch (true) {
      case jsonDescriptor.length === 66: // public key of contract manifest group
      case jsonDescriptor.length === 40: // contract scripthash
      case jsonDescriptor === "*": // wildcard, means it accept any contract
        return jsonDescriptor;
      case jsonDescriptor.length === 42 && jsonDescriptor.indexOf("0x") === 0: // contract with "0x" prefix
        return jsonDescriptor.slice(2);
      default:
        throw new Error(
          `This is not a ContractPermissionDescriptor: ${jsonDescriptor}`
        );
    }
  }

  /**
   * Converts an internal ContractPermissionDescriptor to JSON format.
   * @param descriptor - internal ContractPermissionDescriptor string
   * @returns JSON formatted string
   */
  public static toJsonDescriptor(descriptor: string): string {
    if (descriptor.length === 40) return `0x${descriptor}`;
    return descriptor;
  }
  public fromJson(json: ContractPermissionJson): ContractPermission {
    return new ContractPermission(json);
  }

  public constructor(obj: Partial<ContractPermissionLike> = {}) {
    const { contract = "*", methods = "*" } = obj;
    this.contract = ContractPermission.parseJsonDescriptor(contract);
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

  public toJson(): ContractPermissionJson {
    return {
      contract: ContractPermission.toJsonDescriptor(this.contract),
      methods: this.methods,
    };
  }

  public export(): ContractPermissionLike {
    return {
      contract: this.contract,
      methods: this.methods,
    };
  }
}
