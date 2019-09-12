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
    const {
      account = "",
      scopes = WitnessScope.Global,
      allowedContracts = [],
      allowedGroups = []
    } = signer;
    this.account = account;
    this.scopes = scopes & 0xff;
    this.allowedContracts = [...allowedContracts];
    this.allowedGroups = [...allowedGroups];
  }

  public addAllowedContracts(...contracts: string[]) {
    this.scopes |= WitnessScope.CustomContracts;
    this.allowedContracts.push(...contracts);
  }

  public addAllowedGroups(...groups: string[]) {
    this.scopes |= WitnessScope.CustomGroups;
    this.allowedGroups.push(...groups);
  }

  public static deserialize(ss: StringStream): CosignerLike {
    const account = ss.read(20);
    const scopes = parseInt(ss.read(), 16);

    const readStringFromStream = (ss1: StringStream) => ss1.readVarBytes();

    const allowedContracts =
      scopes & WitnessScope.CustomContracts
        ? deserializeArrayOf(readStringFromStream, ss)
        : [];
    const allowedGroups =
      scopes & WitnessScope.CustomGroups
        ? deserializeArrayOf(readStringFromStream, ss)
        : [];
    return { account, scopes, allowedContracts, allowedGroups };
  }

  public serialize(): string {
    let out = "";
    out += this.account;
    out += num2hexstring(this.scopes);
    if (this.scopes & WitnessScope.CustomContracts) {
      out += serializeArrayOf(this.allowedContracts);
    }
    if (this.scopes & WitnessScope.CustomGroups) {
      out += serializeArrayOf(this.allowedGroups);
    }

    return out;
  }

  public export(): CosignerLike {
    return {
      account: this.account,
      scopes: this.scopes,
      allowedContracts: [...this.allowedContracts],
      allowedGroups: [...this.allowedContracts]
    };
  }
}
