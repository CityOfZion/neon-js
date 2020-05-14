import StateDescriptor, {
  StateDescriptorLike,
  StateType,
} from "../../../src/tx/components/StateDescriptor";

describe("Constructor", () => {
  test("empty", () => {
    const result = new StateDescriptor();
    expect(result instanceof StateDescriptor).toBeTruthy();
    expect(result.type).toBe(StateType.Account);
    expect(result.field).toBe("");
    expect(result.key).toBe("");
    expect(result.value).toBe("");
  });

  test("StateDescriptorLike (string type)", () => {
    const testObject = {
      type: "Validator",
      key: "testKey",
      field: "testField",
      value: "testValue",
    };

    const result = new StateDescriptor(testObject);
    expect(result instanceof StateDescriptor).toBeTruthy();
    expect(result.type).toBe(StateType.Validator);
    expect(result.field).toBe(testObject.field);
    expect(result.key).toBe(testObject.key);
    expect(result.value).toBe(testObject.value);
  });

  test("StateDescriptorLike (int type)", () => {
    const testObject = {
      type: 0x48,
      key: "testKey",
      field: "testField",
      value: "testValue",
    };

    const result = new StateDescriptor(testObject);
    expect(result instanceof StateDescriptor).toBeTruthy();
    expect(result.type).toBe(StateType.Validator);
    expect(result.field).toBe(testObject.field);
    expect(result.key).toBe(testObject.key);
    expect(result.value).toBe(testObject.value);
  });

  test("StateDescriptor", () => {
    const testObject = new StateDescriptor({
      type: 0x48,
      key: "testKey",
      field: "testField",
      value: "testValue",
    });

    const result = new StateDescriptor(testObject);
    expect(result instanceof StateDescriptor).toBeTruthy();
    expect(result).toEqual(testObject);
  });
});

describe("export", () => {
  test("export to StateDescriptorLike", () => {
    const testObject = {
      type: 0x40,
      key: "testKey",
      field: "testField",
      value: "testValue",
    };

    const stateDescriptor = new StateDescriptor(testObject);
    const result = stateDescriptor.export();
    expect(result).toEqual(testObject);
  });
});

describe("equals", () => {
  const obj1 = {
    type: 0x48,
    key: "key1",
    field: "field1",
    value: "value1",
  };

  const obj2 = {
    type: 0x40,
    key: "key2",
    field: "field2",
    value: "value2",
  };

  const desc1 = new StateDescriptor(obj1);
  const desc2 = new StateDescriptor(obj2);

  test.each([
    ["Desc1 === Desc1", desc1, desc1, true],
    ["Desc1 !== Desc2", desc1, desc2, false],
    ["Desc1 === Obj1", desc1, obj1, true],
    ["Desc1 !== Obj2", desc1, obj2, false],
  ])("%s", (msg: string, a: StateDescriptor, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = [
  [
    "Account Type",
    {
      type: 0x40,
      key: "3775292229eccdf904f16fff8e83e7cffdc0f0ce",
      field: "Votes",
      value:
        "02030ef96257401b803da5dd201233e2be828795672b775dd674d69df83f7aec1e360327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee8",
    },
    "40143775292229eccdf904f16fff8e83e7cffdc0f0ce05566f7465734302030ef96257401b803da5dd201233e2be828795672b775dd674d69df83f7aec1e360327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee8",
  ],
];
describe("serialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, data: StateDescriptor, expected: string) => {
      const result = new StateDescriptor(data);
      expect(result.serialize()).toBe(expected);
    }
  );
});

describe("deserialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, expected: StateDescriptorLike, data: string) => {
      const result = StateDescriptor.deserialize(data);
      expect(result.export()).toEqual(expected);
    }
  );
});
