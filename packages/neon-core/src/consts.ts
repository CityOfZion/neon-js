export const ADDR_VERSION = "35";

export enum MAGIC_NUMBER {
  MainNet = 5195086,
  TestNet = 1951352142,
  SoloNet = 1234567890,
}

export enum NATIVE_CONTRACT_HASH {
  NeoToken = "0a46e2e37c9987f570b4af253fb77e7eef0f72b6",
  GasToken = "a6a6c15dcdc9b997dac448b6926522d22efeedfb",
  PolicyContract = "dde31084c0fdbebc7f5ed5f53a38905305ccee14",
  ManagementContract = "cd97b70d82d69adfcd9165374109419fade8d6ab",
  OracleContract = "b1c37d5847c2ae36bdde31d0cc833a7ad9667f8f",
  DesignationContract = "c0073f4c7069bf38995780c9da065f9b3949ea7a",
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
