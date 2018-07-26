import ClaimItem, { ClaimItemLike } from "./components/ClaimItem";
export interface ClaimsLike {
    address: string;
    net: string;
    claims: ClaimItemLike[];
}
/**
 * @class Claims
 * @classdesc
 * Claims object used for claiming GAS.
 * @param {Claims} config - Claims-like object
 * @param {string} config.net - Network
 * @param {string}  config.address - The address for this Claims
 * @param {ClaimItem[]} config.claims - The list of claims to be made.
 */
export declare class Claims {
    address: string;
    net: string;
    claims: ClaimItem[];
    constructor(config?: Partial<ClaimsLike>);
    readonly [Symbol.toStringTag]: string;
    export(): {
        address: string;
        net: string;
        claims: ClaimItemLike[];
    };
    /**
     * Returns a Claims object that contains part of the total claims starting at start, ending at end.
     */
    slice(start: number, end?: number): Claims;
}
export default Claims;
//# sourceMappingURL=Claims.d.ts.map