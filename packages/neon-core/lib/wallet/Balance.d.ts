import { BaseTransaction } from "../tx/transaction/BaseTransaction";
import Fixed8 from "../u/Fixed8";
import AssetBalance, { AssetBalanceLike } from "./components/AssetBalance";
export interface BalanceLike {
    address: string;
    net: string;
    assetSymbols: string[];
    assets: {
        [sym: string]: Partial<AssetBalanceLike>;
    };
    tokenSymbols: string[];
    tokens: {
        [sym: string]: number | string | Fixed8;
    };
}
export declare class Balance {
    address: string;
    net: string;
    assetSymbols: string[];
    assets: {
        [sym: string]: AssetBalance;
    };
    tokenSymbols: string[];
    tokens: {
        [sym: string]: Fixed8;
    };
    constructor(bal?: Partial<BalanceLike>);
    readonly [Symbol.toStringTag]: string;
    /**
     * Adds a new asset to this Balance.
     * @param  sym The symbol to refer by. This function will force it to upper-case.
     * @param assetBalance The assetBalance if initialized. Default is a zero balance object.
     * @return this
     */
    addAsset(sym: string, assetBalance?: Partial<AssetBalanceLike>): this;
    /**
     * Adds a new NEP-5 Token to this Balance.
     * @param sym - The NEP-5 Token Symbol to refer by.
     * @param tokenBalance - The amount of tokens this account holds.
     * @return this
     */
    addToken(sym: string, tokenBalance?: string | number | Fixed8): this;
    /**
     * Applies a Transaction to a Balance, removing spent coins and adding new coins. This currently applies only to Assets.
     * @param {BaseTransaction|string} tx - Transaction that has been sent and accepted by Node.
     * @param {boolean} confirmed - If confirmed, new coins will be added to unspent. Else, new coins will be added to unconfirmed property first.
     * @return {Balance} this
     */
    applyTx(tx: BaseTransaction | string, confirmed?: boolean): Balance;
    /**
     * Informs the Balance that the next block is confirmed, thus moving all unconfirmed transaction to unspent.
     * @return {Balance}
     */
    confirm(): Balance;
    /**
     * Export this class as a plain JS object
     */
    export(): BalanceLike;
    /**
     * Verifies the coins in balance are unspent. This is an expensive call.
     * @param {string} url - NEO Node to check against.
     * @return {Promise<Balance>} Returns this
     */
    verifyAssets(url: string): Promise<Balance>;
}
export default Balance;
//# sourceMappingURL=Balance.d.ts.map