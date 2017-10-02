const ab2str = buf => String.fromCharCode.apply(null, new Uint8Array(buf));

const str2ab = str => {
  const bufView = new Uint8Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

const hexstring2ab = str => {
  const result = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }
  return result;
}

const ab2hexstring = arr => {
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i].toString(16);
    str = str.length == 0 ? '00' :
      str.length == 1 ? `0${str}` :
        str;
    result += str;
  }
  return result;
}

/**
 * Converts a number to a hexstring of a suitable size
 * @param {number} num
 * @param {number} size - The required size in chars, eg 2 for Uint8, 4 for Uint16. Defaults to 2.
 */
const num2hexstring = (num, size = 2) => {
  let hexstring = num.toString(16)
  return hexstring.length % size === 0 ? hexstring : ('0'.repeat(size) + hexstring).substring(hexstring.length)
}

/**
 * Converts a number to a Fixed8 format string
 * @param {number} num
 * @return {string} number in Fixed8 representation.
 */
const num2fixed8 = (num) => {
  const hexValue = (num * 100000000).toString(16)
  return reverseHex(('0000000000000000' + hexValue).substring(hexValue.length))
}

/**
 * Converts a Fixed8 string to number
 * @param {string} fixed8
 * @return {number}
 */
const fixed82num = (fixed8) => {
  return parseInt(reverseHex(fixed8), 16) / 100000000
}
/**
 * Converts a number to a variable length Int. Used for array length header
 * @param num - The number
 * @returns {string} hexstring of the variable Int.
 */
const num2VarInt = (num) => {
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

const hexXor = (str1, str2) => {
  console.log(str1, str2);
  if (str1.length !== str2.length) throw new Error()
  if (str1.length % 2 !== 0) throw new Error()
  const result = [];
  for (let i = 0; i < str1.length; i += 2) {
    result.push(parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16));
  }
  return ab2hexstring(result);
}

const reverseArray = arr => {
  const result = new Uint8Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i];
  }
  return result;
}

const reverseHex = hex => {
  if (hex.length % 2 !== 0) throw new Error(`Incorrect Length: ${hex}`)
  let out = ''
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    out += hex.substr(i, 2)
  }
  return out
}

const numStoreInMemory = (num, length) => {
  for (let i = num.length; i < length; i++) {
    num = `0${num}`;
  }
  return ab2hexstring(reverseArray(Buffer.from(num, 'hex')));
}

const stringToBytes = str => {
  const arr = [],
    utf8 = unescape(encodeURIComponent(str));
  for (let i = 0; i < utf8.length; i++) {
    arr.push(utf8.charCodeAt(i));
  }
  return arr;
}

const getTransferTxData = (txData) => {
  const ba = new Buffer(txData, 'hex'),
    Transaction = () => {
      this.type = 0;
      this.version = 0;
      this.attributes = '';
      this.inputs = [];
      this.outputs = [];
    },
    tx = new Transaction();

  // Transfer Type
  if (ba[0] != 0x80) return;
  tx.type = ba[0];

  // Version
  tx.version = ba[1];

  // Attributes
  let k = 2,
    len = ba[k];

  for (i = 0; i < len; i++) {
    k = k + 1;
  }

  // Inputs
  k = k + 1;
  len = ba[k];
  for (i = 0; i < len; i++) {
    tx.inputs.push({
      txid: ba.slice(k + 1, k + 33),
      index: ba.slice(k + 33, k + 35)
    });
    //console.log( "txid:", tx.inputs[i].txid );
    //console.log( "index:", tx.inputs[i].index );
    k = k + 34;
  }

  // Outputs
  k = k + 1;
  len = ba[k];
  for (i = 0; i < len; i++) {
    tx.outputs.push({
      assetid: ba.slice(k + 1, k + 33),
      value: ba.slice(k + 33, k + 41),
      scripthash: ba.slice(k + 41, k + 61)
    });
    //console.log( "outputs.assetid:", tx.outputs[i].assetid );
    //console.log( "outputs.value:", tx.outputs[i].value );
    //console.log( "outputs.scripthash:", tx.outputs[i].scripthash );
    k = k + 60;
  }

  return tx;
}

class StringStream {
  constructor(str = '') {
    this.str = str
    this.pter = 0
  }

  isEmpty() {
    return this.pter >= this.str.length
  }

  read(bytes) {
    if (this.isEmpty()) throw new Error()
    const out = this.str.substr(this.pter, bytes * 2)
    this.pter += bytes * 2
    return out
  }

  readVarBytes() {
    return this.read(this.readVarInt())
  }
  readVarInt() {
    let len = parseInt(this.read(1), 16)
    if (len === 0xfd) { len = parseInt(reverseHex(this.read(2)), 16) }
    else if (len === 0xfe) { len = parseInt(reverseHex(this.read(4)), 16) }
    else if (len === 0xff) { len = parseInt(reverseHex(this.read(8)), 16) }
    return len
  }
}

export {
  ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes,
  hexXor,
  num2hexstring,
  StringStream,
  reverseHex,
  num2VarInt,
  num2fixed8,
  fixed82num
}
