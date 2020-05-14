import { ASSET_ID, TX_VERSION } from "../../consts";
import { Fixed8, StringStream } from "../../u";
import { Claims, getScriptHashFromAddress } from "../../wallet";
import {
  TransactionInput,
  TransactionInputLike,
  TransactionOutput,
} from "../components";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import { serializeArrayOf } from "./main";
import TransactionType from "./TransactionType";

const MAX_CLAIMS_LENGTH = 255;

export interface ClaimTransactionLike extends TransactionLike {
  claims: TransactionInputLike[];
}

export interface ClaimExclusive {
  claims: TransactionInput[];
}

/**
 * Transaction used for claiming GAS. Do note that GAS Claims can only occur for spent coins.
 * Constructed with a list of claims and a TransactionOutput representing the GAS claimed.
 */
export class ClaimTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<ClaimTransactionLike> {
    const out = {
      claims: [] as TransactionInput[],
    };
    const claimLength = ss.readVarInt();
    for (let i = 0; i < claimLength; i++) {
      out.claims.push(TransactionInput.fromStream(ss));
    }
    return Object.assign(tx, out);
  }

  public static fromClaims(claim: Claims): ClaimTransaction {
    const totalClaim = claim.claims.reduce((p, c) => {
      return p.add(c.claim);
    }, new Fixed8(0));
    const outputs = [
      new TransactionOutput({
        assetId: ASSET_ID.GAS,
        value: totalClaim,
        scriptHash: getScriptHashFromAddress(claim.address),
      }),
    ];
    const claims = claim.claims.map((c) => ({
      prevHash: c.txid,
      prevIndex: c.index,
    }));
    return new ClaimTransaction({ outputs, claims });
  }

  public readonly type: TransactionType = 0x02;
  public claims: TransactionInput[];

  public get exclusiveData(): ClaimExclusive {
    return { claims: this.claims };
  }

  public get fees(): number {
    return 0;
  }

  public constructor(obj: Partial<ClaimTransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.CLAIM }, obj));
    this.claims = Array.isArray(obj.claims)
      ? obj.claims
          .slice(0, MAX_CLAIMS_LENGTH)
          .map((c) => new TransactionInput(c))
      : [];
  }

  public addClaims(claim: Claims): this {
    if (this.claims.length !== 0) {
      throw new Error(`This transaction already has claims!`);
    }
    const totalClaim = claim.claims.reduce((p, c) => {
      return p.add(c.claim);
    }, new Fixed8(0));
    this.outputs.push(
      new TransactionOutput({
        assetId: ASSET_ID.GAS,
        value: totalClaim,
        scriptHash: getScriptHashFromAddress(claim.address),
      })
    );
    this.claims = claim.claims.map(
      (c) =>
        new TransactionInput({
          prevHash: c.txid,
          prevIndex: c.index,
        })
    );
    return this;
  }

  public serializeExclusive(): string {
    return serializeArrayOf(this.claims);
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof ClaimTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new ClaimTransaction(other).hash;
  }

  public export(): ClaimTransactionLike {
    return Object.assign(super.export(), {
      claims: this.claims.map((c) => c.export()),
    });
  }
}

export default ClaimTransaction;
