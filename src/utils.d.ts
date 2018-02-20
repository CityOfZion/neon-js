import { BigNumber } from 'bignumber.js'

export function ab2str(buf: ArrayBuffer): string
export function str2ab(str: string): ArrayBuffer
export function hexstring2ab(str: string): number[]
export function ab2hexstring(arr: ArrayBuffer): string
export function str2hexstring(str: string): string
export function hexstring2str(hexstring: string): string
export function int2hex(mNumber: number): string
export function num2hexstring(num: number, size: number, littleEndian?: boolean): string
export function num2fixed8(num: number, size?: number): string
export function fixed82num(fixed8: string): number
export function num2VarInt(num: number): string
export function hexXor(str1: string, str2: string): string
export function reverseArray(arr: Array<number>): Uint8Array
export function reverseHex(hex: string): string
export function isHex(str: string): boolean
export function ensureHex(str: string): void

export class StringStream {
  public pter: 0
  public str: string

  constructor(str?: string)

  public isEmpty(): boolean
  public read(bytes: number): string
  public readVarBytes(): string
  public readVarInt(): string
}

export function hash160(hex: string): string
export function hash256(hex: string): string
export function sha256(hex: string): string

export class Fixed8 extends BigNumber {

  public toHex(): string
  public toReverseHex(): string
  static fromHex(hex: string): Fixed8
  static fromReverseHex(hex: string): Fixed8
}


