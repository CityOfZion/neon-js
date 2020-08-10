export enum StackItemType {
  Any = 0x00,
  Pointer = 0x10,
  Boolean = 0x20,
  Integer = 0x21,
  ByteString = 0x28,
  Buffer = 0x30,
  Array = 0x40,
  Struct = 0x41,
  Map = 0x48,
  InteropInterface = 0x60,
}

export type StackItemValue =
  | string
  | boolean
  | number
  | StackItem[]
  | StackItemMap[];

export interface StackItemLike {
  type: StackItemType | keyof typeof StackItemType | number;
  value: string | boolean | number | StackItemLike[] | StackItemMapLike[];
}

export interface StackItemJson {
  type: keyof typeof StackItemType;
  value?: string | boolean | number | StackItemJson[];
}

export interface StackItemMapLike {
  key: StackItem | StackItemLike;
  value: StackItem | StackItemLike;
}

export interface StackItemMap {
  key: StackItem;
  value: StackItem;
}

function toStackItemType(
  type: StackItemType | keyof typeof StackItemType | number
): StackItemType {
  if (typeof type === "string") {
    return StackItemType[type];
  }
  return type;
}
/**
 * Determine if there's a nested set based on type
 */
export function hasChildren(type: StackItemType): boolean {
  if (
    type === StackItemType.Array ||
    type === StackItemType.Struct ||
    type === StackItemType.Map
  ) {
    return true;
  }
  return false;
}

function getDefaultValue(type: StackItemType): StackItemValue {
  switch (type) {
    case StackItemType.Array:
    case StackItemType.Struct:
    case StackItemType.Map:
      return [];
    case StackItemType.Boolean:
      return false;
    case StackItemType.Integer:
      return "0";
    case StackItemType.Pointer:
      return 0;
    default:
      return "";
  }
}

/**
 * Object returned as a result of executing a script in the VM.
 */
export class StackItem {
  public type: StackItemType;
  public value: string | boolean | number | StackItem[] | StackItemMap[];

  public constructor(obj: Partial<StackItemLike>) {
    if (obj.type === undefined) {
      throw new Error("No type is provided");
    }
    this.type = toStackItemType(obj.type);
    if (obj.value === null || obj.value === undefined) {
      this.value = getDefaultValue(this.type);
      return;
    }
    switch (this.type) {
      case StackItemType.Pointer:
        if (typeof obj.value !== "number") {
          throw new Error("value of a Pointer StackItem should be a number.");
        }
        this.value = obj.value;
        return;
      case StackItemType.Integer:
        this.value = obj.value?.toString() ?? "0";
        return;
      case StackItemType.Buffer:
      case StackItemType.ByteString:
        if (typeof obj.value !== "string") {
          throw new Error(
            "value of a ByteString/Buffer StackItem should be a string."
          );
        }
        this.value = obj.value;
        return;
      case StackItemType.Boolean:
        this.value = !!obj.value;
        return;
      case StackItemType.Map:
        if (Array.isArray(obj.value) && isStackItemMapLikeArray(obj.value)) {
          this.value = obj.value.map((i) => ({
            key: new StackItem(i.key),
            value: new StackItem(i.value),
          }));
        }
        throw new Error("Mismatch value for type");
      case StackItemType.Array:
      case StackItemType.Struct:
        if (Array.isArray(obj.value) && isStackItemLikeArray(obj.value)) {
          this.value = obj.value.map((i) => new StackItem(i));
        }
        throw new Error("Mismatch value for type");
      default:
        throw new Error("unsupported");
    }
  }

  public export(): StackItemLike {
    const type = StackItemType[this.type] as keyof typeof StackItemType;
    switch (this.type) {
      case StackItemType.Array:
      case StackItemType.Struct:
        return {
          type,
          value: (this.value as StackItem[]).map((i) => i.export()),
        };
      case StackItemType.Map:
        return {
          type,
          value: (this.value as StackItemMap[]).map((kv) => ({
            key: kv.key.export(),
            value: kv.value.export(),
          })),
        };
      default:
        return { type, value: this.value };
    }
  }
}

function isStackItemLike(i: unknown): i is StackItemLike {
  return i && typeof i === "object" && "type" in i;
}

function isStackItemLikeArray(arr: unknown[]): arr is StackItemLike[] {
  return arr.every(isStackItemLike);
}

function isStackItemMapLikeArray(arr: unknown[]): arr is StackItemMap[] {
  return arr.every(
    (i) => i && typeof i === "object" && "key" in i && "value" in i
  );
}
export default StackItem;
