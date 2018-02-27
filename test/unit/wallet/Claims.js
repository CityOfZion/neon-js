import Claims from '../../../src/wallet/Claims'

describe('Claims', function () {
  const claimsLike = {
    address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
    net: 'TestNet',
    claims: [
      {
        txid: 'a',
        index: 0,
        claim: 0.02455600
      },
      {
        txid: 'b',
        index: 1,
        claim: 0.05267460
      },
      {
        txid: 'c',
        index: 2,
        claim: 1.04
      },
      {
        txid: 'd',
        index: 3,
        claim: 0.0012
      },
      {
        txid: 'e',
        index: 4,
        claim: 0.05460
      }
    ]
  }

  describe('constructor', function () {
    it('default', () => {
      const expected = {
        address: '',
        net: 'NoNet',
        claims: []
      }
      const result = new Claims()
      result.address.should.equal(expected.address)
      result.net.should.equal(expected.net)
      result.claims.should.eql(expected.claims)
    })

    it('CLaims-like', () => {
      const result = new Claims(claimsLike)

      result.address.should.equal(claimsLike.address)
      result.net.should.equal(claimsLike.net)
      result.claims.length.should.equal(5)
      for (var i; i < claimsLike.claims.length; i++) {
        result.claims[i].txid.should.equal(claimsLike.claims[i].txid)
        result.claims[i].index.should.equal(claimsLike.claims[i].index)
        result.claims[i].claim.toNumber().should.equal(claimsLike.claims[i].claim)
      }
    })

    it('Claims', () => {
      const claims1 = new Claims(claimsLike)
      const claims2 = new Claims(claims1)
      claims1.should.eql(claims2);
      (claims1 === claims2).should.equal(false)
    })
  })

  describe('export', function () {
    it('works', () => {
      const c = new Claims(claimsLike)
      const result = c.export()
      result.address.should.equal(claimsLike.address)
      result.claims.forEach((claim, i) => {
        const item = { 'claim': claim.claim, 'index': claim.index, 'txid': claim.txid }
        item.should.eql(claimsLike.claims[i])
      })
    })
  })

  it('slice', () => {
    const original = new Claims(claimsLike)
    const slice1 = original.slice(1, 3)
    slice1.claims.length.should.equal(2)
    slice1.claims[0].txid.should.equal('b')
    slice1.claims[1].txid.should.equal('c')
    const slice2 = original.slice(2)
    slice2.claims.length.should.equal(3)
    slice2.claims[0].txid.should.equal('c')
    slice2.claims[2].txid.should.equal('e')
  })
})
