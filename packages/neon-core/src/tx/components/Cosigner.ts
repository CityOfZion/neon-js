import { WitnessScope } from "./WitnessScope";
import { StringStream, num2hexstring } from "../../u";
import { deserializeArrayOf, serializeArrayOf } from "../main";

export interface CosignerLike {
  account: string;
  scopes: number;
  allowedContracts: string[];
  allowedGroups: string[];
}

export class Cosigner {
  /**
   * script hash of cosigner
   */
  public account: string;
  public scopes: WitnessScope;
  public allowedContracts: string[];
  public allowedGroups: string[];

  /**
   * @description This limits maximum number of allowedContracts or allowedGroups here
   */
  private readonly MAX_SUB_ITEMS: number = 16;

  public constructor(signer: Partial<CosignerLike>) {
    const { account, scopes, allowedContracts, allowedGroups } = signer;
    this.account = account || "";
    this.scopes = !scopes ? WitnessScope.Global : scopes & 0x11;
    this.allowedContracts = allowedContracts || [];
    this.allowedGroups = allowedGroups || [];
  }

  public get isGlobal() {
    return this.scopes === WitnessScope.Global;
  }

  public removeAllScopes() {
    this.scopes = WitnessScope.Global;
  }

  public get isCalledByEntry() {
    return (
      (this.scopes & WitnessScope.CalledByEntry) === WitnessScope.CalledByEntry
    );
  }

  public set isCalledByEntry(yes: boolean) {
    yes
      ? (this.scopes |= WitnessScope.CalledByEntry)
      : (this.scopes &= ~WitnessScope.CalledByEntry);
  }

  public get isCustomContracts() {
    return (
      (this.scopes & WitnessScope.CustomContracts) ===
      WitnessScope.CustomContracts
    );
  }

  public set isCustomContracts(yes: boolean) {
    yes
      ? (this.scopes |= WitnessScope.CustomContracts)
      : (this.scopes &= ~WitnessScope.CustomContracts);
  }

  public get isCustomGroups() {
    return (
      (this.scopes & WitnessScope.CustomGroups) === WitnessScope.CustomGroups
    );
  }

  public set isCustomGroups(yes: boolean) {
    yes
      ? (this.scopes |= WitnessScope.CustomGroups)
      : (this.scopes &= ~WitnessScope.CustomGroups);
  }

  public static deserialize(ss: StringStream): CosignerLike {
    const account = ss.read(20);
    const scopes = parseInt(ss.read(), 16);

    const readStringFromStream = (ss1: StringStream) => ss1.readVarBytes();

    const allowedContracts =
      (scopes & WitnessScope.CustomContracts) === WitnessScope.CustomContracts
        ? deserializeArrayOf(readStringFromStream, ss)
        : [];
    const allowedGroups =
      (scopes & WitnessScope.CustomGroups) === WitnessScope.CustomGroups
        ? deserializeArrayOf(readStringFromStream, ss)
        : [];
    return { account, scopes, allowedContracts, allowedGroups };
  }

  public serialize(): string {
    let out = "";
    out += this.account;
    out += num2hexstring(this.scopes);
    if (this.isCustomContracts) {
      out += serializeArrayOf(this.allowedContracts);
    }
    if (this.isCustomGroups) {
      out += serializeArrayOf(this.allowedGroups);
    }

    return out;
  }

  public export(): CosignerLike {
    return {
      account: this.account,
      scopes: this.scopes,
      allowedContracts: this.allowedContracts,
      allowedGroups: this.allowedContracts
    };
  }
}
