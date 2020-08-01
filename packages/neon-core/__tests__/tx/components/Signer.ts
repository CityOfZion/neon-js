import {
  SignerLike,
  Signer,
  SignerJson,
} from "../../../src/tx/components/Signer";
import { WitnessScope } from "../../../src/tx/components/WitnessScope";
import { StringStream } from "../../../src/u";

const data: [string, string, SignerJson][] = [
  [
    "default",
    "000000000000000000000000000000000000000000",
    {
      account: "0x0000000000000000000000000000000000000000",
      scopes: "FeeOnly",
    },
  ],
  [
    "simple",
    "010000000000000000000000000000000000000001",
    {
      account: "0x0000000000000000000000000000000000000001",
      scopes: "CalledByEntry",
    },
  ],
  [
    "Global",
    "010000000000000000000000000000000000000080",
    {
      account: "0x0000000000000000000000000000000000000001",
      scopes: "Global",
    },
  ],
  [
    "CustomContracts",
    "010000000000000000000000000000000000000010010200000000000000000000000000000000000000",
    {
      account: "0x0000000000000000000000000000000000000001",
      scopes: "CustomContracts",
      allowedcontracts: ["0x0000000000000000000000000000000000000002"],
    },
  ],
  [
    "CustomGroups",
    "0100000000000000000000000000000000000000200103b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c",
    {
      account: "0x0000000000000000000000000000000000000001",
      scopes: "CustomGroups",
      allowedgroups: [
        "03b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c",
      ],
    },
  ],
];

const defaultCosigner: SignerLike = {
  account: "",
  scopes: 0,
};

const fullCosigner: SignerLike = {
  account: "dec317f6e4335db8a98418bd16960bf4e7fce4c7",
  scopes:
    WitnessScope.CalledByEntry |
    WitnessScope.CustomContracts |
    WitnessScope.CustomGroups,
  allowedContracts: [
    "43cf98eddbe047e198a3e5d57006311442a0ca15",
    "a1760976db5fcdfab2a9930e8f6ce875b2d18225",
  ],
  allowedGroups: [
    "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
    "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
  ],
};

describe("constructor & export", () => {
  test("default constructor & export", () => {
    const cosigner = new Signer();
    expect(cosigner.export()).toStrictEqual(defaultCosigner);
  });

  test("constructor with obj & export", () => {
    const cosigner = new Signer(fullCosigner);
    expect(cosigner.export()).toStrictEqual(fullCosigner);
  });
});

describe("add methods", () => {
  test("addAllowedContracts", () => {
    const cosigner = new Signer();
    expect(cosigner.scopes & WitnessScope.CustomContracts).toBeFalsy();
    cosigner.addAllowedContracts(
      "43cf98eddbe047e198a3e5d57006311442a0ca15",
      "a1760976db5fcdfab2a9930e8f6ce875b2d18225"
    );
    expect(!!(cosigner.scopes & WitnessScope.CustomContracts)).toBeTruthy();
    expect(
      cosigner.allowedContracts.map((i) => i.toBigEndian())
    ).toStrictEqual([
      "43cf98eddbe047e198a3e5d57006311442a0ca15",
      "a1760976db5fcdfab2a9930e8f6ce875b2d18225",
    ]);
  });

  test("addAllowedGroups", () => {
    const cosigner = new Signer();
    expect(!!(cosigner.scopes & WitnessScope.CustomGroups)).toBeFalsy();
    cosigner.addAllowedGroups(
      "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef"
    );
    expect(!!(cosigner.scopes & WitnessScope.CustomGroups)).toBeTruthy();
    expect(cosigner.allowedGroups.map((i) => i.toBigEndian())).toStrictEqual([
      "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
    ]);
  });
});

describe.each(data)(
  "transform %s",
  (_: string, serialized: string, json: SignerJson) => {
    const neonObj = Signer.fromJson(json);
    const deserialized = Signer.deserialize(new StringStream(serialized));
    test("deserialize", () => {
      expect(deserialized).toEqual(neonObj);
    });

    test("toJson", () => {
      const result = deserialized.toJson();
      expect(result).toEqual(json);
    });

    test("serialize", () => {
      const result = deserialized.serialize();
      expect(result).toEqual(serialized);
    });
  }
);
