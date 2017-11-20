import { num2VarInt, reverseHex } from '../src/utils'

describe('Utils', () => {
  describe('num2VarInt', () => {
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
})
