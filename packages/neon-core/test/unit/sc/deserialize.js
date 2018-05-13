import deserialize from '../../../src/sc/deserialize'
import { hexstring2str, reverseHex } from '../../../src/utils'

import serializedData from './serializedData.json'

describe('deserialize', () => {
  it('ByteArray', () => {
    const toSerialize = serializedData.byteArray
    const d = deserialize(toSerialize)

    d.type.should.eql('ByteArray')
    hexstring2str(d.value).should.eql('message to myself!')
  })

  it('Integer', () => {
    const toSerialize = serializedData.integer
    const d = deserialize(toSerialize)

    d.type.should.eql('Integer')
    parseInt(reverseHex(d.value), 16).toString().should.eql('1526501187')
  })

  it('Array', () => {
    const toSerialize = serializedData.array
    const d = deserialize(toSerialize)

    d.type.should.eql('Array')
    d.value.length.should.eql(2)
    d.value[0].type.should.eql('ByteArray')
    d.value[1].type.should.eql('Integer')
    hexstring2str(d.value[0].value).should.eql('message to myself!')
    parseInt(reverseHex(d.value[1].value), 16).toString().should.eql('1526501187')
  })

  it('map', () => {
    const toSerialize = serializedData.map
    const d = deserialize(toSerialize)

    d.type.should.eql('Map')
    d.value.length.should.eql(5)
    d.value[0].key.type.should.eql('ByteArray')
    d.value[0].key.value.should.eql('61')
    d.value[0].value.type.should.eql('Integer')
    d.value[0].value.value.should.eql('01')
    d.value[4].value.type.should.eql('Array')
    d.value[4].value.value.length.should.eql(6)
  })

  it('longString', () => {
    const toSerialize = serializedData.longString
    const d = deserialize(toSerialize)

    d.type.should.eql('ByteArray')
    hexstring2str(d.value).should.eql('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit ')
  })

  // TODO: booleans, structs, maps, even longer strings
})
