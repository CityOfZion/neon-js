// import { getIntegrationEnvUrl } from "../../../../../testHelpers";
import { experimental } from "../../src";
import { CONST, rpc, sc, wallet, u } from "@cityofzion/neon-core";
import * as TestHelpers from "../../../../testHelpers";
import { promises as fs } from "fs";
import path from "path";
import { CommonConfig } from "../../src/experimental/types";

let rpcClient: rpc.RPCClient;

const wif = "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g";
const acc = new wallet.Account(wif);

const baseConfig: CommonConfig = {
  networkMagic: CONST.MAGIC_NUMBER.SoloNet,
  rpcAddress: "",
  account: acc,
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  baseConfig.rpcAddress = url;
  rpcClient = new rpc.RPCClient(url);
});

describe("contract", () => {
  test("deploy", async () => {
    const config = Object.assign(
      {
        networkFeeOverride: u.BigInteger.fromDecimal(20, 8),
        systemFeeOverride: u.BigInteger.fromDecimal(20, 8),
      },
      baseConfig
    );
    const nef = Buffer.from(
      await fs.readFile(
        path.resolve(__dirname, "./contract3.nef"),
        null // specifying 'binary' causes extra junk bytes, because apparently it is an alias for 'latin1' *crazy*
      )
    );
    const manifest = sc.ContractManifest.fromJson(
      JSON.parse(
        ((await fs.readFile(
          path.resolve(__dirname, "./contract3.manifest.json")
        )) as unknown) as string
      )
    );

    const contractHash = experimental.getContractHash(
      u.HexString.fromHex(acc.scriptHash),
      nef
    );
    console.log(`Deploying contract with hash: 0x${contractHash}`);

    const txid = await experimental.deployContract(nef, manifest, config);
    expect(txid).toBeDefined();

    console.log(`TXID: ${txid}`);

    await sleep(5000);

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

  test("deploy simple contract", async () => {
    const config = Object.assign(
      {
        networkFeeOverride: u.BigInteger.fromDecimal(10, 8),
        systemFeeOverride: u.BigInteger.fromDecimal(10, 8),
      },
      baseConfig
    );

    const nefFile = new ArrayBuffer(69);
    const manifest = new sc.ContractManifest({
      permissions: [
        {
          contract: "*",
          methods: "*",
        },
      ],
    });

    const txid = await experimental.deployContract(nefFile, manifest, config);
    expect(txid).toBeDefined();
  }, 30000);
});
