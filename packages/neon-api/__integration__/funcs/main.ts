import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../../src/index";

const neonJs = apiPlugin(neonCore);

const { api, CONST, rpc, sc } = neonJs;

const net = "TestNet";
const url = "https://neoscan-testnet.io/api/test_net";
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

neonCore.settings.addNetwork(
  new rpc.Network({
    Name: net,
    ExtraConfiguration: {
      neoscan: url
    }
  })
);

const provider = new api.neoscan.instance("TestNet");

beforeAll(() => {
  expect(provider.name).toMatch(url);
});

describe("sendAsset", () => {
  test(
    "send some NEO with network fee from a to b",
    async () => {
      const intents = api.makeIntent(
        { NEO: 1, GAS: 0.00000001 },
        testKeys.b.address
      );
      const config = {
        intents,
        api: provider,
        account: new neonJs.wallet.Account(testKeys.a.privateKey),
        fees: 0.00000001
      };

      const result = await api.sendAsset(config);
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
        api: provider,
        account: new neonJs.wallet.Account(testKeys.a.privateKey)
      };

      const result = await api.claimGas(config);

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
      const intents = api.makeIntent(
        { NEO: 1, GAS: 0.00000001 },
        testKeys.a.address
      );
      const config = {
        api: provider,
        intents,
        account: new neonJs.wallet.Account(testKeys.a.privateKey),
        script,
        gas: 0
      };

      const result = await api.doInvoke(config);
      expect(result.response!.result).toBe(true);
      expect(result.response!.txid).not.toBeNull();
    },
    20000
  );

  test(
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
        api: provider,
        account: new neonJs.wallet.Account(testKeys.a.privateKey),
        script,
        gas: 0
      };

      const result = await api.doInvoke(config);
      expect(result.response!.result).toBe(true);
      expect(result.response!.txid).not.toBeNull();
    },
    20000
  );
});
