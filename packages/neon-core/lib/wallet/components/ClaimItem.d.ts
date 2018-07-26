import Fixed8 from "../../u/Fixed8";
export interface ClaimItemLike {
    claim: Fixed8 | number | string;
    txid: string;
    index: number;
    value: number;
    start?: number;
    end?: number;
}
export declare class ClaimItem {
    claim: Fixed8;
    txid: string;
    index: number;
    value: number;
    start?: number;
    end?: number;
    constructor(claimItemLike?: Partial<ClaimItemLike>);
    export(): ClaimItemLike;
    equals(other: Partial<ClaimItemLike>): boolean;
}
export default ClaimItem;
//# sourceMappingURL=ClaimItem.d.ts.map