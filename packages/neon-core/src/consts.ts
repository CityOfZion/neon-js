/**
 * @deprecated If you are looking for the default MainNet address version for N3, please use DEFAULT_ADDRESS_VERSION.
 */
export const ADDR_VERSION = "35";

export const DEFAULT_ADDRESS_VERSION = 0x35;

export enum MAGIC_NUMBER {
  MainNet = 860833102,
  TestNet = 894710606,
  SoloNet = 1234567890,
}

export enum NATIVE_CONTRACT_HASH {
  NeoToken = "ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
  GasToken = "d2a4cff31913016155e38e474a2c06d08be276cf",
  PolicyContract = "cc5e4edd9f5f8dba8bb65734541df7a1c081c67b",
  ManagementContract = "fffdc93764dbaddd97c48f252a53ea4643faa3fd",
  OracleContract = "fe924b7cfe89ddd271abaf7210a80a7e11178758",
  LedgerContract = "da65b600f7124ce6c79950c1772a36403104f2be",
  RoleManagement = "49cf4e5378ffcd4dec034fd98a174c5491e395e2",
  StdLib = "acce6fd80d44e1796aa0c2c625e9e4e0ce39efc0",
  CryptoLib = "726cb6e0cd8628a1350a611384688911ab75f51b",
}

/**
 * @deprecated Please use NATIVE_CONTRACT_HASH
 */
export const ASSET_ID: { [key: string]: string } = {
  NEO: "de5f57d430d3dece511cf975a8d37848cb9e0525",
  GAS: "668e0c1f9d7b70a99dd9e06eadd4c784d641afbc",
};
export const DEFAULT_REQ = {
  jsonrpc: "2.0",
  method: "getblockcount",
  params: [],
  id: 1234,
};

export const DEFAULT_SCRYPT = {
  n: 16384,
  r: 8,
  p: 8,
  size: 64,
};

export const DEFAULT_WALLET = {
  name: "myWallet",
  version: "1.0",
  scrypt: DEFAULT_SCRYPT,
  extra: null,
};

export const DEFAULT_ACCOUNT_CONTRACT = {
  script: "",
  parameters: [
    {
      name: "signature",
      type: "Signature",
    },
  ],
  deployed: false,
};

// specified by nep2, same as bip38
export const NEP2_HEADER = "0142";

export const NEP2_FLAG = "e0";

// transaction related
export const TX_VERSION = 0;
