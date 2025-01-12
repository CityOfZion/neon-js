import { rpc } from "@cityofzion/neon-core";
import { getTokenBalances } from "../../src/api/getTokenBalances";

describe("getTokenBalances", () => {
  test("success", async () => {
    const mockClient = {
      invokeScript: jest.fn(async () => {
        return {
          script: "",
          state: "HALT",
          gasconsumed: "4000000",
          stack: [
            {
              type: "Integer",
              value: "0",
            },
            {
              type: "Integer",
              value: "1",
            },
            {
              type: "Integer",
              value: "3",
            },
            {
              type: "Integer",
              value: "2000",
            },
            {
              type: "Integer",
              value: "8",
            },
            {
              type: "Integer",
              value: "300000000",
            },
          ],
        };
      }),
    } as unknown as rpc.NeoServerRpcClient;

    const result = await getTokenBalances(
      "NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i",
      [
        "0000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000001",
        "0000000000000000000000000000000000000002",
      ],
      mockClient,
    );

    expect(result).toStrictEqual(["1", "2.000", "3.00000000"]);
  });

  test("VM fault", async () => {
    const mockClient = {
      invokeScript: jest.fn(async () => {
        return {
          script: "",
          state: "FAULT",
          gasconsumed: "4000000",
          exception: "expected exception message",
          stack: [],
        };
      }),
    } as unknown as rpc.NeoServerRpcClient;

    expect(
      async () =>
        await getTokenBalances(
          "NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i",
          [
            "0000000000000000000000000000000000000000",
            "0000000000000000000000000000000000000001",
            "0000000000000000000000000000000000000002",
          ],
          mockClient,
        ),
    ).rejects.toThrow("expected exception message");
  });

  test("VM fault without exception message", async () => {
    const mockClient = {
      invokeScript: jest.fn(async () => {
        return {
          script: "",
          state: "FAULT",
          gasconsumed: "4000000",
          stack: [],
        };
      }),
    } as unknown as rpc.NeoServerRpcClient;

    expect(
      async () =>
        await getTokenBalances(
          "NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i",
          [
            "0000000000000000000000000000000000000000",
            "0000000000000000000000000000000000000001",
            "0000000000000000000000000000000000000002",
          ],
          mockClient,
        ),
    ).rejects.toThrow("No exception message returned");
  });
});
