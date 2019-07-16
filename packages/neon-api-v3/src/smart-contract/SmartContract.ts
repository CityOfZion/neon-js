import { CONST, sc, u, wallet } from "@cityofzion/neon-core";
import { RPCClient, RPCVMResponse } from "@cityofzion/neon-core/lib/rpc";
import { ContractParam } from "@cityofzion/neon-core/lib/sc";
import { Transaction } from "@cityofzion/neon-core/lib/tx_v3";

export interface SmartContractLike {
    scriptHash: string;
    address: string;
    url: string;
}

export enum SmartContractParamType {
    Array = "Array",
    Address = "Address",
    Boolean = "Boolean",
    Hash160 = "Hash160",
    Integer = "Integer",
    String = "String"
}

export interface SmartContractParam {
    type: SmartContractParamType;
    value: any;
}

export class SmartContract {
    private _scriptHash: string;
    private _address: string;
    private _url: string;
    private _rpcClient: RPCClient;

    public constructor(scObj: Partial<SmartContractLike> = {}) {
        const { scriptHash, address, url } = scObj;
        this._scriptHash = scriptHash? scriptHash : "";
        this._address = address? address : "";
        this._url = url? url : CONST.DEFAULT_RPC.TEST;
        this._rpcClient = new RPCClient(this._url);
    }

    get scriptHash() {
        return this._scriptHash;
    }

    set scriptHash(sh: string) {
        this._scriptHash = sh;
    }

    get address() {
        return this._address;
    }

    set address(addr: string) {
        this._address = addr;
    }

    get url() {
        return this._url;
    }

    set url(url: string) {
        this._url = url;
        this._rpcClient.net = url;
    }

    /**
     * Static function to invoke script on desired node 
     * @param url rpc url
     * @param script invocation script
     */
    public static invokeScript(url: string, script: string): Promise<RPCVMResponse> {
        const rpcClient = new RPCClient(url);
        return rpcClient.invokeScript(script);
    }

    /**
     * Invoke smart contract within target node only
     * @param method smart contract method
     * @param params parameters to be passed to smart contract method
     */
    public invokeRead(method: string, params: Array<string>): Promise<RPCVMResponse> {
        return this._rpcClient.invokeFunction(this._scriptHash, method, params);
    }

    /**
     * Send transaction and broadcast
     * @param method smart contract method
     * @param params parameters to be passed
     */
    public invoke(method: string, params: Array<SmartContractParam>): void {
        const sb = new sc.ScriptBuilder();
        const scBuilder = sb.emitAppCall(this._scriptHash, method, this.convertParams(params));
        const script = scBuilder.str;
        export interface TransactionLike {
            version: number;
            attributes: TransactionAttributeLike[];
            scripts: WitnessLike[];
            script: string;
            gas: number | Fixed8;
          }
        const invocationTx = new Transaction({
            sc
        })
    }

    private convertParams(params: Array<SmartContractParam>): Array<ContractParam> {
        return params.map(param => {
            const { type, value } = param; 
            switch (type) {
                case SmartContractParamType.Address:
                  return ContractParam.byteArray(value, "address");
                case SmartContractParamType.Array:
                  const paramsInArr = this.convertParams(value as Array<SmartContractParam>);
                  return ContractParam.array(...paramsInArr);
                case SmartContractParamType.Boolean:
                  return ContractParam.boolean(value);
                default:
                  throw new Error('Smart Contract Param Format Error.');
              }
        })
    }
}