import { num2VarInt, StringStream } from "../../u";
import {
  TransactionAttribute,
  TransactionInput,
  TransactionOutput,
  Witness,
} from "../components";
import { TransactionLike } from "./BaseTransaction";

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
  return num2VarInt(prop.length) + prop.map((p) => p.serialize()).join("");
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
  _tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const byte = ss.read();
  return Object.assign({ version: parseInt(byte, 16) });
}

export function deserializeAttributes(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const attributes = deserializeArrayOf(
    TransactionAttribute.fromStream,
    ss
  ).map((i) => i.export());
  return Object.assign(tx, { attributes });
}

export function deserializeInputs(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const inputs = deserializeArrayOf(TransactionInput.fromStream, ss).map((i) =>
    i.export()
  );
  return Object.assign(tx, { inputs });
}

export function deserializeOutputs(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const outputs = deserializeArrayOf(TransactionOutput.fromStream, ss).map(
    (i) => i.export()
  );
  return Object.assign(tx, { outputs });
}

export function deserializeWitnesses(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const scripts = deserializeArrayOf(Witness.fromStream, ss).map((i) =>
    i.export()
  );
  return Object.assign(tx, { scripts });
}
