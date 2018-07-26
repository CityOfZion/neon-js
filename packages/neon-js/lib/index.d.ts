import * as api from "@cityofzion/neon-api";
import { CONST, rpc, sc, settings, tx, u, wallet } from "@cityofzion/neon-core";
import * as nep5 from "@cityofzion/neon-nep5";
declare const _default: {
    sendAsset: typeof api.sendAsset;
    claimGas: typeof api.claimGas;
    doInvoke: typeof api.doInvoke;
    create: {
        account: (k: string) => wallet.Account;
        privateKey: () => string;
        signature: (tx: string, privateKey: string) => string;
        wallet: (k: wallet.WalletJSON) => wallet.Wallet;
        claimTx: () => tx.ClaimTransaction;
        contractTx: () => tx.ContractTransaction;
        invocationTx: () => tx.InvocationTransaction;
        contractParam: (type: "Signature" | "Boolean" | "Integer" | "Hash160" | "Hash256" | "ByteArray" | "PublicKey" | "String" | "Array" | "InteropInterface" | "Void", value: any) => sc.ContractParam;
        script: typeof sc.createScript;
        scriptBuilder: () => sc.ScriptBuilder;
        deployScript: (args: any) => sc.ScriptBuilder;
        rpcClient: (net: string, version: string) => rpc.RPCClient;
        query: (req: rpc.RPCRequest) => rpc.Query;
    };
    deserialize: {
        attribute: typeof tx.TransactionAttribute.deserialize;
        input: typeof tx.TransactionInput.deserialize;
        output: typeof tx.TransactionOutput.deserialize;
        script: typeof tx.Witness.deserialize;
        tx: typeof tx.Transaction.deserialize;
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
        scriptHashFromPublicKey: (publicKey: string) => string;
        addressFromScriptHash: (scriptHash: string) => string;
        scriptHashFromAddress: (address: string) => string;
    };
    sign: {
        message: typeof wallet.sign;
    };
    verify: {
        message: typeof wallet.verify;
    };
    u: typeof u;
    CONST: typeof CONST;
};
export default _default;
export * from "@cityofzion/neon-core";
export { settings, api, nep5 };
//# sourceMappingURL=index.d.ts.map