/**
 * Used to constrain witness to specified scope
 * The execution in vm of a script is kind of opaque, user could add scope on his signature to avoid abuse of signature
 */
export enum WitnessScopeFlag {
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
  CustomGroups = 1 << 5
}

export class WitnessScope {
  /**
   * 8-bits(1 Byte) unsigned number of scope flags
   */
  private _scopes: number;
  public constructor(scopes?: number) {
    this._scopes = 0x11 & (scopes || 0);
  }

  public get scopes() {
    return this._scopes;
  }

  public set scopes(scopes: number) {
    this._scopes = 0x11 & scopes;
  }

  public get isGlobal() {
    return this._scopes === 0;
  }

  public get isCalledByEntry() {
    return (
      (this._scopes & WitnessScopeFlag.CalledByEntry) ===
      WitnessScopeFlag.CalledByEntry
    );
  }

  public get isCustomContracts() {
    return (
      (this._scopes & WitnessScopeFlag.CustomContracts) ===
      WitnessScopeFlag.CustomContracts
    );
  }

  public get isCustomGroups() {
    return (
      (this._scopes & WitnessScopeFlag.CustomGroups) ===
      WitnessScopeFlag.CustomGroups
    );
  }

  /**
   * @description add scopes to the original
   */
  public setScope(...flags: WitnessScopeFlag[]) {
    flags.forEach(flag => (this._scopes |= flag));
  }

  public export() {
    return this._scopes;
  }
}
