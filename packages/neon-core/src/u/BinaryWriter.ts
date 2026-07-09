import { HexString } from "./HexString";

const MAX_SCRIPT_SIZE = 0xffff;

export class BinaryWriter {
  private _stream = new Uint8Array(MAX_SCRIPT_SIZE);
  private _view = new DataView(this._stream.buffer);
  private _position = 0;

  writeUint32(value: number): void {
    this._view.setUint32(this._position, value, true);
    this._position += 4;
  }

  writeUint64(value: number | bigint): void {
    let v = value;
    if (typeof value === "number") {
      v = BigInt(value);
    }
    this._view.setBigUint64(this._position, v as bigint, true);
    this._position += 8;
  }

  writeUInt160(value: string): void {
    this.writeBytes(HexString.fromHex(value, true).toArrayBuffer());
  }

  writeUint16(value: number): void {
    this._view.setUint16(this._position, value, true);
    this._position += 2;
  }

  writeBytes(value: Uint8Array): void {
    this._stream.set(value, this._position);
    this._position += value.length;
  }

  writeVarInt(value: number): void {
    if (value < 0) {
      throw new Error("value too small");
    } else if (value < 0xfd) {
      this.writeBytes(new Uint8Array([value]));
    } else if (value <= 0xffff) {
      this.writeBytes(new Uint8Array([0xfd]));
      this.writeUint16(value);
    } else if (value <= 0xffffffff) {
      this.writeBytes(new Uint8Array([0xfe]));
      this.writeUint32(value);
    } else {
      this.writeBytes(new Uint8Array([0xff]));
      this.writeUint64(value);
    }
  }

  writeVarString(value: string): void {
    const data = new TextEncoder().encode(value);
    this.writeVarInt(data.length);
    this._stream.set(data, this._position);
    this._position += data.length;
  }

  toArray(): Uint8Array {
    return this._stream.slice(0, this._position);
  }

  toHex(): string {
    return HexString.fromArrayBuffer(this.toArray()).toString();
  }

  get length(): number {
    return this._position;
  }
}
