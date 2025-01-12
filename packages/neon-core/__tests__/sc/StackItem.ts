import StackItem, { hasChildren, StackItemType } from "../../src/sc/StackItem";

describe("constructor", () => {
  describe("defaults", () => {
    test("Integer", () => {
      const result = new StackItem({ type: StackItemType.Integer });

      expect(result.type).toBe(StackItemType.Integer);
      expect(result.value).toEqual("0");
    });

    test("Boolean", () => {
      const result = new StackItem({ type: StackItemType.Boolean });

      expect(result.type).toBe(StackItemType.Boolean);
      expect(result.value).toEqual(false);
    });

    test("ByteString", () => {
      const result = new StackItem({ type: StackItemType.ByteString });

      expect(result.type).toBe(StackItemType.ByteString);
      expect(result.value).toEqual("");
    });

    test("Array", () => {
      const result = new StackItem({ type: StackItemType.Array });

      expect(result.type).toBe(StackItemType.Array);
      expect(result.value).toEqual([]);
    });

    test("Struct", () => {
      const result = new StackItem({ type: StackItemType.Struct });

      expect(result.type).toBe(StackItemType.Struct);
      expect(result.value).toEqual([]);
    });

    test("Map", () => {
      const result = new StackItem({ type: StackItemType.Map });

      expect(result.type).toBe(StackItemType.Map);
      expect(result.value).toEqual([]);
    });

    test("Pointer", () => {
      const result = new StackItem({ type: StackItemType.Pointer });

      expect(result.type).toBe(StackItemType.Pointer);
      expect(result.value).toEqual(0);
    });

    test("Buffer", () => {
      const result = new StackItem({ type: StackItemType.Buffer });

      expect(result.type).toBe(StackItemType.Buffer);
      expect(result.value).toEqual("");
    });
  });
});

describe("hasChildren", () => {
  test.each(["Array", "Struct", "Map"])("%s has children", (type: string) => {
    const result = hasChildren(
      StackItemType[type as keyof typeof StackItemType],
    );
    expect(result).toBeTruthy();
  });

  test.each(["ByteString", "Boolean", "Integer", "InteropInterface"])(
    "%s do not have children",
    (type: string) => {
      const result = hasChildren(
        StackItemType[type as keyof typeof StackItemType],
      );
      expect(result).toBeFalsy();
    },
  );
});
