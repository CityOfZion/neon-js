---
id: u
title: Utility
---

The `u` module is exposed as:

```js
import Neon, { u } from "@cityofzion/neon-js";
Neon.u.reverseHex(hexstring);

```

The utility module contains:

- Format manipulation methods
- Hashing methods
- Utility classes

---

## Classes

### StringStream

StringStream is a simple stream object that allows us to read a hexstring byte
by byte. It is not an actual stream but fakes the stream interface for better
manipulation. It stores the whole string and a pointer to keep track of the
current position on the string.

It is used in serializing and deserializing a transaction object. The
ScriptBuilder class for smart contracts inherits from StringStream.

```js
const ss = new Neon.u.StringStream("abcdefgh");
ss.read(1); // 'ab'
ss.read(2); // 'cdef'
ss.isEmpty(); // false
ss.read(1); // 'gh'
ss.isEmpty(); // true
ss.str; // 'abcdefgh'
```

## Methods

### Format

While most of the methods in Neon takes in strings and outputs strings, the
underlying logic requires a lot of format conversions.

```js
Neon.u.reverseHex(hexstring);
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

The most common format is hex string. This is a string where every 2 characters
represents a byte in an bytearray. `neon-js` intentionally works with hex
strings because strings are easy to print and manipulate.

### Hashing

These methods are convenient wrappers around the CryptoJS functions. They take
in strings and return strings.

```js
import Neon from "@cityofzion/neon-js";
// Performs a single SHA
Neon.u.sha256(item);
// Performs a SHA followed by a SHA
Neon.u.hash256(item);
// Performs a SHA followed by a RIPEMD160
Neon.u.hash160(item);
```
