import * as core from '../../src/api/core'
import { neonDB } from '../../src/api'
import testKeys from '../testKeys.json'

describe('Core API', function () {
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

  describe.skip('sendAsset', function () {
    this.timeout(15000)
    it('NeonDB', () => {
      const intent1 = core.makeIntent({ NEO: 1 }, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      const config1 = {
        net: 'TestNet',
        address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
        privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
        intents: intent1
      }
      const intent2 = core.makeIntent({ NEO: 1 }, 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s')
      const config2 = {
        net: 'TestNet',
        address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
        privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344',
        intents: intent2
      }
      return core.sendAsset(config1)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
        .then(() => core.sendAsset(config2))
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })

    it('Neoscan')
  })

  describe.skip('claimGas', function () {
    this.timeout(15000)
    it('neonDB', () => {
      const config = {
        net: 'TestNet',
        address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
        privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69'
      }
      return core.claimGas(config)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })
  })

  describe.skip('doInvoke', function () {
    this.timeout(15000)
    it('neonDB', () => {
      const config = {
        url: 'http://seed1.neo.org:20332',
        net: 'TestNet',
        address: 'AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx',
        privateKey: '3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b',
        script: '00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc',
        gas: 0
      }
      return core.doInvoke(config)
        .then((c) => {
          console.log(c)
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })
  })
})
