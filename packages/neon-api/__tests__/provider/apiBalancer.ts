import { mocked as _mocked } from "ts-jest/utils";
import ApiBalancer from "../../src/provider/apiBalancer";
import { instance as NeonDB } from "../../src/provider/neonDB";
import { instance as Neoscan } from "../../src/provider/neoscan";

jest.mock("../../src/provider/neonDB");
jest.mock("../../src/provider/neoscan");

const left = new Neoscan("neoscanUrl");
const right = new NeonDB("neonDBUrl");

const balancer = new ApiBalancer(left, right);
describe("preference", () => {
  test("sets setting", () => {
    balancer.preference = 1;
    expect(balancer.preference).toBe(1);
  });

  test("restricted to range between 0 and 1", () => {
    balancer.preference = -1;
    expect(balancer.preference).toBe(0);
    balancer.preference = 1.3;
    expect(balancer.preference).toBe(1);
    balancer.preference = 0;
    expect(balancer.preference).toBe(0);
    balancer.preference = 1;
    expect(balancer.preference).toBe(1);
  });
});

describe("frozen", () => {
  test("preference change when unfrozen", async () => {
    balancer.frozen = false;
    balancer.preference = 0.5;
    right.getRPCEndpoint.mockResolvedValue(true);
    left.getRPCEndpoint.mockResolvedValue(true);
    const _result = await balancer.getRPCEndpoint();
    expect(balancer.preference).not.toBe(0.5);
  });

  test("preference does not change when frozen", async () => {
    balancer.frozen = true;
    balancer.preference = 0.5;
    right.getRPCEndpoint.mockResolvedValue(true);
    left.getRPCEndpoint.mockResolvedValue(true);
    await balancer.getRPCEndpoint();
    expect(balancer.preference).toBe(0.5);
  });
});

describe("loadBalance", () => {
  test("calls LeftProvider when preference = 0", async () => {
    balancer.preference = 0;
    await balancer.getRPCEndpoint();
    expect(left.getRPCEndpoint).toBeCalled();
  });

  test("calls rightProvider when preference = 1", async () => {
    balancer.preference = 1;
    await balancer.getRPCEndpoint();
    expect(right.getRPCEndpoint).toBeCalled();
  });

  test("calls other provider when initial call fails", async () => {
    balancer.frozen = false;
    balancer.preference = 0;
    left.getRPCEndpoint.mockRejectedValue(false);
    right.getRPCEndpoint.mockResolvedValue(true);
    const result = await balancer.getRPCEndpoint();
    expect(result).toBe(true);
    expect(balancer.preference).toBeGreaterThan(0);
  });
});
