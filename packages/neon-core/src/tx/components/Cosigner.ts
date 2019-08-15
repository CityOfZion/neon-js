import { WitnessScope, extractScopes } from "./WitnessScope";
import { StringStream, num2hexstring } from "../../u";
import { deserializeArrayOf, serializeArrayOf } from "../main";

export interface CosignerLike {
  account: string;
  scopes: WitnessScope[];
  allowedContracts: string[];
  allowedGroups: string[];
}

function isTargetContainedInScopes(
  scopes: WitnessScope[],
  targetScope: WitnessScope
): boolean {
  if (targetScope === WitnessScope.Global) {
    return scopes.every(scope => scope === WitnessScope.Global);
  }
  return scopes.includes(targetScope);
}

export class Cosigner {
  /**
   * script hash of cosigner
   */
  public account: string;
  public scopes: WitnessScope[];
  public allowedContracts: string[];
  public allowedGroups: string[];
  // This limits maximum number of allowedContracts or allowedGroups here
  private maxSubitems: number = 16;

  public constructor(signer: Partial<CosignerLike>) {
    const { account, scopes, allowedContracts, allowedGroups } = signer;
    this.account = account || "";
    this.scopes = scopes || [WitnessScope.Global];
    this.allowedContracts = allowedContracts || [];
    this.allowedGroups = allowedGroups || [];
  }

  public isScope(targetScope: WitnessScope): boolean {
    return isTargetContainedInScopes(this.scopes, targetScope);
  }

  public static deserialize(ss: StringStream): CosignerLike {
    const account = ss.read(20);
    const scopes = extractScopes(ss.read());

    const readStringFromStream = (ss1: StringStream) => ss1.readVarBytes();

    const allowedContracts = isTargetContainedInScopes(
      scopes,
      WitnessScope.CustomContracts
    )
      ? deserializeArrayOf(readStringFromStream, ss)
      : [];
    const allowedGroups = isTargetContainedInScopes(
      scopes,
      WitnessScope.CustomContracts
    )
      ? deserializeArrayOf(readStringFromStream, ss)
      : [];
    return { account, scopes, allowedContracts, allowedGroups };
  }

  public serialize(): string {
    let out = "";
    out += this.account;
    out += num2hexstring(
      this.scopes.reduce((scopesInByte, scope) => scopesInByte | scope)
    );
    if (this.isScope(WitnessScope.CustomContracts)) {
      out += serializeArrayOf(this.allowedContracts);
    }
    if (this.isScope(WitnessScope.CustomGroups)) {
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
