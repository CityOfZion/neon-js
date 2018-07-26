import { StringStream } from "../u";
import OpCode from "./OpCode";
export interface ScriptIntent {
    scriptHash: string;
    operation?: string;
    args?: any[];
    useTailCall?: boolean;
}
/**
 * @class ScriptBuilder
 * @extends StringStream
 * @classdesc Builds a VM script in hexstring. Used for constructing smart contract method calls.
 */
export declare class ScriptBuilder extends StringStream {
    /**
     * Appends an Opcode, followed by args
     */
    emit(op: OpCode, args?: string): this;
    /**
     * Appends args, operation and scriptHash
     * @param {string} scriptHash - Hexstring(BE)
     * @param {string|null} operation - ASCII, defaults to null
     * @param {Array|string|number|boolean} args - any
     * @param {boolean} useTailCall - Use TailCall instead of AppCall
     * @return {ScriptBuilder} this
     */
    emitAppCall(scriptHash: string, operation?: string | null, args?: any[] | string | number | boolean, useTailCall?: boolean): this;
    /**
     * Appends a SysCall
     * @param {string} api - api of SysCall
     * @return {ScriptBuilder} this
     */
    emitSysCall(api: string): this;
    /**
     * Appends data depending on type. Used to append params/array lengths.
     * @param {Array|string|number|boolean} data
     * @return {ScriptBuilder} this
     */
    emitPush(data?: any): this;
    /**
     * Reverse engineer a script back to its params.
     * @return {scriptParams[]}
     */
    toScriptParams(): ScriptIntent[];
    /**
     * Appends a AppCall and scriptHash. Used to end off a script.
     * @param scriptHash Hexstring(BE)
     * @param useTailCall Defaults to false
     */
    private _emitAppCall;
    /**
     * Private method to append an array
     * @private
     */
    private _emitArray;
    /**
     * Private method to append a hexstring.
     * @private
     * @param {string} hexstring - Hexstring(BE)
     * @return {ScriptBuilder} this
     */
    private _emitString;
    /**
     * Private method to append a number.
     * @private
     * @param {number} num
     * @return {ScriptBuilder} this
     */
    private _emitNum;
    /**
     * Private method to append a ContractParam
     * @private
     */
    private _emitParam;
}
export default ScriptBuilder;
//# sourceMappingURL=ScriptBuilder.d.ts.map