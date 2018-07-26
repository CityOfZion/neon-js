import Fixed8 from "../../u/Fixed8";
export interface CoinLike {
    index: number;
    txid: string;
    value: Fixed8 | number | string;
}
export declare class Coin {
    index: number;
    txid: string;
    value: Fixed8;
    constructor(coinLike?: Partial<CoinLike>);
    export(): CoinLike;
    equals(other: Partial<CoinLike>): boolean;
}
export default Coin;
//# sourceMappingURL=Coin.d.ts.map