import { rpc, CONST } from "../../src/index";
import { ContractParam, createScript } from "../../src/sc";
import { Transaction, WitnessScope } from "../../src/tx";
import { Account } from "../../src/wallet";
import { reverseHex } from "../../src/u";
import { RPCClient } from "../../src/rpc";

const TESTNET_URLS = [
  "http://seed1t.neo.org:20332",
  "http://seed2t.neo.org:20332",
  "http://seed3t.neo.org:20332",
  "http://seed4t.neo.org:20332",
  "http://seed5t.neo.org:20332",
];

const LOCALNET_URLS = ["http://localhost:20332"];

let client: rpc.RPCClient;
const address = "NXFprNJ9tBk4ziUaq2b9b2DtWQ1Vv2uLn3";
const privateKey =
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69";

// NEO contract hash. Should be same across TestNet or LocalNet.
const contractHash = "8c23f196d8a1bfd103a9dcb1f9ccf0c611377d3b";

async function safelyCheckHeight(url: string): Promise<number> {
  try {
    const res = await rpc.sendQuery(url, rpc.Query.getBlockCount(), {
      timeout: 10000,
    });
    return res.result;
  } catch (_e) {
    return -1;
  }
}

beforeAll(async () => {
  console.log(global["__TARGETNET__"]);
  const urls =
    (global["__TARGETNET__"] as string).toLowerCase() === "testnet"
      ? TESTNET_URLS
      : LOCALNET_URLS;
  const data = await Promise.all(urls.map((url) => safelyCheckHeight(url)));
  const heights = data.map((h, i) => ({ height: h, url: TESTNET_URLS[i] }));
  const best = heights.reduce(
    (bestSoFar, h) => (bestSoFar.height >= h.height ? bestSoFar : h),
    { height: -1, url: "" }
  );
  console.log(best);
  client = new rpc.RPCClient(best.url);
}, 20000);

describe("RPC Methods", () => {
  const REFERENCE_BLOCK_HEADER = {
    hash: "0x95380d2d8601a0e0d97fbe95c43cbc07e1d9ba6473ea5ddc39b8c381f3e3ae85",
    size: 171,
    version: 0,
    previousblockhash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    merkleroot:
      "0x97eaae7de20c8a28b26a85d1bc8e87034209c7ce59d3afabe411761971f2f542",
    time: 1468595301000,
    index: 0,
    nextconsensus: "NRwdxuyAw559S3qomjSptn77EAJeVRcguV",
    witnesses: [
      {
        invocation: "",
        verification: "EQ==",
      },
    ],
    // do not match confirmations
    nextblockhash:
      "0xcecd22244e794b9f97f45ed9c7b0e82262568b0cc3b285f9bcc04adc69f3b577",
  };
  const REFERENCE_BLOCK = Object.assign(
    {
      consensus_data: {
        primary: 0,
        nonce: "000000007c2bac1d",
      },
      tx: [
        {
          hash:
            "0x1e16f97be7fe8e9e2136dfdea37207fc27d2bc42661dd1feb6f37381233c44ad",
          size: 57,
          version: 0,
          nonce: 0,
          sender: "NeN4xPMn4kHoj7G8Lciq9oorgLTvqt4qi1",
          sys_fee: "0",
          net_fee: "0",
          valid_until_block: 0,
          attributes: [],
          cosigners: [],
          script: "QRI+f+g=",
          witnesses: [
            {
              invocation: "",
              verification: "EQ==",
            },
          ],
        },
      ],
    },
    REFERENCE_BLOCK_HEADER
  );

  describe("getBlock", () => {
    test("height as index, verbose = 0", async () => {
      const result = await client.getBlock(0);
      expect(result).toBeDefined();
    });

    test("height as index, verbose = true", async () => {
      const result = await client.getBlock(0, true);
      expect(Object.keys(result).sort()).toEqual(
        [
          "hash",
          "size",
          "version",
          "previousblockhash",
          "merkleroot",
          "time",
          "index",
          "nextconsensus",
          "witnesses",
          "consensus_data",
          "tx",
          "confirmations",
          "nextblockhash",
        ].sort()
      );
    });

    test("hash as index, verbose = 1", async () => {
      const reference = await client.getBlock(0, 1);
      const result = await client.getBlock(reference.hash, 1);
      expect(result.hash).toEqual(reference.hash);
    });
  });

  test("getBlockHash", async () => {
    const result = await client.getBlockHash(1);
    expect(typeof result).toBe("string");
  });

  test("getBestBlockHash", async () => {
    const result = await client.getBestBlockHash();
    expect(typeof result).toBe("string");
  });

  test("getBlockCount", async () => {
    const result = await client.getBlockCount();
    expect(typeof result).toBe("number");
  });

  describe("getBlockHeader", () => {
    test("height as index, verbose = 0", async () => {
      const result = await client.getBlockHeader(0);
      expect(result).toBe(
        "00000000000000000000000000000000000000000000000000000000000000000000000042f5f271197611e4abafd359cec7094203878ebcd1856ab2288a0ce27daeea9788ea19ef550100000000000042218a992bdd8b981607766347e1ae195c3959cd0100011100"
      );
    });

    test("hash as index, verbose = 1", async () => {
      const result = await client.getBlock(
        "0x95380d2d8601a0e0d97fbe95c43cbc07e1d9ba6473ea5ddc39b8c381f3e3ae85",
        1
      );
      expect(result).toMatchObject(REFERENCE_BLOCK_HEADER);
    });
  });

  test("getConnectionCount", async () => {
    const result = await client.getConnectionCount();
    expect(typeof result).toBe("number");
  });

  // TODO: Find a contract on neo3
  test.skip("getContractState", async () => {
    const result = await client.getContractState(contractHash);
    expect(Object.keys(result)).toEqual([
      "groups",
      "hasStorage",
      "payable",
      "abi",
      "permissions",
      "trusts",
      "safeMethods",
    ]);
  });

  test("getPeers", async () => {
    const result = await client.getPeers();
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["unconnected", "connected", "bad"])
    );
  });

  describe("getRawMemPool", () => {
    test("get comfirmed only", async () => {
      const result = await client.getRawMemPool();
      expect(Array.isArray(result)).toBeTruthy();
    });

    test("get comfirmed and unconfirmed", async () => {
      const result = await client.getRawMemPool(true);
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["height", "verified", "unverified"])
      );
    });
  });

  describe("getRawTransaction", () => {
    test("verbose", async () => {
      const REFERENCE_TX = Object.assign(
        {
          blockhash:
            "0x95380d2d8601a0e0d97fbe95c43cbc07e1d9ba6473ea5ddc39b8c381f3e3ae85",
          // do not match confirmations
          blocktime: 1468595301000,
          vm_state: "HALT",
        },
        REFERENCE_BLOCK.tx[0]
      );
      const result = await client.getRawTransaction(
        "1e16f97be7fe8e9e2136dfdea37207fc27d2bc42661dd1feb6f37381233c44ad",
        1
      );

      expect(result).toMatchObject(REFERENCE_TX);
    });

    test("non-verbose", async () => {
      const result = await client.getRawTransaction(
        "1e16f97be7fe8e9e2136dfdea37207fc27d2bc42661dd1feb6f37381233c44ad"
      );
      expect(result).toBe(
        "0000000000ca61e52e881d41374e640f819cd118cc153b21a7000000000000000000000000000000000000000000000541123e7fe801000111"
      );
    });
  });

  // TODO: Find a contract on neo3
  test.skip("getStorage", async () => {
    const result = await client.getStorage(
      contractHash,
      "9847e26135152874355e324afd5cc99f002acb33"
    );

    expect(typeof result).toBe("string");
  });

  test("getTransactionHeight", async () => {
    const result = await client.getTransactionHeight(
      "1e16f97be7fe8e9e2136dfdea37207fc27d2bc42661dd1feb6f37381233c44ad"
    );
    expect(result).toBe(0);
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
    expect(result).toMatch(/\d+\.\d+\.\d+-?.*/);
  });

  test("listPlugins", async () => {
    const result = await client.listPlugins();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((element) => {
      expect(element).toMatchObject({
        name: expect.any(String),
        version: expect.any(String),
        interfaces: expect.any(Array),
      });
    });
  });

  describe.skip("Invocation methods", () => {
    test("invokeFunction", async () => {
      const result = await client.invokeFunction(contractHash, "name");

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["script", "state", "gas_consumed", "stack"])
      );
      expect(result.state).toContain("HALT");
      expect(result.stack[0].value).toEqual("474153");
    });

    test("invokeScript", async () => {
      const result = await client.invokeScript(
        "14c7e4fce7f40b9616bd1884a9b85d33e4f617c3de51c10962616c616e63654f66142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
      );
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["script", "state", "gas_consumed", "stack"])
      );
      expect(result.state).toContain("HALT");
    });
  });

  test.skip("sendRawTransaction", async () => {
    const account = new Account(privateKey);
    const addressInHash160 = ContractParam.hash160(account.address);
    const script = createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "transfer",
      args: [addressInHash160, addressInHash160, 1],
    });

    const currentHeight = await client.getBlockCount();
    const transaction = new Transaction({
      sender: reverseHex(account.scriptHash),
      cosigners: [
        {
          account: reverseHex(account.scriptHash),
          scopes: WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + Transaction.MAX_TRANSACTION_LIFESPAN - 1,
      systemFee: 1,
      networkFee: 1,
      script: script,
    }).sign(account);
    const result = await client.sendRawTransaction(transaction.serialize(true));
    expect(typeof result).toBe(String);
  }, 10000);

  test.skip("submitBlock", () => {
    const alreadyExistedBlock =
      "000000003d8ee950672593017c40d8469571e3b1ad97a78dbaf3b1f41d3601f7a7f4d65f6f91255ed97c70a24d0a0cd2e23fc73c127f7b3fbe93b5efb973a54acb3f4091aa48063a6d010000640000003991af1bc2546596d3e129df102e2ac011d2ab5901fd4501405b10d7050286170b716e2c167b7cdf6b04a9985f20d5d5848617e27f4cb7a0ab1b93c85f4561f3aa6bbd5d1da15ceb1f1670a840239bbfa1acb598507834d0c040a38b8ad2d1e314e0f517947b3d9a7a9fa3a76a76c7c4846de75bddcb034ccd071ad9af2c581c2521acbe5ddab4bf1c04285819c16cfe5fba9d64d141571e6055400c56c276e4bed164781beb75f20d42e3744e0ae30125581da2cea1215655fadeacafb56c66b3f9c36b22ac25cc222d20e4a435608d801b7a7feac232c6520a2c40ce923ee4aff98a21e8640b56cb7c989a1568cecb2813b1ec8e13bb9b16e8f4fd4a9f53520c58d17f2dfc95efca4ab3158696e6b9fc4e4a79e4e9286cb338b9214021ae5c51c119e8b65fb5d78640b1161d722634b1dcee89f6252c88d393e9115fbfc3a0d52d2acd233d8de407b1840ae2462e6c0001a9da0babc56c37e04fc3bdf5552103009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a221030205e9cefaea5a1dfc580af20c8d5aa2468bb0148f1a5e4605fc622c80e604ba210214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff0121023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d2103408dcd416396f64783ac587ea1e1593c57d9fea880c8a6a1920e92a2594778062102a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b2102ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd5768c7c34cba0102416f54b693afc926";

    expect(client.submitBlock(alreadyExistedBlock)).rejects.toThrow();
  }, 10000);

  describe("validateAddress", () => {
    test("valid", async () => {
      const result = await client.validateAddress(address);
      expect(result).toBe(true);
    });

    test("invalid", async () => {
      const result = await client.validateAddress("wrongaddress");
      expect(result).toBe(false);
    });
  });
});
