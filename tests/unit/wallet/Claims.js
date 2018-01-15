import Claims from '../../../src/wallet/Claims'

describe('Claims', function () {
  const claimsLike = {
    address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
    net: 'TestNet',
    claims: [
      {
        txid: '0ba525af5817b01314ef4e4bc9823986ca7e30871178ce2aa7b86d23d7937768',
        index: 0,
        claim: 0.02455600
      },
      {
        txid: '27341b5fffa9b0c74e454cb73481b9d50cc9fb5856b9a468a7bb7dc4d518628d',
        index: 1,
        claim: 0.05267460
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
      result.should.eql(expected)
    })

    it('CLaims-like', () => {
      const result = new Claims(claimsLike)

      result.address.should.equal(claimsLike.address)
      result.net.should.equal(claimsLike.net)
      result.claims.length.should.equal(2)
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
})
