import * as core from '../../src/api/core'
import { neonDB, neoscan } from '../../src/api'
import { Transaction, signTransaction } from '../../src/transactions'
import { Balance } from '../../src/wallet'
import testKeys from '../testKeys.json'
import testData from '../testData.json'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Core API', function () {
  let mock
  this.timeout(10000)
  const baseConfig = {
    net: 'TestNet',
    address: testKeys.a.address
  }
  describe('getBalanceFrom', function () {
    it('neonDB', () => {
      const config = {
        net: 'TestNet',
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        other: 'props',
        intents: {}
      }
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

    it('neoscan', () => {
      const config = {
        net: 'TestNet',
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        other: 'props',
        intents: {}
      }
      return core.getBalanceFrom(config, neoscan)
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

  describe('getBalanceFrom', function () {
    it('Retrieves information properly', () => {
      const config = Object.assign({}, baseConfig)
      return core.getBalanceFrom(config, neonDB)
        .then((conf) => {
          conf.should.have.keys([
            'net', 'address', 'url', 'balance'
          ])
        })
    })

    it('errors when insufficient info', () => {
      const thrower = () => core.getBalanceFrom({ net: 'TestNet' }, neonDB)
      thrower.should.throw()
    })

    it('errors when incorrect api', () => {
      const config = Object.assign({}, baseConfig)
      const thrower = () => core.getBalanceFrom(config, {})
      thrower.should.throw()
    })
  })

  describe('getClaimsFrom', function () {
    it('Retrieves information properly', () => {
      const config = {
        net: 'TestNet',
        address: testKeys.a.address
      }
      return core.getClaimsFrom(config, neonDB)
        .then((conf) => {
          conf.should.have.keys([
            'net', 'address', 'url', 'claims'
          ])
        })
    })

    it('errors when insufficient info', () => {
      const thrower = () => core.getClaimsFrom({ net: 'TestNet' }, neonDB)
      thrower.should.throw()
    })

    it('errors when incorrect api', () => {
      const config = Object.assign({}, baseConfig)
      const thrower = () => core.getClaimsFrom(config, {})
      thrower.should.throw()
    })
  })

  describe('createTx', function () {
    let config
    beforeEach(() => {
      config = Object.assign({}, baseConfig, {
        balance: new Balance(JSON.parse(JSON.stringify(testData.a.balance))),
        claims: testData.a.claims,
        intents: [{
          assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
          value: 1.1,
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        }],
        script: '001234567890',
        gas: 0.1
      })
    })
    it('claims', () => {
      return core.createTx(config, 'claim')
        .then((conf) => {
          conf.should.have.any.keys(['balance', 'claims', 'intents', 'script', 'gas', 'tx'])
          conf.tx.type.should.equal(2)
          conf.tx.outputs.length.should.equal(1)
        })
    })

    it('contract', () => {
      return core.createTx(config, 'contract')
        .then((conf) => {
          conf.should.have.any.keys(['balance', 'claims', 'intents', 'script', 'gas', 'tx'])
          conf.tx.type.should.equal(128)
          conf.tx.inputs.length.should.least(1)
          conf.tx.outputs.length.should.least(1)
        })
    })

    it('invocation', () => {
      return core.createTx(config, 'invocation')
        .then((conf) => {
          conf.should.have.any.keys(['balance', 'claims', 'intents', 'script', 'gas', 'tx'])
          conf.tx.type.should.equal(209)
        })
    })

    it('errors when given wrong type', () => {
      const thrower = () => core.createTx(config, 'weird')
      thrower.should.throw()
    })
  })

  describe('signTx', function () {
    const tx = Transaction.deserialize(testData.a.tx)
    const signature = tx.scripts[0]
    const address = testKeys.a.address
    beforeEach(() => {
      tx.scripts = []
    })
    it('sign with Private key', () => {
      return core.signTx({
        tx,
        address,
        privateKey: testKeys.a.privateKey
      })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
    })

    it('sign with signingFunction', () => {
      const signingFunction = (tx, publicKey) => {
        return Promise.resolve(signTransaction(tx, testKeys.a.privateKey))
      }
      return core.signTx({ tx, address, signingFunction, publicKey: testKeys.a.publicKey })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
    })
  })

  describe('sendTx', function () {
    const config = {
      tx: Transaction.deserialize(testData.a.tx),
      url: 'http://localhost:20332'
    }
    before(() => {
      mock = new MockAdapter(axios)
    })

    afterEach(() => {
      mock.reset()
      config.response = undefined
    })

    after(() => {
      mock.restore()
    })

    it('works', () => {
      mock.onPost().reply(200, {
        'jsonrpc': '2.0',
        'id': 1234,
        'result': true
      })
      return core.sendTx(config)
        .then((conf) => {
          conf.response.should.be.an('object')
          conf.response.result.should.equal(true)
        })
    })
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
        net: 'TestNet',
        address: 'AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx',
        privateKey: '3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b',
        intents: core.makeIntent({ GAS: 0.1 }, 'AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx'),
        script: '00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc',
        gas: 0
      }
      return core.doInvoke(config)
        .then((c) => {
          c.response.result.should.equal(true)
        })
    })
  })
})
