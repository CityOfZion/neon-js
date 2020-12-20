const sc = require("@cityofzion/neon-core").sc;

const nativeContractNames = [
  "NeoToken",
  "GasToken",
  "PolicyContract",
  "ContractManagement",
  "OracleContract",
  "RoleManagement",
];

console.log(
  nativeContractNames
    .map((name) => `${name} = "${sc.getNativeContractHash(name)}"`)
    .join(",\n")
);
