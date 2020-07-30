import { StringStream, fixed82num, ensureHex, reverseHex } from "../../u";
import { TransactionAttribute, Witness, Signer } from "../components";
import { TransactionLike } from "./Transaction";
import { getScriptHashFromAddress } from "../../wallet";
import logger from "../../logging";
import { deserializeArrayOf } from "../lib";

const log = logger("tx");

export function deserializeVersion(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const byte = ss.read();
  const version = parseInt(byte, 16);
  if (version !== 0) {
    log.error(`Transaction version should be 0 not ${version}`);
  }
  return Object.assign(tx, { version });
}

export function deserializeNonce(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const nonce = parseInt(reverseHex(ss.read(4)), 16);
  return Object.assign(tx, { nonce });
}

export function deserializeScript(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const script = ss.readVarBytes();
  if (script.length === 0) {
    log.error("Script should not be vacant.");
  }
  return Object.assign(tx, { script });
}

export function deserializeFee(
  ss: StringStream,
  tx: Partial<TransactionLike> = {}
): Partial<TransactionLike> {
  const systemFee = fixed82num(ss.read(8));
  const networkFee = fixed82num(ss.read(8));
  return Object.assign(tx, { systemFee, networkFee });
}

export function deserializeValidUntilBlock(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const validUntilBlock = parseInt(reverseHex(ss.read(4)), 16);
  return Object.assign(tx, { validUntilBlock });
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

export function deserializeWitnesses(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const witnesses = deserializeArrayOf(Witness.fromStream, ss).map((i) =>
    i.export()
  );
  return Object.assign(tx, { witnesses });
}

export function formatSender(sender: string | undefined): string {
  if (!sender) {
    return "";
  }
  if (sender.length === 42 && sender.startsWith("0x")) {
    const hex = sender.slice(2);
    ensureHex(hex);
    return hex;
  } else if (sender.length === 40) {
    ensureHex(sender);
    return sender;
  } else if (sender.length === 34) {
    return getScriptHashFromAddress(sender);
  } else {
    throw new Error(`Sender format error: ${sender}`);
  }
}

export function deserializeSigners(
  ss: StringStream,
  tx: Partial<TransactionLike>
): Partial<TransactionLike> {
  const signers = deserializeArrayOf(Signer.deserialize, ss);
  if (!signers.every((s) => signers.indexOf(s) === signers.lastIndexOf(s))) {
    log.warn("Signer should not duplicate.");
  }
  return Object.assign(tx, { signers });
}
