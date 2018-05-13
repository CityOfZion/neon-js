import * as core from '../../../src/api/core'
import { neonDB, neoscan } from '../../../src/api'
import { Transaction, signTransaction, getTransactionHash } from '../../../src/transactions'
import { Account, Balance, Claims } from '../../../src/wallet'
import { DEFAULT_RPC } from '../../../src/consts'
import { Fixed8 } from '../../../src/utils'
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

  it('makeIntent', () => {
    core.makeIntent({ NEO: 1, GAS: 1.1 }, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      .should.deep.include.members([
        {
          assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
          value: new Fixed8(1),
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        },
        {
          assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
          value: new Fixed8(1.1),
          scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
        }]
      )
  })

  describe('getBalanceFrom', function () {
    it('neonDB', () => {
      const config = Object.assign({}, baseConfig)
      return core.getBalanceFrom(config, neonDB)
        .should.eventually.have.keys([
          'net',
          'address',
          'balance'
        ])
    })

    it('neoscan', () => {
      const config = Object.assign({}, baseConfig)
      return core.getBalanceFrom(config, neoscan)
        .should.eventually.have.keys([
          'net',
          'address',
          'balance'
        ])
    })

    it('errors when insufficient info', () => {
      return core.getBalanceFrom({ net: 'TestNet' }, neonDB).should.be.rejected
    })

    it('errors when incorrect api', () => {
      const config = Object.assign({}, baseConfig)
      return core.getBalanceFrom(config, {}).should.be.rejected
    })
  })

  describe('getClaimsFrom', function () {
    it('Retrieves information properly', () => {
      const config = Object.assign({}, baseConfig)
      return core.getClaimsFrom(config, neonDB)
        .then((conf) => {
          conf.should.have.keys([
            'net', 'address', 'claims'
          ])
        })
    })

    it('errors when insufficient info', () => {
      return core.getClaimsFrom({ net: 'TestNet' }, neonDB).should.be.rejected
    })

    it('errors when incorrect api', () => {
      const config = Object.assign({}, baseConfig)
      return core.getClaimsFrom(config, {}).should.be.rejected
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
      return core.createTx(config, 'weird').should.eventually.be.rejected
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

    it('cannot sign for assets on address mismatch', () => {
      return core.signTx({
        tx,
        address,
        privateKey: testKeys.b.privateKey
      })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
        .should.be.rejectedWith(Error)
    })

    it('sign for smart contract assets', () => {
      const testSmartContractAddress = 'AXhgHZtAYC8ZztJo8B1LV2kLyeMrXr39La'

      return core.signTx({
        tx,
        address: testSmartContractAddress,
        privateKey: testKeys.a.privateKey,
        sendingFromSmartContract: true
      })
        .then((conf) => {
          conf.tx.scripts.length.should.equal(1)
          conf.tx.scripts[0].should.eql(signature)
        })
    })

    it('cannot sign for smart contract assets without option', () => {
      const testSmartContractAddress = 'AXhgHZtAYC8ZztJo8B1LV2kLyeMrXr39La'

      const config = {
        tx,
        address: testSmartContractAddress,
        privateKey: testKeys.a.privateKey
      }
      return core.signTx(config).should.be.rejectedWith(Error)
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

  describe('fillUrl', function () {
    it('does nothing when url provided', () => {
      const config = {
        url: 'http://random.org:20332'
      }

      return core.fillUrl(config)
        .then(conf => {
          conf.url.should.equal('http://random.org:20332')
        })
    })

    it('fills url', () => {
      const config = Object.assign({}, baseConfig)
      return core.fillUrl(config)
        .then(conf => {
          conf.url.should.be.a('string')
        })
    })
  })

  describe('fillKeys', function () {
    it('fill address and privateKey', () => {
      const config = {
        account: new Account(testKeys.a.privateKey)
      }

      return core.fillKeys(config)
        .then((conf) => {
          conf.address.should.equal(testKeys.a.address)
          conf.privateKey.should.equal(testKeys.a.privateKey)
        })
    })

    it('fill address and publicKey when using signingFunction', () => {
      const config = {
        account: new Account(testKeys.a.publicKey),
        signingFunction: () => true
      }

      return core.fillKeys(config)
        .then(conf => {
          conf.address.should.equal(testKeys.a.address)
          conf.publicKey.should.equal(testKeys.a.publicKey)
        })
    })
  })

  describe('fillBalance', function () {
    it('does not call getBalance when balance exists', () => {
      const expectedBalance = new Balance()
      const config = {
        net: 'RandomNet',
        address: testKeys.b.address,
        balance: expectedBalance
      }
      return core.fillBalance(config)
        .then(conf => {
          conf.balance.should.equal(expectedBalance)
        })
    })

    it('calls getBalance when balance is not available', () => {
      const config = Object.assign({}, baseConfig)
      return core.fillBalance(config)
        .then(conf => {
          conf.should.have.keys([
            'net',
            'address',
            'balance'
          ])
        })
    })
  })

  describe('fillClaims', function () {
    it('does not call getClaims when claims exist', () => {
      const expectedClaims = new Claims()
      const config = {
        net: 'RandomNet',
        address: testKeys.b.address,
        claims: expectedClaims
      }
      return core.fillClaims(config)
        .then(conf => {
          conf.claims.should.equal(expectedClaims)
        })
    })

    it('calls getClaims when claims is not available', () => {
      const config = Object.assign({}, baseConfig)
      return core.fillClaims(config)
        .then(conf => {
          conf.should.have.keys([
            'net',
            'address',
            'claims'
          ])
        })
    })
  })
})
