import {
  hexstring2str,
  num2hexstring,
  num2VarInt,
  str2hexstring,
  StringStream,
} from "../../u";

export enum StateType {
  Account = 0x40,
  Validator = 0x48,
}

export interface StateDescriptorLike {
  type: string | number;
  key: string;
  field: string;
  value: string;
}

function toStateType(type: StateType | string | number): StateType {
  if (typeof type === "string") {
    if (type in StateType) {
      return StateType[type as keyof typeof StateType];
    }
    throw new Error(`${type} not found in StateType!`);
  }
  return type;
}

export class StateDescriptor {
  public static deserialize(hex: string): StateDescriptor {
    const ss = new StringStream(hex);
    return this.fromStream(ss);
  }

  public static fromStream(ss: StringStream): StateDescriptor {
    const type = parseInt(ss.read(), 16);
    const key = ss.readVarBytes();
    const field = hexstring2str(ss.readVarBytes());
    const value = ss.readVarBytes();
    return new StateDescriptor({ type, key, field, value });
  }

  /** Indicates the role of the transaction sender */
  public type: StateType;
  /** The signing field of the transaction sender (scripthash for voting) */
  public key: string;
  /** Indicates action for this descriptor */
  public field: string;
  /** Data depending on field. For voting, this is the list of publickeys to vote for. */
  public value: string;

  public constructor(obj: Partial<StateDescriptorLike> = {}) {
    this.type = obj.type ? toStateType(obj.type) : StateType.Account;
    this.key = obj.key || "";
    this.field = obj.field || "";
    this.value = obj.value || "";
  }

  public get [Symbol.toStringTag](): string {
    return "StateDescriptor";
  }

  public serialize(): string {
    let out = num2hexstring(this.type);
    out += num2VarInt(this.key.length / 2);
    out += this.key;
    const hexField = str2hexstring(this.field);
    out += num2VarInt(hexField.length / 2);
    out += hexField;
    out += num2VarInt(this.value.length / 2);
    out += this.value;
    return out;
  }

  public export(): StateDescriptorLike {
    return {
      type: this.type,
      key: this.key,
      field: this.field,
      value: this.value,
    };
  }

  public equals(other: StateDescriptorLike): boolean {
    return (
      this.type === toStateType(other.type) &&
      this.key === other.key &&
      this.field === other.field &&
      this.value === other.value
    );
  }
}
export default StateDescriptor;
