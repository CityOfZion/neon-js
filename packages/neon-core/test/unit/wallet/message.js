import * as M from '../../../src/wallet/message'

describe('Message Methods', function () {
  const account1 = {
    address: 'Adc4jT59RjDLdXbBni6xzg6SEcLVhHZ5Z9',
    publicKey: '02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5',
    publicKeyUnencoded:
      '04963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5ab872395851e9b1b0dbee1f46c11cc7928912ddb452964099931e05f7f9efd5c',
    privateKey: 'a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1',
    WIF: 'L2qkBc4ogTZERR4Watg4QoQq37w8fxrVZkYrPk7ZZSoRUZsr9yML',
    message: 'City of Zion'
  }

  const account2 = {
    address: 'AYYrr4GauveRr45WwAJyw6izvEMvasBBXH',
    publicKey: '02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26',
    publicKeyUnencoded:
      '04c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26a4ddc2ceb4ddc55ae7b2920f79fdbfe5b91e6184d7d487e71030007a56a302f2',
    privateKey: '793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e13',
    WIF: 'L1HKLWratxFhX94XSn98JEULQYKGhRycf4nREe3Cs8EPQStF5u9E',
    message: 'Morpheus'
  }

  it('sign using private key and verify', () => {
    const signature = M.signMessage(account1.message, account1.privateKey)
    M.verifyMessage(account1.message, signature, account1.publicKey).should.equal(true)
  })

  it('sign using WIF and verify', () => {
    const signature = M.signMessage(account1.message, account1.WIF)
    M.verifyMessage(account1.message, signature, account1.publicKey).should.equal(true)
  })

  it('sign using WIF and verify using public Key unencoded', () => {
    const signature = M.signMessage(account1.message, account1.WIF)
    M.verifyMessage(account1.message, signature, account1.publicKeyUnencoded).should.equal(true)
  })

  it('not verify signature with wrong public key', () => {
    const signature = M.signMessage(account1.message, account1.privateKey)
    M.verifyMessage(account1.message, signature, account2.publicKey).should.equal(false)
  })

  it('not verify signature with changed message', () => {
    const signature = M.signMessage(account1.message, account1.privateKey)
    M.verifyMessage(account2.message, signature, account1.publicKey).should.equal(false)
  })

  it('raise error for invalid public Key', () => {
    ; (function () {
      const signature = M.signMessage(account1.message, account1.privateKey)
      M.verifyMessage(account2.message, signature, 'x')
    }.should.throw(Error, 'Invalid public key'))
  })

  it('raise error for invalid signature', () => {
    ; (function () {
      M.verifyMessage(account2.message, 'x', account1.publicKey).should.equal(false)
    }.should.throw(Error, 'Invalid signature format expected hex'))
  })
})
