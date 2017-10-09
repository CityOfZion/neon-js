import * as V from '../../src/wallet/verify'

describe('Key Verification', function () {
  const valid = {
    wifs: [
      'L2qkBc4ogTZERR4Watg4QoQq37w8fxrVZkYrPk7ZZSoRUZsr9yML',
      'KysNqEuLb3wmZJ6PsxbA9Bh6ewTybEda4dEiN9X7X48dJPkLWZ5a',
      'L1HKLWratxFhX94XSn98JEULQYKGhRycf4nREe3Cs8EPQStF5u9E'
    ],
    nep2s: [
      '6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF'
    ],
    privateKeys: [
      'a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1',
      '4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd6548',
      '793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e13'
    ],
    publicKeys: [
      '02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5',
      '03c663ba46afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f321',
      '02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26'
    ],
    addresses: [
      'Adc4jT59RjDLdXbBni6xzg6SEcLVhHZ5Z9',
      'ARCvt1d5qAGzcHqJCWA2MxvhTLQDb9dvjQ',
      'AYYrr4GauveRr45WwAJyw6izvEMvasBBXH'
    ]
  }

  const invalid = {
    wifs: [
      '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
      'KysNqEuLb3wmZJ6PsxbA9Bh6ehTybEda4dEiN9X7X48dJPkLWZ5a'
    ],
    nep2s: [
      '6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRf',
      '6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRf@',
      '7PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF',
      '6PRRWQToT7GCPe21SYwLUBC9LSWsuzFoP63PNZCdvm3wWUKtpkJTW9Uwpa'
    ],
    privateKeys: [
      'a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce',
      '4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd654g',
      '793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e1364'
    ],
    publicKeys: [
      '800C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D',
      '01c663ba46afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f321',
      '02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c2g'
    ],
    addresses: [
      '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      'AYYrr4GauveRr45WwAJyw6izvEMvasBBXh'
    ]
  }

  it('returns true for valid WIF', () => {
    valid.wifs.map((wif) => V.isWIF(wif).should.be.true)
  })

  it('returns true for valid NEP2', () => {
    valid.nep2s.map((nep) => V.isNEP2(nep).should.be.true)
  })

  it('returns true for valid privateKey', () => {
    valid.privateKeys.map((key) => V.isPrivateKey(key).should.be.true)
  })

  it('returns true for valid publicKey', () => {
    valid.publicKeys.map((key) => V.isPublicKey(key).should.be.true)
  })

  it('returns true for valid address', () => {
    valid.addresses.map((addr) => V.isAddress(addr).should.be.true)
  })

  it('returns false for invalid WIF', () => {
    invalid.wifs.map((wif) => V.isWIF(wif).should.be.false)
  })

  it('returns false for invalid NEP2', () => {
    invalid.nep2s.map((nep) => V.isNEP2(nep).should.be.false)
  })

  it('returns false for invalid privateKey', () => {
    invalid.privateKeys.map((key) => V.isPrivateKey(key).should.be.false)
  })

  it('returns false for invalid publicKey', () => {
    invalid.publicKeys.map((key) => V.isPublicKey(key).should.be.false)
  })

  it('returns false for invalid address', () => {
    invalid.addresses.map((addr) => V.isAddress(addr).should.be.false)
  })
})
