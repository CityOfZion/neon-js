import { num2VarInt } from '../src/utils'

describe('Utils', () => {
  describe('num2VarInt', () => {
    it('converts a byte int', () => {
      const actual = num2VarInt(1)
      const expected = '01'
      actual.should.eql(expected)
    })
    it('converts a byte int (max)', () => {
      const actual = num2VarInt(0xfc)
      const expected = 'fc'
      actual.should.eql(expected)
    })
    it('converts a uint16', () => {
      const actual = num2VarInt(0xfd)
      const expected = 'fdfd00'
      actual.should.eql(expected)
    })
    it('converts a uint16 (max)', () => {
      const actual = num2VarInt(0xffff)
      const expected = 'fdffff'
      actual.should.eql(expected)
    })
    it('converts a uint32', () => {
      const actual = num2VarInt(0x010000)
      const expected = 'fe00000100'
      actual.should.eql(expected)
    })
    it('converts a uint32 (max)', () => {
      const actual = num2VarInt(0xffffffff)
      const expected = 'feffffffff'
      actual.should.eql(expected)
    })
    it('converts a uint64', () => {
      const actual = num2VarInt(0x0100000000)
      const expected = 'ff0000000001000000'
      actual.should.eql(expected)
    })
    it('converts a uint64 (max)', () => {
      const actual = num2VarInt(Number.MAX_SAFE_INTEGER) // 0x1fffffffffffff
      const expected = 'ffffffffffffff1f00'
      actual.should.eql(expected)
    })
  })
})
