import { num2VarInt, StringStream } from "../u";

export function deserializeArrayOf<T>(
  type: (ss: StringStream) => T,
  ss: StringStream
): T[] {
  const output = [];
  const len = ss.readVarInt();
  for (let i = 0; i < len; i++) {
    output.push(type(ss));
  }
  return output;
}

export function serializeArrayOf(prop: any[]): string {
  return num2VarInt(prop.length) + prop.map(p => p.serialize()).join("");
}
