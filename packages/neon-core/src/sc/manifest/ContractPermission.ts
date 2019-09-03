import { ContractPermissionDescriptor } from "./ContractPermissionDescriptor";
import { WildCardContainer } from "./WildCardContainer";

export interface ContractPermissionLike {
  contract: string;
  methods: "*" | string[];
}

export class ContractPermission {
  public contract: ContractPermissionDescriptor;
  public methods: WildCardContainer;

  public constructor(obj: Partial<ContractPermissionLike>) {
    const { contract = "*", methods = "*" } = obj;
    this.contract = ContractPermissionDescriptor.fromString(contract);
    this.methods = WildCardContainer.fromSerialized(methods);
  }

  public export(): ContractPermissionLike {
    return {
      contract: this.contract.export(),
      methods: this.methods.export()
    };
  }
}
