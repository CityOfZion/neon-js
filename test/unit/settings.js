import * as settings from '../../src/settings'
import Network from '../../src/rpc/Network'

describe('Settings', function () {
  it('Default Networks are loaded properly', () => {
    ['MainNet', 'TestNet'].map(net => {
      settings.networks[net].should.include.all.keys([
        'name',
        'protocol',
        'nodes',
        'extra'
      ])
      settings.networks[net].name.should.equal(net)
      settings.networks[net].extra.should.include.keys([
        'neonDB',
        'neoscan'
      ])
    })
  })

  it('addNetwork', () => {
    settings.addNetwork(new Network({}, 'PrivateNet'))
    settings.networks.should.include.all.keys(['PrivateNet'])
  })

  it('removeNetwork', () => {
    settings.removeNetwork('TestNet')
    settings.should.not.have.any.keys(['TestNet'])
  })
})
