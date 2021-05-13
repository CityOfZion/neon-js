/* eslint-disable @typescript-eslint/no-non-null-assertion */
jest.mock("@cityofzion/neon-core");
import { logging as _logging, rpc as _rpc } from "@cityofzion/neon-core";
import { mocked } from "ts-jest/utils";

const logging = mocked(_logging, true);
const rpc = mocked(_rpc, true);
logging.default.mockImplementation(() => ({
  error: jest.fn(),
}));

import * as send from "../../src/funcs/send";
import { SendAssetConfig } from "../../src/funcs/types";

describe("sendTx", () => {
  test("node returns false", async () => {
    const config = {
      url: "mockUrl",
      account: { address: "mockAddress" },
      tx: { serialize: jest.fn() } as any,
    } as SendAssetConfig;
    const mockExecute = jest.fn().mockResolvedValueOnce({ result: false });
    rpc.Query.sendRawTransaction.mockImplementationOnce(() => ({
      execute: mockExecute,
    }));
    await send.sendTx(config);
    expect(config).toHaveProperty("response");
    expect(config.response!.result).toBe(false);
    expect(rpc.Query.sendRawTransaction).toBeCalledWith(config.tx);
    expect(mockExecute).toBeCalledWith(config.url);
  });

  test("node returns true", async () => {
    const config = {
      url: "mockUrl",
      tx: {
        serialize: jest.fn(),
        hash: jest.fn(),
      } as any,
    } as SendAssetConfig;
    const mockExecute = jest.fn().mockResolvedValueOnce({ result: true });
    rpc.Query.sendRawTransaction.mockImplementationOnce(() => ({
      execute: mockExecute,
    }));
    await send.sendTx(config);
    expect(config).toHaveProperty("response");
    expect(config.response!).toEqual({
      result: true,
      txid: config.tx!.hash,
    });
    expect(rpc.Query.sendRawTransaction).toBeCalledWith(config.tx);
    expect(mockExecute).toBeCalledWith(config.url);
  });
});

describe("applyTxToBalance", () => {
  test("skips if result is false", async () => {
    const config = {
      response: { result: false },
      balance: { applyTx: jest.fn() } as any,
    } as SendAssetConfig;

    await send.applyTxToBalance(config);
    expect(config.balance.applyTx).not.toBeCalled();
  });

  test("calls applyTx if result is true", async () => {
    const config = {
      response: { result: true },
      tx: jest.fn() as any,
      balance: { applyTx: jest.fn() } as any,
    } as SendAssetConfig;

    await send.applyTxToBalance(config);
    expect(config.balance.applyTx).toBeCalledWith(config.tx, false);
  });
});
