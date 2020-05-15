import Transport from "@ledgerhq/hw-transport";
import {
  ErrorCode,
  evalTransportError,
  TransportStatusError,
} from "./ErrorCode";
import { DerToHexSignature } from "./utils";

const DEFAULT_STATUSLIST = [ErrorCode.VALID_STATUS];

/**
 * Appends data to the Ledger for signature.
 * @param msg A string up to 510 characters (256 bytes)
 */
async function appendDataForSignature(
  ledger: Transport,
  msg: string
): Promise<Buffer> {
  return await ledger.send(
    0x80,
    0x02,
    0x00,
    0x00,
    Buffer.from(msg, "hex"),
    DEFAULT_STATUSLIST
  );
}

/**
 * Appends data to the Ledger and returns the signature of the entire message that has been appended so far.
 * @param ledger
 * @param msg A string up to 510 characters (256 bytes)
 */
async function finalizeDataForSignature(
  ledger: Transport,
  msg: string
): Promise<Buffer> {
  return await ledger.send(
    0x80,
    0x02,
    0x80,
    0x00,
    Buffer.from(msg, "hex"),
    DEFAULT_STATUSLIST
  );
}

/**
 * Returns the list of connected Ledger devices. Throw if Ledger is not supported by the computer.
 * @param ledgerLibrary
 */
export async function getDevicePaths(
  ledgerLibrary: typeof Transport
): Promise<ReadonlyArray<string>> {
  const supported = await ledgerLibrary.isSupported();
  if (!supported) {
    throw new Error(`Your computer does not support the ledger!`);
  }
  return await ledgerLibrary.list();
}

/**
 * Requests the public key of a requested address from the Ledger.
 * @param ledger The Ledger Transport.
 * @param bip44String The BIP44 string (40 bytes)
 * @returns An unencoded public key (65 bytes)
 */
export async function getPublicKey(
  ledger: Transport,
  bip44String: string
): Promise<string> {
  try {
    const response = await ledger.send(
      0x80,
      0x04,
      0x00,
      0x00,
      Buffer.from(bip44String, "hex"),
      DEFAULT_STATUSLIST
    );
    return response.toString("hex").substring(0, 130);
  } catch (e) {
    if (e.statusCode) {
      throw evalTransportError(e as TransportStatusError);
    }
    throw e;
  }
}

/**
 * Requests the device to sign a message using the NEO application.
 * @param ledger The Ledger Transport.
 * @param hex The message to sign as a hexstring.
 * @param bip44String The BIP44 string (40 bytes)
 * @returns Signature as a hexstring (64 bytes)
 */
export async function getSignature(
  ledger: Transport,
  hex: string,
  bip44String: string
): Promise<string> {
  const payload = hex + bip44String;
  const chunks = payload.match(/.{1,510}/g) || [];
  try {
    for (let i = 0; i < chunks.length - 1; i++) {
      await appendDataForSignature(ledger, chunks[i]);
    }
    const response = await finalizeDataForSignature(
      ledger,
      chunks[chunks.length - 1]
    );
    if (response.readUIntBE(0, 2) === ErrorCode.VALID_STATUS) {
      throw new Error(`No more data but Ledger did not return signature!`);
    }
    return DerToHexSignature(response.toString("hex"));
  } catch (e) {
    if (e.statusCode) {
      throw evalTransportError(e as TransportStatusError);
    }
    throw e;
  }
}
