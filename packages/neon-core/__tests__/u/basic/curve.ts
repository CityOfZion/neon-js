import {
  getCurve,
  EllipticCurvePreset,
  EllipticCurve,
} from "../../../src/u/basic/curve";

type CurveData = string[][];
describe("EllipticCurve", () => {
  // http://point-at-infinity.org/ecc/nisttv
  const secp256r1Data = [
    [
      "0000000000000000000000000000000000000000000000000000000000000001",
      "046B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C2964FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5",
      "036B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296",
    ],
    [
      "000000000000000000000000000000000000000000000000000000000000000a",
      "04CEF66D6B2A3A993E591214D1EA223FB545CA6C471C48306E4C36069404C5723F878662A229AAAE906E123CDD9D3B4C10590DED29FE751EEECA34BBAA44AF0773",
      "03CEF66D6B2A3A993E591214D1EA223FB545CA6C471C48306E4C36069404C5723F",
    ],
    [
      "0000000000000000000000000000000000000000000000000000000000000010",
      "0476A94D138A6B41858B821C629836315FCD28392EFF6CA038A5EB4787E1277C6EA985FE61341F260E6CB0A1B5E11E87208599A0040FC78BAA0E9DDD724B8C5110",
      "0276A94D138A6B41858B821C629836315FCD28392EFF6CA038A5EB4787E1277C6E",
    ],
  ];

  // https://ipfs-sec.stackexchange.cloudflare-ipfs.com/crypto/A/question/784.html
  const secp256k1Data = [
    [
      "0000000000000000000000000000000000000000000000000000000000000001",
      "0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8",
      "0279BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798",
    ],
    [
      "000000000000000000000000000000000000000000000000000000000000000a",
      "04A0434D9E47F3C86235477C7B1AE6AE5D3442D49B1943C2B752A68E2A47E247C7893ABA425419BC27A3B6C7E693A24C696F794C2ED877A1593CBEE53B037368D7",
      "03A0434D9E47F3C86235477C7B1AE6AE5D3442D49B1943C2B752A68E2A47E247C7",
    ],
    [
      "0000000000000000000000000000000000000000000000000000000000000010",
      "04E60FCE93B59E9EC53011AABC21C23E97B2A31369B87A5AE9C44EE89E2A6DEC0AF7E3507399E595929DB99F34F57937101296891E44D23F0BE1F32CCE69616821",
      "03E60FCE93B59E9EC53011AABC21C23E97B2A31369B87A5AE9C44EE89E2A6DEC0A",
    ],
  ];

  describe.each([
    ["SECP256R1", getCurve(EllipticCurvePreset.SECP256R1), secp256r1Data],
    ["SECP256K1", getCurve(EllipticCurvePreset.SECP256K1), secp256k1Data],
  ])("%s", (_unused: string, curve: EllipticCurve, curveData: CurveData) => {
    test.each(curveData)(
      "getPublicKey: %s",
      (
        privateKey: string,
        unencodedPublicKey: string,
        encodedPublicKey: string
      ) => {
        expect(curve.getPublicKey(privateKey, false)).toBe(
          unencodedPublicKey.toLowerCase()
        );
        expect(curve.getPublicKey(privateKey)).toBe(
          encodedPublicKey.toLowerCase()
        );
      }
    );

    test.each(curveData)(
      "decodePublicKey: %s",
      (
        _unused: string,
        unencodedPublicKey: string,
        encodedPublicKey: string
      ) => {
        expect(curve.decodePublicKey(encodedPublicKey)).toBe(
          unencodedPublicKey.toLowerCase()
        );
      }
    );

    describe("signing", () => {
      const privateKey = curveData[0][0];
      const publicKey = curveData[0][1];
      const msg = "123456";

      test("signs and verifies successfully", () => {
        const sig = curve.sign(msg, privateKey);
        const verificationResult = curve.verify(msg, sig, publicKey);
        expect(verificationResult).toBeTruthy();
      });

      test("no k provided, signature is different but verifies correctly", () => {
        const sig1 = curve.sign(msg, privateKey);
        const sig2 = curve.sign(msg, privateKey);
        expect(sig1).not.toBe(sig2);
        expect(curve.verify(msg, sig1, publicKey)).toBeTruthy();
        expect(curve.verify(msg, sig2, publicKey)).toBeTruthy();
      });

      test("provided k makes signature deterministic", () => {
        const sig1 = curve.sign(msg, privateKey, "123456");
        const sig2 = curve.sign(msg, privateKey, "123456");
        expect(sig1).toStrictEqual(sig2);
        expect(curve.verify(msg, sig1, publicKey)).toBeTruthy();
      });

      test("k <=0 throws error", () => {
        expect(() => curve.sign(msg, privateKey, -1)).toThrowError(
          "k must be a positive number"
        );
        expect(() => curve.sign(msg, privateKey, 0)).toThrowError(
          "k must be a positive number"
        );
      });

      test("k >= n throws error", () => {
        const largerThanN = "f".repeat(64);
        expect(() => curve.sign(msg, privateKey, largerThanN)).toThrowError(
          "k must be smaller"
        );
      });
    });
  });
});
