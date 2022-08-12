// import { getIntegrationEnvUrl } from "../../../../../testHelpers";
import { experimental } from "../../src";
import { CONST, rpc, sc, u, wallet } from "@cityofzion/neon-core";
import { promises as fs } from "fs";
import * as TestHelpers from "../../../../testHelpers";
import path from "path";
import { CommonConfig } from "../../src/experimental/types";

let rpcClient: rpc.RPCClient;
let nef: sc.NEF;
let manifest: sc.ContractManifest;
let contractHash: string;

const wif = "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g";
const acc = new wallet.Account(wif);

const config: CommonConfig = {
  networkMagic: CONST.MAGIC_NUMBER.SoloNet,
  rpcAddress: "",
  account: acc,
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  config.rpcAddress = url;
  rpcClient = new rpc.RPCClient(url);

  nef = sc.NEF.fromBuffer(
    await fs.readFile(
      path.resolve(__dirname, "./contract3.nef"),
      null // specifying 'binary' causes extra junk bytes, because apparently it is an alias for 'latin1' *crazy*
    )
  );

  manifest = sc.ContractManifest.fromJson(
    JSON.parse(
      (await fs.readFile(
        path.resolve(__dirname, "./contract3.manifest.json")
      )) as unknown as string
    )
  );

  contractHash = experimental.getContractHash(
    u.HexString.fromHex(acc.scriptHash),
    nef.checksum,
    manifest.name
  );
});

describe("contract", () => {
  test("deploy & invoke", async () => {
    console.log(`Deploying contract with hash: 0x${contractHash}`);

    const txid = await experimental.deployContract(nef, manifest, config);
    expect(txid).toBeDefined();

    console.log(`TXID: ${txid}`);

    await sleep(3000);
    const txLog = await rpcClient.getApplicationLog(txid);
    expect(txLog["executions"][0]["vmstate"] as string).toBe("HALT");

    const state = await rpcClient.getContractState(contractHash);
    // if contract state fails it throws an RpcError
    expect(state).toBeDefined();
    const contract = new experimental.SmartContract(
      u.HexString.fromHex(contractHash),
      config
    );
    const result = await contract.testInvoke("test_func");
    expect(result.state).toBe("HALT");
    expect(result.stack).toStrictEqual([
      {
        type: "Integer",
        value: "2",
      },
    ]);
  }, 30000);

  test("deploy duplicate contract", async () => {
    console.log(`Deploying contract with hash: 0x${contractHash}`);

    // If one does not override the systemfee then this call will fail while trying to obtain the system fee through RPC
    //
    try {
      await experimental.deployContract(nef, manifest, config);
    } catch (e) {
      expect(e.message).toContain("Contract Already Exists");
    }
  });

  test("deploy duplicate contract - with fee override", async () => {
    const config2 = Object.assign(
      {
        networkFeeOverride: u.BigInteger.fromDecimal(20, 8),
        systemFeeOverride: u.BigInteger.fromDecimal(20, 8),
      },
      config
    );

    console.log(`Deploying contract with hash: 0x${contractHash}`);

    // If one does not override the systemfee then this call will fail while trying to obtain the system fee through RPC
    const txid = await experimental.deployContract(nef, manifest, config2);
    expect(txid).toBeDefined();

    console.log(`TXID: ${txid}`);

    await sleep(3000);
    const txLog = await rpcClient.getApplicationLog(txid);
    const execution = txLog["executions"][0];
    expect(execution["vmstate"] as string).toBe("FAULT");
    expect(execution["exception"] as string).toContain(
      "Contract Already Exists"
    );
  });
});
