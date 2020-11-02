import { rpc, sc, tx, u, CONST, wallet } from "../../../src";
import * as TestHelpers from "../../../../../testHelpers";
import testWalletJson from "../../../__tests__/testWallet.json";

const testWallet = new wallet.Wallet(testWalletJson);

let client: rpc.NeoServerRpcClient;
const address = testWallet.accounts[0].address;

// NEO contract hash. Should be same across TestNet or LocalNet.
const contractHash = CONST.ASSET_ID["NEO"];
let txid: string;
let blockhash: string;

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.NeoServerRpcClient(url);
  const firstBlock = await client.getBlock(0, true);
  expect(firstBlock.tx.length).toBe(1);
  blockhash = firstBlock.hash;
  txid = firstBlock.tx[0].hash;
}, 20000);

describe("NeoServerRpcClient", () => {
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
          "consensusdata",
          "tx",
          "confirmations",
          "nextblockhash",
        ].sort()
      );
    });

    test("hash as index, verbose = 1", async () => {
      const result = await client.getBlock(blockhash, 1);
      expect(result.hash).toEqual(blockhash);
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
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    test("hash as index, verbose = 1", async () => {
      const result = await client.getBlockHeader(blockhash, 1);
      expect(result.hash).toBe(blockhash);
      expect(Object.keys(result)).toEqual([
        "hash",
        "size",
        "version",
        "previousblockhash",
        "merkleroot",
        "time",
        "index",
        "nextconsensus",
        "witnesses",
        "confirmations",
        "nextblockhash",
      ]);
    });
  });

  test("getConnectionCount", async () => {
    const result = await client.getConnectionCount();
    expect(typeof result).toBe("number");
  });

  test("getContractState", async () => {
    const result = await client.getContractState(contractHash);
    expect(result).toBeInstanceOf(sc.ContractManifest);
  });

  test("getPeers", async () => {
    const result = await client.getPeers();
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["unconnected", "connected", "bad"])
    );
  });

  describe("getRawMemPool", () => {
    test("get confirmed only", async () => {
      const result = await client.getRawMemPool();
      expect(Array.isArray(result)).toBeTruthy();
    });

    test("get confirmed and unconfirmed", async () => {
      const result = await client.getRawMemPool(true);
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["height", "verified", "unverified"])
      );
    });
  });

  describe("getRawTransaction", () => {
    test("verbose", async () => {
      const result = await client.getRawTransaction(txid, 1);
      expect(result).toBeDefined();
      const resultTx = tx.Transaction.fromJson(result);
      expect(resultTx).toBeDefined();
    });

    //TODO: Update to receive base64 string
    test.skip("non-verbose", async () => {
      const result = await client.getRawTransaction(txid);
      expect(typeof result).toBe("string");

      const deserializedTx = tx.Transaction.deserialize(result);
      expect(deserializedTx).toBeDefined();
    });
  });

  test("getStorage", async () => {
    const result = await client.getStorage(contractHash, "0b");

    // This storage is totalSupply of NEO. Should be safe and static for usage.
    expect(result).toBe("00e1f505");
  });

  test("getTransactionHeight", async () => {
    const result = await client.getTransactionHeight(txid);
    expect(result).toBe(0);
  });

  //TODO: Update to getNextBlockValidators
  test.skip("getValidators", async () => {
    const result = await client.getValidators();
    result.map((v) =>
      expect(v).toMatchObject({
        publickey: expect.any(String),
        active: expect.any(Boolean),
        votes: expect.any(String),
      })
    );
  });

  // TODO: Add new field magic
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

  //TODO: Add new field: exception
  // TODO: Update script to receive base64 string
  describe("Invocation methods", () => {
    test("invokeFunction", async () => {
      const result = await client.invokeFunction(contractHash, "name");

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          "script",
          "state",
          "gasconsumed",
          "stack",
          "tx",
        ])
      );
      expect(result.state).toContain("HALT");
    });

    test("invokeFunction with signers", async () => {
      const fromAccount = testWallet.accounts[0];
      const toAccount = testWallet.accounts[1];
      const result = await client.invokeFunction(
        contractHash,
        "transfer",
        [
          sc.ContractParam.hash160(fromAccount.address),
          sc.ContractParam.hash160(toAccount.address),
          sc.ContractParam.integer(1),
        ],
        [
          new tx.Signer({
            account: fromAccount.scriptHash,
            scopes: tx.WitnessScope.CalledByEntry,
          }),
        ]
      );

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          "script",
          "state",
          "gasconsumed",
          "stack",
          "tx",
        ])
      );
      expect(result.state).toContain("HALT");
    });

    test("invokeScript", async () => {
      const result = await client.invokeScript(
        new sc.ScriptBuilder()
          .emitAppCall(contractHash, "name")
          .emitAppCall(contractHash, "symbol")
          .build()
      );
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          "script",
          "state",
          "gasconsumed",
          "stack",
          "tx",
        ])
      );
      expect(result.state).toContain("HALT");
      expect(result.stack.length).toEqual(2);
      expect(result.stack[0].value).toEqual(
        u.HexString.fromAscii("NEO").toBase64()
      );
      expect(result.stack[1].value).toEqual(
        u.HexString.fromAscii("neo").toBase64()
      );
    });

    test("invokeScript with signers", async () => {
      const fromAccount = testWallet.accounts[0];
      const toAccount = testWallet.accounts[1];
      const script = sc.createScript({
        scriptHash: contractHash,
        operation: "transfer",
        args: [
          sc.ContractParam.hash160(fromAccount.address),
          sc.ContractParam.hash160(toAccount.address),
          sc.ContractParam.integer(1),
        ],
      });

      const result = await client.invokeScript(script, [
        new tx.Signer({
          account: fromAccount.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        }),
      ]);

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          "script",
          "state",
          "gasconsumed",
          "stack",
          "tx",
        ])
      );
      expect(result.state).toContain("HALT");
    });
  });

  test("sendRawTransaction", async () => {
    await testWallet.decrypt(0, "wallet");

    const fromAccount = testWallet.accounts[0];
    const toAccount = testWallet.accounts[1];
    const script = sc.createScript({
      scriptHash: "9bde8f209c88dd0e7ca3bf0af0f476cdd8207789",
      operation: "transfer",
      args: [
        sc.ContractParam.hash160(fromAccount.address),
        sc.ContractParam.hash160(toAccount.address),
        sc.ContractParam.integer(1),
      ],
    });

    const currentHeight = await client.getBlockCount();
    const transaction = new tx.Transaction({
      signers: [
        {
          account: fromAccount.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + 1000000,
      systemFee: 1,
      networkFee: 1,
      script: script,
    }).sign(fromAccount, 1234567890);
    const result = await client.sendRawTransaction(transaction.serialize(true));
    expect(typeof result).toBe("string");
  }, 20000);

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

  test("getUnclaimedGas", async () => {
    const result = await client.getUnclaimedGas(
      "NZCbeSDnadGsacF69zVvfaB4zDKMioMHJV"
    );
    expect(result).toBeGreaterThan(0);
  });
});
