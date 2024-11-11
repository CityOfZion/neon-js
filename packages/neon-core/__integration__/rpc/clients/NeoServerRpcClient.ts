import { rpc, sc, tx, u, CONST, wallet } from "../../../src";
import * as TestHelpers from "../../../../../testHelpers";
import testWalletJson from "../../../__tests__/testWallet.json";
import { HexString } from "../../../src/u";
import { StackItemInteropInterfaceJson } from "../../../src/sc";

const testWallet = new wallet.Wallet(
  testWalletJson as unknown as wallet.WalletJSON
);

let client: rpc.NeoServerRpcClient;
const address = testWallet.accounts[0].address;

// NEO contract hash. Should be same across TestNet or LocalNet.
const contractHash = CONST.NATIVE_CONTRACT_HASH.NeoToken;
let txid: string;
let blockhash: string;
let blockHeight: number;

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.NeoServerRpcClient(url);

  let height = 0;
  while (!txid) {
    const block = await client.getBlock(height, true);
    if (block.tx.length !== 0 && block.tx[0].hash) {
      txid = block.tx[0].hash;
      blockhash = block.hash;
      blockHeight = height;
      return;
    }

    height++;
  }
}, 20000);

describe("NeoServerRpcClient", () => {
  test("calculateNetworkFee", async () => {
    const acct = new wallet.Account();
    const testTx = new tx.Transaction();
    // Requires non-zero script
    testTx.script = HexString.fromHex("1234");
    // We also need a signer and empty witness.
    testTx.addSigner(new tx.Signer({ account: acct.scriptHash }));
    testTx.addWitness(
      new tx.Witness({
        invocationScript: "",
        verificationScript: HexString.fromBase64(
          acct.contract.script
        ).toString(),
      })
    );

    const result = await client.calculateNetworkFee(testTx);

    expect(parseInt(result)).toBeGreaterThan(0);
  });

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
          "primary",
          "merkleroot",
          "nonce",
          "time",
          "index",
          "nextconsensus",
          "witnesses",
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
      expect(Object.keys(result).sort()).toEqual(
        [
          "confirmations",
          "hash",
          "index",
          "merkleroot",
          "nextblockhash",
          "nextconsensus",
          "nonce",
          "previousblockhash",
          "primary",
          "time",
          "size",
          "witnesses",
          "version",
        ].sort()
      );
    });
  });

  test("getCommittee", async () => {
    const result = await client.getCommittee();

    // expect at least 1 public key
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].length).toBe(66);
  });

  test("getConnectionCount", async () => {
    const result = await client.getConnectionCount();
    expect(typeof result).toBe("number");
  });

  test("getContractState", async () => {
    const result = await client.getContractState(contractHash);
    expect(Object.keys(result)).toHaveLength(5);
    expect(result).toMatchObject({
      id: expect.any(Number),
      updatecounter: expect.any(Number),
      hash: expect.any(String),
      nef: expect.any(Object),
      manifest: expect.any(Object),
    });
  });

  test("getNativeContracts", async () => {
    const result = await client.getNativeContracts();
    expect(result.length).toBeGreaterThanOrEqual(9);

    // We briefly check for the token contracts as a smoke test.
    const contractNames = result.map((r) => r.manifest.name);
    expect(contractNames).toContain("NeoToken");
    expect(contractNames).toContain("GasToken");

    expect(result[0]).toMatchObject({
      id: expect.any(Number),
      hash: expect.any(String),
      nef: expect.any(Object),
      manifest: expect.any(Object),
      updatehistory: expect.any(Array),
    });
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

    test("non-verbose", async () => {
      const result = await client.getRawTransaction(txid);
      expect(typeof result).toBe("string");

      const hexstring = HexString.fromBase64(result).toBigEndian();
      const deserializedTx = tx.Transaction.deserialize(hexstring);
      expect(deserializedTx).toBeDefined();
    });
  });

  test("getStorage", async () => {
    const result = await client.getStorage(contractHash, "0b");

    // This storage is totalSupply of NEO. Should be safe and static for usage.
    expect(result).toBe("AOH1BQ==");
  });

  describe.only("findStorage", () => {
    test("find NEOs totalSupply storage", async () => {
      const findTotalSupplyPrefixResult = await client.findStorage(
        contractHash,
        "0b",
        0
      );

      const findTotalSupplyPrefixWithDefaultArgResult =
        await client.findStorage(contractHash, "0b");

      // This find will only get the totalSupply of NEO. Should be safe and static for usage.
      expect(findTotalSupplyPrefixResult.truncated).toBe(false);
      expect(findTotalSupplyPrefixResult.next).toBe(1);
      expect(findTotalSupplyPrefixResult.results.length).toBe(1);
      expect(findTotalSupplyPrefixResult.results[0].key).toBe("Cw==");
      expect(findTotalSupplyPrefixResult.results[0].value).toBe("AOH1BQ==");

      expect(findTotalSupplyPrefixWithDefaultArgResult).toEqual(
        findTotalSupplyPrefixResult
      );
    });

    test("find NEOs balance storage", async () => {
      // This find will only get a list of accounts on NEOs storage. Will only be used to check the truncated and next values.
      const findAccountPrefix0Result = await client.findStorage(
        contractHash,
        "14",
        0
      );
      expect(findAccountPrefix0Result.truncated).toBe(false);
      expect(findAccountPrefix0Result.next).toBeLessThan(50);
      expect(findAccountPrefix0Result.results.length).toBeLessThan(50);

      // There isn't 50 or more accounts with NEO on this blockchain instance.
      const findAccountPrefix50Result = await client.findStorage(
        contractHash,
        "14",
        50
      );
      expect(findAccountPrefix50Result.truncated).toBe(false);
      expect(findAccountPrefix50Result.next).toBe(50);
      expect(findAccountPrefix50Result.results.length).toBe(0);
    });
  });

  test("getTransactionHeight", async () => {
    const result = await client.getTransactionHeight(txid);
    expect(result).toBe(blockHeight);
  });

  test("getNextBlockValidators", async () => {
    const result = await client.getNextBlockValidators();
    result.map((v) => {
      expect(Object.keys(v)).toHaveLength(2);
      expect(v).toMatchObject({
        publickey: expect.any(String),
        votes: expect.any(Number),
      });

      expect(parseInt(v.votes)).toBeDefined();
    });
  });

  test("getVersion", async () => {
    const result = await client.getVersion();

    expect(Object.keys(result)).toHaveLength(5);
    expect(result).toMatchObject({
      tcpport: expect.any(Number),
      wsport: expect.any(Number),
      nonce: expect.any(Number),
      useragent: expect.any(String),
      protocol: expect.objectContaining({
        addressversion: expect.any(Number),
        network: expect.any(Number),
        validatorscount: expect.any(Number),
        msperblock: expect.any(Number),
        maxtraceableblocks: expect.any(Number),
        maxvaliduntilblockincrement: expect.any(Number),
        maxtransactionsperblock: expect.any(Number),
        memorypoolmaxtransactions: expect.any(Number),
        initialgasdistribution: expect.any(Number),
      }),
    });
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

  describe("Invocation methods", () => {
    // Currently there are no contracts with verify that we can make use of.
    test.skip("invokeContractVerify", async () => {
      const result = await client.invokeContractVerify(contractHash, []);

      expect(result).toMatchObject({
        script: expect.any(String),
        state: "HALT",
        gasconsumed: expect.any(String),
        exception: null,
        stack: expect.any(Array),
      });
    });
    test("invokeFunction with HALT", async () => {
      const result = await client.invokeFunction(contractHash, "symbol");

      expect(result).toMatchObject({
        script: expect.any(String),
        state: "HALT",
        gasconsumed: expect.any(String),
        exception: null,
        stack: expect.any(Array),
      });
    });

    test("invokeFunction with FAULT", async () => {
      const result = await client.invokeFunction(contractHash, "fail");

      expect(result).toMatchObject({
        script: expect.any(String),
        state: "FAULT",
        gasconsumed: expect.any(String),
        exception: expect.any(String),
        stack: expect.any(Array),
      });
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
          sc.ContractParam.any(),
        ],
        [
          new tx.Signer({
            account: fromAccount.scriptHash,
            scopes: tx.WitnessScope.CalledByEntry,
          }),
        ]
      );

      expect(result).toMatchObject({
        script: expect.any(String),
        state: "HALT",
        gasconsumed: expect.any(String),
        exception: null,
        stack: expect.any(Array),
      });
    });

    test("invokeScript", async () => {
      const result = await client.invokeScript(
        HexString.fromHex(
          new sc.ScriptBuilder().emitAppCall(contractHash, "symbol").build()
        )
      );

      expect(result).toMatchObject({
        script: expect.any(String),
        state: "HALT",
        gasconsumed: expect.any(String),
        exception: null,
        stack: expect.any(Array),
      });

      expect(result.state).toContain("HALT");
      expect(result.stack.length).toEqual(1);
      expect(result.stack[0].value).toEqual(
        u.HexString.fromAscii("NEO").toBase64()
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
          sc.ContractParam.any(),
        ],
      });

      const result = await client.invokeScript(HexString.fromHex(script), [
        new tx.Signer({
          account: fromAccount.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        }),
      ]);

      expect(result).toMatchObject({
        script: expect.any(String),
        state: "HALT",
        gasconsumed: expect.any(String),
        exception: null,
        stack: expect.any(Array),
      });
    });
  });

  test("sendRawTransaction", async () => {
    await testWallet.decrypt(0, "wallet");

    const fromAccount = testWallet.accounts[0];
    const toAccount = testWallet.accounts[1];
    const script = sc.createScript({
      scriptHash: contractHash,
      operation: "transfer",
      args: [
        sc.ContractParam.hash160(fromAccount.address),
        sc.ContractParam.hash160(toAccount.address),
        sc.ContractParam.integer(1),
        sc.ContractParam.any(),
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
      validUntilBlock: currentHeight + 1000,
      systemFee: "100000000",
      networkFee: "100000000",
      script: script,
    }).sign(fromAccount, 1234567890);
    const result = await client.sendRawTransaction(
      HexString.fromHex(transaction.serialize(true))
    );
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
      "NR4SHeS9kfgN5EXVcAuFwfu6Y56xaSPxg9"
    );

    expect(parseInt(result)).toBeGreaterThan(0);
  });

  test.only("traverseIterator", async () => {
    const newClient = new rpc.NeoServerRpcClient(
      "https://testnet1.neo.coz.io:443"
    );

    const { session, stack } =
      await newClient.invokeFunction<StackItemInteropInterfaceJson>(
        CONST.NATIVE_CONTRACT_HASH.NeoToken,
        "getAllCandidates",
        []
      );

    expect(session).toEqual(expect.any(String));
    expect(stack[0]).toEqual({
      type: "InteropInterface",
      interface: "IIterator",
      id: expect.any(String),
    });

    const sessionid = session as string;

    const iteratorId = stack[0].id;

    const result = await newClient.traverseIterator(sessionid, iteratorId, 10);

    expect(result).toContainEqual({
      type: expect.any(String),
      value: expect.arrayContaining([
        {
          type: expect.any(String),
          value: expect.any(String),
        },
        {
          type: expect.any(String),
          value: expect.any(String),
        },
      ]),
    });
  });
});
