import { CONST, rpc, wallet } from "@cityofzion/neon-core";
import * as TestHelpers from "../../../testHelpers";
import testWallet from "../../neon-core/__tests__/testWallet.json";
import { NetworkFacade } from "../src/NetworkFacade";
import { signWithAccount } from "../src/transaction";

let client: rpc.NeoServerRpcClient;
beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.NeoServerRpcClient(url);
}, 20000);

describe("NetworkFacade", () => {
  test("transferToken", async () => {
    const facade = await NetworkFacade.fromConfig({ node: client });
    const fromAccount = new wallet.Account(testWallet.accounts[0]);

    await fromAccount.decrypt("wallet");

    const txid = await facade.transferToken(
      [
        {
          from: fromAccount,
          to: testWallet.accounts[1].address,
          contractHash: CONST.NATIVE_CONTRACT_HASH.GasToken,
          decimalAmt: 0.00000001,
        },
      ],
      {
        signingCallback: signWithAccount(fromAccount),
      }
    );

    expect(txid).toBeDefined();
  }, 30000);
});
