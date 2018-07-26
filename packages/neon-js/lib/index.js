"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api = __importStar(require("@cityofzion/neon-api"));
exports.api = api;
const neon_core_1 = require("@cityofzion/neon-core");
exports.settings = neon_core_1.settings;
const nep5 = __importStar(require("@cityofzion/neon-nep5"));
exports.nep5 = nep5;
const networks_1 = __importDefault(require("./networks"));
const bootstrap = networks_1.default;
Object.keys(bootstrap).map(key => {
    neon_core_1.settings.networks[key] = new neon_core_1.rpc.Network(bootstrap[key]);
});
exports.default = {
    sendAsset: api.sendAsset,
    claimGas: api.claimGas,
    doInvoke: api.doInvoke,
    create: {
        account: (k) => new neon_core_1.wallet.Account(k),
        privateKey: neon_core_1.wallet.generatePrivateKey,
        signature: neon_core_1.wallet.generateSignature,
        wallet: (k) => new neon_core_1.wallet.Wallet(k),
        claimTx: () => new neon_core_1.tx.ClaimTransaction,
        contractTx: () => new neon_core_1.tx.ContractTransaction,
        invocationTx: () => new neon_core_1.tx.InvocationTransaction,
        contractParam: (type, value) => new neon_core_1.sc.ContractParam(type, value),
        script: neon_core_1.sc.createScript,
        scriptBuilder: () => new neon_core_1.sc.ScriptBuilder(),
        deployScript: (args) => neon_core_1.sc.generateDeployScript(args),
        rpcClient: (net, version) => new neon_core_1.rpc.RPCClient(net, version),
        query: (req) => new neon_core_1.rpc.Query(req)
    },
    deserialize: {
        attribute: neon_core_1.tx.TransactionAttribute.deserialize,
        input: neon_core_1.tx.TransactionInput.deserialize,
        output: neon_core_1.tx.TransactionOutput.deserialize,
        script: neon_core_1.tx.Witness.deserialize,
        tx: neon_core_1.tx.Transaction.deserialize
    },
    is: {
        address: neon_core_1.wallet.isAddress,
        publicKey: neon_core_1.wallet.isPublicKey,
        encryptedKey: neon_core_1.wallet.isNEP2,
        privateKey: neon_core_1.wallet.isPrivateKey,
        wif: neon_core_1.wallet.isWIF,
        scriptHash: neon_core_1.wallet.isScriptHash
    },
    encrypt: {
        privateKey: neon_core_1.wallet.encrypt
    },
    decrypt: {
        privateKey: neon_core_1.wallet.decrypt
    },
    get: {
        privateKeyFromWIF: neon_core_1.wallet.getPrivateKeyFromWIF,
        WIFFromPrivateKey: neon_core_1.wallet.getWIFFromPrivateKey,
        publicKeyFromPrivateKey: neon_core_1.wallet.getPublicKeyFromPrivateKey,
        scriptHashFromPublicKey: neon_core_1.wallet.getScriptHashFromPublicKey,
        addressFromScriptHash: neon_core_1.wallet.getAddressFromScriptHash,
        scriptHashFromAddress: neon_core_1.wallet.getScriptHashFromAddress
    },
    sign: {
        message: neon_core_1.wallet.sign
    },
    verify: {
        message: neon_core_1.wallet.verify
    },
    u: neon_core_1.u,
    CONST: neon_core_1.CONST
};
__export(require("@cityofzion/neon-core"));
//# sourceMappingURL=index.js.map