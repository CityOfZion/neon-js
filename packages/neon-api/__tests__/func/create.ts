import { tx as _tx, u as _u, wallet } from "@cityofzion/neon-core";
import { mocked } from "ts-jest/utils";
import * as create from "../../src/funcs/create";
import {
  ClaimGasConfig,
  DoInvokeConfig,
  SendAssetConfig,
  SetupVoteConfig,
} from "../../src/funcs/types";

jest.mock("@cityofzion/neon-core");

const tx = mocked(_tx, true);
const u = mocked(_u, true);
// const wallet = mocked

describe("createClaimTx", () => {
  test("create with the correct args", async () => {
    const config = {
      api: {} as any,
      account: { address: "address" },
      claims: new wallet.Claims(),
      override: {},
    } as ClaimGasConfig;
    const addClaimsFunc = jest.fn();
    const claimTx = {
      addClaims: addClaimsFunc,
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
      balance: new wallet.Balance(),
      intents: [],
      override: {},
      fees: 0,
    } as SendAssetConfig;
    const calculateFunc = jest.fn();
    const contractTx = {
      calculate: calculateFunc,
    };
    tx.ContractTransaction.mockImplementationOnce(() => contractTx);
    const result = await create.createContractTx(config);
    expect(result.tx).toBe(contractTx);
    expect(calculateFunc).toBeCalledWith(
      config.balance,
      undefined,
      config.fees
    );
  });
});

describe("createInvocationTx", () => {
  test("create with the correct args", async () => {
    const config = {
      api: {} as any,
      balance: new wallet.Balance(),
      override: {},
      intents: [],
      script: "abcd",
      gas: 0,
      fees: 0,
    } as DoInvokeConfig;
    const calculateFunc = jest.fn();
    const invocationTx = {
      calculate: calculateFunc,
    };
    tx.InvocationTransaction.mockImplementationOnce(() => invocationTx);
    const result = await create.createInvocationTx(config);
    expect(result.tx).toBe(invocationTx);
    expect(calculateFunc).toBeCalledWith(
      config.balance,
      undefined,
      config.fees
    );
  });
});

describe("createStateTx", () => {
  test("create with the correct args", async () => {
    const config = {
      api: {} as any,
      account: {
        scriptHash: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
      } as wallet.Account,
      balance: new wallet.Balance(),
      candidateKeys: [
        "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa",
        "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      ],
    } as SetupVoteConfig;
    u.reverseHex.mockImplementation(
      () => "3775292229eccdf904f16fff8e83e7cffdc0f0ce"
    );
    u.int2hex.mockImplementation(() => "02");
    const expectedTx = jest.fn();
    const expectedDescriptor = jest.fn();
    tx.StateTransaction.mockImplementation(() => expectedTx);
    tx.StateDescriptor.mockImplementation(() => expectedDescriptor);
    const result = await create.createStateTx(config);
    expect(result.tx).toBe(expectedTx);
    expect(u.reverseHex).toBeCalledWith(config.account.scriptHash);
    expect(u.int2hex).toBeCalledWith(2);
    expect(tx.StateDescriptor).toBeCalledWith({
      type: 0x40,
      field: "Votes",
      key: "3775292229eccdf904f16fff8e83e7cffdc0f0ce",
      value: "02" + config.candidateKeys[0] + config.candidateKeys[1],
    });
    expect(tx.StateTransaction).toBeCalledWith({
      descriptors: [expectedDescriptor],
    });
  });
});
