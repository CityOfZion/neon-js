import { parseEnum } from "../../internal";
import {
  deserializeArrayOf,
  getSerializedSize,
  HexString,
  NeonSerializable,
  serializeArrayOf,
  StringStream,
} from "../../u";
export enum WitnessConditionType {
  Boolean = 0,
  Not = 1,
  And = 2,
  Or = 3,
  ScriptHash = 0x18,
  Group = 0x19,
  CalledByEntry = 0x20,
  CalledByContract = 0x28,
  CalledByGroup = 0x29,
}

export interface BooleanWitnessConditionJson {
  type: "Boolean";
  expression: boolean;
}

export interface NotWitnessConditionJson {
  type: "Not";
  expression: WitnessConditionJson;
}

export interface AndWitnessConditionJson {
  type: "And";
  expressions: WitnessConditionJson[];
}

export interface OrWitnessConditionJson {
  type: "Or";
  expressions: WitnessConditionJson[];
}

export interface ScriptHashWitnessConditionJson {
  type: "ScriptHash";
  // Scripthash
  hash: string;
}

export interface GroupWitnessConditionJson {
  type: "Group";
  // Public key
  group: string;
}

export interface CalledByEntryWitnessConditionJson {
  type: "CalledByEntry";
}

export interface CalledByContractWitnessConditionJson {
  type: "CalledByContract";
  // Scripthash
  hash: string;
}

export interface CalledByGroupWitnessConditionJson {
  type: "CalledByGroup";
  // Public key
  group: string;
}

export type WitnessConditionJson =
  | BooleanWitnessConditionJson
  | AndWitnessConditionJson
  | NotWitnessConditionJson
  | OrWitnessConditionJson
  | ScriptHashWitnessConditionJson
  | GroupWitnessConditionJson
  | CalledByEntryWitnessConditionJson
  | CalledByContractWitnessConditionJson
  | CalledByGroupWitnessConditionJson;

export abstract class WitnessCondition implements NeonSerializable {
  public abstract get type(): WitnessConditionType;
  public get size(): number {
    return 1;
  }
  public static fromJson(input: WitnessConditionJson): WitnessCondition {
    const witnessType = parseEnum(input.type, WitnessConditionType);
    const implementingClass = this.getImplementation(witnessType);
    return implementingClass.fromJson(input as never);
  }

  public static deserialize(ss: StringStream): WitnessCondition {
    const rawType = parseInt(ss.peek(1), 16);
    const witnessType = parseEnum(rawType, WitnessConditionType);
    const implementingClass = this.getImplementation(witnessType);
    return implementingClass.deserialize(ss);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private static getImplementation(type: WitnessConditionType) {
    switch (type) {
      case WitnessConditionType.And:
        return AndWitnessCondition;
      case WitnessConditionType.Not:
        return NotWitnessCondition;
      case WitnessConditionType.Boolean:
        return BooleanWitnessCondition;
      case WitnessConditionType.Or:
        return OrWitnessCondition;
      case WitnessConditionType.ScriptHash:
        return ScriptHashWitnessCondition;
      case WitnessConditionType.Group:
        return GroupWitnessCondition;
      case WitnessConditionType.CalledByEntry:
        return CalledByEntryWitnessCondition;
      case WitnessConditionType.CalledByContract:
        return CalledByContractWitnessCondition;
      case WitnessConditionType.CalledByGroup:
        return CalledByGroupWitnessCondition;
      default:
        throw new Error(`Unknown WitnessConditionType: ${type}`);
    }
  }

  public serialize(): string {
    return this.type.toString(16).padStart(2, "0");
  }

  public abstract toJson(): WitnessConditionJson;
}

export class BooleanWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.Boolean;
  public get type(): WitnessConditionType {
    return BooleanWitnessCondition._type;
  }
  public static deserialize(ss: StringStream): BooleanWitnessCondition {
    readAndAssertType(ss, this._type);
    const expression = !!ss.read(1);
    return new BooleanWitnessCondition(expression);
  }

  public static fromJson(
    input: BooleanWitnessConditionJson
  ): BooleanWitnessCondition {
    return new BooleanWitnessCondition(input.expression);
  }

  public get size(): number {
    return super.size + 1;
  }

  constructor(public expression: boolean) {
    super();
  }

  public toJson(): BooleanWitnessConditionJson {
    return {
      type: "Boolean",
      expression: this.expression,
    };
  }
}

export class AndWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.And;

  public get type(): WitnessConditionType {
    return AndWitnessCondition._type;
  }
  public static deserialize(ss: StringStream): AndWitnessCondition {
    readAndAssertType(ss, this._type);
    const expressions = deserializeArrayOf(WitnessCondition.deserialize, ss);
    return new AndWitnessCondition(expressions);
  }

  public static fromJson(input: AndWitnessConditionJson): AndWitnessCondition {
    return new AndWitnessCondition(
      input.expressions.map((e) => WitnessCondition.fromJson(e))
    );
  }

  public get size(): number {
    return super.size + getSerializedSize(this.expressions);
  }
  constructor(public expressions: WitnessCondition[]) {
    super();
  }

  public serialize(): string {
    return super.serialize() + serializeArrayOf(this.expressions);
  }
  public toJson(): AndWitnessConditionJson {
    return {
      type: "And",
      expressions: this.expressions.map((e) => e.toJson()),
    };
  }
}

export class NotWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.Not;

  public get type(): WitnessConditionType {
    return NotWitnessCondition._type;
  }
  public static deserialize(ss: StringStream): NotWitnessCondition {
    readAndAssertType(ss, this._type);
    const expression = WitnessCondition.deserialize(ss);
    return new NotWitnessCondition(expression);
  }

  public static fromJson(input: NotWitnessConditionJson): NotWitnessCondition {
    return new NotWitnessCondition(WitnessCondition.fromJson(input.expression));
  }

  public get size(): number {
    return super.size + this.expression.size;
  }
  constructor(public expression: WitnessCondition) {
    super();
  }

  public serialize(): string {
    return super.serialize() + this.expression.serialize();
  }

  public toJson(): NotWitnessConditionJson {
    return { type: "Not", expression: this.expression.toJson() };
  }
}

export class OrWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.Or;

  public get type(): WitnessConditionType {
    return OrWitnessCondition._type;
  }

  public static deserialize(ss: StringStream): OrWitnessCondition {
    readAndAssertType(ss, this._type);
    const expressions = deserializeArrayOf(WitnessCondition.deserialize, ss);
    return new OrWitnessCondition(expressions);
  }

  public static fromJson(input: OrWitnessConditionJson): OrWitnessCondition {
    return new OrWitnessCondition(
      input.expressions.map((e) => WitnessCondition.fromJson(e))
    );
  }

  public get size(): number {
    return super.size + getSerializedSize(this.expressions);
  }

  constructor(public expressions: WitnessCondition[]) {
    super();
  }

  public serialize(): string {
    return super.serialize() + serializeArrayOf(this.expressions);
  }

  public toJson(): OrWitnessConditionJson {
    return {
      type: "Or",
      expressions: this.expressions.map((e) => e.toJson()),
    };
  }
}

export class ScriptHashWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.ScriptHash;

  public get type(): WitnessConditionType {
    return ScriptHashWitnessCondition._type;
  }

  public static deserialize(ss: StringStream): ScriptHashWitnessCondition {
    readAndAssertType(ss, this._type);
    const hash = HexString.fromHex(ss.read(20), true);
    return new ScriptHashWitnessCondition(hash);
  }

  public static fromJson(
    input: ScriptHashWitnessConditionJson
  ): ScriptHashWitnessCondition {
    return new ScriptHashWitnessCondition(input.hash);
  }

  public hash: HexString;
  public get size(): number {
    return super.size + 20;
  }

  constructor(inputHash: string | HexString) {
    super();
    this.hash = HexString.fromHex(inputHash);
    if (this.hash.length !== 40) {
      throw new Error(
        `ScriptHashWitnessCondition only accepts a scripthash of 20 bytes but got ${this.hash.toString()}`
      );
    }
  }

  public serialize(): string {
    return super.serialize() + this.hash.toLittleEndian();
  }

  public toJson(): ScriptHashWitnessConditionJson {
    return {
      type: "ScriptHash",
      hash: this.hash.toString(),
    };
  }
}

export class GroupWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.Group;

  public get type(): WitnessConditionType {
    return GroupWitnessCondition._type;
  }

  public static deserialize(ss: StringStream): GroupWitnessCondition {
    readAndAssertType(ss, this._type);
    const group = ss.read(33);
    return new GroupWitnessCondition(group);
  }

  public static fromJson(
    input: GroupWitnessConditionJson
  ): GroupWitnessCondition {
    return new GroupWitnessCondition(input.group);
  }

  public group: HexString;
  public get size(): number {
    return super.size + 33;
  }

  constructor(inputGroup: string | HexString) {
    super();
    this.group = HexString.fromHex(inputGroup);

    if (this.group.length !== 66) {
      throw new Error(
        `GroupWitnessCondition only accepts a encoded public key of 33 bytes but got ${this.group.toString()}`
      );
    }
  }

  public serialize(): string {
    return super.serialize() + this.group.toString();
  }

  public toJson(): GroupWitnessConditionJson {
    return {
      type: "Group",
      group: this.group.toString(),
    };
  }
}

export class CalledByEntryWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.CalledByEntry;

  public get type(): WitnessConditionType {
    return CalledByEntryWitnessCondition._type;
  }

  public static deserialize(ss: StringStream): CalledByEntryWitnessCondition {
    readAndAssertType(ss, this._type);
    return new CalledByEntryWitnessCondition();
  }

  public static fromJson(
    _input: CalledByEntryWitnessConditionJson
  ): CalledByEntryWitnessCondition {
    return new CalledByEntryWitnessCondition();
  }
  public get size(): number {
    return super.size;
  }

  constructor() {
    super();
  }

  public serialize(): string {
    return super.serialize();
  }

  public toJson(): CalledByEntryWitnessConditionJson {
    return { type: "CalledByEntry" };
  }
}

export class CalledByContractWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.CalledByContract;

  public get type(): WitnessConditionType {
    return CalledByContractWitnessCondition._type;
  }

  public static deserialize(
    ss: StringStream
  ): CalledByContractWitnessCondition {
    readAndAssertType(ss, this._type);
    const hash = HexString.fromHex(ss.read(20), true);
    return new CalledByContractWitnessCondition(hash);
  }

  public static fromJson(
    input: CalledByContractWitnessConditionJson
  ): CalledByContractWitnessCondition {
    return new CalledByContractWitnessCondition(input.hash);
  }

  public hash: HexString;
  public get size(): number {
    return super.size + 20;
  }

  constructor(inputHash: string | HexString) {
    super();
    this.hash = HexString.fromHex(inputHash);
    if (this.hash.length !== 40) {
      throw new Error(
        `CalledByContractWitnessCondition only accepts a scripthash of 20 bytes but got ${this.hash.toString()}`
      );
    }
  }

  public serialize(): string {
    return super.serialize() + this.hash.toLittleEndian();
  }

  public toJson(): CalledByContractWitnessConditionJson {
    return {
      type: "CalledByContract",
      hash: this.hash.toString(),
    };
  }
}

export class CalledByGroupWitnessCondition extends WitnessCondition {
  private static _type = WitnessConditionType.CalledByGroup;

  public get type(): WitnessConditionType {
    return CalledByGroupWitnessCondition._type;
  }

  public static deserialize(ss: StringStream): CalledByGroupWitnessCondition {
    readAndAssertType(ss, this._type);
    const group = ss.read(33);
    return new CalledByGroupWitnessCondition(group);
  }

  public static fromJson(
    input: CalledByGroupWitnessConditionJson
  ): CalledByGroupWitnessCondition {
    return new CalledByGroupWitnessCondition(input.group);
  }

  public group: HexString;
  public get size(): number {
    return super.size + 33;
  }

  constructor(inputGroup: string | HexString) {
    super();
    this.group = HexString.fromHex(inputGroup);

    if (this.group.length !== 66) {
      throw new Error(
        `CalledByGroupWitnessCondition only accepts a encoded public key of 33 bytes but got ${this.group.toString()}`
      );
    }
  }

  public serialize(): string {
    return super.serialize() + this.group.toString();
  }

  public toJson(): CalledByGroupWitnessConditionJson {
    return {
      type: "CalledByGroup",
      group: this.group.toString(),
    };
  }
}

function readAndAssertType(ss: StringStream, type: WitnessConditionType): void {
  const rawType = parseInt(ss.read(1), 16);
  const witnessType = parseEnum(rawType, WitnessConditionType);
  if (witnessType !== type) {
    throw new Error(
      `Wrong WitnessConditionType. Wanted ${WitnessConditionType[type]} but got ${witnessType}`
    );
  }
}
