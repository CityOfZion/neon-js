const sc = require("@cityofzion/neon-core").sc;

const nativeContractNames = [
  "NeoToken",
  "GasToken",
  "PolicyContract",
  "ManagementContract",
  "OracleContract",
  "DesignationContract",
];

console.log(
  nativeContractNames
    .map((name) => `${name} = "${sc.getNativeContractHash(name)}"`)
    .join(",\n")
);
