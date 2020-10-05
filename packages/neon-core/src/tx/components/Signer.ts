import {
  WitnessScope,
  parse as parseWitnessScope,
  toString,
} from "./WitnessScope";
import { StringStream, num2hexstring, HexString } from "../../u";
import { deserializeArrayOf, serializeArrayOf } from "../lib";

export interface SignerLike {
  /* account scripthash in big endian */
  account: string | HexString;
  scopes: number | string | WitnessScope;
  allowedContracts?: (string | HexString)[];
  allowedGroups?: (string | HexString)[];
}

export interface SignerJson {
  // Scripthash of the account (BE & Ox)
  account: string;
  // Comma-delimited flags in English
  scopes: string;
  // Array of scripthashes (BE & Ox)
  allowedcontracts?: string[];
  // Array of public keys (BE)
  allowedgroups?: string[];
}

export class Signer {
  /**
   * scripthash of cosigner
   */
  public account: HexString;

  public scopes: WitnessScope;
  /**
   * List of scripthashes of allowed contracts. Only present when WitnessScope.CustomContracts is present in scopes.
   */
  public allowedContracts: HexString[];
  /**
   * List of public keys of allowed groups. Only present when WitnessScope.CustomGroups is present in scopes.
   */
  public allowedGroups: HexString[];

  public static fromJson(input: SignerJson): Signer {
    return new Signer({
      account: input.account,
      scopes: parseWitnessScope(input.scopes),
      allowedContracts: input.allowedcontracts ?? [],
      allowedGroups: input.allowedgroups ?? [],
    });
  }

  public constructor(signer: Partial<SignerLike | Signer> = {}) {
    const {
      account = "",
      scopes = WitnessScope.FeeOnly,
      allowedContracts = [],
      allowedGroups = [],
    } = signer;
    this.account = HexString.fromHex(account);
    this.scopes =
      (typeof scopes === "string" ? parseWitnessScope(scopes) : scopes) & 0xff;
    this.allowedContracts = allowedContracts.map((i) => HexString.fromHex(i));
    this.allowedGroups = allowedGroups.map((i) => HexString.fromHex(i));
  }

  /**
   * Returns the number of bytes this object will take when serialized.
   */
  public get size(): number {
    return (
      this.serialize().length / 2
    );
  }

  public addAllowedContracts(...contracts: string[]): void {
    this.scopes |= WitnessScope.CustomContracts;
    contracts
      .map((i) => HexString.fromHex(i))
      .forEach((i) => this.allowedContracts.push(i));
  }

  public addAllowedGroups(...groups: string[]): void {
    this.scopes |= WitnessScope.CustomGroups;
    groups
      .map((i) => HexString.fromHex(i))
      .forEach((i) => this.allowedGroups.push(i));
  }

  public static deserialize(ss: StringStream): Signer {
    const account = HexString.fromHex(ss.read(20), true);
    const scopes = parseInt(ss.read(), 16);

    const allowedContracts =
      scopes & WitnessScope.CustomContracts
        ? deserializeArrayOf((s) => HexString.fromHex(s.read(20), true), ss)
        : [];
    const allowedGroups =
      scopes & WitnessScope.CustomGroups
        ? deserializeArrayOf((s) => HexString.fromHex(s.read(33)), ss)
        : [];
    return new Signer({ account, scopes, allowedContracts, allowedGroups });
  }

  public serialize(): string {
    let out = "";
    out += this.account.toLittleEndian();
    out += num2hexstring(this.scopes, 1);
    if (this.scopes & WitnessScope.CustomContracts) {
      out += serializeArrayOf(
        this.allowedContracts.map((i) => i.toLittleEndian())
      );
    }
    if (this.scopes & WitnessScope.CustomGroups) {
      out += serializeArrayOf(this.allowedGroups.map((i) => i.toBigEndian()));
    }

    return out;
  }

  public export(): SignerLike {
    const output: SignerLike = {
      account: this.account.toBigEndian(),
      scopes: this.scopes,
    };
    if (this.scopes & WitnessScope.CustomContracts) {
      output.allowedContracts = [
        ...this.allowedContracts.map((i) => i.toBigEndian()),
      ];
    }
    if (this.scopes & WitnessScope.CustomGroups) {
      output.allowedGroups = [
        ...this.allowedGroups.map((i) => i.toBigEndian()),
      ];
    }
    return output;
  }

  public toJson(): SignerJson {
    const output: SignerJson = {
      account: "0x" + this.account.toBigEndian(),
      scopes: toString(this.scopes),
    };
    if (this.scopes & WitnessScope.CustomContracts) {
      output.allowedcontracts = [
        ...this.allowedContracts.map((i) => "0x" + i.toBigEndian()),
      ];
    }
    if (this.scopes & WitnessScope.CustomGroups) {
      output.allowedgroups = [
        ...this.allowedGroups.map((i) => i.toBigEndian()),
      ];
    }
    return output;
  }
}

export default Signer;
