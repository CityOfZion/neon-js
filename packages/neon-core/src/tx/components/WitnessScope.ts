/**
 * Used to constrain witness to specified scope
 * The execution in vm of a script is kind of opaque, user could add scope on his signature to avoid abuse of signature
 */
export enum WitnessScope {
  /**
   * Global allows this witness in all contexts (default Neo2 behavior)
   * This cannot be combined with other flags
   */
  Global = 0,

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
}
