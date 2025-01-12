import { num2VarInt } from "./convert";
import { HexString } from "./HexString";
import { StringStream } from "./StringStream";
export interface NeonSerializable {
  size: number;
  serialize: () => string;
}
type Serializables = number | HexString | NeonSerializable[];
/**
 * Calculates the byte size of any supported input following NEO's variable int format.
 */
export function getSerializedSize(value: Serializables): number {
  switch (typeof value) {
    case "number": {
      if (value < 0xfd) return 1;
      else if (value <= 0xffff) return 3;
      else return 5;
    }
    case "object": {
      if (value instanceof HexString) {
        const size = value.byteLength;
        return getSerializedSize(size) + size;
      } else if (Array.isArray(value)) {
        let size = 0;
        if (value.length > 0) {
          if (
            typeof value[0].size === "number" &&
            typeof value[0].serialize === "function"
          ) {
            size = value
              .map((item) => item.size)
              .reduce((prev, curr) => prev + curr, 0);
          }
        }
        return getSerializedSize(value.length) + size;
      }
      // do not break here so we fall through to the default
    }
    default:
      throw new Error("Unsupported value type: " + typeof value);
  }
}

export function deserializeArrayOf<T>(
  type: (ss: StringStream) => T,
  ss: StringStream,
): T[] {
  const output = [];
  const len = ss.readVarInt();
  for (let i = 0; i < len; i++) {
    output.push(type(ss));
  }
  return output;
}

export function serializeArrayOf(prop: (NeonSerializable | string)[]): string {
  return (
    num2VarInt(prop.length) +
    prop.map((p) => (typeof p === "string" ? p : p.serialize())).join("")
  );
}
