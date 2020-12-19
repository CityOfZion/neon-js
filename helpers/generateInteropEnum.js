const sc = require("@cityofzion/neon-core").sc;

const interopMethods = {
  "System.Binary.Serialize": 1 << 12,
  "System.Binary.Deserialize": 1 << 14,
  "System.Binary.Base64Encode": 1 << 12,
  "System.Binary.Base64Decode": 1 << 12,
  "System.Binary.Base58Encode": 1 << 12,
  "System.Binary.Base58Decode": 1 << 12,
  "System.Binary.Itoa": 1 << 12,
  "System.Binary.Atoi": 1 << 12,

  "System.Blockchain.GetHeight": 1 << 4,
  "System.Blockchain.GetBlock": 1 << 16,
  "System.Blockchain.GetTransaction": 1 << 15,
  "System.Blockchain.GetTransactionHeight": 1 << 15,
  "System.Blockchain.GetTransactionFromBlock": 1 << 15,

  "System.Callback.Create": 1 << 4,
  "System.Callback.CreateFromMethod": 1 << 15,
  "System.Callback.CreateFromSyscall": 1 << 4,
  "System.Callback.Invoke": 1 << 15,

  "System.Contract.Call": 1 << 15,
  "System.Contract.CallEx": 1 << 15,
  "System.Contract.CallNative": 1 << 15,
  "System.Contract.IsStandard": 1 << 10,
  "System.Contract.GetCallFlags": 1 << 10,
  "System.Contract.CreateStandardAccount": 1 << 8,
  "System.Contract.NativeOnPersist": 0,
  "System.Contract.NativePostPersist": 0,

  "Neo.Crypto.RIPEMD160": 1 << 15,
  "Neo.Crypto.SHA256": 1 << 15,
  "Neo.Crypto.VerifyWithECDsaSecp256r1": 1 << 15,
  "Neo.Crypto.VerifyWithECDsaSecp256k1": 1 << 15,
  "Neo.Crypto.CheckMultisigWithECDsaSecp256r1": 0,
  "Neo.Crypto.CheckMultisigWithECDsaSecp256k1": 0,

  "System.Enumerator.Create": 1 << 4,
  "System.Enumerator.Next": 1 << 15,
  "System.Enumerator.Value": 1 << 4,
  "System.Enumerator.Concat": 1 << 4,

  "System.Iterator.Create": 1 << 4,
  "System.Iterator.Key": 1 << 4,
  "System.Iterator.Keys": 1 << 4,
  "System.Iterator.Values": 1 << 4,
  "System.Iterator.Concat": 1 << 4,

  "System.Json.Serialize": 1 << 12,
  "System.Json.Deserialize": 1 << 14,

  "System.Runtime.Platform": 1 << 3,
  "System.Runtime.GetTrigger": 1 << 3,
  "System.Runtime.GetTime": 1 << 3,
  "System.Runtime.GetScriptContainer": 1 << 3,
  "System.Runtime.GetExecutingScriptHash": 1 << 4,
  "System.Runtime.GetCallingScriptHash": 1 << 4,
  "System.Runtime.GetEntryScriptHash": 1 << 4,
  "System.Runtime.CheckWitness": 1 << 10,
  "System.Runtime.GetInvocationCounter": 1 << 4,
  "System.Runtime.Log": 1 << 15,
  "System.Runtime.Notify": 1 << 15,
  "System.Runtime.GetNotifications": 1 << 8,
  "System.Runtime.GasLeft": 1 << 4,

  "System.Storage.GetContext": 1 << 4,
  "System.Storage.GetReadOnlyContext": 1 << 4,
  "System.Storage.AsReadOnly": 1 << 4,
  "System.Storage.Get": 1 << 15,
  "System.Storage.Find": 1 << 15,
  "System.Storage.Put": 0,
  "System.Storage.PutEx": 0,
  "System.Storage.Delete": 0,
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
