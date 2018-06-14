import * as api from "@cityofzion/neon-api";
import { CONST, rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";
import * as nep5 from "@cityofzion/neon-nep5";
declare const _default: {
    sendAsset: typeof api.sendAsset;
    claimGas: typeof api.claimGas;
    doInvoke: typeof api.doInvoke;
    create: {
        account: (k: string) => wallet.Account;
        privateKey: typeof wallet.generatePrivateKey;
        signature: typeof wallet.generateSignature;
        wallet: (k: wallet.WalletLike) => wallet.Wallet;
        tx: (args: tx.Transaction) => tx.Transaction;
        claimTx: typeof tx.Transaction.createClaimTx;
        contractTx: typeof tx.Transaction.createContractTx;
        invocationTx: typeof tx.Transaction.createInvocationTx;
        contractParam: (type: string, value: any) => sc.ContractParam;
        script: typeof sc.createScript;
        scriptBuilder: () => sc.ScriptBuilder;
        deployScript: (args: any) => string;
        rpcClient: (net: string, version: string) => rpc.RPCClient;
        query: (req: rpc.RPCRequest) => rpc.Query;
    };
    deserialize: {
        attribute: typeof tx.deserializeTransactionAttribute;
        input: typeof tx.deserializeTransactionInput;
        output: typeof tx.deserializeTransactionOutput;
        script: typeof tx.deserializeWitness;
        exclusiveData: {
            2: (stream: sc.StringStream) => {
                claims: tx.TransactionInput[];
            };
            128: (stream: sc.StringStream) => {};
            209: (stream: sc.StringStream) => {
                gas: number;
                script: string;
            };
        };
        tx: typeof tx.deserializeTransaction;
    };
    is: {
        address: typeof wallet.isAddress;
        publicKey: typeof wallet.isPublicKey;
        encryptedKey: typeof wallet.isNEP2;
        privateKey: typeof wallet.isPrivateKey;
        wif: typeof wallet.isWIF;
        scriptHash: typeof wallet.isScriptHash;
    };
    encrypt: {
        privateKey: typeof wallet.encrypt;
    };
    decrypt: {
        privateKey: typeof wallet.decrypt;
    };
    get: {
        privateKeyFromWIF: typeof wallet.getPrivateKeyFromWIF;
        WIFFromPrivateKey: typeof wallet.getWIFFromPrivateKey;
        publicKeyFromPrivateKey: typeof wallet.getPublicKeyFromPrivateKey;
        scriptHashFromPublicKey: typeof wallet.getScriptHashFromPublicKey;
        addressFromScriptHash: typeof wallet.getAddressFromScriptHash;
        scriptHashFromAddress: typeof wallet.getScriptHashFromAddress;
        transactionHash: typeof tx.getTransactionHash;
    };
    serialize: {
        attribute: typeof tx.serializeTransactionAttribute;
        input: typeof tx.serializeTransactionInput;
        output: typeof tx.serializeTransactionOutput;
        script: typeof tx.serializeWitness;
        exclusiveData: {
            2: (tx: tx.Transaction) => string;
            128: (tx: tx.Transaction) => "";
            209: (tx: tx.Transaction) => string;
        };
        tx: typeof tx.serializeTransaction;
    };
    sign: {
        message: typeof wallet.signMessage;
        transaction: typeof tx.signTransaction;
    };
    verify: {
        message: typeof wallet.verifyMessage;
    };
    u: typeof u;
    CONST: typeof CONST;
};
export default _default;
export * from "@cityofzion/neon-core";
export { api, nep5 };
//# sourceMappingURL=index.d.ts.map