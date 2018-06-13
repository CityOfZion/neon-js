import { tx } from "@cityofzion/neon-core";
import * as sign from "../../src/funcs/sign";

jest.mock("@cityofzion/neon-core");

describe("signTx", () => {
  test("single signature", async () => {
    const mockSerialize = jest.fn();
    const mockSignature = jest.fn();
    const config = {
      account: {
        publicKey: "mockKey"
      },
      signingFunction: jest.fn().mockImplementationOnce(() => mockSignature),
      tx: {
        scripts: [],
        serialize: jest.fn().mockImplementationOnce(() => mockSerialize)
      }
    } as any;
    tx.deserializeWitness.mockImplementationOnce(() => mockSignature);

    const result = await sign.signTx(config);
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
        publicKey: "mockKey"
      },
      signingFunction: jest.fn().mockImplementationOnce(() => mockSignatures),
      tx: {
        scripts: [],
        serialize: jest.fn().mockImplementationOnce(() => mockSerialize)
      }
    } as any;
    tx.deserializeWitness
      .mockImplementationOnce(() => mockSignatures[0])
      .mockImplementationOnce(() => mockSignatures[1]);

    const result = await sign.signTx(config);
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
    const mockSignature = jest.fn();
    const mockTx = jest.fn();
    const mockKey = jest.fn();
    tx.serializeWitness.mockImplementationOnce(() => mockSignature);
    tx.signTransaction.mockImplementationOnce(() => ({
      scripts: [1]
    }));
    const signingFunction = sign.signWithPrivateKey("key");
    const result = await signingFunction(mockTx as any, mockKey as any);
    expect(result).toBe(mockSignature);
  });
});
