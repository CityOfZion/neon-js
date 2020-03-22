function assertPositiveInteger(input: number, inputName: string): void {
  if (!Number.isInteger(input) || input < 0) {
    throw new Error(`${input} is an invalid input for ${inputName}`);
  }
}

function to8BitHex(num: number): string {
  const hex = num.toString(16);
  return "0".repeat(8 - hex.length) + hex;
}

/**
 * Returns a BIP44 string specific to NEO.
 */
export function BIP44(address = 0, change = 0, account = 0): string {
  assertPositiveInteger(address, "address");
  assertPositiveInteger(change, "change");
  assertPositiveInteger(account, "account");
  const accountHex = to8BitHex(account + 0x80000000);
  const changeHex = to8BitHex(change);
  const addressHex = to8BitHex(address);
  return "8000002C" + "80000378" + accountHex + changeHex + addressHex;
}

export default BIP44;
