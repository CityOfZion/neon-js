import { wallet } from "@cityofzion/neon-core";
import { mocked } from "ts-jest/utils";
import { SendAssetConfig } from "../../lib/funcs/types";
import * as fill from "../../src/funcs/fill";
import { signWithPrivateKey as _signWithPrivateKey } from "../../src/funcs/sign";
import { ClaimGasConfig } from "../../src/funcs/types";

jest.mock("../../src/funcs/sign");

const signWithPrivateKey = mocked(_signWithPrivateKey, false);

describe("fillUrl", () => {
  test("skips if url present", async () => {
    const expectedUrl = "http://localhost.com";
    const config = {
      api: {
        getRPCEndpoint: jest.fn(),
      } as any,
      account: {},
      url: expectedUrl,
    } as SendAssetConfig;

    const result = await fill.fillUrl(config);

    expect(result.url).toBe(expectedUrl);
    expect(config.api.getRPCEndpoint).not.toBeCalled();
  });

  test("fills if url not present", async () => {
    const expectedUrl = "http://localhost.com";
    const config = {
      api: {
        getRPCEndpoint: jest.fn().mockImplementationOnce(() => expectedUrl),
      } as any,
    } as any;

    const result = await fill.fillUrl(config);

    expect(result.url).toBe(expectedUrl);
    expect(config.api.getRPCEndpoint).toBeCalledWith();
  });
});

describe("fillBalance", () => {
  test("skips if balance present", async () => {
    const expectedBalance = new wallet.Balance();
    const config = {
      api: {
        getBalance: jest.fn(),
      } as any,
      balance: expectedBalance,
    } as SendAssetConfig;

    const result = await fill.fillBalance(config);

    expect(result.balance).toBe(expectedBalance);
    expect(config.api.getBalance).not.toBeCalled();
  });

  test("fills if balance not present", async () => {
    const expectedBalance = new wallet.Balance();
    const config = {
      api: {
        getBalance: jest.fn().mockImplementationOnce(() => expectedBalance),
      } as any,
      account: {
        address: "address",
      },
    } as SendAssetConfig;

    const result = await fill.fillBalance(config);

    expect(result.balance).toBe(expectedBalance);
    expect(config.api.getBalance).toBeCalledWith(config.account.address);
  });
});

describe("fillSigningFunction", () => {
  test("skips if signingFunction present", async () => {
    const expectedFunc = jest.fn() as any;
    const config = {
      signingFunction: expectedFunc,
    } as SendAssetConfig;

    await fill.fillSigningFunction(config);

    expect(config.signingFunction).toBe(expectedFunc);
  });

  test("fills with signWithPrivateKey if not present", async () => {
    const expectedFunc = jest.fn() as any;
    const mockKey = "privateKey";
    signWithPrivateKey.mockImplementationOnce(() => expectedFunc);
    const config = {
      account: {
        privateKey: mockKey,
      },
    } as SendAssetConfig;

    await fill.fillSigningFunction(config);

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
    const expectedClaims = new wallet.Claims({
      claims: [new wallet.ClaimItem()],
    });
    const config = {
      claims: expectedClaims,
    } as ClaimGasConfig;

    const result = await fill.fillClaims(config);
    expect(result.claims).toBe(expectedClaims);
  });

  test("fills if claims not present", async () => {
    const expectedClaims = new wallet.Claims({
      claims: [new wallet.ClaimItem()],
    });
    const config = {
      net: "UnitTestNet",
      account: {
        address: "address",
      } as any,
      api: {
        getClaims: jest.fn().mockImplementationOnce(() => expectedClaims),
      } as any,
    } as ClaimGasConfig;

    const result = await fill.fillClaims(config);
    expect(result.claims).toBe(expectedClaims);
    expect(config.api.getClaims).toBeCalledWith(config.account.address);
  });

  test("throws if claims not present and api returned no claims", async () => {
    const expectedClaims = new wallet.Claims();
    const config = {
      net: "UnitTestNet",
      account: {
        address: jest.fn(),
      },
      api: {
        getClaims: jest.fn().mockImplementationOnce(() => expectedClaims),
      } as any,
    } as any;

    expect(fill.fillClaims(config)).rejects.toThrow("No Claims found");
  });
});
