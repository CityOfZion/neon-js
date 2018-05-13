import {
  ab2hexstring,
  ab2str,
  fixed82num,
  hash160,
  hash256,
  hexstring2ab,
  hexXor,
  int2hex,
  num2fixed8,
  num2hexstring,
  num2VarInt,
  reverseArray,
  reverseHex,
  isHex,
  sha256,
  str2ab,
  str2hexstring,
  Fixed8
} from '../../src/utils'

describe('Utils', () => {
  describe('ab2str', () => {
    const testingab = [84, 101, 115, 116]
    it('converts an empty array to an empty string', () => {
      const actual = ab2str([])
      const expected = ''
      actual.should.eql(expected)
    })
    it('converts an array of ascii bytes to string', () => {
      const actual = ab2str(testingab)
      const expected = 'Test'
      actual.should.eql(expected)
    })
    it('converts an arraybuffer of ascii bytes to string', () => {
      const buffer = new Uint8Array(testingab).buffer
      const actual = ab2str(buffer)
      const expected = 'Test'
      actual.should.eql(expected)
    })
  })

  describe('str2ab', () => {
    it('throws if non-string', () => {
      (() => str2ab([0])).should.throw()
    })
    it('converts an empty string to an empty array', () => {
      const actual = str2ab('')
      actual.length.should.eql(0)
    })
    it('converts a string to an array of ascii bytes', () => {
      const actual = str2ab('Test')
      const expected = new Uint8Array([84, 101, 115, 116])
      actual.should.eql(expected)
    })
  })

  describe('hexstring2ab', () => {
    it('throws if non-string', () => {
      (() => hexstring2ab([0])).should.throw()
    })
    it('converts an empty string to an empty array', () => {
      const actual = hexstring2ab('')
      actual.length.should.eql(0)
    })
    it('converts a hex string to an array of ascii bytes', () => {
      const actual = hexstring2ab('54657374')
      actual.should.eql(new Uint8Array([84, 101, 115, 116]))
    })
  })

  describe('ab2hexstring', () => {
    it('throws if non-array', () => {
      (() => ab2hexstring('Test')).should.throw()
    })
    it('converts an empty array to an empty string', () => {
      const actual = ab2hexstring([])
      actual.should.eql('')
    })
    it('converts a an array of ascii bytes to a hex string', () => {
      const actual = ab2hexstring(new Uint8Array([84, 101, 115, 116]))
      actual.should.eql('54657374')
    })
  })

  describe('str2hexstring', () => {
    it('throws if non-string', () => {
      (() => str2hexstring([0])).should.throw()
    })
    it('converts an empty string to an empty string', () => {
      const actual = str2hexstring('')
      actual.should.eql('')
    })
    it('converts a string to a hex string', () => {
      const actual = str2hexstring('Test')
      actual.should.eql('54657374')
    })
  })

  describe('int2hex (BE)', () => {
    it('throws if non-number', () => {
      (() => int2hex('01')).should.throw()
    })
    it('converts a number to its hex form', () => {
      const actual = int2hex(0x00)
      actual.should.eql('00')
    })
    it('converts a number to its hex form (big)', () => {
      const actual = int2hex(0xFFF000F)
      actual.should.eql('0fff000f')
    })
  })

  describe('num2hexstring (BE)', () => {
    it('throws if negative', () => {
      (() => num2hexstring(-1)).should.throw()
    })
    it('throws if non-integer', () => {
      (() => num2hexstring(0.1)).should.throw()
    })
    it('throws if non-integer size', () => {
      (() => num2hexstring(1, 0.1)).should.throw()
    })
    it('throws if not a number', () => {
      (() => num2hexstring('1')).should.throw()
    })
    it('throws if unsafe', () => {
      (() => num2hexstring(Number.MAX_SAFE_INTEGER + 1)).should.throw()
    })
    it('converts a byte size int', () => {
      const actual = num2hexstring(1)
      const expected = '01'
      actual.should.eql(expected)
    })
    it('converts a byte size int (max)', () => {
      const actual = num2hexstring(0xff)
      const expected = 'ff'
      actual.should.eql(expected)
    })
    it('converts a uint16', () => {
      const num = 0xff
      const actual = num2hexstring(num, 2)
      const expected = '00ff'
      Number.parseInt(expected, 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint16 (max)', () => {
      const num = 0xffff
      const actual = num2hexstring(num, 2)
      const expected = 'ffff'
      Number.parseInt(expected, 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint32', () => {
      const num = 0x010000
      const actual = num2hexstring(num, 4)
      const expected = '00010000'
      Number.parseInt(expected, 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint32 (max)', () => {
      const num = 0xffffffff
      const actual = num2hexstring(num, 4)
      const expected = 'ffffffff'
      Number.parseInt(expected, 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint64', () => {
      const num = 0x0100000000
      const actual = num2hexstring(num, 8)
      const expected = '0000000100000000'
      Number.parseInt(expected, 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint64 (max)', () => {
      const num = Number.MAX_SAFE_INTEGER
      const actual = num2hexstring(num, 8) // 0x1fffffffffffff
      const expected = '001fffffffffffff'
      Number.parseInt(expected, 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint64 (max) (little endian)', () => {
      const num = Number.MAX_SAFE_INTEGER
      const actual = num2hexstring(num, 8, true) // 0x1fffffffffffff
      const expected = 'ffffffffffff1f00'
      Number.parseInt(reverseHex(expected), 16).should.eql(num)
      actual.should.eql(expected)
    })
  })

  describe('num2fixed8', () => {
    it('throws if not a number', () => {
      (() => num2fixed8('1')).should.throw()
    })
    it('converts a number to fixed8 hex', () => {
      const actual = num2fixed8(1)
      const expected = '00e1f50500000000'
      actual.should.eql(expected)
    })
    it('converts a big number with decimal places', () => {
      const actual = num2fixed8(123456.12345678)
      const expected = '4ea1d66f3a0b0000'
      actual.should.eql(expected)
    })
  })

  describe('fixed82num', () => {
    it('throws if not a string', () => {
      (() => fixed82num(1)).should.throw()
    })
    it('throws if non-hex string', () => {
      (() => fixed82num('xxx')).should.throw()
    })
    it('converts an empty string to zero', () => {
      const actual = fixed82num('')
      const expected = 0
      actual.should.eql(expected)
    })
    it('converts a number to fixed8 hex', () => {
      const actual = fixed82num('00e1f50500000000')
      const expected = 1
      actual.should.eql(expected)
    })
    it('converts a big number with decimal places', () => {
      const actual = fixed82num('4ea1d66f3a0b0000')
      const expected = 123456.12345678
      actual.should.eql(expected)
    })
  })

  describe('num2VarInt (LE)', () => {
    it('throws if negative', () => {
      (() => num2VarInt(-1)).should.throw()
    })
    it('throws if not a number', () => {
      (() => num2VarInt('1')).should.throw()
    })
    it('throws if unsafe', () => {
      (() => num2VarInt(Number.MAX_SAFE_INTEGER + 1)).should.throw()
    })
    it('converts a byte size int', () => {
      const actual = num2VarInt(1)
      const expected = '01'
      actual.should.eql(expected)
    })
    it('converts a byte size int (max)', () => {
      const actual = num2VarInt(0xfc)
      const expected = 'fc'
      actual.should.eql(expected)
    })
    it('converts a uint16', () => {
      const num = 0xfd
      const actual = num2VarInt(num)
      const expected = 'fdfd00'
      Number.parseInt(reverseHex(expected.substr(2)), 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint16 (max)', () => {
      const num = 0xffff
      const actual = num2VarInt(num)
      const expected = 'fdffff'
      Number.parseInt(reverseHex(expected.substr(2)), 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint32', () => {
      const num = 0x010000
      const actual = num2VarInt(num)
      const expected = 'fe00000100'
      Number.parseInt(reverseHex(expected.substr(2)), 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint32 (max)', () => {
      const num = 0xffffffff
      const actual = num2VarInt(num)
      const expected = 'feffffffff'
      Number.parseInt(reverseHex(expected.substr(2)), 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint64', () => {
      const num = 0x0100000000
      const actual = num2VarInt(num)
      const expected = 'ff0000000001000000'
      Number.parseInt(reverseHex(expected.substr(2)), 16).should.eql(num)
      actual.should.eql(expected)
    })
    it('converts a uint64 (max)', () => {
      const num = Number.MAX_SAFE_INTEGER
      const actual = num2VarInt(num) // 0x1fffffffffffff
      const expected = 'ffffffffffffff1f00'
      Number.parseInt(reverseHex(expected.substr(2)), 16).should.eql(num)
      actual.should.eql(expected)
    })
  })

  describe('hexXor', () => {
    it('throws if not a string', () => {
      (() => hexXor(0x0101, 0x0000)).should.throw()
    })
    it('throws if disparate lengths', () => {
      (() => hexXor('0101', '000')).should.throw()
    })
    it('xors a hex string', () => {
      const actual = hexXor('0101', '0001')
      const expected = '0100'
      actual.should.eql(expected)
    })
  })

  describe('reverseArray', () => {
    it('throws if not an array', () => {
      (() => reverseArray('123')).should.throw()
    })
    it('reverses an array of ints', () => {
      const actual = reverseArray([1, 2, 3])
      const expected = new Uint8Array([3, 2, 1])
      actual.should.eql(expected)
    })
    it('reverses a Uint8Array', () => {
      const actual = reverseArray(new Uint8Array([1, 2, 3]))
      const expected = new Uint8Array([3, 2, 1])
      actual.should.eql(expected)
    })
  })

  describe('reverseHex', () => {
    it('throws if not a string', () => {
      (() => reverseHex(0x01)).should.throw()
    })
    it('throws if not hex', () => {
      (() => reverseHex('fff')).should.throw()
    })
    it('reverses hex', () => {
      const actual = reverseHex('feff')
      const expected = 'fffe'
      actual.should.eql(expected)
    })
  })

  describe('isHex', () => {
    it('true given hexstring', () => {
      isHex('abcd').should.equal(true)
      isHex('D1F2').should.equal(true)
      isHex('9090').should.equal(true)
      isHex('').should.equal(true)
    })

    it('false given non hexstring', () => {
      isHex('0x12').should.equal(false)
      isHex('*123').should.equal(false)
      isHex('1').should.equal(false)
    })
  })

  describe('hash160', () => {
    it('throws if not a string', () => {
      (() => hash160(0x01)).should.throw()
    })
    it('throws if not hex', () => {
      (() => hash160('fff')).should.throw()
    })
    it('produces a ripemd160 + sha256 from the given hex', () => {
      const actual = hash160('54657374')
      const expected = '0d6d086ce847371e069db7f67c5de45ed9ef1e54'
      actual.should.eql(expected)
    })
  })

  describe('hash256', () => {
    it('throws if not a string', () => {
      (() => hash256(0x01)).should.throw()
    })
    it('throws if not hex', () => {
      (() => hash256('fff')).should.throw()
    })
    it('produces a double sha256 from the given hex', () => {
      const actual = hash256('54657374')
      const expected = 'c60907e990745f7d91c4423713764d2724571269d3db4856d37c6302792c59a6'
      actual.should.eql(expected)
    })
  })

  describe('sha256', () => {
    it('throws if not a string', () => {
      (() => sha256(0x01)).should.throw()
    })
    it('throws if not hex', () => {
      (() => sha256('fff')).should.throw()
    })
    it('produces a sha256 from the given hex', () => {
      const input = '54657374'
      const actual = sha256(input)
      const expected = '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25'
      const again = sha256(expected)
      actual.should.eql(expected)
      again.should.eql(hash256(input))
    })
  })

  describe('Fixed8', () => {
    describe('constructor', () => {
      it('number', () => {
        let result = new Fixed8(1.23456789).toString()
        result.should.eql('1.23456789')
      })

      it('hex', () => {
        let result = new Fixed8('0000000005f5e100', 16).toNumber()
        result.should.eql(100000000)
      })

      it('string', () => {
        let result = new Fixed8('1.23456789').toNumber()
        result.should.eql(1.23456789)
      })

      it('Fixed8', () => {
        let anotherFixed8 = new Fixed8(1)
        let result = new Fixed8(anotherFixed8).toNumber()
        result.should.eql(1)
      })
    })
    it('fromHex', () => {
      let result = Fixed8.fromHex('0000000005f5e100').toNumber()
      result.should.eql(1)
    })

    it('fromReverseHex', () => {
      let result = Fixed8.fromReverseHex('00e1f50500000000').toNumber()
      result.should.eql(1)
    })

    it('toHex', () => {
      let result = new Fixed8(1).toHex()
      result.should.eql('0000000005f5e100')
    })

    it('toReverseHex', () => {
      let result = new Fixed8(1).toReverseHex()
      result.should.eql('00e1f50500000000')
    })
  })
})
