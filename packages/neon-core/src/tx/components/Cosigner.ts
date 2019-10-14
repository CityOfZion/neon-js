import { WitnessScope } from "./WitnessScope";
import { StringStream, num2hexstring } from "../../u";
import { deserializeArrayOf, serializeArrayOf } from "../lib";
import { ScriptHash } from "../../basic/hex/ScriptHash";
import { PublicKey } from "../../basic/hex/PublicKey";

export interface CosignerLike {
  account: string;
  scopes: number;
  allowedContracts?: string[];
  allowedGroups?: string[];
}

export interface CosignerConfig {
  account: ScriptHash;
  scopes: number;
  allowedContracts?: ScriptHash[];
  allowedGroups?: PublicKey[];
}

export class Cosigner {
  /**
   * script hash of cosigner
   */
  public account: ScriptHash;
  public scopes: WitnessScope;
  public allowedContracts: ScriptHash[];
  public allowedGroups: PublicKey[];

  /**
   * @description This limits maximum number of allowedContracts or allowedGroups here
   */
  private readonly MAX_SUB_ITEMS: number = 16;

  public constructor(signer: CosignerConfig) {
    const {
      account,
      scopes,
      allowedContracts = [],
      allowedGroups = []
    } = signer;
    this.account = account;
    this.scopes = scopes & 0xff;
    this.allowedContracts = [...allowedContracts];
    this.allowedGroups = [...allowedGroups];
  }

  public addAllowedContracts(...contracts: ScriptHash[]) {
    this.scopes |= WitnessScope.CustomContracts;
    this.allowedContracts.push(...contracts);
  }

  public addAllowedGroups(...groups: PublicKey[]) {
    this.scopes |= WitnessScope.CustomGroups;
    this.allowedGroups.push(...groups);
  }

  public static deserialize(ss: StringStream): CosignerConfig {
    const account = ScriptHash.fromHexString(ss.read(20), false);
    const scopes = parseInt(ss.read(), 16);

    const allowedContracts =
      scopes & WitnessScope.CustomContracts
        ? deserializeArrayOf(
            (ss1: StringStream) =>
              ScriptHash.fromHexString(ss1.readVarBytes(), true),
            ss
          ) // TODO: confirm if it's little endian here
        : [];
    const allowedGroups =
      scopes & WitnessScope.CustomGroups
        ? deserializeArrayOf(
            (ss1: StringStream) =>
              PublicKey.fromHexString(ss1.readVarBytes(), true),
            ss
          )
        : [];
    return { account, scopes, allowedContracts, allowedGroups };
  }

  public serialize(): string {
    let out = "";
    out += this.account.value(false);
    out += num2hexstring(this.scopes);
    if (this.scopes & WitnessScope.CustomContracts) {
      out += serializeArrayOf(
        this.allowedContracts.map(contract => contract.value(true))
      );
    }
    if (this.scopes & WitnessScope.CustomGroups) {
      out += serializeArrayOf(
        this.allowedGroups.map(group => group.value(true))
      );
    }

    return out;
  }

  public export(): CosignerLike {
    return {
      account: this.account.value(false),
      scopes: this.scopes,
      allowedContracts: [
        ...this.allowedContracts.map(contract => contract.value(true))
      ],
      allowedGroups: [...this.allowedGroups.map(group => group.value(true))]
    };
  }
}

export default Cosigner;
