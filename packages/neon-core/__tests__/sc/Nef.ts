import { NEF } from "../../src/sc/NEF";
import { CallFlags } from "../../src/sc";
import { Buffer } from "buffer";

import { readFileSync } from "fs";
import { join as joinPath } from "path";

describe("constructor", () => {
  test("ok", () => {
    const result = new NEF({
      compiler: "test-compiler",
      tokens: [],
      script: "00",
    });

    expect(result instanceof NEF).toBeTruthy();
  });
});

describe("fromJson", () => {
  test("incorrect magic", () => {
    expect(() =>
      NEF.fromJson({
        magic: 0,
        compiler: "test-compiler",
        source: "",
        tokens: [],
        script: "00",
        checksum: 0,
      })
    ).toThrowError("Incorrect magic");
  });

  test("invalid checksum", () => {
    expect(() =>
      NEF.fromJson({
        magic: NEF.MAGIC,
        compiler: "test-compiler",
        source: "github",
        tokens: [],
        script: "00",
        checksum: 0,
      })
    ).toThrowError("Invalid checksum");
  });

  test("ok", () => {
    const result = NEF.fromJson({
      magic: NEF.MAGIC,
      compiler: "test-compiler",
      source: "github",
      tokens: [],
      script: "00",
      checksum: 3977318361,
    });
    expect(result instanceof NEF).toBeTruthy();
  });
});

describe("fromBuffer", () => {
  test("ok", () => {
    /* Capture from C#
      var nef = new NefFile
      {
          Compiler = "test-compiler 0.1",
          Source = "github",
          Script = new byte[] {(byte) OpCode.RET},
          Tokens = new MethodToken[]
          {
              new MethodToken()
              {
                  Hash = UInt160.Zero,
                  Method = "test_method",
                  ParametersCount = 0,
                  HasReturnValue = true,
                  CallFlags = CallFlags.None
              }
          }
      };
      nef.CheckSum = NefFile.ComputeChecksum(nef);
      Console.WriteLine(nef.ToArray().ToHexString());
     */
    const data = Buffer.from(
      "4e454633746573742d636f6d70696c657220302e31000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006676974687562000100000000000000000000000000000000000000000b746573745f6d6574686f6400000100000001403374b4fd",
      "hex"
    );
    const nef = NEF.fromBuffer(data);
    expect(nef.compiler).toBe("test-compiler 0.1");
    expect(nef.source).toBe("github");
    expect(nef.tokens.length).toBe(1);
    expect(nef.tokens[0].hash).toBe("0000000000000000000000000000000000000000");
    expect(nef.tokens[0].method).toBe("test_method");
    expect(nef.tokens[0].parametersCount).toBe(0);
    expect(nef.tokens[0].hasReturnValue).toBe(true);
    expect(nef.tokens[0].callFlags).toBe(CallFlags.None);
    expect(nef.script).toBe("40");
    expect(nef.checksum).toBe(4256461875);
  });

  test("local file: djnicholson.NeoPetShopContract", () => {
    const nefFile = readFileSync(
      joinPath(__dirname, "./djnicholson.NeoPetShopContract.nef")
    );

    const nef = NEF.fromBuffer(nefFile);

    expect(nef.checksum).toBeDefined();
  });

  test("incorrect magic", () => {
    const data = Buffer.from("00010203", "hex");
    expect(() => NEF.fromBuffer(data)).toThrowError(
      "NEF deserialization failure - incorrect magic"
    );
  });

  test("invalid source length", () => {
    const magic = "4e454633";
    const compiler = Buffer.alloc(64, 0).toString("hex");
    const source = "fd0101"; // var size of 257 (limit is 256)
    const data = Buffer.from(magic + compiler + source, "hex");
    expect(() => NEF.fromBuffer(data)).toThrowError(
      "NEF deserialization failure - source field size exceeds maximum length of 256"
    );
  });

  test("invalid reserved 1", () => {
    const magic = "4e454633";
    const compiler = Buffer.alloc(64, 0).toString("hex");
    const source = "00";
    const data = Buffer.from(magic + compiler + source + "01", "hex");
    expect(() => NEF.fromBuffer(data)).toThrowError(
      "NEF deserialization failure - reserved bytes must be 0"
    );
  });

  test("invalid token length", () => {
    const magic = "4e454633";
    const compiler = Buffer.alloc(64, 0).toString("hex");
    const source = "00";
    const reserved = "00";
    const data = Buffer.from(
      magic + compiler + source + reserved + "ffff",
      "hex"
    );
    expect(() => NEF.fromBuffer(data)).toThrowError(
      "NEF deserialization failure - token array exceeds maximum length of 128"
    );
  });

  test("invalid reserved 2", () => {
    const magic = "4e454633";
    const compiler = Buffer.alloc(64, 0).toString("hex");
    const source = "00";
    const reserved = "00";
    const methodLength = "00";
    const data = Buffer.from(
      magic + compiler + source + reserved + methodLength + "0001",
      "hex"
    );
    expect(() => NEF.fromBuffer(data)).toThrowError(
      "NEF deserialization failure - reserved bytes must be 0"
    );
  });

  test("script length cannot be 0", () => {
    const magic = "4e454633";
    const compiler = Buffer.alloc(64, 0).toString("hex");
    const source = "00";
    const reserved1 = "00";
    const reserved2 = "0000";
    const methodLength = "00";
    const data = Buffer.from(
      magic + compiler + source + reserved1 + methodLength + reserved2 + "00",
      "hex"
    );
    expect(() => NEF.fromBuffer(data)).toThrowError(
      "NEF deserialization failure - script length can't be 0"
    );
  });

  test("script length exceeds max value", () => {
    const magic = "4e454633";
    const compiler = Buffer.alloc(64, 0).toString("hex");
    const source = "00";
    const reserved1 = "00";
    const reserved2 = "0000";
    const methodLength = "00";
    const data = Buffer.from(
      magic +
        compiler +
        source +
        reserved1 +
        methodLength +
        reserved2 +
        "ffffffffffffffff",
      "hex"
    );
    expect(() => NEF.fromBuffer(data)).toThrowError(
      "NEF deserialization failure - max script length exceeded"
    );
  });
});

describe("serialize", () => {
  test("ok", () => {
    // hexstring captured from C#, see fromBuffer test for the capture code
    const hexstring =
      "4e454633746573742d636f6d70696c657220302e31000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006676974687562000100000000000000000000000000000000000000000b746573745f6d6574686f6400000100000001403374b4fd";
    const data = Buffer.from(hexstring, "hex");
    const nef = NEF.fromBuffer(data);
    expect(nef.serialize()).toEqual(hexstring);
  });
});
