const sc = require("@cityofzion/neon-core").sc;

const interopMethods = {
  "System.Binary.Serialize": 100000,
  "System.Binary.Deserialize": 500000,

  "System.Blockchain.GetHeight": 400,
  "System.Blockchain.GetBlock": 2500000,
  "System.Blockchain.GetTransaction": 1000000,
  "System.Blockchain.GetTransactionHeight": 1000000,
  "System.Blockchain.GetTransactionFromBlock": 1000000,
  "System.Blockchain.GetContract": 1000000,

  "System.Contract.Create": -1,
  "System.Contract.Update": -1,
  "System.Contract.Destroy": 1000000,
  "System.Contract.Call": 1000000,
  "System.Contract.CallEx": 1000000,
  "System.Contract.IsStandard": 30000,
  "System.Contract.GetCallFlags": 30000,
  "System.Contract.CreateStandardAccount": 10000,

  "Neo.Crypto.ECDsaVerify": 1000000,
  "Neo.Crypto.ECDsaCheckMultiSig": -1,

  "System.Enumerator.Create": 400,
  "System.Enumerator.Next": 1000000,
  "System.Enumerator.Value": 400,
  "System.Enumerator.Concat": 400,

  "System.Iterator.Create": 400,
  "System.Iterator.Key": 400,
  "System.Iterator.Keys": 400,
  "System.Iterator.Values": 400,
  "System.Iterator.Concat": 400,

  "System.Json.Serialize": 100000,
  "System.Json.Deserialize": 500000,

  "Neo.Native.Deploy": 0,

  "System.Runtime.Platform": 250,
  "System.Runtime.GetTrigger": 250,
  "System.Runtime.GetTime": 250,
  "System.Runtime.GetScriptContainer": 250,
  "System.Runtime.GetExecutingScriptHash": 400,
  "System.Runtime.GetCallingScriptHash": 400,
  "System.Runtime.GetEntryScriptHash": 400,
  "System.Runtime.CheckWitness": 30000,
  "System.Runtime.GetInvocationCounter": 400,
  "System.Runtime.Log": 1000000,
  "System.Runtime.Notify": 1000000,
  "System.Runtime.GetNotifications": 10000,
  "System.Runtime.GasLeft": 400,

  "System.Storage.GetContext": 400,
  "System.Storage.GetReadOnlyContext": 400,
  "System.Storage.AsReadOnly": 400,
  "System.Storage.Get": 1000000,
  "System.Storage.Find": 1000000,
  "System.Storage.Put": -1,
  "System.Storage.PutEx": -1,
  "System.Storage.Delete": -1
};

const { opcodes, prices } = Object.keys(interopMethods)
  .map(k => [
    k.toUpperCase().replace(/\./g, "_"),
    sc.generateInteropServiceCode(k),
    interopMethods[k]
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
  .forEach(i => console.log(`${i[0]} = "${i[1]}",`));

console.log("\n\n ---PRICES---");

Object.entries(prices)
  .sort()
  .forEach(i => {
    if (i[1] !== -1) {
      console.log(`[InteropServiceCode.${i[0]}] : ${i[1]}e-8,`);
    }
  });
