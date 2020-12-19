import { getIntegrationEnvUrl } from "../../../../../testHelpers";
import { NATIVE_CONTRACT_HASH } from "../../../src/consts";
import { RPCClient } from "../../../src/rpc";
import { Nep17Contract } from "../../../src/sc/contracts/Nep17Contract";
import testWallet from "../../../__tests__/testWallet.json";

let rpcClient: RPCClient;
beforeAll(async () => {
  const url = await getIntegrationEnvUrl();
  rpcClient = new RPCClient(url);
});

describe("Nep17Contract", () => {
  test("totalSupply", async () => {
    const neoContract = new Nep17Contract(NATIVE_CONTRACT_HASH.NeoToken);
    const contractCall = neoContract.totalSupply();

    const result = await rpcClient.invokeFunction(
      contractCall.scriptHash,
      contractCall.operation,
      contractCall.args
    );

    expect(result.state).toBe("HALT");
    expect(result.stack).toStrictEqual([
      {
        type: "Integer",
        value: "100000000",
      },
    ]);
  });

  test("symbol", async () => {
    const neoContract = new Nep17Contract(NATIVE_CONTRACT_HASH.NeoToken);
    const contractCall = neoContract.symbol();

    const result = await rpcClient.invokeFunction(
      contractCall.scriptHash,
      contractCall.operation,
      contractCall.args
    );

    expect(result.state).toBe("HALT");
    expect(result.stack).toStrictEqual([
      {
        type: "ByteString",
        value: "TkVP",
      },
    ]);
  });

  test("decimals", async () => {
    const neoContract = new Nep17Contract(NATIVE_CONTRACT_HASH.GasToken);
    const contractCall = neoContract.decimals();

    const result = await rpcClient.invokeFunction(
      contractCall.scriptHash,
      contractCall.operation,
      contractCall.args
    );

    expect(result.state).toBe("HALT");
    expect(result.stack).toStrictEqual([
      {
        type: "Integer",
        value: "8",
      },
    ]);
  });

  test("balanceOf", async () => {
    const neoContract = new Nep17Contract(NATIVE_CONTRACT_HASH.GasToken);
    const contractCall = neoContract.balanceOf(testWallet.accounts[0].address);

    const result = await rpcClient.invokeFunction(
      contractCall.scriptHash,
      contractCall.operation,
      contractCall.args
    );

    expect(result.state).toBe("HALT");
    expect(result.stack).toHaveLength(1);

    expect(result.stack[0].type).toBe("Integer");
    expect(parseInt(result.stack[0].value as string)).toBeGreaterThan(0);
  });
});
