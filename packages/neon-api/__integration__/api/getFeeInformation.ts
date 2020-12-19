import { rpc } from "@cityofzion/neon-core";
import * as TestHelpers from "../../../../testHelpers";

import { getFeeInformation } from "../../src/api/getFeeInformation";

let client: rpc.NeoServerRpcClient;
beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.NeoServerRpcClient(url);
}, 20000);

describe("getFeeInformation", () => {
  test("success", async () => {
    const result = await getFeeInformation(client);

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["feePerByte", "executionFeeFactor"])
    );
  });
});
