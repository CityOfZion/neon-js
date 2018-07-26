import { Fixed8 } from "../../u";
import { Account, Balance } from "../../wallet";
import { TransactionAttribute, TransactionAttributeLike, TransactionInput, TransactionInputLike, TransactionOutput, TransactionOutputLike, Witness, WitnessLike } from "../components";
import { calculationStrategyFunction } from "../strategy";
import TransactionType from "./TransactionType";
export interface TransactionLike {
    type: number;
    version: number;
    attributes: TransactionAttributeLike[];
    inputs: TransactionInputLike[];
    outputs: TransactionOutputLike[];
    scripts: WitnessLike[];
}
export declare abstract class BaseTransaction {
    readonly type: TransactionType;
    version: number;
    attributes: TransactionAttribute[];
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
    scripts: Witness[];
    constructor(tx?: Partial<TransactionLike>);
    readonly [Symbol.toStringTag]: string;
    /**
     * Transaction hash.
     */
    readonly hash: string;
    abstract readonly fees: number;
    abstract readonly exclusiveData: {
        [key: string]: any;
    };
    abstract serializeExclusive(): string;
    addOutput(txOut: TransactionOutputLike): this;
    /**
     * Adds a TransactionOutput. TransactionOutput can be given as a TransactionOutput object or as human-friendly values. This is detected by the number of arguments provided.
     * @param symbol The symbol of the asset (eg NEO or GAS).
     * @param value The value to send.
     * @param address The address to send to.
     */
    addIntent(symbol: string, value: number | Fixed8, address: string): this;
    /**
     * Add an attribute.
     * @param usage The usage type. Do refer to txAttrUsage enum values for all available options.
     * @param data The data as hexstring.
     */
    addAttribute(usage: number, data: string): this;
    /**
     * Add a remark.
     * @param remark A remark in ASCII.
     */
    addRemark(remark: string): this;
    addWitness(witness: Witness): this;
    /**
     * Calculate the inputs required based on existing outputs provided. Also takes into account the fees required through the gas property.
     * @param balance Balance to retrieve inputs from.
     * @param strategy
     * @param fees Additional network fees. Invocation gas and tx fees are already included automatically so this is additional fees for priority on the network.
     */
    calculate(balance: Balance, strategy?: calculationStrategyFunction, fees?: number | Fixed8): this;
    /**
     * Serialize the transaction and return it as a hexstring.
     * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
     * @return {string} Hexstring.
     */
    serialize(signed?: boolean): string;
    /**
     * Signs a transaction.
     * @param {Account|string} signer - Account, privateKey or WIF
     * @return {Transaction} this
     */
    sign(signer: Account | string): this;
    export(): TransactionLike;
}
export default BaseTransaction;
//# sourceMappingURL=BaseTransaction.d.ts.map