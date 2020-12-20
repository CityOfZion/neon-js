import { rpc, CONST } from "@cityofzion/neon-core";
import * as TestHelpers from "../../../../testHelpers";

import { getTokenInfos, TokenInfo } from "../../src/api/getTokenInfos";

let client: rpc.NeoServerRpcClient;

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.NeoServerRpcClient(url);
}, 20000);

describe("getTokenInfos", () => {
  test("NEO & GAS", async () => {
    const neoScriptHash = CONST.NATIVE_CONTRACT_HASH.NeoToken;
    const gasScriptHash = CONST.NATIVE_CONTRACT_HASH.GasToken;
    const result = await getTokenInfos([neoScriptHash, gasScriptHash], client);
    expect(result).toStrictEqual([
      {
        symbol: "NEO",
        decimals: 0,
        totalSupply: "100000000",
      } as TokenInfo,
      {
        symbol: "GAS",
        decimals: 8,
        totalSupply: expect.any(String),
      } as TokenInfo,
    ]);

    expect(parseInt(result[1].totalSupply)).toBeGreaterThan(0);
  });
});
