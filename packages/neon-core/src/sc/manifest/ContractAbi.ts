import {
  ContractMethodDescriptor,
  ContractMethodDescriptorLike
} from "./ContractMethodDescriptor";
import {
  ContractEventDescriptor,
  ContractEventDescriptorLike
} from "./ContractEventDescriptor";

export interface ContractAbiLike {
  hash: string;
  entryPoint: ContractMethodDescriptorLike;
  methods: ContractMethodDescriptorLike[];
  events: ContractEventDescriptorLike[];
}

export class ContractAbi {
  public hash: string;
  public entryPoint: ContractMethodDescriptor;
  public methods: ContractMethodDescriptor[];
  public events: ContractEventDescriptor[];

  public constructor(obj: Partial<ContractAbiLike>) {
    const { hash = "", entryPoint = {}, methods = [], events = [] } = obj;
    this.hash = hash;
    this.entryPoint = new ContractMethodDescriptor(entryPoint);
    this.methods = methods.map(method => new ContractMethodDescriptor(method));
    this.events = events.map(event => new ContractEventDescriptor(event));
  }

  public export(): ContractAbiLike {
    return {
      hash: this.hash,
      entryPoint: this.entryPoint.export(),
      methods: this.methods.map(method => method.export()),
      events: this.events.map(event => event.export())
    };
  }
}
