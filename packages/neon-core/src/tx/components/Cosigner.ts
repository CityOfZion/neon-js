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
    this.scopes = new WitnessScope(scopes);
    this.allowedContracts = allowedContracts || [];
    this.allowedGroups = allowedGroups || [];
  }

  public get isGlobal() {
    return this.scopes.isGlobal;
  }

  public get isCalledByEntry() {
    return this.scopes.isCalledByEntry;
  }

  public get isCustomContracts() {
    return this.scopes.isCustomContracts;
  }

  public get isCustomGroups() {
    return this.scopes.isCustomGroups;
  }

  public static deserialize(ss: StringStream): CosignerLike {
    const account = ss.read(20);
    const scopes = parseInt(ss.read(), 16);
    const witnessScope = new WitnessScope(scopes);

    const readStringFromStream = (ss1: StringStream) => ss1.readVarBytes();

    const allowedContracts = witnessScope.isCustomContracts
      ? deserializeArrayOf(readStringFromStream, ss)
      : [];
    const allowedGroups = witnessScope.isCustomGroups
      ? deserializeArrayOf(readStringFromStream, ss)
      : [];
    return { account, scopes, allowedContracts, allowedGroups };
  }

  public serialize(): string {
    let out = "";
    out += this.account;
    out += num2hexstring(this.scopes.export());
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
      scopes: this.scopes.export(),
      allowedContracts: this.allowedContracts,
      allowedGroups: this.allowedContracts
    };
  }
}
