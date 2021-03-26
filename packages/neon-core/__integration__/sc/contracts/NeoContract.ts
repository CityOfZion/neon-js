import { getIntegrationEnvUrl } from "../../../../../testHelpers";
import { wallet } from "../../../src";
import { RPCClient } from "../../../src/rpc";
import { NeoContract } from "../../../src/sc/contracts/NeoContract";
import testWalletJson from "../../../__tests__/testWallet.json";

let rpcClient: RPCClient;
let testWallet = new wallet.Wallet(testWalletJson);
beforeAll(async () => {
  const url = await getIntegrationEnvUrl();
  rpcClient = new RPCClient(url);
});

describe("NeoContract", () => {
  test("getCandidates", async () => {
    const call = NeoContract.INSTANCE.getCandidates();
    const response = await rpcClient.invokeFunction(
      call.scriptHash,
      call.operation,
      call.args
    );

    expect(response.state).toBe("HALT");
  });

  test("getRegisterPrice", async () => {
    const call = NeoContract.INSTANCE.getRegisterPrice();
    const response = await rpcClient.invokeFunction(
      call.scriptHash,
      call.operation,
      call.args
    );

    expect(response.state).toBe("HALT");
    expect(response.stack.length).toBe(1);
    expect(response.stack[0].type).toBe("Integer");
  });

  test("registerCandidate", async () => {
    const call = NeoContract.INSTANCE.registerCandidate(
      testWallet.accounts[0].publicKey
    );
    const response = await rpcClient.invokeFunction(
      call.scriptHash,
      call.operation,
      call.args,
      [
        {
          account: testWallet.accounts[0].scriptHash,
          scopes: "CalledByEntry",
        },
      ]
    );

    expect(response.state).toBe("HALT");
    expect(response.stack.length).toBe(1);
    expect(response.stack[0]).toMatchObject({
      type: "Boolean",
      value: true,
    });
  });

  test("vote", async () => {
    const call = NeoContract.INSTANCE.vote(
      testWallet.accounts[0].address,
      testWallet.accounts[0].publicKey
    );
    const response = await rpcClient.invokeFunction(
      call.scriptHash,
      call.operation,
      call.args,
      [
        {
          account: testWallet.accounts[0].scriptHash,
          scopes: "CalledByEntry",
        },
      ]
    );

    expect(response.state).toBe("HALT");
    expect(response.stack.length).toBe(1);
    expect(response.stack[0]).toMatchObject({
      type: "Boolean",
      value: true,
    });
  });
});
