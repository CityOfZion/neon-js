import Tx from '../../../src/transactions/transaction'
import { Balance, Account, Claims } from '../../../src/wallet'
import data from './data.json'
import createData from './createData.json'
import { ASSET_ID, CONTRACTS } from '../../../src/consts'
import { Fixed8 } from '../../../src/utils'

describe('Transaction', function () {
  it('Constructor', () => {
    const tx = new Tx({
      type: 2,
      version: 2,
      attributes: [],
      shouldNotBeThere: false
    })
    tx.type.should.equal(2)
    tx.version.should.equal(2)
    tx.attributes.length.should.equal(0)
    tx.should.have.property('claims')
    tx.should.not.have.property('shouldNotBeThere')
  })

  it('get exclusive data', () => {
    const tx = new Tx(data[3].deserialized)
    tx.exclusiveData.should.have.property('claims')
  })

  it('get hash of tx', () => {
    Object.keys(data).map((k) => {
      const tx = new Tx(data[k].deserialized)
      tx.hash.should.equal(data[k].hash)
    })
  })

  it('create ClaimTx', () => {
    const tx = Tx.createClaimTx(createData.claim.address, new Claims(createData.claim))
    tx.type.should.equal(2)
    tx.claims.length.should.equal(4)
    tx.outputs.length.should.equal(1)
    tx.outputs[0].should.eql({
      assetId: ASSET_ID['GAS'],
      value: new Fixed8(0.01983405),
      scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
    })
  })

  it('create ContractTx', () => {
    const balance = new Balance(JSON.parse(JSON.stringify(createData.balance)))
    const intents = [{
      assetId: ASSET_ID['NEO'],
      value: 2,
      scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
    }]
    const tx = Tx.createContractTx(balance, intents)
    tx.type.should.equal(128)
    tx.exclusiveData.should.eql({})
    tx.inputs.length.should.equal(1)
    tx.outputs.length.should.equal(1)
    balance.assets.NEO.unconfirmed.length.should.equal(1)
    balance.assets.NEO.spent.length.should.equal(1)
  })

  it('create InvocationTx', () => {
    const balance = new Balance(JSON.parse(JSON.stringify(createData.balance)))
    const invoke = {
      scriptHash: CONTRACTS.TEST_RPX,
      operation: 'name'
    }
    const tx = Tx.createInvocationTx(balance, null, invoke, 0.001)
    tx.type.should.equal(209)
    tx.exclusiveData.should.eql({
      gas: 0.001,
      script: '00046e616d656711c4d1f4fba619f2628870d36e3a9773e874705b'
    })
    tx.inputs.length.should.be.at.least(1)
    balance.assets.GAS.unconfirmed.length.should.equal(1)
  })

  it('deserialize', () => {
    Object.keys(data).map((k) => {
      const tx = Tx.deserialize(data[k].serialized.stream)
      tx.should.eql(new Tx(data[k].deserialized))
    })
  })

  describe('addOutput', function () {
    const txOut = {
      assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      value: new Fixed8(1),
      scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
    }
    const args = {
      assetSym: 'NEO',
      value: 1,
      address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'
    }
    it('using TransactionOutput', () => {
      const tx = new Tx()
      tx.addOutput(txOut)
      tx.outputs.length.should.equal(1)
      tx.outputs[0].should.eql(txOut)
    })

    it('using human-friendly values', () => {
      const tx = new Tx()
      tx.addOutput(args.assetSym, args.value, args.address)
      tx.outputs.length.should.equal(1)
      tx.outputs[0].should.eql(txOut)
    })

    it('errors when given wrong args', () => {
      const thrower = () => {
        const tx = new Tx()
        tx.addOutput(1, 2)
      }
      thrower.should.throw()
    })
  })

  it('addRemark', () => {
    const remark = 'This is a remark'
    const remarkAttr = {
      usage: parseInt('f0', 16),
      data: '5468697320697320612072656d61726b'
    }
    const tx = new Tx()
    tx.addRemark(remark)
    tx.attributes.length.should.equal(1)
    tx.attributes[0].should.eql(remarkAttr)
  })

  it('serialize', () => {
    Object.keys(data).map((k) => {
      const tx = new Tx(data[k].deserialized)
      tx.serialize().should.equal(data[k].serialized.stream)
    })
  })

  describe('sign', function () {
    it('with privateKey', () => {
      const tx = new Tx(data[1].deserialized)
      tx.scripts = []
      tx.sign(data[1].privateKey)
      tx.serialize().should.equal(data[1].serialized.stream)
    })

    it('with WIF', () => {
      const tx = new Tx(data[1].deserialized)
      tx.scripts = []
      const acct = new Account(data[1].privateKey)
      tx.sign(acct.WIF)
      tx.serialize().should.equal(data[1].serialized.stream)
    })

    it('with Account', () => {
      const tx = new Tx(data[1].deserialized)
      tx.scripts = []
      const acct = new Account(data[1].privateKey)
      tx.sign(acct)
      tx.serialize().should.equal(data[1].serialized.stream)
    })
  })
})
