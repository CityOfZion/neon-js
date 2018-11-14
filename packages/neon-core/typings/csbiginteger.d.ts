declare module "csbiginteger" {
  export class csBigInteger {
    constructor(n: number, base?: number);
    toString: (base?: number) => string;
    parse: (s: string, base?: number) => csBigInteger;
    toHexString: () => string;
  }
}
