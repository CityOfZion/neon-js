import { reverseHex } from "./basic";

/**
 * A simple string stream that allows user to read a hexstring byte by byte using read().
 * @param str - The hexstring to read as a stream.
 *
 * @example
 * const ss = new StringStream("01020304");
 * const zeroOne = ss.read();
 * const zeroTwoZeroThree = ss.read(2);
 */
export class StringStream {
  public str: string;
  public pter: number;

  /**
   * Initializes the stream with given string and pointer at position 0.
   */
  public constructor(str = "") {
    this.str = str;
    this.pter = 0;
  }

  /**
   * Checks if reached the end of the stream. Does not mean stream is actually empty (this.str is not empty).
   *
   * @example
   * const ss = new StringStream("01020304");
   * ss.isEmpty(); // false
   * ss.pter = 3;
   * ss.isEmpty(); // true
   */
  public isEmpty(): boolean {
    return this.pter >= this.str.length;
  }

  /**
   * Peek at the next bytes on the string but does not move the pointer.
   * May return less than intended bytes if reached end of stream.
   *
   * @example
   * const ss = new StringStream("0102");
   * ss.peek();  // "01"
   * ss.peek(5); // "0102"
   */
  public peek(bytes = 1): string {
    if (this.isEmpty()) {
      return "";
    }
    return this.str.substr(this.pter, bytes * 2);
  }

  /**
   * Reads some bytes off the stream.
   * @param bytes - number of bytes to read
   *
   * @example
   * const ss = new StringStream("01020304");
   * ss.read(); // "01"
   * ss.read(2); // "0203"
   */
  public read(bytes = 1): string {
    if (bytes === 0) {
      return "";
    }

    if (this.isEmpty()) {
      throw new Error("Reached the end of the stream!");
    }

    const out = this.str.substr(this.pter, bytes * 2);
    this.pter += bytes * 2;
    return out;
  }

  /**
   * Reads some bytes off the stream.
   * A variable-length integer is first read off the stream and then bytes equal to the integer is read off and returned.
   *
   * @example
   * const ss = new StringStream("03010203040506")
   * const result = ss.readVarBytes(); //010203
   */
  public readVarBytes(): string {
    return this.read(this.readVarInt());
  }

  /**
   * Reads an integer of variable bytelength. May consume up to 9 bytes.
   * The first byte read indicates if more bytes need to be read off.
   * The bytes are read and converted from little endian hexadecimal to number.
   *
   * @example
   * const ss = new StringStream("01");
   * const r1 = ss.readVarInt();
   *
   * const ss2 = new StringStream("fd0102");
   * const r2 = ss.readVarInt(); // 513
   *
   * const ss4 = new StringStream("fe01020304");
   * const r4 = ss.readVarInt(); // 67305985
   *
   * const ss8 = new StringStream("ff0102030405060708");
   * const r8 = ss.readVarInt(); // 578437695752307200
   */
  public readVarInt(): number {
    let len = parseInt(this.read(1), 16);
    if (len === 0xfd) {
      len = parseInt(reverseHex(this.read(2)), 16);
    } else if (len === 0xfe) {
      len = parseInt(reverseHex(this.read(4)), 16);
    } else if (len === 0xff) {
      len = parseInt(reverseHex(this.read(8)), 16);
    }
    return len;
  }

  /**
   * Resets the pointer to start of string.
   *
   * @example
   * const ss = new StringStream("010203");
   * ss.read(); //"01"
   * ss.reset();
   * ss.read(); // "01"
   */
  public reset(): void {
    this.pter = 0;
  }

  /**
   * Returns a printable string of the characters around the pointer.
   * Used for debugging.
   */
  public context(): string {
    const before =
      this.pter > 10
        ? this.str.slice(this.pter - 10, this.pter)
        : this.str.slice(0, this.pter);
    const current = this.read(1);
    const after = this.peek(5);
    this.pter -= 2;
    return `${before}|${current}|${after}`;
  }
}

export default StringStream;
