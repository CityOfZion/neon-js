import Deserialize from '../../../src/sc/Deserialize'
import { hexstring2str, reverseHex } from '../../../src/utils'

describe('Deserialize', () => {
  it('should pass with array', () => {
    const toDeserialize = '800300126d65737361676520746f206d7973656c66210204438ffc5a001423ba2703c53263e8d6e522dc32203339dcd8eee9'

    const d = Deserialize(toDeserialize)
    d.value.forEach(v => {
      if (v.type === 'Integer') console.warn(parseInt(reverseHex(v.value), 16))
      else console.warn(hexstring2str(v.value))
    })

    d.type.should.eql('Array')
    d.value.length.should.eql(3)
  })

  it('should pass with nested large bytearray', () => {
    const toDeserialize = '800300fdfd00617366617366617366617366617366617320666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173666173206661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661736661207366617366743235330204e20aff5a001486d0b148dd9c0b5cd2382428d3cd0fd0969aade4'

    const d = Deserialize(toDeserialize)
    d.value.forEach(v => {
      if (v.type === 'Integer') console.warn(parseInt(reverseHex(v.value), 16))
      else console.warn(hexstring2str(v.value))
    })

    d.type.should.eql('Array')
    d.value.length.should.eql(3)
  })
})
