import { StringStream } from "../u";

export enum StackItemType {
  "ByteArray" = 0x00,
  "Boolean" = 0x01,
  "Integer" = 0x02,
  "InteropInterface" = 0x04,
  "Array" = 0x80,
  "Struct" = 0x81,
  "Map" = 0x82
}

export interface StackItemLike {
  type: StackItemType | keyof typeof StackItemType | number;
  value: string | number | boolean | StackItemLike[] | StackItemMapLike[];
}

export interface StackItemMapLike {
  key: StackItem | StackItemLike;
  value: StackItem | StackItemLike;
}

export interface StackItemMap {
  key: StackItem;
  value: StackItem;
}

/**
 * Object returned as a result of executing a script in the VM.
 */
export class StackItem {
  public static deserialize(hex: string): StackItem {
    const ss = new StringStream(hex);
    return this._deserialize(ss);
  }

  private static _deserialize(ss: StringStream): StackItem {
    const item = new StackItem({type: parseInt(ss.read(), 16)});
    const length = ss.readVarInt();
    switch (item.type) {
      case StackItemType.Array:
      case StackItemType.Struct:
        for (let i = 0; i < length; i++) {
          (item.value as StackItem[]).push(this._deserialize(ss));
        }
        break;
      case StackItemType.Map:
        for (let i = 0; i < length; i++) {
          (item.value as StackItemMap[]).push({
            key: this._deserialize(ss),
            value: this._deserialize(ss)
          });
        }
        break;
      case StackItemType.Boolean:
        item.value = parseInt(ss.read(), 16) > 0;
        break;
      default:
        item.value = ss.read(length);
    }
    return item;
  }

  public type: StackItemType;
  public value: string | number | boolean | StackItem[] | StackItemMap[];

  constructor(obj: Partial<StackItemLike>) {
    if (obj.type === undefined) {
      throw new Error(`Invalid type provided: ${obj.type}`)
    }
    this.type = toStackItemType(obj.type);
    if (obj.value === undefined) {
      this.value = getDefaultValue(this.type);
    } else if (Array.isArray(obj.value)) {
      if (this.type === StackItemType.Array) {
        this.value = (obj.value as StackItemLike[]).map(v => new StackItem(v));
      } else if (this.type === StackItemType.Map) {
        this.value = (obj.value as StackItemMapLike[]).map(v => ({
          key: new StackItem(v.key),
          value: new StackItem(v.value)
        }));
      }
      throw new Error(`Encountered array for value but invalid type`)
    } else {
      this.value = obj.value;
    }
  }

  public export(): StackItemLike {
    const type = StackItemType[this.type] as keyof typeof StackItemType;
    switch (this.type) {
      case StackItemType.Array:
      case StackItemType.Struct:
        return {
          type,
          value: (this.value as StackItem[]).map(i => i.export())
        };
      case StackItemType.Map:
        return {
          type,
          value: (this.value as StackItemMap[]).map(kv => ({
            key: kv.key.export(),
            value: kv.value.export()
          }))
        };
      default:
        return { type, value: this.value };
    }
  }
}

function toStackItemType(
  type: StackItemType | keyof typeof StackItemType | number
): StackItemType {
  if (typeof type === "string") {
    return StackItemType[type];
  }
  return type;
}

export default StackItem;
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

function getDefaultValue(type: StackItemType): any {
  switch (type) {
    case StackItemType.Array:
    case StackItemType.Struct:
    case StackItemType.Map:
      return [];
    case StackItemType.Boolean:
      return undefined;
    default:
      return "";
  }
}
