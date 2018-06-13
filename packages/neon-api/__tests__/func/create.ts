import { tx, wallet } from "@cityofzion/neon-core";
import * as create from "../../src/funcs/create";
import {
  ClaimGasConfig,
  DoInvokeConfig,
  SendAssetConfig
} from "../../src/funcs/types";

jest.mock("@cityofzion/neon-core");

describe("createClaimTx", () => {
  test("create with the correct args", async () => {
    const config = {
      api: {} as any,
      net: "",
      account: { address: "address" },
      claims: new wallet.Claims(),
      override: {}
    } as ClaimGasConfig;
    const result = await create.createClaimTx(config);
    expect(result.tx).not.toBeNull();
    expect(tx.Transaction.createClaimTx).toBeCalledWith(
      config.account!.address,
      config.claims,
      config.override
    );
  });
});

describe("createContractTx", () => {
  test("create with the correct args", async () => {
    const config = {
      api: {} as any,
      net: "",
      balance: new wallet.Balance(),
      intents: [],
      override: {},
      fees: 0
    } as SendAssetConfig;
    const result = await create.createContractTx(config);
    expect(result.tx).not.toBeNull();
    expect(tx.Transaction.createContractTx).toBeCalledWith(
      config.balance,
      config.intents,
      config.override,
      config.fees
    );
  });
});

describe("createInvocationTx", () => {
  test("create with the correct args", async () => {
    const config = {
      api: {} as any,
      net: "",
      balance: new wallet.Balance(),
      override: {},
      intents: [],
      script: "abcd",
      gas: 0,
      fees: 0
    } as DoInvokeConfig;
    const result = await create.createInvocationTx(config);
    expect(result.tx).not.toBeNull();
    expect(tx.Transaction.createInvocationTx).toBeCalledWith(
      config.balance,
      config.intents,
      config.script,
      config.gas,
      config.override,
      config.fees
    );
  });
});
