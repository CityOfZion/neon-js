import { num2VarInt, StringStream, fixed82num } from "../../u";
import {
  TransactionAttribute,
  Witness
} from "../components";
import { TransactionLike } from "./Transaction";

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

export function deserializeType(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const byte = ss.read();
  return Object.assign(tx, { type: parseInt(byte, 16) });
}

export function deserializeVersion(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const byte = ss.read();
  return Object.assign({ version: parseInt(byte, 16) });
}

export function deserializeScript(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const script = ss.readVarBytes();
  return Object.assign(tx, { script });
}

export function deserializeSystemFee(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const gas = fixed82num(ss.read(8));
  return Object.assign(tx, { gas });
}

export function deserializeAttributes(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const attributes = deserializeArrayOf(
    TransactionAttribute.fromStream,
    ss
  ).map(i => i.export());
  return Object.assign(tx, { attributes });
}

export function deserializeWitnesses(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const scripts = deserializeArrayOf(Witness.fromStream, ss).map(i =>
    i.export()
  );
  return Object.assign(tx, { scripts });
}
