import {
  WitnessScope,
  parse as parseWitnessScope,
  toString,
} from "./WitnessScope";
import {
  StringStream,
  num2hexstring,
  HexString,
  deserializeArrayOf,
  serializeArrayOf,
} from "../../u";
import { WitnessRule, WitnessRuleJson } from "./WitnessRule";

export interface SignerLike {
  /* account scripthash in big endian */
  account: string | HexString;
  scopes: number | string | WitnessScope;
  allowedContracts?: (string | HexString)[];
  allowedGroups?: (string | HexString)[];
  rules?: WitnessRuleJson[];
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

  rules?: WitnessRuleJson[];
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

  public rules: WitnessRule[];

  public static fromJson(input: SignerJson): Signer {
    return new Signer({
      account: input.account,
      scopes: parseWitnessScope(input.scopes),
      allowedContracts: input.allowedcontracts ?? [],
      allowedGroups: input.allowedgroups ?? [],
      rules: input.rules ?? [],
    });
  }

  public constructor(signer: Partial<SignerLike | Signer> = {}) {
    const {
      account = "",
      scopes = WitnessScope.None,
      allowedContracts = [],
      allowedGroups = [],
      rules = [],
    } = signer;
    this.account = HexString.fromHex(account);
    this.scopes =
      (typeof scopes === "string" ? parseWitnessScope(scopes) : scopes) & 0xff;
    this.allowedContracts = allowedContracts.map((i) => HexString.fromHex(i));
    this.allowedGroups = allowedGroups.map((i) => HexString.fromHex(i));
    this.rules = rules.map((i) => new WitnessRule(i));
  }

  /**
   * Returns the number of bytes this object will take when serialized.
   */
  public get size(): number {
    return this.serialize().length / 2;
  }

  public addAllowedContracts(...contracts: string[]): void {
    if (this.scopes & WitnessScope.Global) {
      return;
    }

    this.scopes |= WitnessScope.CustomContracts;
    contracts
      .map((i) => HexString.fromHex(i))
      .forEach((i) => this.allowedContracts.push(i));
  }

  public addAllowedGroups(...groups: string[]): void {
    if (this.scopes & WitnessScope.Global) {
      return;
    }

    this.scopes |= WitnessScope.CustomGroups;
    groups
      .map((i) => HexString.fromHex(i))
      .forEach((i) => this.allowedGroups.push(i));
  }

  public addRules(...rules: WitnessRule[]): void {
    if (this.scopes & WitnessScope.Global) {
      return;
    }

    this.scopes |= WitnessScope.WitnessRules;
    for (const rule of rules) {
      this.rules.push(rule);
    }
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
    const rules =
      scopes & WitnessScope.WitnessRules
        ? deserializeArrayOf(WitnessRule.deserialize, ss)
        : [];
    return new Signer({
      account,
      scopes,
      allowedContracts,
      allowedGroups,
      rules,
    });
  }

  /**
   * Merges the other Signer into this signer.
   * Deduplicates contracts and groups.
   * Modifies the original Signer and returns it.
   */
  public merge(other: SignerLike | Signer): this {
    const otherSigner = other instanceof Signer ? other : new Signer(other);

    if (!this.account.equals(otherSigner.account)) {
      throw new Error("Cannot merge Signers of different accounts!");
    }

    this.scopes |= otherSigner.scopes;

    // Global scope
    if (this.scopes & WitnessScope.Global) {
      this.scopes = WitnessScope.Global;
      this.allowedContracts = [];
      this.allowedGroups = [];
      return this;
    }

    if (otherSigner.allowedContracts) {
      const deduplicatedContracts = otherSigner.allowedContracts.filter(
        (i) => !this.allowedContracts.some((j) => j.equals(i)),
      );
      this.allowedContracts = this.allowedContracts.concat(
        deduplicatedContracts,
      );
    }
    if (otherSigner.allowedGroups) {
      const deduplicatedGroups = otherSigner.allowedGroups.filter(
        (i) => !this.allowedGroups.some((j) => j.equals(i)),
      );
      this.allowedGroups = this.allowedGroups.concat(deduplicatedGroups);
    }
    return this;
  }

  public serialize(): string {
    let out = "";
    out += this.account.toLittleEndian();
    out += num2hexstring(this.scopes, 1);
    if (this.scopes & WitnessScope.CustomContracts) {
      out += serializeArrayOf(
        this.allowedContracts.map((i) => i.toLittleEndian()),
      );
    }
    if (this.scopes & WitnessScope.CustomGroups) {
      out += serializeArrayOf(this.allowedGroups.map((i) => i.toBigEndian()));
    }

    if (this.scopes & WitnessScope.WitnessRules) {
      out += serializeArrayOf(this.rules);
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
    if (this.scopes & WitnessScope.WitnessRules) {
      output.rules = [...this.rules.map((i) => i.toJson())];
    }
    return output;
  }
}

export default Signer;
