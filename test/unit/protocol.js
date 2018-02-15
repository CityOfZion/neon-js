import { PROTOCOLS } from '../../src/consts'
// import Protocol from '../../src/protocol'

describe('Protocol', function () {
  it('Default Protocols are loaded properly', () => {
    ['MainNet', 'TestNet'].map(net => {
      PROTOCOLS[net].should.have.keys([
        'name',
        'magic',
        'addressVersion',
        'standbyValidators',
        'seedList',
        'systemFee',
        'extra'
      ])
      PROTOCOLS[net].name.should.equal(net)
      PROTOCOLS[net].seedList.length.should.equal(5)
      PROTOCOLS[net].extra.should.include.keys([
        'neonDB',
        'neoscan'
      ])
    })
  })
})
