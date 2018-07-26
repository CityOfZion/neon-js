import { Fixed8, StringStream } from "../../u";
export interface TransactionOutputLike {
    assetId: string;
    value: number | Fixed8;
    scriptHash: string;
}
export declare class TransactionOutput {
    static deserialize(hex: string): TransactionOutput;
    static fromStream(ss: StringStream): TransactionOutput;
    static fromIntent(symbol: string, value: number | Fixed8, address: string): TransactionOutput;
    assetId: string;
    value: Fixed8;
    scriptHash: string;
    constructor(obj: TransactionOutputLike);
    serialize(): string;
    equals(other: TransactionOutputLike): boolean;
    export(): TransactionOutputLike;
}
export default TransactionOutput;
//# sourceMappingURL=TransactionOutput.d.ts.map