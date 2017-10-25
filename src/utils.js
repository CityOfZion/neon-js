import CryptoJS from 'crypto-js'

/**
 * @param {arrayBuffer} buf
 * @returns {string} ASCII string
 */
export const ab2str = buf => { return String.fromCharCode.apply(null, new Uint8Array(buf)) }

/**
 * @param {string} str - ASCII string
 * @returns {arrayBuffer}
 */
export const str2ab = str => {
  let bufView = new Uint8Array(str.length)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return bufView
}

/**
 * @param {string} str - HEX string
 * @returns {arrayBuffer}
 */
export const hexstring2ab = str => {
  let result = []
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16))
    str = str.substring(2, str.length)
  }

  return result
}

/**
 * @param {arrayBuffer} arr
 * @returns {string} HEX string
 */
export const ab2hexstring = arr => {
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
export const str2hexstring = str => {
  return ab2hexstring(str2ab(str))
}

/**
 * convert an integer to hex and add leading zeros
 * @param {number} mNumber
 * @returns {string}
 */
export const int2hex = mNumber => {
  let h = mNumber.toString(16)
  return h.length % 2 ? '0' + h : h
}

/**
 * Converts a number to a hexstring of a suitable size
 * @param {number} num
 * @param {number} size - The required size in chars, eg 2 for Uint8, 4 for Uint16. Defaults to 2.
 */
export const num2hexstring = (num, size = 2) => {
  let hexstring = num.toString(16)
  return hexstring.length % size === 0 ? hexstring : ('0'.repeat(size) + hexstring).substring(hexstring.length)
}

/**
 * Converts a number to a Fixed8 format string
 * @param {number} num
 * @return {string} number in Fixed8 representation.
 */
export const num2fixed8 = (num) => {
  const hexValue = Math.round(num * 100000000).toString(16)
  return reverseHex(('0000000000000000' + hexValue).substring(hexValue.length))
}

/**
 * Converts a Fixed8 string to number
 * @param {string} fixed8 - number in Fixed8 representation
 * @return {number}
 */
export const fixed82num = (fixed8) => {
  return parseInt(reverseHex(fixed8), 16) / 100000000
}

/**
 * Converts a number to a variable length Int. Used for array length header
 * @param num - The number
 * @returns {string} hexstring of the variable Int.
 */
export const num2VarInt = (num) => {
  if (num < 0xfd) {
    return num2hexstring(num)
  } else if (num <= 0xffff) {
    return 'fd' + num2hexstring(num, 4)
  } else if (num <= 0xffffffff) {
    return 'fe' + num2hexstring(num, 8)
  } else {
    return 'ff' + num2hexstring(num, 8) + num2hexstring(num / Math.pow(2, 32), 8)
  }
}

/**
 * XORs two hexstrings
 * @param {string} str1 - HEX string
 * @param {string} str2 - HEX string
 * @returns {string} XOR output as a HEX string
 */
export const hexXor = (str1, str2) => {
  if (str1.length !== str2.length) throw new Error()
  if (str1.length % 2 !== 0) throw new Error()
  const result = []
  for (let i = 0; i < str1.length; i += 2) {
    result.push(parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16))
  }
  return ab2hexstring(result)
}

/**
 * Reverses an array. Accepts arrayBuffer.
 * @param {Array} arr
 * @param {Uint8Array}
 */
export const reverseArray = arr => {
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
  let hexEncoded = CryptoJS.enc.Hex.parse(hex)
  let ProgramSha256 = CryptoJS.SHA256(hexEncoded)
  return CryptoJS.RIPEMD160(ProgramSha256).toString()
}

/**
 * Performs 2 SHA256.
 * @param {string} hex - String to hash
 * @returns {string} hash output
 */
export const hash256 = (hex) => {
  let hexEncoded = CryptoJS.enc.Hex.parse(hex)
  let ProgramSha256 = CryptoJS.SHA256(hexEncoded)
  return CryptoJS.SHA256(ProgramSha256).toString()
}

/**
 * Performs a single SHA256.
 * @param {string} hex - String to hash
 * @returns {string} hash output
 */
export const sha256 = (hex) => {
  let hexEncoded = CryptoJS.enc.Hex.parse(hex)
  return CryptoJS.SHA256(hexEncoded).toString()
}
