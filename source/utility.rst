*********
Utilities
*********

The utilities module is exposed as::

  import Neon from 'neon-js'
  Neon.u.reverseHex(hexstring)

  import { u } from 'neon-js'
  u.reverseHex(hexstring)

The utility module contains:

- Format manipulation methods
- Hashing methods
- Utility classes

Format
-------

While most of the methods in Neon takes in strings and outputs strings, the underlying logic requires a lot of format conversions.

::

  import Neon from 'neon-js'
  Neon.u.reverseHex(hexstring)
  Neon.u.num2fixed8(1)
  Neon.u.ab2str(arrayBuffer)

The most common format is hex string. This is a string where every 2 characters represents a byte in an bytearray. ``neon-js`` intentionally works with hex strings because strings are easy to print and manipulate.

A special format used in NEO is the fixed8 number format. It is a fixed point float with precision of 8 decimal places. It is usually received as a hexstring from ``getrawtransaction``. ``neon-js`` has functions to convert it to and from a JS number type.

Hashing
-------

These methods are convenient wrappers around the CryptoJS functions. They take in strings and return strings.

::

  import Neon from 'neon-js'
  // Performs a single SHA
  Neon.u.sha256(item)
  // Performs a SHA followed by a SHA
  Neon.u.hash256(item)
  // Performs a SHA followed by a RIPEMD160
  Neon.u.hash160(item)

Utility Classes
---------------

StringStream is a simple stream object that allows us to read a hexstring byte by byte. It is not an actual stream but fakes the stream interface for better manipulation. It stores the whole string and a pointer to keep track of the current position on the string.

It is used in serializing and deserializing a transaction object. The ScriptBuilder class for smart contracts inherits from StringStream.

::

  import Neon from 'neon-js'
  const ss = new Neon.u.StringStream('abcdefgh')
  ss.read(1) // 'ab'
  ss.read(2) // 'cdef'
  ss.isEmpty() // false
  ss.read(1) // 'gh'
  ss.isEmpty() // true
  ss.str // 'abcdefgh'
