/**
 * Used to constrain witness to specified scope
 * The execution in vm of a script is kind of opaque, user could add scope on his signature to avoid abuse of signature
 */
export enum WitnessScope {
  None = 0,

  /**
   * CalledByEntry means that this condition must hold: EntryScriptHash == CallingScriptHash
   * No params is needed, as the witness/permission/signature given on first invocation will automatically expire if entering deeper internal invokes
   * This can be default safe choice for native NEO/GAS (previously used on Neo 2 as "attach" mode)
   */
  CalledByEntry = 1 << 0,

  /**
   * Custom hash for contract-specific
   */
  CustomContracts = 1 << 4,

  /**
   * Custom pubkey for group members, group can be found in contract manifest
   */
  CustomGroups = 1 << 5,

  /**
   * Custom rules for witness to adhere by.
   */
  WitnessRules = 1 << 6,

  /**
   * Global allows this witness in all contexts (default Neo2 behavior)
   * This cannot be combined with other flags
   */
  Global = 1 << 7,
}

export function parse(stringFlags: string): WitnessScope {
  const flags = stringFlags.split(/,/g);
  return flags.reduce(
    (p, c) => p | WitnessScope[c.trim() as keyof typeof WitnessScope],
    WitnessScope.None,
  );
}

function getEnums(): WitnessScope[] {
  return Object.values(WitnessScope).filter(
    (k) => typeof k === "number",
  ) as WitnessScope[];
}

export function toString(flags: WitnessScope): string {
  if (flags === WitnessScope.None) {
    return "None";
  }
  return getEnums()
    .filter((f) => flags & f)
    .map((f) => WitnessScope[f])
    .join(",");
}
