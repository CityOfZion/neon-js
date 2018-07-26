"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDR_VERSION = "17";
exports.ASSETS = {
    NEO: "NEO",
    c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b: "NEO",
    GAS: "GAS",
    "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7": "GAS"
};
exports.ASSET_ID = {
    NEO: "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
    GAS: "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"
};
exports.CONTRACTS = {
    RPX: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
    TEST_RPX: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
    TEST_LWTF: "d7678dd97c000be3f33e9362e673101bac4ca654",
    TEST_NXT: "0b6c1f919e95fe61c17a7612aebfaf4fda3a2214",
    TEST_RHTT4: "f9572c5b119a6b5775a6af07f1cef5d310038f55"
};
exports.DEFAULT_RPC = {
    MAIN: "https://seed1.neo.org:10331",
    TEST: "https://seed1.neo.org:20331"
};
exports.DEFAULT_REQ = {
    jsonrpc: "2.0",
    method: "getblockcount",
    params: [],
    id: 1234
};
exports.DEFAULT_SCRYPT = {
    n: 16384,
    r: 8,
    p: 8,
    size: 64
};
exports.DEFAULT_SYSFEE = {
    enrollmentTransaction: 1000,
    issueTransaction: 500,
    publishTransaction: 500,
    registerTransaction: 10000
};
exports.DEFAULT_WALLET = {
    name: "myWallet",
    version: "1.0",
    scrypt: exports.DEFAULT_SCRYPT,
    extra: null
};
exports.DEFAULT_ACCOUNT_CONTRACT = {
    script: "",
    parameters: [
        {
            name: "signature",
            type: "Signature"
        }
    ],
    deployed: false
};
exports.NEO_NETWORK = {
    MAIN: "MainNet",
    TEST: "TestNet"
};
// specified by nep2, same as bip38
exports.NEP_HEADER = "0142";
exports.NEP_FLAG = "e0";
exports.RPC_VERSION = "2.3.2";
exports.TX_VERSION = {
    CLAIM: 0,
    CONTRACT: 0,
    INVOCATION: 1
};
//# sourceMappingURL=consts.js.map