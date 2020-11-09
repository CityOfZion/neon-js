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
    const neoScriptHash = CONST.ASSET_ID["NEO"];
    const gasScriptHash = CONST.ASSET_ID["GAS"];
    const result = await getTokenInfos([neoScriptHash, gasScriptHash], client);
    expect(result).toStrictEqual([
      {
        name: "NEO",
        symbol: "neo",
        decimals: 0,
        totalSupply: "100000000",
      } as TokenInfo,
      {
        name: "GAS",
        symbol: "gas",
        decimals: 8,
        totalSupply: expect.any(String),
      } as TokenInfo,
    ]);

    expect(parseInt(result[1].totalSupply)).toBeGreaterThan(0);
  });
});
