import { tx, wallet } from "@cityofzion/neon-core";
import * as sign from "../../src/funcs/sign";

jest.mock("@cityofzion/neon-core");

describe("signTx", () => {
  test("single signature", async () => {
    const mockSerialize = jest.fn();
    const mockSignature = jest.fn();
    const config = {
      account: {
        publicKey: "mockKey",
      },
      signingFunction: jest.fn().mockImplementationOnce(() => mockSignature),
      tx: {
        scripts: [],
        serialize: jest.fn().mockImplementationOnce(() => mockSerialize),
      },
    } as any;
    tx.Witness.deserialize.mockImplementationOnce(() => mockSignature);

    await sign.signTx(config);
    expect(config.signingFunction).toBeCalledWith(
      mockSerialize,
      config.account.publicKey
    );
    expect(config.tx.scripts.length).toBe(1);
    expect(config.tx.scripts[0]).toBe(mockSignature);
  });

  test("multi-signature", async () => {
    const mockSerialize = jest.fn();
    const mockSignatures = [jest.fn(), jest.fn()];
    const config = {
      account: {
        publicKey: "mockKey",
      },
      signingFunction: jest.fn().mockImplementationOnce(() => mockSignatures),
      tx: {
        scripts: [],
        serialize: jest.fn().mockImplementationOnce(() => mockSerialize),
      },
    } as any;
    tx.Witness.deserialize
      .mockImplementationOnce(() => mockSignatures[0])
      .mockImplementationOnce(() => mockSignatures[1]);

    await sign.signTx(config);
    expect(config.signingFunction).toBeCalledWith(
      mockSerialize,
      config.account.publicKey
    );
    expect(config.tx.scripts.length).toBe(2);
    expect(config.tx.scripts).toEqual(expect.arrayContaining(mockSignatures));
  });
});

describe("signWithPrivateKey", () => {
  test("produces signingFunction", async () => {
    const expected = jest.fn();
    const mockSignature = jest.fn();
    const mockWitness = {
      serialize: jest.fn().mockImplementationOnce(() => expected),
    };
    const mockTx = jest.fn();
    const mockPublicKey = jest.fn();
    wallet.sign.mockImplementationOnce(() => mockSignature);
    tx.Witness.fromSignature.mockImplementationOnce(() => mockWitness);
    // tx.Witness.deserialize.mockImplementationOnce(() => ({
    //   scripts: [1]
    // }));
    const signingFunction = sign.signWithPrivateKey("key");
    const result = await signingFunction(mockTx as any, mockPublicKey as any);
    expect(result).toBe(expected);
    expect(wallet.sign).toBeCalledWith(mockTx, "key");
    expect(tx.Witness.fromSignature).toBeCalledWith(
      mockSignature,
      mockPublicKey
    );
  });
});
