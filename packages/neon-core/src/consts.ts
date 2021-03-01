export const ADDR_VERSION = "35";

export enum MAGIC_NUMBER {
  MainNet = 5195086,
  TestNet = 1951352142,
  SoloNet = 1234567890,
}

export enum NATIVE_CONTRACT_HASH {
  NeoToken = "f61eebf573ea36593fd43aa150c055ad7906ab83",
  GasToken = "70e2301955bf1e74cbb31d18c2f96972abadb328",
  PolicyContract = "79bcd398505eb779df6e67e4be6c14cded08e2f2",
  ManagementContract = "a501d7d7d10983673b61b7a2d3a813b36f9f0e43",
  OracleContract = "8dc0e742cbdfdeda51ff8a8b78d46829144c80ee",
  DesignationContract = "c0073f4c7069bf38995780c9da065f9b3949ea7a",
  LedgerContract = "971d69c6dd10ce88e7dfffec1dc603c6125a8764",
  RoleManagement = "597b1471bbce497b7809e2c8f10db67050008b02",
  NameService = "a2b524b68dfe43a9d56af84f443c6b9843b8028c",
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
