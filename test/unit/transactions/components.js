import * as c from '../../../src/transactions/components'
import { StringStream, Fixed8 } from '../../../src/utils'
import Account from '../../../src/wallet/Account'

describe('Components', function () {
  const deserializedTx = {
    type: 0x80,
    version: 0,
    attributes: [
      {
        usage: parseInt('f0', 16),
        // This is a remark
        data: '5468697320697320612072656d61726b'
      }
    ],
    inputs: [
      {
        prevHash: '22555bfe765497956f4194d40c0e8cf8068b97517799061e450ad2468db2a7c4',
        prevIndex: 1
      }
    ],
    outputs: [
      {
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: 1,
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      },
      {
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: 4714,
        scriptHash: '5df31f6f59e6a4fbdd75103786bf73db1000b235'
      }
    ],
    scripts: [
      {
        invocationScript: '4051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b20783',
        verificationScript: '21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9ac'
      }
    ]
  }

  const serializedTx = {
    stream: '80000001c4a7b28d46d20a451e06997751978b06f88c0e0cd494416f95975476fe5b55220100029b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f505000000003775292229eccdf904f16fff8e83e7cffdc0f0ce9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc5002aa1c16d00000035b20010db73bf86371075ddfba4e6596f1ff35d01414051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b207832321031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9ac',
    attributes: [
      'f0105468697320697320612072656d61726b'
    ],
    inputs: [
      'c4a7b28d46d20a451e06997751978b06f88c0e0cd494416f95975476fe5b55220100'
    ],
    outputs: [
      '9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f505000000003775292229eccdf904f16fff8e83e7cffdc0f0ce',
      '9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc5002aa1c16d00000035b20010db73bf86371075ddfba4e6596f1ff35d'
    ],
    scripts: [
      '414051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b207832321031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9ac'
    ]
  }
  describe('TransactionInput', function () {
    it('serialize', () => {
      let s = c.serializeTransactionInput(deserializedTx.inputs[0])
      s.should.equal(serializedTx.inputs[0])
    })
    it('deserialize', () => {
      let ss = new StringStream(serializedTx.inputs[0])
      let s = c.deserializeTransactionInput(ss)
      s.should.eql(deserializedTx.inputs[0])
    })
  })

  describe('TransactionOutput', function () {
    it('serialize', () => {
      for (let i = 0; i < deserializedTx.outputs.length; i++) {
        let s = c.serializeTransactionOutput(deserializedTx.outputs[i])
        s.should.equal(serializedTx.outputs[i])
      }
    })
    it('deserialize', () => {
      for (let i = 0; i < serializedTx.outputs.length; i++) {
        let ss = new StringStream(serializedTx.outputs[i])
        let s = c.deserializeTransactionOutput(ss)
        s.assetId.should.eql(deserializedTx.outputs[i].assetId)
        s.value.toNumber().should.eql(deserializedTx.outputs[i].value)
        s.scriptHash.should.eql(deserializedTx.outputs[i].scriptHash)
      }
    })

    it('create', () => {
      const txOut = c.createTransactionOutput('NEO', 1, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      txOut.should.eql({
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: new Fixed8(1),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      })
    })
  })

  describe('Attribute', function () {
    it('serialize', () => {
      for (let i = 0; i < deserializedTx.attributes.length; i++) {
        let s = c.serializeTransactionAttribute(deserializedTx.attributes[i])
        s.should.equal(serializedTx.attributes[i])
      }
    })
    it('deserialize', () => {
      for (let i = 0; i < serializedTx.attributes.length; i++) {
        let ss = new StringStream(serializedTx.attributes[i])
        let s = c.deserializeTransactionAttribute(ss)
        s.should.eql(deserializedTx.attributes[i])
      }
    })
  })

  describe('Witness', function () {
    it('serialize', () => {
      for (let i = 0; i < deserializedTx.scripts.length; i++) {
        let s = c.serializeWitness(deserializedTx.scripts[i])
        s.should.equal(serializedTx.scripts[i])
      }
    })
    it('deserialize', () => {
      for (let i = 0; i < serializedTx.scripts.length; i++) {
        let ss = new StringStream(serializedTx.scripts[i])
        let s = c.deserializeWitness(ss)
        s.should.eql(deserializedTx.scripts[i])
      }
    })

    describe('buildMultiSig', () => {
      const msg = '1234'
      const signatures = [
        'e634f503454fc99d72aa3ab6048cb0cf33ed2afec8c9f38a6c4b87126f0da6c62e39205c86178d95a191ec76fb09b2380b8df1074ea62e02cb9d4a5e1c6372a2',
        'f81e7b0ac2e415dac37bf189827f2e716c53e383faf973d9e222bbb44bb0c55d181726460397a90e9f26013ac3eb17019f0667d78915d5d7ded4d9f87ef785ac',
        '9ed10d60df8d8ac2fe719448ea732638963649f41c44bdbe6eb10e7dd7d6c5c71d82738f1d33c58fe8350f5c4c51b388a41c32768b598afb978f08a56eef72d7'
      ]

      const witnesses = [
        {
          invocationScript:
        '40e634f503454fc99d72aa3ab6048cb0cf33ed2afec8c9f38a6c4b87126f0da6c62e39205c86178d95a191ec76fb09b2380b8df1074ea62e02cb9d4a5e1c6372a2',
          verificationScript:
        '2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699efac'
        },
        {
          invocationScript:
        '40f81e7b0ac2e415dac37bf189827f2e716c53e383faf973d9e222bbb44bb0c55d181726460397a90e9f26013ac3eb17019f0667d78915d5d7ded4d9f87ef785ac',
          verificationScript:
        '21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9ac'
        },
        {
          invocationScript:
        '409ed10d60df8d8ac2fe719448ea732638963649f41c44bdbe6eb10e7dd7d6c5c71d82738f1d33c58fe8350f5c4c51b388a41c32768b598afb978f08a56eef72d7',
          verificationScript:
        '2102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462faac'
        }
      ]
      const orderedSigExpectedInvocationScript = [signatures[0], signatures[1]]
        .map(s => '40' + s)
        .join('')
      const verificationScript =
    '522102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa53ae'

      const account = new Account({
        address: 'ASo1RcNVLiV3yQ8j3ZyZv5EWfqBBT8s2Yd',
        contract: {
          script:
        '522102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa53ae',
          parameters: [
            { name: 'parameter0', type: 'Signature' },
            { name: 'parameter1', type: 'Signature' }
          ],
          deployed: false
        }
      })

      it('constructs Witness given correctly ordered signature', () => {
        const result = c.Witness.buildMultiSig(msg, signatures, verificationScript)
        result.verificationScript.should.equal(verificationScript)
        result.invocationScript.should.equal(orderedSigExpectedInvocationScript)
      })

      it('constructs Witness given unordered signatures', () => {
        const result = c.Witness.buildMultiSig(msg, [signatures[1], signatures[2], signatures[0]], verificationScript)
        result.verificationScript.should.equal(verificationScript)
        result.invocationScript.should.equal(orderedSigExpectedInvocationScript)
      })

      it('constructs Witness given unordered individual witnesses', () => {
        const result = c.Witness.buildMultiSig(msg, [witnesses[1], witnesses[2], witnesses[0]], verificationScript)
        result.verificationScript.should.equal(verificationScript)
        result.invocationScript.should.equal(orderedSigExpectedInvocationScript)
      })

      it('constructs Witness given random signatures/witnesses and Account', () => {
        const result = c.Witness.buildMultiSig(msg, [signatures[1], signatures[2], witnesses[0]], verificationScript)
        result.verificationScript.should.equal(verificationScript)
        result.invocationScript.should.equal(orderedSigExpectedInvocationScript)
      })

      it('throws if invalid signature given', () => {
        const wrongSigs = [signatures[0].replace('1', '0'), signatures[1]]
        const throwingFunc = () =>
          c.Witness.buildMultiSig(msg, wrongSigs, verificationScript)
        throwingFunc.should.throw('Invalid signature given')
      })

      it('throws if insufficient signatures', () => {
        const oneSig = [signatures[1]]
        const throwingFunc = () =>
          c.Witness.buildMultiSig(msg, oneSig, verificationScript)
        throwingFunc.should.throw('Insufficient signatures')
      })
    })
  })
})
