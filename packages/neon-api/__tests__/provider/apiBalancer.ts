import ApiBalancer from "../../src/provider/apiBalancer"
import { DataProvider } from "../../src/provider/common";
import * as neonDB from '../../src/provider/neonDB'
import * as neoscan from '../../src/provider/neoscan'
import {internalSettings} from "../../src/settings"

jest.mock('../../src/provider/neonDB')
jest.mock('../../src/provider/neoscan')

const balancer = new ApiBalancer(neoscan as DataProvider, neonDB as DataProvider);
describe("preference", () => {
  test("sets setting", () => {
    balancer.preference = 1;
    expect(balancer.preference).toBe(1);
  })

  test("restricted to range between 0 and 1", () => {
    balancer.preference = -1;
    expect(balancer.preference).toBe(0);
    balancer.preference = 1.3;
    expect(balancer.preference).toBe(1);
    balancer.preference = 0;
    expect(balancer.preference).toBe(0);
    balancer.preference = 1;
    expect(balancer.preference).toBe(1);
  })
})

describe("frozen", () => {
  test("preference change when unfrozen", async () => {
    balancer.frozen = false;
    balancer.preference = 0.5;
    neoscan.getRPCEndpoint.mockResolvedValue(true);
    neonDB.getRPCEndpoint.mockResolvedValue(true);
    const result = await balancer.getRPCEndpoint("UnitTestNet");
    expect(balancer.preference).not.toBe(0.5);
  })

  test("preference does not change when frozen", async () => {
    balancer.frozen = true;
    balancer.preference = 0.5;
    neoscan.getRPCEndpoint.mockResolvedValue(true);
    neonDB.getRPCEndpoint.mockResolvedValue(true);
    const result = await balancer.getRPCEndpoint("UnitTestNet");
    expect(balancer.preference).toBe(0.5);

  })
})

describe("loadBalance", () => {
  test("calls LeftProvider when preference = 0", async () => {
    balancer.preference = 0;
    const result = await balancer.getRPCEndpoint("UnitTestNet");
    expect(neoscan.getRPCEndpoint).toBeCalledWith("UnitTestNet");
  })

  test("calls rightProvider when preference = 1", async () => {
    balancer.preference = 1;
    const f = jest.fn();
    const result = await balancer.getRPCEndpoint("UnitTestNet");
    expect(neonDB.getRPCEndpoint).toBeCalledWith("UnitTestNet");
  })

  test("calls other provider when initial call fails", async() => {
    balancer.frozen = false;
    balancer.preference = 0;
    neoscan.getRPCEndpoint.mockRejectedValue(false);
    neonDB.getRPCEndpoint.mockResolvedValue(true);
    const result =  await balancer.getRPCEndpoint("UnitTestNet");
    expect(result).toBe(true);
    expect(balancer.preference).toBeGreaterThan(0);
  })
})
