/**
 * Used to constrain witness to specified scope
 * The execution in vm of a script is kind of opaque, user could add scope on his signature to avoid abuse of signature
 */
export enum WitnessScope {
  /**
   * Global allows this witness in all contexts (default Neo2 behavior)
   * This cannot be combined with other flags
   */
  Global = 0x00,

  /**
   * CalledByEntry means that this condition must hold: EntryScriptHash == CallingScriptHash
   * No params is needed, as the witness/permission/signature given on first invocation will automatically expire if entering deeper internal invokes
   * This can be default safe choice for native NEO/GAS (previously used on Neo 2 as "attach" mode)
   */
  CalledByEntry = 0x01,

  /**
   * Custom hash for contract-specific
   */
  CustomContracts = 0x10,

  /**
   * Custom pubkey for group members, group can be found in contract manifest
   */
  CustomGroups = 0x20
}

export function extractScopes(scopesHex: string): WitnessScope[] {
  if (scopesHex.length !== 2) {
    throw new Error(`A scopes hex should contain just 1 byte`);
  }

  const hexNum = parseInt(scopesHex, 16);
  if (hexNum === 0) {
    return [WitnessScope.Global];
  }

  const scopes = [];
  (hexNum & WitnessScope.CalledByEntry) === 0 ||
    scopes.push(WitnessScope.CalledByEntry);
  (hexNum & WitnessScope.CustomContracts) === 0 ||
    scopes.push(WitnessScope.CustomContracts);
  (hexNum & WitnessScope.CustomGroups) === 0 ||
    scopes.push(WitnessScope.CustomGroups);
  return scopes;
}
