export declare enum ContractParamType {
    Signature = 0,
    Boolean = 1,
    Integer = 2,
    Hash160 = 3,
    Hash256 = 4,
    ByteArray = 5,
    PublicKey = 6,
    String = 7,
    Array = 16,
    InteropInterface = 240,
    Void = 255
}
export interface ContractParamLike {
    type: string;
    value: any;
}
export declare class ContractParam {
    /**
     * Creates a String ContractParam.
     */
    static string(value: string): ContractParam;
    /**
     * Creates a Boolean ContractParam. Does basic checks to convert value into a boolean.
     */
    static boolean(value: any): ContractParam;
    /**
     * Creates a Hash160 ContractParam. This is used for containing a scriptHash. Do not reverse the input if using this format.
     * @param {string} value - A 40 character long hexstring. Automatically converts an address to scripthash if provided.
     * @return {ContractParam}
     */
    static hash160(value: string): ContractParam;
    /**
     * Creates an Integer ContractParam. Does basic parsing and rounding to convert value into an Integer.
     * @param {any} value - A value that can be parsed to an Integer using parseInt.
     */
    static integer(value: string | number): ContractParam;
    /**
     * Creates a ByteArray ContractParam.
     * @param value
     * @param format The format that this value represents. Different formats are parsed differently.
     * @param args Additional arguments such as decimal precision
     */
    static byteArray(value: any, format: string, ...args: any[]): ContractParam;
    /**
     * Creates an Array ContractParam.
     * @param params params to be encapsulated in an array.
     */
    static array(...params: ContractParam[]): ContractParam;
    type: ContractParamType;
    value: any;
    constructor(type: ContractParam | ContractParamLike | ContractParamType | keyof typeof ContractParamType | number, value?: any);
    readonly [Symbol.toStringTag]: string;
    export(): ContractParamLike;
    equal(other: ContractParamLike): boolean;
}
export declare function likeContractParam(cp: Partial<ContractParam>): boolean;
export default ContractParam;
//# sourceMappingURL=ContractParam.d.ts.map