import {
  ContractMethodDefinition,
  ContractMethodDefinitionLike,
  ContractMethodDefinitionJson,
} from "./ContractMethodDefinition";
import {
  ContractEventDefiniton,
  ContractEventDefinitonLike,
  ContractEventDefinitionJson,
} from "./ContractEventDefiniton";

export interface ContractAbiLike {
  hash: string;
  methods: ContractMethodDefinitionLike[];
  events: ContractEventDefinitonLike[];
}

export interface ContractAbiJson {
  /** 0x-prefixed string */
  hash: string;
  methods: ContractMethodDefinitionJson[];
  events: ContractEventDefinitionJson[];
}
export class ContractAbi {
  public hash: string;
  public methods: ContractMethodDefinition[];
  public events: ContractEventDefiniton[];

  public static fromJson(json: ContractAbiJson): ContractAbi {
    return new ContractAbi({
      hash: json.hash,
      methods: json.methods.map((m) => ContractMethodDefinition.fromJson(m)),
      events: json.events.map((e) => ContractEventDefiniton.fromJson(e)),
    });
  }

  public constructor(obj: Partial<ContractAbiLike>) {
    const { hash = "", methods = [], events = [] } = obj;
    this.hash = hash;
    this.methods = methods.map(
      (method) => new ContractMethodDefinition(method)
    );
    this.events = events.map((event) => new ContractEventDefiniton(event));
  }

  public toJson(): ContractAbiJson {
    return {
      hash: this.hash,
      methods: this.methods.map((m) => m.toJson()),
      events: this.events.map((e) => e.toJson()),
    };
  }

  public export(): ContractAbiLike {
    return {
      hash: this.hash,
      methods: this.methods.map((method) => method.export()),
      events: this.events.map((event) => event.export()),
    };
  }
}
