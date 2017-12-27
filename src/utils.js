import { SHA256, RIPEMD160, enc } from 'crypto-js'

/**
 * @param {arrayBuffer} buf
 * @returns {string} ASCII string
 */
export const ab2str = buf =>
  String.fromCharCode.apply(null, new Uint8Array(buf))

/**
 * @param {string} str - ASCII string
 * @returns {arrayBuffer}
 */
export const str2ab = str => {
  if (typeof str !== 'string') {
    throw new Error('str2ab expects a string')
  }
  const result = new Uint8Array(str.length)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    result[i] = str.charCodeAt(i)
  }
  return result
}

/**
 * @param {string} str - HEX string
 * @returns {number[]}
 */
export const hexstring2ab = str => {
  if (typeof str !== 'string') {
    throw new Error('hexstring2ab expects a string')
  }
  if (!str.length) return new Uint8Array()
  const iters = str.length / 2
  const result = new Uint8Array(iters)
  for (let i = 0; i < iters; i++) {
    result[i] = parseInt(str.substring(0, 2), 16)
    str = str.substring(2)
  }
  return result
}

/**
 * @param {arrayBuffer} arr
 * @returns {string} HEX string
 */
export const ab2hexstring = arr => {
  if (typeof arr !== 'object') {
    throw new Error('ab2hexstring expects an array')
  }
  let result = ''
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i].toString(16)
    str = str.length === 0 ? '00'
      : str.length === 1 ? '0' + str
        : str
    result += str
  }
  return result
}

/**
 * @param {string} str - ASCII string
 * @returns {string} HEX string
 */
export const str2hexstring = str => ab2hexstring(str2ab(str))

/**
 * @param {string} hexstring - HEX string
 * @returns {string} ASCII string
 */
export const hexstring2str = hexstring => ab2str(hexstring2ab(hexstring))

/**
 * convert an integer to big endian hex and add leading zeros
 * @param {number} num
 * @returns {string}
 */
export const int2hex = num => {
  if (typeof num !== 'number') {
    throw new Error('int2hex expects a number')
  }
  let h = num.toString(16)
  return h.length % 2 ? '0' + h : h
}

/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param {number} num
 * @param {number} size - The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param {boolean} littleEndian - Encode the hex in little endian form
 * @return {string}
 */
export const num2hexstring = (num, size = 1, littleEndian = false) => {
  if (typeof num !== 'number') throw new Error('num must be numeric')
  if (num < 0) throw new RangeError('num is unsigned (>= 0)')
  if (size % 1 !== 0) throw new Error('size must be a whole integer')
  if (!Number.isSafeInteger(num)) throw new RangeError(`num (${num}) must be a safe integer`)
  size = size * 2
  let hexstring = num.toString(16)
  hexstring = hexstring.length % size === 0 ? hexstring : ('0'.repeat(size) + hexstring).substring(hexstring.length)
  if (littleEndian) hexstring = reverseHex(hexstring)
  return hexstring
}

/**
 * Converts a number to a Fixed8 format hex string
 * @param {number} num
 * @param {number} size output size in bytes
 * @return {string} number in Fixed8 representation.
 */
export const num2fixed8 = (num, size = 8) => {
  if (typeof num !== 'number') throw new Error('num must be numeric')
  if (size % 1 !== 0) throw new Error('size must be a whole integer')
  return num2hexstring(Math.round(num * Math.pow(10, 8)), size, true)
}

/**
 * Converts a Fixed8 hex string to its original number
 * @param {string} fixed8hex - number in Fixed8 representation
 * @return {number}
 */
export const fixed82num = (fixed8hex) => {
  if (typeof fixed8hex !== 'string') throw new Error('fixed8hex must be a string')
  if (fixed8hex.length % 2 !== 0) throw new Error('fixed8hex must be hex')
  if (fixed8hex === '') return 0
  return parseInt(reverseHex(fixed8hex), 16) / Math.pow(10, 8)
}

/**
 * Converts a number to a variable length Int. Used for array length header
 * @param {number} num - The number
 * @returns {string} hexstring of the variable Int.
 */
export const num2VarInt = (num) => {
  if (num < 0xfd) {
    return num2hexstring(num)
  } else if (num <= 0xffff) {
    // uint16
    return 'fd' + num2hexstring(num, 2, true)
  } else if (num <= 0xffffffff) {
    // uint32
    return 'fe' + num2hexstring(num, 4, true)
  } else {
    // uint64
    return 'ff' + num2hexstring(num, 8, true)
  }
}

/**
 * XORs two hexstrings
 * @param {string} str1 - HEX string
 * @param {string} str2 - HEX string
 * @returns {string} XOR output as a HEX string
 */
export const hexXor = (str1, str2) => {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') throw new Error('hexXor expects hex strings')
  if (str1.length !== str2.length) throw new Error('strings are disparate lengths')
  if (str1.length % 2 !== 0) throw new Error('strings must be hex')
  const result = []
  for (let i = 0; i < str1.length; i += 2) {
    result.push(parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16))
  }
  return ab2hexstring(result)
}

/**
 * Reverses an array. Accepts arrayBuffer.
 * @param {Array} arr
 * @returns {Uint8Array}
 */
export const reverseArray = arr => {
  if (typeof arr !== 'object' || !arr.length) throw new Error('reverseArray expects an array')
  let result = new Uint8Array(arr.length)
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i]
  }

  return result
}

/**
 * Reverses a HEX string, treating 2 chars as a byte.
 * @example
 * reverseHex('abcdef') = 'efcdab'
 * @param {string} hex - HEX string
 * @return {string} HEX string reversed in 2s.
 */
export const reverseHex = hex => {
  if (typeof hex !== 'string') throw new Error('reverseHex expects a string')
  if (hex.length % 2 !== 0) throw new Error(`Incorrect Length: ${hex}`)
  let out = ''
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    out += hex.substr(i, 2)
  }
  return out
}

/**
 * @class StringStream
 * @classdesc A simple string stream that allows user to read a string byte by byte using read().
 * @param {string} str - The string to read as a stream.
 */
export class StringStream {
  constructor (str = '') {
    this.str = str
    this.pter = 0
  }

  /**
   * Checks if reached the end of the stream. Does not mean stream is actually empty (this.str is not empty)
   * @returns {boolean}
   */
  isEmpty () {
    return this.pter >= this.str.length
  }

  /**
   * Reads some bytes off the stream.
   * @param {number} bytes - Number of bytes to read
   * @returns {string}
   */
  read (bytes) {
    if (this.isEmpty()) throw new Error()
    const out = this.str.substr(this.pter, bytes * 2)
    this.pter += bytes * 2
    return out
  }

  /**
   * Reads some bytes off the stream using the first byte as the length indicator.
   * @return {string}
   */
  readVarBytes () {
    return this.read(this.readVarInt())
  }

  /**
   * Reads a variable Int.
   * @returns {number}
   */
  readVarInt () {
    let len = parseInt(this.read(1), 16)
    if (len === 0xfd) len = parseInt(reverseHex(this.read(2)), 16)
    else if (len === 0xfe) len = parseInt(reverseHex(this.read(4)), 16)
    else if (len === 0xff) len = parseInt(reverseHex(this.read(8)), 16)
    return len
  }
}

/**
 * Performs a SHA256 followed by a RIPEMD160.
 * @param {string} hex - String to hash
 * @returns {string} hash output
 */
export const hash160 = (hex) => {
  if (typeof hex !== 'string') throw new Error('reverseHex expects a string')
  if (hex.length % 2 !== 0) throw new Error(`Incorrect Length: ${hex}`)
  let hexEncoded = enc.Hex.parse(hex)
  let ProgramSha256 = SHA256(hexEncoded)
  return RIPEMD160(ProgramSha256).toString()
}

/**
 * Performs 2 SHA256.
 * @param {string} hex - String to hash
 * @returns {string} hash output
 */
export const hash256 = (hex) => {
  if (typeof hex !== 'string') throw new Error('reverseHex expects a string')
  if (hex.length % 2 !== 0) throw new Error(`Incorrect Length: ${hex}`)
  let hexEncoded = enc.Hex.parse(hex)
  let ProgramSha256 = SHA256(hexEncoded)
  return SHA256(ProgramSha256).toString()
}

/**
 * Performs a single SHA256.
 * @param {string} hex - String to hash
 * @returns {string} hash output
 */
export const sha256 = (hex) => {
  if (typeof hex !== 'string') throw new Error('reverseHex expects a string')
  if (hex.length % 2 !== 0) throw new Error(`Incorrect Length: ${hex}`)
  let hexEncoded = enc.Hex.parse(hex)
  return SHA256(hexEncoded).toString()
}
