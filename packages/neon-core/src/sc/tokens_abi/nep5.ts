import { Fixed8 } from "../../u";
import { NativeNEP5 } from "./native_nep5";

/**
 * Nep5 non-native contract are executed in VM, system fee cannot be computed in advance.
 * So I removed fee property in the result to avoid confusion.
 */
export class NEP5 {
  private nativeNep5: NativeNEP5;
  public constructor(scriptHash = "") {
    this.nativeNep5 = new NativeNEP5("NEP5", scriptHash);
  }

  public name(): string {
    return this.nativeNep5.name().hex;
  }

  public symbol(): string {
    return this.nativeNep5.symbol().hex;
  }

  public decimals(): string {
    return this.nativeNep5.decimals().hex;
  }

  public totalSupply(): string {
    return this.nativeNep5.totalSupply().hex;
  }

  public balanceOf(addr: string): string {
    return this.nativeNep5.balanceOf(addr).hex;
  }

  public transfer(
    fromAddr: string,
    toAddr: string,
    amt: Fixed8 | number
  ): string {
    return this.nativeNep5.transfer(fromAddr, toAddr, amt).hex;
  }
}
