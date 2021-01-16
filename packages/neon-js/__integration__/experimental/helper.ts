// import { getIntegrationEnvUrl } from "../../../../../testHelpers";
import { experimental } from "../../";
import { rpc, sc, wallet, u } from "@cityofzion/neon-core";
import { promises as fs } from "fs";

let rpc_client: rpc.RPCClient;

const wif = "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g";
const acc = new wallet.Account(wif);

const config = {
  networkMagic: 769,
  rpcAddress: "http://127.0.0.1:10332",
  account: acc,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeAll(async () => {
  // const url = await getIntegrationEnvUrl();
  const url = "http://localhost:20332";
  config.rpcAddress = url;
  rpc_client = new rpc.RPCClient(url);
});

describe("contract", () => {
  test("deploy", async () => {
    const nef = Buffer.from(
      await fs.readFile(
        "./contract3.nef",
        null // specifying 'binary' causes extra junk bytes, because apparently it is an alias for 'latin1' *crazy*
      )
    );
    const manifest = sc.ContractManifest.fromJson(
      JSON.parse(await fs.readFile("./contract3.manifest.json"))
    );
    try {
      const contract_hash = experimental.getContractHash(
        u.HexString.fromHex(acc.scriptHash),
        nef
      );
      console.log(`Deploying contract with hash: 0x${contract_hash}`);

      const txid = await experimental.deployContract(nef, manifest, config);
      expect(txid).toBeDefined();

      await sleep(5000);

      const state = await rpc_client.getContractState(contract_hash);
      // if contract state fails it throws an RpcError
      expect(state).toBeDefined();
      const contract = new experimental.SmartContract(
        u.HexString.fromHex(contract_hash),
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
    } catch (e) {
      console.log(e);
    }
  });
});
