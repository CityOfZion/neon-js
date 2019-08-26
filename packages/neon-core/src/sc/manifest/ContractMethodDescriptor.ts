import { ContractParamType } from "../ContractParam";
import {
  ContractEventDescriptor,
  ContractEventDescriptorLike
} from "./ContractEventDescriptor";
import { ContractParameterDefinition } from "./ContractParameterDefinition";

export interface ContractMethodDescriptorLike
  extends ContractEventDescriptorLike {
  returnType: ContractParamType;
}

export class ContractMethodDescriptor extends ContractEventDescriptor {
  public returnType: ContractParamType;
  // public static readonly defaultEntryPoint = new ContractMethodDescriptor
  public constructor(obj: Partial<ContractMethodDescriptorLike>) {
    super(obj);
    this.returnType = obj.returnType || ContractParamType.Any;
  }

  public export(): ContractMethodDescriptorLike {
    return Object.assign({}, super.export(), { returnType: this.returnType });
  }

  public static readonly DEFAULT_ENTRY_POINT = new ContractMethodDescriptor({
    name: "Main",
    parameters: [
      new ContractParameterDefinition({
        name: "operation",
        type: ContractParamType.String
      }),
      new ContractParameterDefinition({
        name: "args",
        type: ContractParamType.Array
      })
    ],
    returnType: ContractParamType.Void
  });
}
