import * as C from '../../src/wallet/core'

describe('Core Wallet Methods', function () {
  const keys = [
    {
      address: 'Adc4jT59RjDLdXbBni6xzg6SEcLVhHZ5Z9',
      publicKey: '02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5',
      privateKey: 'a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1',
      scriptHash: '77f807a219d340423a307310ac15c1d179dc77ef',
      WIF: 'L2qkBc4ogTZERR4Watg4QoQq37w8fxrVZkYrPk7ZZSoRUZsr9yML'
    },
    {
      address: 'ARCvt1d5qAGzcHqJCWA2MxvhTLQDb9dvjQ',
      publicKey: '03c663ba46afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f321',
      privateKey: '4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd6548',
      scriptHash: 'f5cf63dfe3821b4d17302aeb8551b219d83a7667',
      WIF: 'KysNqEuLb3wmZJ6PsxbA9Bh6ewTybEda4dEiN9X7X48dJPkLWZ5a'
    },
    {
      address: 'AYYrr4GauveRr45WwAJyw6izvEMvasBBXH',
      publicKey: '02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26',
      privateKey: '793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e13',
      scriptHash: 'e485d31067646f5d43f0b8328edf31e8fa0f04b8',
      WIF: 'L1HKLWratxFhX94XSn98JEULQYKGhRycf4nREe3Cs8EPQStF5u9E'
    }
  ]
  const unencodedTest = {
    address: 'AeqoGrirm7khpRVTJvisi8EugfYYmbB6xD',
    publicKey: '0447705328908193ed38ebaeb992ec921fcfb4d4538cbeaf970d270d1cd1be2b3350e91d851ff0d0aed059ab835e70df2e889da598e406d220991889d893549ad4'
  }

  it('WIF => privateKey', () => {
    keys.map((acct) => {
      const privateKey = C.getPrivateKeyFromWIF(acct.WIF)
      privateKey.should.equal(acct.privateKey)
    })
  })

  it('privateKey => WIF', () => {
    keys.map((acct) => {
      const wif = C.getWIFFromPrivateKey(acct.privateKey)
      wif.should.equal(acct.WIF)
    })
  })

  it('privateKey => publicKey', () => {
    keys.map((acct) => {
      const publicKey = C.getPublicKeyFromPrivateKey(acct.privateKey)
      publicKey.should.equal(acct.publicKey)
    })
  })

  it('publicKey => scriptHash', () => {
    keys.map((acct) => {
      const scriptHash = C.getScriptHashFromPublicKey(acct.publicKey)
      scriptHash.should.equal(acct.scriptHash)
    })
  })

  it('publicKey => scriptHash => address', () => {
    keys.map((acct) => {
      const scriptHash = C.getScriptHashFromPublicKey(acct.publicKey)
      const address = C.getAddressFromScriptHash(scriptHash)
      address.should.equal(acct.address)
    })
  })

  it('unencoded publicKey => address', () => {
    keys.map((acct) => {
      const scriptHash = C.getScriptHashFromPublicKey(unencodedTest.publicKey)
      const address = C.getAddressFromScriptHash(scriptHash)
      address.should.equal(unencodedTest.address)
    })
  })

  it('scriptHash => address', () => {
    keys.map((acct) => {
      const address = C.getAddressFromScriptHash(acct.scriptHash)
      address.should.equal(acct.address)
    })
  })

  it('address => scriptHash', () => {
    keys.map((acct) => {
      const scriptHash = C.getScriptHashFromAddress(acct.address)
      scriptHash.should.equal(acct.scriptHash)
    })
  })

  it('generate a private key', (done) => {
    const privateKey = C.generatePrivateKey()
    privateKey.should.have.length(64)
    done()
  })
})
