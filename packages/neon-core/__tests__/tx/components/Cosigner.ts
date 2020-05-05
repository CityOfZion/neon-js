import { CosignerLike, Cosigner } from "../../../src/tx/components/Cosigner";
import { WitnessScope } from "../../../src/tx/components/WitnessScope";
import { StringStream } from "../../../src/u";

const defaultCosigner: CosignerLike = {
  account: "",
  scopes: 0,
  allowedContracts: [],
  allowedGroups: [],
};

const fullCosigner: CosignerLike = {
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

const fullCosignerSerialized =
  "dec317f6e4335db8a98418bd16960bf4e7fce4c731021443cf98eddbe047e198a3e5d57006311442a0ca1514a1760976db5fcdfab2a9930e8f6ce875b2d182250221031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef";

describe("constructor & export", () => {
  test("default constructor & export", () => {
    const cosigner = new Cosigner();
    expect(cosigner.export()).toStrictEqual(defaultCosigner);
  });

  test("constructor with obj & export", () => {
    const cosigner = new Cosigner(fullCosigner);
    expect(cosigner.export()).toStrictEqual(fullCosigner);
  });
});

describe("add methods", () => {
  test("addAllowedContracts", () => {
    const cosigner = new Cosigner();
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
    const cosigner = new Cosigner();
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

describe("serialize & deserialize", () => {
  test("serialize", () => {
    const cosigner = new Cosigner(fullCosigner);
    expect(cosigner.serialize()).toBe(fullCosignerSerialized);
  });

  test("deserialize", () => {
    expect(
      Cosigner.deserialize(new StringStream(fullCosignerSerialized))
    ).toStrictEqual(fullCosigner);
  });
});
