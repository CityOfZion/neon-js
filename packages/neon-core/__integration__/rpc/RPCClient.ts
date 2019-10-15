import { rpc, CONST } from "../../src/index";
import { ContractParam, createScript } from "../../src/sc";
import { Transaction, WitnessScope } from "../../src/tx";
import { Account } from "../../src/wallet";
import { reverseHex } from "../../src/u";

const TESTNET_URLS = [
  "http://seed2t.neo.org:20332",
  "http://seed3t.neo.org:20332",
  "http://seed4t.neo.org:20332",
  "http://seed5t.neo.org:20332",
  "http://seed1t.neo.org:20332"
];

let client: rpc.RPCClient;
const address = "AZzpS2oDPRtPwFp6C9ric98KCXGZiic6RV";
const privateKey =
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69";
const contractHash = "a1760976db5fcdfab2a9930e8f6ce875b2d18225";

beforeAll(async () => {
  for (let i = 0; i < TESTNET_URLS.length; i++) {
    try {
      await rpc.Query.getBlockCount().execute(TESTNET_URLS[i]);
      client = new rpc.RPCClient(TESTNET_URLS[i]);
      break;
    } catch (e) {
      if (i === TESTNET_URLS.length - 1) {
        throw new Error("Exhausted all urls but found no available RPC");
      }
      continue;
    }
  }
});

describe("RPC Methods", () => {
  describe("getBlock", () => {
    const the100thBlockHash =
      "000000003d8ee950672593017c40d8469571e3b1ad97a78dbaf3b1f41d3601f7a7f4d65f6f91255ed97c70a24d0a0cd2e23fc73c127f7b3fbe93b5efb973a54acb3f4091aa48063a6d010000640000003991af1bc2546596d3e129df102e2ac011d2ab5901fd4501405b10d7050286170b716e2c167b7cdf6b04a9985f20d5d5848617e27f4cb7a0ab1b93c85f4561f3aa6bbd5d1da15ceb1f1670a840239bbfa1acb598507834d0c040a38b8ad2d1e314e0f517947b3d9a7a9fa3a76a76c7c4846de75bddcb034ccd071ad9af2c581c2521acbe5ddab4bf1c04285819c16cfe5fba9d64d141571e6055400c56c276e4bed164781beb75f20d42e3744e0ae30125581da2cea1215655fadeacafb56c66b3f9c36b22ac25cc222d20e4a435608d801b7a7feac232c6520a2c40ce923ee4aff98a21e8640b56cb7c989a1568cecb2813b1ec8e13bb9b16e8f4fd4a9f53520c58d17f2dfc95efca4ab3158696e6b9fc4e4a79e4e9286cb338b9214021ae5c51c119e8b65fb5d78640b1161d722634b1dcee89f6252c88d393e9115fbfc3a0d52d2acd233d8de407b1840ae2462e6c0001a9da0babc56c37e04fc3bdf5552103009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a221030205e9cefaea5a1dfc580af20c8d5aa2468bb0148f1a5e4605fc622c80e604ba210214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff0121023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d2103408dcd416396f64783ac587ea1e1593c57d9fea880c8a6a1920e92a2594778062102a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b2102ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd5768c7c34cba0102416f54b693afc926";
    const the100thBlockJson = {
      confirmations: 0,
      consensus_data: { nonce: "26c9af93b6546f41", primary: 2 },
      hash:
        "0x47383336f5bf76e4eb621484a58c4d2de064b28bc197000a7218177c77d4d1c8",
      index: 100,
      merkleroot:
        "0x91403fcb4aa573b9efb593be3f7b7f123cc73fe2d20c0a4da2707cd95e25916f",
      nextblockhash:
        "0x890627674a48c530f53ddb20ff4a4552c18f0d2ac45f9dec72fa44abd1fe07ba",
      nextconsensus: "AM2GgjcwzHDGGJP3FuizmmvEEL9re9V43M",
      previousblockhash:
        "0x5fd6f4a7f701361df4b1f3ba8da797adb1e3719546d8407c0193256750e98e3d",
      size: 685,
      time: 1568636553386,
      tx: [],
      version: 0,
      witnesses: [
        {
          invocation:
            "405b10d7050286170b716e2c167b7cdf6b04a9985f20d5d5848617e27f4cb7a0ab1b93c85f4561f3aa6bbd5d1da15ceb1f1670a840239bbfa1acb598507834d0c040a38b8ad2d1e314e0f517947b3d9a7a9fa3a76a76c7c4846de75bddcb034ccd071ad9af2c581c2521acbe5ddab4bf1c04285819c16cfe5fba9d64d141571e6055400c56c276e4bed164781beb75f20d42e3744e0ae30125581da2cea1215655fadeacafb56c66b3f9c36b22ac25cc222d20e4a435608d801b7a7feac232c6520a2c40ce923ee4aff98a21e8640b56cb7c989a1568cecb2813b1ec8e13bb9b16e8f4fd4a9f53520c58d17f2dfc95efca4ab3158696e6b9fc4e4a79e4e9286cb338b9214021ae5c51c119e8b65fb5d78640b1161d722634b1dcee89f6252c88d393e9115fbfc3a0d52d2acd233d8de407b1840ae2462e6c0001a9da0babc56c37e04fc3bd",
          verification:
            "552103009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a221030205e9cefaea5a1dfc580af20c8d5aa2468bb0148f1a5e4605fc622c80e604ba210214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff0121023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d2103408dcd416396f64783ac587ea1e1593c57d9fea880c8a6a1920e92a2594778062102a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b2102ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd5768c7c34cba"
        }
      ]
    };
    test("height as index, verbose = 0", async () => {
      const result = await client.getBlock(100);
      expect(result).toBe(the100thBlockHash);
    });

    test("hash as index, verbose = 1", async () => {
      const result = await client.getBlock(
        "47383336f5bf76e4eb621484a58c4d2de064b28bc197000a7218177c77d4d1c8",
        1
      );
      expect(result.consensus_data).toStrictEqual(
        the100thBlockJson.consensus_data
      );
    });
  });

  test("getBlockHash", async () => {
    const result = await client.getBlockHash(1);
    expect(typeof result === "string").toBeTruthy();
  });

  test("getBestBlockHash", async () => {
    const result = await client.getBestBlockHash();
    expect(result).toBeDefined();
  });

  test("getBlockCount", async () => {
    const result = await client.getBlockCount();
    expect(typeof result === "number").toBeTruthy();
  });

  describe("getBlockHeader", () => {
    const the100thBlockHeaderHash =
      "000000003d8ee950672593017c40d8469571e3b1ad97a78dbaf3b1f41d3601f7a7f4d65f6f91255ed97c70a24d0a0cd2e23fc73c127f7b3fbe93b5efb973a54acb3f4091aa48063a6d010000640000003991af1bc2546596d3e129df102e2ac011d2ab5901fd4501405b10d7050286170b716e2c167b7cdf6b04a9985f20d5d5848617e27f4cb7a0ab1b93c85f4561f3aa6bbd5d1da15ceb1f1670a840239bbfa1acb598507834d0c040a38b8ad2d1e314e0f517947b3d9a7a9fa3a76a76c7c4846de75bddcb034ccd071ad9af2c581c2521acbe5ddab4bf1c04285819c16cfe5fba9d64d141571e6055400c56c276e4bed164781beb75f20d42e3744e0ae30125581da2cea1215655fadeacafb56c66b3f9c36b22ac25cc222d20e4a435608d801b7a7feac232c6520a2c40ce923ee4aff98a21e8640b56cb7c989a1568cecb2813b1ec8e13bb9b16e8f4fd4a9f53520c58d17f2dfc95efca4ab3158696e6b9fc4e4a79e4e9286cb338b9214021ae5c51c119e8b65fb5d78640b1161d722634b1dcee89f6252c88d393e9115fbfc3a0d52d2acd233d8de407b1840ae2462e6c0001a9da0babc56c37e04fc3bdf5552103009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a221030205e9cefaea5a1dfc580af20c8d5aa2468bb0148f1a5e4605fc622c80e604ba210214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff0121023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d2103408dcd416396f64783ac587ea1e1593c57d9fea880c8a6a1920e92a2594778062102a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b2102ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd5768c7c34cba00";
    const the100thBlockHeaderJson = {
      confirmations: 0,
      hash:
        "0x47383336f5bf76e4eb621484a58c4d2de064b28bc197000a7218177c77d4d1c8",
      index: 100,
      merkleroot:
        "0x91403fcb4aa573b9efb593be3f7b7f123cc73fe2d20c0a4da2707cd95e25916f",
      nextblockhash:
        "0x890627674a48c530f53ddb20ff4a4552c18f0d2ac45f9dec72fa44abd1fe07ba",
      nextconsensus: "AM2GgjcwzHDGGJP3FuizmmvEEL9re9V43M",
      previousblockhash:
        "0x5fd6f4a7f701361df4b1f3ba8da797adb1e3719546d8407c0193256750e98e3d",
      size: 685,
      time: 1568636553386,
      version: 0,
      witnesses: [
        {
          invocation:
            "405b10d7050286170b716e2c167b7cdf6b04a9985f20d5d5848617e27f4cb7a0ab1b93c85f4561f3aa6bbd5d1da15ceb1f1670a840239bbfa1acb598507834d0c040a38b8ad2d1e314e0f517947b3d9a7a9fa3a76a76c7c4846de75bddcb034ccd071ad9af2c581c2521acbe5ddab4bf1c04285819c16cfe5fba9d64d141571e6055400c56c276e4bed164781beb75f20d42e3744e0ae30125581da2cea1215655fadeacafb56c66b3f9c36b22ac25cc222d20e4a435608d801b7a7feac232c6520a2c40ce923ee4aff98a21e8640b56cb7c989a1568cecb2813b1ec8e13bb9b16e8f4fd4a9f53520c58d17f2dfc95efca4ab3158696e6b9fc4e4a79e4e9286cb338b9214021ae5c51c119e8b65fb5d78640b1161d722634b1dcee89f6252c88d393e9115fbfc3a0d52d2acd233d8de407b1840ae2462e6c0001a9da0babc56c37e04fc3bd",
          verification:
            "552103009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a221030205e9cefaea5a1dfc580af20c8d5aa2468bb0148f1a5e4605fc622c80e604ba210214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff0121023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d2103408dcd416396f64783ac587ea1e1593c57d9fea880c8a6a1920e92a2594778062102a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b2102ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd5768c7c34cba"
        }
      ]
    };
    test("height as index, verbose = 0", async () => {
      const result = await client.getBlockHeader(100);
      expect(result).toBe(the100thBlockHeaderHash);
    });

    test("hash as index, verbose = 1", async () => {
      const result = await client.getBlock(
        "47383336f5bf76e4eb621484a58c4d2de064b28bc197000a7218177c77d4d1c8",
        1
      );
      expect(result.merkleroot).toStrictEqual(
        the100thBlockHeaderJson.merkleroot
      );
    });
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
    expect(Object.keys(result)).toEqual(["hash", "script", "manifest"]);
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
      const result = await client.getRawMemPool(1);
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(["height", "verified", "unverified"])
      );
    });
  });

  describe("getRawTransaction", () => {
    test("verbose", async () => {
      const result = await client.getRawTransaction(
        "7d6f49c21623c25817b4ca5b14ecc79284d75e14b65b8415d01fa439c48ba064",
        1
      );
      expect(result.nonce).toEqual(242735824);
    });

    test("non-verbose", async () => {
      const result = await client.getRawTransaction(
        "7d6f49c21623c25817b4ca5b14ecc79284d75e14b65b8415d01fa439c48ba064"
      );
      expect(result).toBe(
        "00d0da770ec7e4fce7f40b9616bd1884a9b85d33e4f617c3de00e1f5050000000000e1f50500000000244a20000001c7e4fce7f40b9616bd1884a9b85d33e4f617c3de01505114c7e4fce7f40b9616bd1884a9b85d33e4f617c3de14c7e4fce7f40b9616bd1884a9b85d33e4f617c3de53c1087472616e736665721415caa04214310670d5e5a398e147e0dbed98cf4368627d5b5201414030f17ca4b22d50bb6b7f4398466d2f700eb24e5a9d762acc7a5091a0ab774f311af28b81d3488431dffe91bb5ab89cfdadcf9a75028a66e54cb8eb77c7db03cb2721031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c968747476aa"
      );
    });
  });

  test.skip("getStorage", async () => {
    const result = await client.getStorage(
      contractHash,
      "9847e26135152874355e324afd5cc99f002acb33"
    );

    expect(typeof result === "string").toBeTruthy();
  });

  test("getTransactionHeight", async () => {
    const result = await client.getTransactionHeight(
      "7d6f49c21623c25817b4ca5b14ecc79284d75e14b65b8415d01fa439c48ba064"
    );
    expect(result).toBe(13733);
  });

  test("getValidators", async () => {
    const result = await client.getValidators();
    result.map(v =>
      expect(v).toMatchObject({
        publickey: expect.any(String),
        active: expect.any(Boolean),
        votes: expect.any(String)
      })
    );
  });

  test("getVersion", async () => {
    const result = await client.getVersion();
    expect(result).toMatch(/\d+\.\d+\.\d+/);
  });

  test("listPlugins", async () => {
    const result = await client.listPlugins();
    expect(result.length).toBeGreaterThan(0);
  });

  describe("Invocation methods", () => {
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

  test("sendRawTransaction", async () => {
    const account = new Account(privateKey);
    const addressInHash160 = ContractParam.hash160(account.address);
    const script = createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "transfer",
      args: [addressInHash160, addressInHash160, 1]
    });

    const currentHeight = await client.getBlockCount();
    const transaction = new Transaction({
      sender: reverseHex(account.scriptHash),
      cosigners: [
        {
          account: reverseHex(account.scriptHash),
          scopes: WitnessScope.CalledByEntry
        }
      ],
      validUntilBlock: currentHeight + Transaction.MAX_TRANSACTION_LIFESPAN - 1,
      systemFee: 1,
      networkFee: 1,
      script: script
    }).sign(account);
    const result = await client.sendRawTransaction(transaction.serialize(true));
    expect(typeof result).toBe("string");
  });

  test("submitBlock", () => {
    const alreadyExistedBlock =
      "000000003d8ee950672593017c40d8469571e3b1ad97a78dbaf3b1f41d3601f7a7f4d65f6f91255ed97c70a24d0a0cd2e23fc73c127f7b3fbe93b5efb973a54acb3f4091aa48063a6d010000640000003991af1bc2546596d3e129df102e2ac011d2ab5901fd4501405b10d7050286170b716e2c167b7cdf6b04a9985f20d5d5848617e27f4cb7a0ab1b93c85f4561f3aa6bbd5d1da15ceb1f1670a840239bbfa1acb598507834d0c040a38b8ad2d1e314e0f517947b3d9a7a9fa3a76a76c7c4846de75bddcb034ccd071ad9af2c581c2521acbe5ddab4bf1c04285819c16cfe5fba9d64d141571e6055400c56c276e4bed164781beb75f20d42e3744e0ae30125581da2cea1215655fadeacafb56c66b3f9c36b22ac25cc222d20e4a435608d801b7a7feac232c6520a2c40ce923ee4aff98a21e8640b56cb7c989a1568cecb2813b1ec8e13bb9b16e8f4fd4a9f53520c58d17f2dfc95efca4ab3158696e6b9fc4e4a79e4e9286cb338b9214021ae5c51c119e8b65fb5d78640b1161d722634b1dcee89f6252c88d393e9115fbfc3a0d52d2acd233d8de407b1840ae2462e6c0001a9da0babc56c37e04fc3bdf5552103009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a221030205e9cefaea5a1dfc580af20c8d5aa2468bb0148f1a5e4605fc622c80e604ba210214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff0121023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d2103408dcd416396f64783ac587ea1e1593c57d9fea880c8a6a1920e92a2594778062102a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b2102ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd5768c7c34cba0102416f54b693afc926";
    return client.submitBlock(alreadyExistedBlock).catch(err => {
      expect(err).toBeDefined();
    });
  });

  test("validateAddress", async () => {
    const result = await client.validateAddress(address);
    expect(result).toBe(true);
  });
});
