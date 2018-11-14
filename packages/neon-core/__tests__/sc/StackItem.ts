import StackItem, {
  hasChildren,
  StackItemMap,
  StackItemType
} from "../../src/sc/StackItem";
import data from "./serializedData.json";

describe("hasChildren", () => {
  test.each(["Array", "Struct", "Map"])(
    "%s has children",
    (type: keyof typeof StackItemType) => {
      const result = hasChildren(StackItemType[type]);
      expect(result).toBeTruthy();
    }
  );

  test.each(["ByteArray", "Boolean", "Integer", "InteropInterface"])(
    "%s do not have children",
    (type: keyof typeof StackItemType) => {
      const result = hasChildren(StackItemType[type]);
      expect(result).toBeFalsy();
    }
  );
});

describe("deserialize", () => {
  test("ByteArray", () => {
    const result = StackItem.deserialize(data.byteArray);

    expect(result.type).toBe(StackItemType.ByteArray);
    expect(result.value).toBe("6d65737361676520746f206d7973656c6621");
  });

  test("Integer", () => {
    const result = StackItem.deserialize(data.integer);

    expect(result.type).toBe(StackItemType.Integer);
    expect(result.value).toBe("438ffc5a");
  });

  test("Array", () => {
    const result = StackItem.deserialize(data.array);

    expect(result.type).toBe(StackItemType.Array);
    expect(Array.isArray(result.value)).toBeTruthy();
    const resultValueArray = result.value as StackItem[];
    expect(resultValueArray.length).toBe(2);
    expect(resultValueArray[0].type).toBe(StackItemType.ByteArray);
    expect(resultValueArray[0].value).toBe(
      "6d65737361676520746f206d7973656c6621"
    );
    expect(resultValueArray[1].type).toBe(StackItemType.Integer);
    expect(resultValueArray[1].value).toBe("438ffc5a");
  });

  test("Map", () => {
    const result = StackItem.deserialize(data.map);

    expect(result.type).toBe(StackItemType.Map);
    expect(Array.isArray(result.value)).toBeTruthy();
    const resultValueArray = result.value as StackItemMap[];
    expect(resultValueArray.length).toBe(5);
    expect(resultValueArray[0].key.type).toBe(StackItemType.ByteArray);
    expect(resultValueArray[0].key.value).toBe("61");
    expect(resultValueArray[0].value.type).toBe(StackItemType.Integer);
    expect(resultValueArray[0].value.value).toBe("01");
    expect(resultValueArray[4].value.type).toBe(StackItemType.Array);
    const innerArray = resultValueArray[4].value.value as any[];
    expect(innerArray.length).toBe(6);
  });

  test("ByteArray (long)", () => {
    const result = StackItem.deserialize(data.longString);

    expect(result.type).toBe(StackItemType.ByteArray);
    const resultValueArray = result.value as string;
    expect(resultValueArray.length).toBe(3000);
  });
});
