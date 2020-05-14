import StackItem, {
  hasChildren,
  StackItemMap,
  StackItemType,
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
    const result = StackItem.deserialize(data.byteArray.serialized);

    expect(result.type).toBe(StackItemType.ByteArray);
    expect(result.value).toBe("6d65737361676520746f206d7973656c6621");
  });

  test("Integer", () => {
    const result = StackItem.deserialize(data.integer.serialized);

    expect(result.type).toBe(StackItemType.Integer);
    expect(result.value).toBe("438ffc5a");
  });

  test("Array", () => {
    const result = StackItem.deserialize(data.array.serialized);

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
    const result = StackItem.deserialize(data.map.serialized);

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
    const result = StackItem.deserialize(data.longString.serialized);

    expect(result.type).toBe(StackItemType.ByteArray);
    const resultString = result.value as string;
    expect(resultString.length).toBe(3000);
  });

  test("complex array", () => {
    const result = StackItem.deserialize(data.complexArray.serialized);

    expect(result.type).toBe(StackItemType.Array);
    const resultValueArray = result.value as StackItem[];
    expect(resultValueArray.length).toBe(2);

    expect(resultValueArray[0].type).toBe(StackItemType.ByteArray);
    expect(resultValueArray[0].value).toBe("68656c6c6f");

    expect(resultValueArray[1].type).toBe(StackItemType.Array);
    const nestedArray = resultValueArray[1].value as StackItem[];
    expect(nestedArray.length).toBe(4);

    expect(nestedArray[0].type).toBe(StackItemType.ByteArray);
    expect(nestedArray[0].value).toBe(
      "9ec6163233c8e731992adc111a3708b0fde27f2c"
    );

    expect(nestedArray[1].type).toBe(StackItemType.ByteArray);
    expect(nestedArray[1].value).toBe(
      "32633766653266646230303833373161313164633261393933316537633833333332313663363965"
    );

    expect(nestedArray[2].type).toBe(StackItemType.ByteArray);
    expect(nestedArray[2].value).toBe(
      "35616335366236613030353237616334366135313532376163343661303063333039373336353732363936313663363937613635383736343231303036613531633336383135346536353666326535323735366537343639366436353265353336353732363936313663363937613635363136633735363636313661303063333062363436353733363537323639363136633639376136353837363432653030366135316333633035313837363432353030366135316333303063333638313734653635366632653532373536653734363936643635326534343635373336353732363936313663363937613635363136633735363636313030366337353636"
    );

    expect(nestedArray[3].type).toBe(StackItemType.ByteArray);
    expect(nestedArray[3].value).toBe("");
  });
});
