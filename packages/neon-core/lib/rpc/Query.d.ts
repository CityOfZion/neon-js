import { AxiosRequestConfig } from "axios";
import { BaseTransaction } from "../tx/transaction/BaseTransaction";
export interface RPCRequest {
    method: string;
    params: any[];
    id: number;
}
export interface RPCResponse {
    jsonrpc: string;
    id: number;
    result: any;
    error?: RPCErrorResponse;
}
export interface RPCErrorResponse {
    code: number;
    message: string;
}
/**
 * @class Query
 * @classdesc
 * A Query object helps us to construct and record requests
 * @param req
 */
export declare class Query {
    /**
     * @param addr address in Base58 encoding (starting with A)
     */
    static getAccountState(addr: string): Query;
    /**
     * @param assetId
     */
    static getAssetState(assetId: string): Query;
    /**
     * This Query returns the specified block either as a hexstring or human readable JSON.
     * @param indexOrHash height or hash of block.
     * @param verbose 0 for hexstring, 1 for JSON. Defaults to 1.
     */
    static getBlock(indexOrHash: string | number, verbose?: number): Query;
    /**
     * This Query returns the hash of a specific block.
     * @param {number} index height of block.
     */
    static getBlockHash(index: number): Query;
    /**
     * This Query returns the hash of the highest block.
     */
    static getBestBlockHash(): Query;
    /**
     * This Query returns the current block height.
     */
    static getBlockCount(): Query;
    /**
     * This Query returns the amount of GAS burnt as fees within a specific block.
     * @param index height of block.
     */
    static getBlockSysFee(index: number): Query;
    /**
     * This Query returns the number of other nodes that this node is connected to.
     */
    static getConnectionCount(): Query;
    /**
     * This Query returns information about the smart contract registered at the specific hash.
     * @param scriptHash hash of contract
     */
    static getContractState(scriptHash: string): Query;
    /**
     * This Query returns the list of nodes that this node is connected to.
     */
    static getPeers(): Query;
    /**
     * This Query returns the transaction hashes of the transactions waiting to be processed at the node.
     */
    static getRawMemPool(): Query;
    /**
     * This Query returns information about a specific transaction in either hexstring or human readable JSON.
     * @param txid hash of the specific transaction.
     * @param verbose 0 for hexstring, 1 for JSON. Defaults to 1.
     */
    static getRawTransaction(txid: string, verbose?: number): Query;
    /**
     * This Query returns the raw value stored at the specific key under a specific contract.
     * @param scriptHash hash of contract.
     * @param key
     */
    static getStorage(scriptHash: string, key: string): Query;
    /**
     * This Query returns the status of a TransactionOutput. If the output has been spent, this will return null.
     * @param txid hash of transaction.
     * @param index position of output in the vout array.
     */
    static getTxOut(txid: string, index: number): Query;
    /**
     * This Query returns the node version.
     */
    static getVersion(): Query;
    /**
     * This Query invokes the VM to run the given contract with the given parameters.
     * @param scriptHash hash of contract to test.
     * @param params parameters to pass into the VM.
     */
    static invoke(scriptHash: string, ...params: any[]): Query;
    /**
     * This Query invokes the VM to run the specific contract with the provided operation and params. Do note that this function only suits contracts with a Main(string, args[]) entry method.
     * @param scriptHash hash of contract to test.
     * @param operation name of operation to call (first argument)
     * @param params parameters to pass (second argument)
     */
    static invokeFunction(scriptHash: string, operation: string, ...params: any[]): Query;
    /**
     * This Query runs the specific script through the VM.
     * @param script
     */
    static invokeScript(script: string): Query;
    /**
     * This Query transmits the specific transaction to the node.
     * @param transaction Transaction as a Transaction object or hexstring.
     */
    static sendRawTransaction(transaction: BaseTransaction | string): Query;
    /**
     * This Query submits a block for processing.
     * @param block
     */
    static submitBlock(block: string): Query;
    /**
     * This Query submits an address for validation.
     * @param addr Address to validate.
     */
    static validateAddress(addr: string): Query;
    req: RPCRequest;
    res: any;
    completed: boolean;
    parse?: (res: any) => any;
    readonly id: number;
    readonly method: string;
    readonly params: any[];
    constructor(req: Partial<RPCRequest>);
    readonly [Symbol.toStringTag]: string;
    /**
     * Attaches a parser method to the Query. This method will be used to parse the response.
     */
    parseWith(parser: (res: any) => any): this;
    /**
     * Executes the Query by sending the RPC request to the provided net.
     * @param url The URL of the node.
     * @param config Request configuration
     */
    execute(url: string, config?: AxiosRequestConfig): Promise<any>;
    export(): RPCRequest;
    equals(other: Partial<RPCRequest>): boolean;
}
export default Query;
/**
 * Wrapper for querying node RPC
 * @param url Node URL.
 * @param req RPC Request object.
 * @param config Configuration to pass down to axios
 * @returns RPC Response
 */
export declare function queryRPC(url: string, req: Partial<RPCRequest>, config?: AxiosRequestConfig): Promise<RPCResponse>;
//# sourceMappingURL=Query.d.ts.map