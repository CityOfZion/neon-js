import { StringStream } from "../../u";
export interface WitnessLike {
    invocationScript: string;
    verificationScript: string;
}
export declare class Witness {
    static deserialize(hex: string): Witness;
    static fromStream(ss: StringStream): Witness;
    static fromSignature(sig: string, publicKey: string): Witness;
    invocationScript: string;
    verificationScript: string;
    constructor(obj: WitnessLike);
    serialize(): string;
    export(): WitnessLike;
    equals(other: WitnessLike): boolean;
}
export default Witness;
//# sourceMappingURL=Witness.d.ts.map