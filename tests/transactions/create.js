import * as c from '../../src/transactions/create'
import { Account } from '../../src/wallet'
import data from './createData.json'

describe('Create Transactions', function () {
  const publicKey = '02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef'
  it('create claimTransaction', () => {
    const tx = c.createClaimTx(publicKey, data.claim)
    tx.type.should.equal(2)
    tx.claims.length.should.equal(data.claim.claims.length)
    tx.outputs.length.should.equal(1)
    tx.outputs[0].value.should.equal(data.claim['total_claim'] / 100000000)
  })

  const intents = [
    {
      assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      value: 5,
      scriptHash: new Account('031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9').scriptHash
    },
    {
      assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
      value: 10.5,
      scriptHash: new Account('02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa').scriptHash
    }
  ]
  it('create contractTransaction', () => {
    const tx = c.createContractTx(publicKey, data.balance, intents)
    tx.type.should.equal(128)
    tx.inputs.length.should.equal(6)
    tx.outputs.length.should.equal(4)
  })

  const moreIntents = intents.concat([{
    assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
    value: 500,
    scriptHash: new Account('031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9').scriptHash
  }])
  it('errors when insufficient assets', () => {
    const notEnoughNEO = () => {
      c.createContractTx(publicKey, data.balance, moreIntents)
    }
    notEnoughNEO.should.throw()
  })
  const invo = {
    'rpxTest': '5b7074e873973a6ed3708862f219a6fbf4d1c411',
    'outputs': [
      {
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: 1,
        scriptHash: '5b7074e873973a6ed3708862f219a6fbf4d1c411'
      }
    ],
    publicKey: '02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef',
    invoke: {
      scriptHash: '5b7074e873973a6ed3708862f219a6fbf4d1c411',
      operation: 'mintTokens'
    }
  }
  it('create invocationTransaction', () => {
    const tx = c.createInvocationTx(invo.publicKey, data.balance, invo.outputs, invo.invoke, 0.5, { version: 1 })
    tx.version.should.equal(1)
    tx.gas.should.equal(0.5)
    tx.inputs.length.should.equal(2)
    tx.outputs.length.should.equal(2)
  })
})
