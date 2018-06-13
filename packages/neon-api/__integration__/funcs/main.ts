import { CONST, sc } from "@cityofzion/neon-core";
import * as main from "../../src/funcs/main";
import { ClaimGasConfig, DoInvokeConfig, SendAssetConfig } from "../../src/funcs/types";
import { Provider } from "../../src/provider/common";
import * as neoscan from "../../src/provider/neoscan";

const net = "TestNet";
const testKeys = {
  a: {
    address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
    privateKey:
      "7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344"
  },
  b: {
    address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
    privateKey:
      "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69"
  },
  c: {
    address: "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
    privateKey:
      "3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b"
  }
};

const api = neoscan as Provider;

describe("sendAsset", () => {
  test(
    "send some NEO with network fee from a to b",
    async () => {
      const intents = main.makeIntent(
        { NEO: 1, GAS: 0.00000001 },
        testKeys.b.address
      );
      const config = {
        net,
        intents,
        api,
        privateKey: testKeys.a.privateKey,
        fees: 0.00000001
      } as SendAssetConfig;

      const result = await main.sendAsset(config);

      expect(result.response!.result).toBe(true);
      expect(result.response!.txid).not.toBeNull();
    },
    20000
  );
});

describe("claimGas", () => {
  test(
    "claimGas for a",
    async () => {
      const config = {
        net,
        api,
        privateKey: testKeys.a.privateKey
      } as ClaimGasConfig;

      const result = await main.claimGas(config);

      expect(result.response!.result).toBe(true);
      expect(result.response!.txid).not.toBeNull();
    },
    20000
  );
});

describe("doInvoke", () => {
  test(
    "send LWTF and some assets from b to a",
    async () => {
      const fromAddrScriptHash = sc.ContractParam.byteArray(
        testKeys.b.address,
        "address"
      );
      const toAddrScriptHash = sc.ContractParam.byteArray(
        testKeys.a.address,
        "address"
      );
      const transferAmount = sc.ContractParam.byteArray(0.00000001, "fixed8");
      const script = {
        scriptHash: CONST.CONTRACTS.TEST_LWTF,
        operation: "transfer",
        args: sc.ContractParam.array(
          fromAddrScriptHash,
          toAddrScriptHash,
          transferAmount
        )
      };
      const intents = main.makeIntent(
        { NEO: 1, GAS: 0.00000001 },
        testKeys.a.address
      );
      const config = {
        net,
        api,
        intents,
        privateKey: testKeys.b.privateKey,
        script,
        gas: 0
      } as DoInvokeConfig;

      const result = await main.doInvoke(config);
      expect(result.response!.result).toBe(true);
      expect(result.response!.txid).not.toBeNull();
    },
    20000
  );

  test.only(
    "send LWTF tokens with empty tx from a to b",
    async () => {
      const fromAddrScriptHash = sc.ContractParam.byteArray(
        testKeys.a.address,
        "address"
      );
      const toAddrScriptHash = sc.ContractParam.byteArray(
        testKeys.b.address,
        "address"
      );
      const transferAmount = sc.ContractParam.byteArray(0.00000001, "fixed8");
      const script = {
        scriptHash: CONST.CONTRACTS.TEST_LWTF,
        operation: "transfer",
        args: sc.ContractParam.array(
          fromAddrScriptHash,
          toAddrScriptHash,
          transferAmount
        )
      };
      const config = {
        net,
        api,
        privateKey: testKeys.a.privateKey,
        script,
        gas: 0
      } as DoInvokeConfig;

      const result = await main.doInvoke(config);
      expect(result.response!.result).toBe(true);
      expect(result.response!.txid).not.toBeNull();
    },
    20000
  );
});
