import base58 from "bs58";
import { num2hexstring, hash256, hexstring2ab, ab2hexstring } from "../u";

export function encode(privateKey: string, version = 128): string {
  const privateKeyWithPrefix = num2hexstring(version) + privateKey;
  const hashed = hash256(privateKeyWithPrefix);
  const checksum = hashed.substr(0, 8); // first 4 bytes
  const privateKeyWithPrefixAndChecksum = privateKeyWithPrefix + checksum;
  return base58.encode(hexstring2ab(privateKeyWithPrefixAndChecksum));
}

export function decode(wif: string): string {
  const privateKeyWithPrefixAndChecksum = ab2hexstring(base58.decode(wif));
  if (privateKeyWithPrefixAndChecksum.length !== 74) {
    throw new Error("Unable to decode WIF. Wrong length provided.");
  }
  const privateKeyWithPrefix = privateKeyWithPrefixAndChecksum.substr(0, 66);
  const checksum = privateKeyWithPrefixAndChecksum.substr(66);
  if (!verifyChecksum(privateKeyWithPrefix, checksum)) {
    throw new Error("WIF checksum failed.");
  }

  return privateKeyWithPrefix.substr(2);
}

function verifyChecksum(
  privateKeyWithPrefix: string,
  checksum: string
): boolean {
  return hash256(privateKeyWithPrefix).substr(0, 8) === checksum;
}

export function verify(wif: string): boolean {
  const privateKeyWithPrefixAndChecksum = ab2hexstring(base58.decode(wif));
  if (privateKeyWithPrefixAndChecksum.length !== 74) {
    return false;
  }
  const privateKeyWithPrefix = privateKeyWithPrefixAndChecksum.substr(0, 66);
  const checksum = privateKeyWithPrefixAndChecksum.substr(66);
  return verifyChecksum(privateKeyWithPrefix, checksum);
}
