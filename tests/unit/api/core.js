import * as core from '../../../src/api/core'
import { neonDB, neoscan } from '../../../src/api'
import { Transaction, signTransaction, getTransactionHash } from '../../../src/transactions'
import { Balance } from '../../../src/wallet'
import { DEFAULT_RPC } from '../../../src/consts'
import testKeys from '../testKeys.json'
import testData from '../testData.json'
import mockData from './mockData.json'

describe('Core API', function () {
  let mock
  const baseConfig = {
    net: 'TestNet',
    address: testKeys.a.address
  }

  before(() => {
    mock = setupMock([mockData.neonDB, mockData.neoscan, mockData.core])
  })

  after(() => {
    mock.restore()
  })

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
      url: DEFAULT_RPC.TEST
    }
    it('works', () => {
      return core.sendTx(config)
        .then((conf) => {
          conf.response.should.be.an('object')
          conf.response.result.should.equal(true)
          conf.response.txid.should.equal(getTransactionHash(config.tx))
        })
    })
  })
})
