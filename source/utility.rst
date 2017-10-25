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
- utility classes

Format
-------

While most of the methods in Neon takes in strings and outputs strings, the underlying logic requires a lot of format conversions.

::

  import Neon from 'neon-js'
  Neon.u.reverseHex(hexstring)
  Neon.u.num2fixed8(1)
  Neon.u.ab2str(arrayBuffer)

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

.. autoclass:: StringStream
