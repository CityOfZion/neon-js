import { wallet } from "../../../neon-js/src";
import { SendAssetConfig } from "../../lib/funcs/types";
import * as fill from "../../src/funcs/fill";
import { signWithPrivateKey } from "../../src/funcs/sign";
import { ClaimGasConfig } from "../../src/funcs/types";

jest.mock("../../src/funcs/sign");

describe("fillUrl", () => {
  test("skips if url present", async () => {
    const expectedUrl = "http://localhost.com";
    const config = {
      net: "UnitTestNet",
      api: {
        getRPCEndpoint: jest.fn()
      } as any,
      address: "",
      url: expectedUrl
    };

    const result = await fill.fillUrl(config);

    expect(result.url).toBe(expectedUrl);
    expect(config.api.getRPCEndpoint).not.toBeCalled();
  });

  test("fills if url not present", async () => {
    const expectedUrl = "http://localhost.com";
    const config = {
      net: "UnitTestNet",
      api: {
        getRPCEndpoint: jest.fn().mockImplementationOnce(() => expectedUrl)
      } as any,
      address: ""
    };

    const result = await fill.fillUrl(config);

    expect(result.url).toBe(expectedUrl);
    expect(config.api.getRPCEndpoint).toBeCalledWith(config.net);
  });
});

describe("fillBalance", () => {
  test("skips if balance present", async () => {
    const expectedBalance = new wallet.Balance();
    const config = {
      net: "UnitTestNet",
      api: {
        getBalance: jest.fn()
      } as any,
      balance: expectedBalance
    } as SendAssetConfig;

    const result = await fill.fillBalance(config);

    expect(result.balance).toBe(expectedBalance);
    expect(config.api.getBalance).not.toBeCalled();
  });

  test("fills if balance not present", async () => {
    const expectedBalance = new wallet.Balance();
    const config = {
      net: "UnitTestNet",
      api: {
        getBalance: jest.fn().mockImplementationOnce(() => expectedBalance)
      } as any,
      account: {
        address: "address"
      }
    } as SendAssetConfig;

    const result = await fill.fillBalance(config);

    expect(result.balance).toBe(expectedBalance);
    expect(config.api.getBalance).toBeCalledWith(
      config.net,
      config.account.address
    );
  });
});

describe("fillAccount", () => {
  test("skips if account present", async () => {
    const expectedAccount = {} as wallet.Account;
    const config = {
      account: expectedAccount
    } as SendAssetConfig;

    const result = await fill.fillAccount(config);
    expect(result.account).toBe(expectedAccount);
  });

  test("fills if privateKey found", async () => {
    const expectedKey =
      "7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344";
    const config = {
      privateKey: expectedKey,
      publicKey:
        "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s"
    } as SendAssetConfig;
    const result = await fill.fillAccount(config);

    expect(Object.keys(config)).toEqual(
      expect.arrayContaining(["account", "privateKey"])
    );
    expect(config.account!.privateKey).toEqual(expectedKey);
  });

  test("fills with publicKey if publicKey found w/o privateKey", async () => {
    const expectedKey =
      "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef";
    const config = {
      publicKey: expectedKey,
      address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s"
    } as SendAssetConfig;
    const result = await fill.fillAccount(config);

    expect(Object.keys(config)).toEqual(
      expect.arrayContaining(["account", "publicKey"])
    );
    expect(config.account!.publicKey).toEqual(expectedKey);
  });

  test("fills with address if address found w/o privateKey and publicKey", async () => {
    const expectedKey = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
    const config = {
      address: expectedKey
    } as SendAssetConfig;
    const result = await fill.fillAccount(config);

    expect(Object.keys(config)).toEqual(
      expect.arrayContaining(["account", "address"])
    );
    expect(config.account!.address).toEqual(expectedKey);
  });

  test("errors if no keys available", async () => {
    const config = {} as SendAssetConfig;

    expect(fill.fillAccount(config)).rejects.toThrow(
      "No identifying key found!"
    );
  });
});

describe("fillSigningFunction", () => {
  test("skips if signingFunction present", async () => {
    const expectedFunc = jest.fn() as any;
    const config = {
      signingFunction: expectedFunc
    } as SendAssetConfig;

    const result = await fill.fillSigningFunction(config);

    expect(config.signingFunction).toBe(expectedFunc);
  });

  test("fills with signWithPrivateKey if not present", async () => {
    const expectedFunc = jest.fn() as any;
    const mockKey = "privateKey";
    signWithPrivateKey.mockImplementationOnce(() => expectedFunc);
    const config = {
      account: {
        privateKey: mockKey
      }
    } as SendAssetConfig;

    const result = await fill.fillSigningFunction(config);

    expect(config.signingFunction).toBe(expectedFunc);
    expect(signWithPrivateKey).toBeCalledWith(mockKey);
  });

  test("errors if no signingFunction and account found", async () => {
    const config = {} as SendAssetConfig;

    expect(fill.fillSigningFunction(config)).rejects.toThrow(
      "No account found!"
    );
  });
});

describe("fillClaims", () => {
  test("skips if claims present", async () => {
    const expectedClaims = new wallet.Claims();
    const config = {
      claims: expectedClaims
    } as ClaimGasConfig;

    const result = await fill.fillClaims(config);
    expect(result.claims).toBe(expectedClaims);
  });

  test("fills if claims not present", async () => {
    const expectedClaims = new wallet.Claims();
    const config = {
      net: "UnitTestNet",
      account: {
        address: "address"
      },
      api: {
        getClaims: jest.fn().mockImplementationOnce(() => expectedClaims)
      } as any
    } as ClaimGasConfig;

    const result = await fill.fillClaims(config);
    expect(result.claims).toBe(expectedClaims);
    expect(config.api.getClaims).toBeCalledWith(
      config.net,
      config.account.address
    );
  });
});
