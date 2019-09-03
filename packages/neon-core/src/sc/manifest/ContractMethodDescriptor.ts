import { ContractParamType } from "../ContractParam";
import {
  ContractEventDescriptor,
  ContractEventDescriptorLike
} from "./ContractEventDescriptor";

export interface ContractMethodDescriptorLike
  extends ContractEventDescriptorLike {
  returnType: ContractParamType;
}

export class ContractMethodDescriptor extends ContractEventDescriptor {
  public returnType: ContractParamType;
  public constructor(obj: Partial<ContractMethodDescriptorLike>) {
    super(obj);
    this.returnType = obj.returnType || ContractParamType.Any;
  }

  public export(): ContractMethodDescriptorLike {
    return Object.assign({}, super.export(), { returnType: this.returnType });
  }
}
