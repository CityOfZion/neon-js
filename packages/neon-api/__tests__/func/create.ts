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
    const addClaimsFunc = jest.fn();
    const claimTx = {
      addClaims: addClaimsFunc
    };
    tx.ClaimTransaction.mockImplementationOnce(() => claimTx);
    const result = await create.createClaimTx(config);
    expect(result.tx).toBe(claimTx);
    expect(addClaimsFunc).toBeCalledWith(config.claims);
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
    const calculateFunc = jest.fn();
    const contractTx = {
      calculate: calculateFunc
    }
    tx.ContractTransaction.mockImplementationOnce(() => contractTx);
    const result = await create.createContractTx(config);
    expect(result.tx).toBe(contractTx);
    expect(calculateFunc).toBeCalledWith(config.balance, undefined, config.fees);
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
    const calculateFunc = jest.fn();
    const invocationTx = {
      calculate: calculateFunc
    }
    tx.InvocationTransaction.mockImplementationOnce(() => invocationTx);
    const result = await create.createInvocationTx(config);
    expect(result.tx).toBe(invocationTx);
    expect(calculateFunc).toBeCalledWith(config.balance, undefined, config.fees);
  });
});
