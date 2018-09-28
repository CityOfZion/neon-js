---
id: u
title: Utility
---

The `u` module is exposed as:

```js
import Neon, { u } from "@cityofzion/neon-js";
Neon.u.reverseHex(hexstring);

const fixed8 = new Neon.u.Fixed8(123.456)
```

The utility module contains:

- Format manipulation methods
- Hashing methods
- Utility classes

---

## Classes

### StringStream

StringStream is a simple stream object that allows us to read a hexstring byte by byte. It is not an actual stream but fakes the stream interface for better manipulation. It stores the whole string and a pointer to keep track of the current position on the string.

It is used in serializing and deserializing a transaction object. The ScriptBuilder class for smart contracts inherits from StringStream.

```js
const ss = new Neon.u.StringStream("abcdefgh");
ss.read(1); // 'ab'
ss.read(2); // 'cdef'
ss.isEmpty(); // false
ss.read(1); // 'gh'
ss.isEmpty(); // true
ss.str; // 'abcdefgh'
```

### Fixed8

Fixed8 is a class based off bignumber.js for storage and accurate calculations of values. It is extended to have helper methods for converting between decimal and hex representation.

```js
const a = new Neon.u.Fixed8(1);
a.toHex(); // '0000000005f5e100'
a.toReverseHex(); // '00e1f50500000000'

const b = Neon.u.Fixed8.fromHex("0000000005f5e100"); // 1
const c = new u.Fixed8("2");
const d = u.Fixed8.fromReverseHex("00e1f50500000000");
```

## Methods

### Format

While most of the methods in Neon takes in strings and outputs strings, the underlying logic requires a lot of format conversions.

```js
Neon.u.reverseHex(hexstring);
Neon.u.num2fixed8(1);
Neon.u.ab2str(arrayBuffer);

// Conversions to hex
Neon.u.str2hexstring("normalString"); // 6e6f726d616c537472696e67
Neon.u.int2hex(234); // EA
Neon.u.ab2hexstring(arrayBuffer);

// Conversion from hex
Neon.u.hexstring2str("6e6f726d616c537472696e67"); // normalString
Neon.u.hex2int("EA"); // 234
Neon.u.hexstring2ab(hexString);
```

The most common format is hex string. This is a string where every 2 characters represents a byte in an bytearray. `neon-js` intentionally works with hex strings because strings are easy to print and manipulate.

A special format used in NEO is the fixed8 number format. It is a fixed point float with precision of 8 decimal places. It is usually received as a hexstring from `getrawtransaction`. `neon-js` has functions to convert it to and from a JS number type.

### Hashing

These methods are convenient wrappers around the CryptoJS functions. They take in strings and return strings.

```js
import Neon from "@cityofzion/neon-js";
// Performs a single SHA
Neon.u.sha256(item);
// Performs a SHA followed by a SHA
Neon.u.hash256(item);
// Performs a SHA followed by a RIPEMD160
Neon.u.hash160(item);
```
