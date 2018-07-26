import BN from "bignumber.js";
export declare class Fixed8 extends BN {
    static fromHex(hex: string): Fixed8;
    static fromReverseHex(hex: string): Fixed8;
    constructor(input?: number | string | BN, base?: number);
    toHex(): string;
    toReverseHex(): string;
    /**
     * Returns a Fixed8 whose value is rounded upwards to the next whole number.
     */
    ceil(): Fixed8;
    /**
     * Returns a Fixed8 whose value is rounded downwards to the previous whole number.
     */
    floor(): Fixed8;
    /**
     * Returns true if the value is equivalent.
     */
    equals(other: string | number | Fixed8 | BN): boolean;
    /**
     * Returns a Fixed8 rounded to the nearest dp decimal places according to rounding mode rm.
     * If dp is null, round to whole number.
     * If rm is null, round according to default rounding mode.
     * @param dp
     * @param rm
     * @return {Fixed8}
     */
    round(dp?: number, rm?: BN.RoundingMode): Fixed8;
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 divided by `n`
     * @alias div
     */
    dividedBy(n: string | number | BN, base?: number): Fixed8;
    div(n: string | number | BN, base?: number): Fixed8;
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 multipled by `n`
     * @alias mul
     */
    times(n: string | number | BN, base?: number): Fixed8;
    mul(n: string | number | BN, base?: number): Fixed8;
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 plus `n`
     * @alias add
     */
    plus(n: string | number | BN, base?: number): Fixed8;
    add(n: string | number | BN, base?: number): Fixed8;
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 minus `n`
     * @alias sub
     */
    minus(n: string | number | BN, base?: number): Fixed8;
    sub(n: string | number | BN, base?: number): Fixed8;
}
export default Fixed8;
//# sourceMappingURL=Fixed8.d.ts.map