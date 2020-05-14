import * as common from "../../src/provider/common";

const nodes = [
  { height: 1, url: "https://url1" },
  { height: 2, url: "http://url2:1234" },
  { height: 3, url: "https://url3.com/bv/adsf/" },
  { height: 4, url: "http://url4.io" },
  { height: 5, url: "https://www.url5.com" },
  { height: 6, url: "url6:2134" },
];

describe("filterHttpsOnly", () => {
  test("empty array", () => {
    const result = common.filterHttpsOnly([]);
    expect(result).toEqual([]);
  });

  test("array with only http nodes", () => {
    const result = common.filterHttpsOnly([nodes[1], nodes[3], nodes[5]]);
    expect(result).toEqual([]);
  });

  test("filters for https correctly", () => {
    const result = common.filterHttpsOnly(nodes);
    expect(result).toEqual([nodes[0], nodes[2], nodes[4]]);
  });
});

describe("findGoodNodesFromHeight", () => {
  test("returns list of good nodes within tolerance", () => {
    const result = common.findGoodNodesFromHeight(nodes);
    expect(result).toEqual(expect.arrayContaining([nodes[5], nodes[4]]));
  });

  test("errors when no nodes found", () => {
    expect(() => common.findGoodNodesFromHeight([])).toThrow();
  });

  test("returns list of good nodes within custom tolerance", () => {
    const result = common.findGoodNodesFromHeight(nodes, 10);
    expect(result).toEqual(expect.arrayContaining(nodes));
  });
});
