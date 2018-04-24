---
id: api-u
title: 工具
---

工具模块暴露为：

```js
import Neon from '@cityofzion/neon-js'
Neon.u.reverseHex(hexstring)

import { u } from '@cityofzion/neon-js'
u.reverseHex(hexstring)
```

该工具模块包含：

- 格式操作方法
- 散列法
- 工具类

## 类

### StringStream

`StringStream` 是一个简单的流对象，允许我们逐字节读取一个十六进制字符串。这不是一个实际的流，但假装为流接口以实现更好的操作。它存储整个字符串和一个指针，以跟踪字符串上的当前位置。

它用于序列化和反序列化事务对象。用于智能合约的 `ScriptBuilder` 类从 `StringStream` 继承。

```js
import Neon from '@cityofzion/neon-js'
const ss = new Neon.u.StringStream('abcdefgh')
ss.read(1) // 'ab'
ss.read(2) // 'cdef'
ss.isEmpty() // false
ss.read(1) // 'gh'
ss.isEmpty() // true
ss.str // 'abcdefgh'
```

### Fixed8

Fixed8是一个基于 `bignumber.js` 的类，用于存储和精确计算值。 它被扩展为具有用于在十进制和十六进制表示之间转换的辅助方法。

```js
import Neon from '@cityofzion/neon-js'
const a = new Neon.u.Fixed8(1)
a.toHex()        // '0000000005f5e100'
a.toReverseHex() // '00e1f50500000000'

const b = Neon.u.Fixed8.fromHex('0000000005f5e100') // 1

import {u} from '@cityofzion/neon-js'
const c = new u.Fixed8('2')
const d = u.Fixed8.fromReverseHex('00e1f50500000000')
```

## 方法

### 格式

虽然Neon中的大多数方法都会接受字符串并输出字符串，但底层逻辑需要进行大量的格式转换。

```js
import Neon from '@cityofzion/neon-js'
Neon.u.reverseHex(hexstring)
Neon.u.num2fixed8(1)
Neon.u.ab2str(arrayBuffer)

// Conversions to hex
Neon.u.str2hexstring('normalString') // 6e6f726d616c537472696e67
Neon.u.int2hex(234) // EA
Neon.u.ab2hexstring(arrayBuffer)

// Conversion from hex
Neon.u.hexstring2str('6e6f726d616c537472696e67') // normalString
Neon.u.hex2int('EA') // 234
Neon.u.hexstring2ab(hexString)
```

最常见的格式是十六进制字符串。这是一个字符串，每2个字符代表一个字节数组中的一个字节。`neon-js` 故意使用十六进制字符串，因为字符串很容易打印和操作。

### 散列法

这些方法是围绕在 CryptoJS 函数的方便包装。他们接受字符串并返回字符串。

```js
import Neon from '@cityofzion/neon-js'
// Performs a single SHA
Neon.u.sha256(item)
// Performs a SHA followed by a SHA
Neon.u.hash256(item)
// Performs a SHA followed by a RIPEMD160
Neon.u.hash160(item)
```

