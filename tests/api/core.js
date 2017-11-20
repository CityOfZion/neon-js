import * as core from '../../src/api/core'
import { neonDB } from '../../src/api'
import testKeys from '../testKeys.json'

describe.only('Core API', function () {
  describe('getBalanceFrom', function () {
    const config = {
      net: 'TestNet',
      address: testKeys.a.address,
      privateKey: testKeys.a.privateKey,
      other: 'props',
      intents: {}
    }

    it('neonDB', () => {
      return core.getBalanceFrom(config, neonDB)
        .should.eventually.have.keys([
          'net',
          'address',
          'privateKey',
          'other',
          'intents',
          'balance',
          'url'
        ])
    })

    it('neoscan')
    // , () => {
    //   return core.getBalanceFrom(config, neoscan)
    //   .should.eventually.have.keys([
    //     'net',
    //     'address',
    //     'privateKey',
    //     'other',
    //     'intents',
    //     'balance',
    //     'url'
    //   ])
    // })
  })

  it('makeIntent', () => {
    core.makeIntent({ NEO: 1, GAS: 1.1 }, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      .should.deep.include.members([
        {
          assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
          value: 1,
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        },
        {
          assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
          value: 1.1,
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        }]
      )
  })

  describe('sendAsset', function () {
    it('NeonDB', () => {
      const intent1 = core.makeIntent({ NEO: 1 }, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      const config1 = {
        net: 'TestNet',
        address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
        privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344',
        intents: intent1
      }
      const intent2 = core.makeIntent({ NEO: 1 }, 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s')
      const config2 = {
        net: 'TestNet',
        address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
        privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344',
        intents: intent2
      }
      return core.getBalanceFrom(config1, neonDB)
        .then((conf) => {
          return core.sendAsset(conf)
        })
        .then((res) => {
          res.result.should.be.true()
        })
        .then(() => {
          return core.getBalanceFrom.from(config2, neonDB)
        })
        .then((conf) => {
          return core.sendAsset(conf)
        })
        .then((res) => {
          res.result.should.be.true()
        })
    })

    it('Neoscan')
  })
})
