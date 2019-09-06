import { ContractPermissionDescriptor } from "./ContractPermissionDescriptor";

export interface ContractPermissionLike {
  contract: string;
  methods: "*" | string[];
}

export class ContractPermission {
  public contract: ContractPermissionDescriptor;
  public methods: "*" | string[];

  public constructor(obj: Partial<ContractPermissionLike>) {
    const { contract = "*", methods = "*" } = obj;
    this.contract = new ContractPermissionDescriptor(contract);
    this.methods = methods;
  }

  public export(): ContractPermissionLike {
    return {
      contract: this.contract.export(),
      methods: this.methods
    };
  }
}
