import { NeonObject } from "../../helper";
import Fixed8 from "../../u/Fixed8";
import Coin, { CoinLike } from "./Coin";
export interface AssetBalanceLike {
    balance: Fixed8 | number | string;
    unspent: CoinLike[];
    spent: CoinLike[];
    unconfirmed: CoinLike[];
}
export declare class AssetBalance implements NeonObject {
    unspent: Coin[];
    spent: Coin[];
    unconfirmed: Coin[];
    constructor(abLike?: Partial<AssetBalanceLike>);
    readonly balance: Fixed8;
    export(): AssetBalanceLike;
    equals(other: Partial<AssetBalanceLike>): boolean;
}
export default AssetBalance;
//# sourceMappingURL=AssetBalance.d.ts.map