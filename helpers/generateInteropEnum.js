const sc = require("@cityofzion/neon-core").sc;

const interopMethods = {
  "System.Contract.Call": 1 << 15,
  "System.Contract.CallNative": 0,
  "System.Contract.GetCallFlags": 1 << 10,
  "System.Contract.CreateStandardAccount": 1 << 8,
  "System.Contract.CreateMultisigAccount": 1 << 8,
  "System.Contract.NativeOnPersist": 0,
  "System.Contract.NativePostPersist": 0,

  "System.Crypto.CheckSig": 1 << 15,
  "System.Crypto.CheckMultisig": 0,

  "System.Iterator.Next": 1 << 15,
  "System.Iterator.Value": 1 << 4,

  "System.Runtime.Platform": 1 << 3,
  "System.Runtime.GetNetwork": 1 << 3,
  "System.Runtime.GetTrigger": 1 << 3,
  "System.Runtime.GetTime": 1 << 3,
  "System.Runtime.GetScriptContainer": 1 << 3,
  "System.Runtime.GetExecutingScriptHash": 1 << 4,
  "System.Runtime.GetCallingScriptHash": 1 << 4,
  "System.Runtime.GetEntryScriptHash": 1 << 4,
  "System.Runtime.CheckWitness": 1 << 10,
  "System.Runtime.GetInvocationCounter": 1 << 4,
  "System.Runtime.GetRandom": 1 << 4,
  "System.Runtime.Log": 1 << 15,
  "System.Runtime.Notify": 1 << 15,
  "System.Runtime.GetNotifications": 1 << 8,
  "System.Runtime.GasLeft": 1 << 4,
  "System.Runtime.BurnGas": 1 << 4,

  "System.Storage.GetContext": 1 << 4,
  "System.Storage.GetReadOnlyContext": 1 << 4,
  "System.Storage.AsReadOnly": 1 << 4,
  "System.Storage.Get": 1 << 15,
  "System.Storage.Find": 1 << 15,
  "System.Storage.Put": 1 << 15,
  "System.Storage.Delete": 1 << 15,
};

const { opcodes, prices } = Object.keys(interopMethods)
  .map((k) => [
    k.toUpperCase().replace(/\./g, "_"),
    sc.generateInteropServiceCode(k),
    interopMethods[k],
  ])
  .reduce(
    (prev, curr) => {
      prev.opcodes[curr[0]] = curr[1];
      prev.prices[curr[0]] = curr[2];
      return prev;
    },
    { opcodes: {}, prices: {} }
  );

Object.entries(opcodes)
  .sort()
  .forEach((i) => console.log(`${i[0]} = "${i[1]}",`));

console.log("\n\n ---PRICES---");

Object.entries(prices)
  .sort()
  .forEach((i) => {
    if (i[1] !== -1) {
      console.log(`[InteropServiceCode.${i[0]}] : ${i[1]},`);
    }
  });
