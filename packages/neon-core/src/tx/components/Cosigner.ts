import { WitnessScope } from "./WitnessScope";
import { StringStream, num2hexstring, HexString } from "../../u";
import { deserializeArrayOf, serializeArrayOf } from "../lib";

export interface CosignerLike {
  /* account scripthash in big endian */
  account: string | HexString;
  scopes: number;
  allowedContracts?: (string | HexString)[];
  allowedGroups?: (string | HexString)[];
}

export interface CosignerJson {
  account: string;
  scopes: string;
  allowedContracts?: string[];
  allowedGroups?: string[];
}

export class Cosigner {
  /**
   * script hash of cosigner
   */
  public account: HexString;
  public scopes: WitnessScope;
  public allowedContracts: HexString[];
  public allowedGroups: HexString[];

  /**
   * @description This limits maximum number of allowedContracts or allowedGroups here
   */
  private readonly MAX_SUB_ITEMS: number = 16;

  public constructor(signer: Partial<CosignerLike | Cosigner> = {}) {
    const {
      account = "",
      scopes = WitnessScope.Global,
      allowedContracts = [],
      allowedGroups = []
    } = signer;
    this.account = HexString.fromHex(account);
    this.scopes = scopes & 0xff;
    this.allowedContracts = allowedContracts.map(i => HexString.fromHex(i));
    this.allowedGroups = allowedGroups.map(i => HexString.fromHex(i));
  }

  public addAllowedContracts(...contracts: string[]): void {
    this.scopes |= WitnessScope.CustomContracts;
    contracts
      .map(i => HexString.fromHex(i))
      .forEach(i => this.allowedContracts.push(i));
  }

  public addAllowedGroups(...groups: string[]): void {
    this.scopes |= WitnessScope.CustomGroups;
    groups
      .map(i => HexString.fromHex(i))
      .forEach(i => this.allowedGroups.push(i));
  }

  public static deserialize(ss: StringStream): CosignerLike {
    const account = ss.read(20);
    const scopes = parseInt(ss.read(), 16);

    const readStringFromStream = (ss1: StringStream): string =>
      ss1.readVarBytes();

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
      out += serializeArrayOf(this.allowedContracts.map(i => i.toBigEndian()));
    }
    if (this.scopes & WitnessScope.CustomGroups) {
      out += serializeArrayOf(this.allowedGroups.map(i => i.toBigEndian()));
    }

    return out;
  }

  public export(): CosignerLike {
    return {
      account: this.account.toBigEndian(),
      scopes: this.scopes,
      allowedContracts: [...this.allowedContracts.map(i => i.toBigEndian())],
      allowedGroups: [...this.allowedGroups.map(i => i.toBigEndian())]
    };
  }
}

export default Cosigner;
