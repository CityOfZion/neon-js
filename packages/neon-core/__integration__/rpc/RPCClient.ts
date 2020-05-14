import { rpc, wallet } from "../../src/index";
import { ContractParam } from "../../src/sc";

const TESTNET_URLS = [
  "https://seed11.ngd.network:20331",
  "https://test1.cityofzion.io:443",
  "https://test2.cityofzion.io:443",
  "https://test3.cityofzion.io:443",
  "http://seed3.neo.org:20332",
  "http://seed4.neo.org:20332",
  "http://seed5.neo.org:20332",
];

let client: rpc.RPCClient;
const address = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
const contractHash = "5b7074e873973a6ed3708862f219a6fbf4d1c411";

beforeAll(async () => {
  for (let i = 0; i < TESTNET_URLS.length; i++) {
    try {
      await rpc.Query.getBlockCount().execute(TESTNET_URLS[i]);
      client = new rpc.RPCClient(TESTNET_URLS[i]);
      break;
    } catch (e) {
      if (i === TESTNET_URLS.length) {
        throw new Error("Exhausted all urls but found no available RPC");
      }
      continue;
    }
  }
});

describe("RPC Methods", () => {
  test("getAccountState", async () => {
    const result = await client.getAccountState(address);
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        "version",
        "script_hash",
        "frozen",
        "votes",
        "balances",
      ])
    );
  });

  test("getAssetState", async () => {
    const result = await client.getAssetState(
      "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
    );
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        "version",
        "id",
        "type",
        "name",
        "amount",
        "available",
        "precision",
        "owner",
        "admin",
        "issuer",
        "expiration",
        "frozen",
      ])
    );
  });

  describe("getBlock", () => {
    test("by index", async () => {
      const result = await client.getBlock(1);
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          "hash",
          "size",
          "version",
          "previousblockhash",
          "merkleroot",
          "time",
          "index",
          "nonce",
          "nextconsensus",
          "script",
          "tx",
          "confirmations",
          "nextblockhash",
        ])
      );
    });

    test("by hash", async () => {
      const result = await client.getBlock(
        "0012f8566567a9d7ddf25acb5cf98286c9703297de675d01ba73fbfe6bcb841c"
      );
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          "hash",
          "size",
          "version",
          "previousblockhash",
          "merkleroot",
          "time",
          "index",
          "nonce",
          "nextconsensus",
          "script",
          "tx",
          "confirmations",
          "nextblockhash",
        ])
      );
    });

    test("by hash", async () => {
      const result = await client.getBlock(1, 0);
      expect(typeof result === "string").toBeTruthy();
    });
  });

  test("getBlockHash", async () => {
    const result = await client.getBlockHash(1);
    expect(typeof result === "string").toBeTruthy();
  });

  test("getBlockCount", async () => {
    const result = await client.getBlockCount();
    expect(typeof result === "number").toBeTruthy();
  });

  test("getBlockSysFee", async () => {
    const result = await client.getBlockSysFee(1);
    expect(typeof result === "string").toBeTruthy();
  });

  test("getConnectionCount", async () => {
    const result = await client.getConnectionCount();
    expect(typeof result === "number").toBeTruthy();
  });

  test("getContractState", async () => {
    const result = await client.getContractState(contractHash);
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["version", "hash", "script"])
    );
  });

  test("getPeers", async () => {
    const result = await client.getPeers();
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["unconnected", "connected", "bad"])
    );
  });

  test("getRawMemPool", async () => {
    const result = await client.getRawMemPool();
    expect(Array.isArray(result)).toBeTruthy();
  });

  describe("getRawTransaction", () => {
    test("verbose", async () => {
      const result = await client.getRawTransaction(
        "7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3"
      );
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          "txid",
          "size",
          "type",
          "version",
          "attributes",
          "vin",
          "vout",
          "sys_fee",
          "net_fee",
          "scripts",
          "blockhash",
          "confirmations",
          "blocktime",
        ])
      );
    });

    test("non-verbose", async () => {
      const result = await client.getRawTransaction(
        "7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3",
        0
      );

      expect(typeof result === "string").toBeTruthy();
    });
  });

  test("getStorage", async () => {
    const result = await client.getStorage(
      contractHash,
      "9847e26135152874355e324afd5cc99f002acb33"
    );

    expect(typeof result === "string").toBeTruthy();
  });

  test("getTxOut (spent)", async () => {
    const result = await client.getTxOut(
      "7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3",
      1
    );

    expect(result).toBe(null);
  });

  test("getValidators", async () => {
    const result = await client.getValidators();
    result.map((v) =>
      expect(v).toMatchObject({
        publickey: expect.any(String),
        active: expect.any(Boolean),
        votes: expect.any(String),
      })
    );
  });

  test("getVersion", async () => {
    const result = await client.getVersion();
    expect(result).toMatch(/\d+\.\d+\.\d+/);
  });

  describe("Invocation methods", () => {
    test("invoke: simple", async () => {
      const result = await client.invoke(
        contractHash,
        ContractParam.string("name"),
        ContractParam.boolean(false)
      );

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["script", "state", "gas_consumed", "stack"])
      );
      expect(result.state).toContain("HALT");
      expect(result.stack[0].value).toEqual(
        "5265642050756c736520546f6b656e20332e312e34"
      );
    });

    test("invoke: complex", async () => {
      const result = await client.invoke(
        contractHash,
        ContractParam.string("balanceOf"),
        ContractParam.array(
          ContractParam.byteArray(
            "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
            "address"
          )
        )
      );

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["script", "state", "gas_consumed", "stack"])
      );
      expect(result.state).toContain("HALT");
      expect(result.stack.length).toBe(1);
    });

    test("invokeFunction", async () => {
      const result = await client.invokeFunction(contractHash, "name");

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["script", "state", "gas_consumed", "stack"])
      );
      expect(result.state).toContain("HALT");
      expect(result.stack[0].value).toEqual(
        "5265642050756c736520546f6b656e20332e312e34"
      );
    });

    test("invokeScript", async () => {
      const result = await client.invokeScript(
        "00c1046e616d656711c4d1f4fba619f2628870d36e3a9773e874705b"
      );
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["script", "state", "gas_consumed", "stack"])
      );
      expect(result.state).toContain("HALT");
      expect(result.stack[0].value).toEqual(
        "5265642050756c736520546f6b656e20332e312e34"
      );
    });
  });

  test("validateAddress", async () => {
    const result = await client.validateAddress(address);
    expect(result).toBe(true);
  });

  test("getUnspents", async () => {
    const result = await client.getUnspents(address);
    expect(result).toBeInstanceOf(wallet.Balance);
  });

  test("getClaimable", async () => {
    const result = await client.getClaimable(address);
    expect(result).toBeInstanceOf(wallet.Claims);
  });

  test("getUnclaimed", async () => {
    const result = await client.getUnclaimed(address);
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["available", "unavailable", "unclaimed"])
    );
  });
});
