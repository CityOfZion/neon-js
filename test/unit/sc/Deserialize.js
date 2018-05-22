import Deserialize from '../../../src/sc/Deserialize'
import { hexstring2str, reverseHex } from '../../../src/utils'

import serializedData from './serializedData.json'

describe('Deserialize', () => {
  it('ByteArray', () => {
    const toSerialize = serializedData.byteArray
    const d = Deserialize(toSerialize)

    d.type.should.eql('ByteArray')
    hexstring2str(d.value).should.eql('message to myself!')
  })

  it('Integer', () => {
    const toSerialize = serializedData.integer
    const d = Deserialize(toSerialize)

    d.type.should.eql('Integer')
    parseInt(reverseHex(d.value), 16).toString().should.eql('1526501187')
  })

  it('Array', () => {
    const toSerialize = serializedData.array
    const d = Deserialize(toSerialize)

    d.type.should.eql('Array')
    d.value.length.should.eql(2)
    d.value[0].type.should.eql('ByteArray')
    d.value[1].type.should.eql('Integer')
    hexstring2str(d.value[0].value).should.eql('message to myself!')
    parseInt(reverseHex(d.value[1].value), 16).toString().should.eql('1526501187')
  })

  it('longString (length > 0xFD)', () => {
    const toSerialize = serializedData.longString
    const d = Deserialize(toSerialize)

    d.type.should.eql('ByteArray')
    hexstring2str(d.value).should.eql('asfasfasfasfasfas fasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfas fasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfa sfasft253')
  })

  // TODO: booleans, structs, maps, even longer strings
})
