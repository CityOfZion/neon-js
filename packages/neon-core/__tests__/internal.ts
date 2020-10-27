import { parseEnum } from "../src/internal";

enum TestEnum {
  Any = 0,
  First = 1,
  Second = 2,
}
describe("parseEnum", () => {
  test("integer", () => {
    const result = parseEnum(0, TestEnum);

    expect(result.toString()).toBe("0");
  });

  test("string", () => {
    const result = parseEnum("First", TestEnum);

    expect(result.toString()).toBe("1");
  });

  test("enum", () => {
    const result = parseEnum(TestEnum.Second, TestEnum);

    expect(result.toString()).toBe("2");
  });
});
