import ContractParam from '../../../src/sc/ContractParam'

describe('ContractParam', function () {
  it('Constructor', () => {
    const cp = new ContractParam('this', 'that')
    cp.should.eql({ type: 'this', value: 'that' })
  })

  it('String', () => {
    const cp = ContractParam.string('this is a string')
    cp.should.eql({ type: 'String', value: 'this is a string' })
  })

  it('Boolean', () => {
    const cp1 = ContractParam.boolean(true)
    cp1.should.eql({ type: 'Boolean', value: true })
    const cp2 = ContractParam.boolean(false)
    cp2.should.eql({ type: 'Boolean', value: false })
    const cp3 = ContractParam.boolean(0)
    cp3.should.eql({ type: 'Boolean', value: false })
    const cp4 = ContractParam.boolean('0')
    cp4.should.eql({ type: 'Boolean', value: true })
  })

  it('Integer', () => {
    const cp1 = ContractParam.integer(10)
    cp1.should.eql({ type: 'Integer', value: 10 })
    const cp2 = ContractParam.integer('10')
    cp2.should.eql({ type: 'Integer', value: 10 })
  })

  it('Hash160', () => {
    const cp1 = ContractParam.hash160('cef0c0fdcfe7838eff6ff104f9cdec2922297537')
    cp1.should.eql({type: 'Hash160', value: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'})
    const cp2 = ContractParam.hash160('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
    cp2.should.eql({type: 'Hash160', value: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'})
  })

  describe('ByteArray', function () {
    it('bytearray', () => {
      const cp = ContractParam.byteArray('010101')
      cp.should.eql({ type: 'ByteArray', value: '010101' })
    })

    it('address', () => {
      const cp = ContractParam.byteArray('ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s', 'address')
      cp.should.eql({ type: 'ByteArray', value: '35b20010db73bf86371075ddfba4e6596f1ff35d' })
    })

    it('fixed8', () => {
      const cp = ContractParam.byteArray(1000.12345678, 'fixed8')
      cp.should.eql({ type: 'ByteArray', value: '4e49334917000000' })
    })

    it('fixed8 with zero decimals', () => {
      const cp = ContractParam.byteArray(1, 'fixed8', 0)
      cp.should.eql({ type: 'ByteArray', value: '0100000000000000' })
    })

    it('fixed8 with four decimals', () => {
      const cp = ContractParam.byteArray(222.1234, 'fixed8', 4)
      cp.should.eql({ type: 'ByteArray', value: 'b2e4210000000000' })
    })

    it('errors when exceeds allowed precision', () => {
      (() => { ContractParam.byteArray(222.12345, 'fixed8', 4) }).should.throw(Error, 'wrong precision')
    })
  })

  it('Array', () => {
    const c1 = ContractParam.string('first')
    const c2 = ContractParam.integer(2)
    const cp = ContractParam.array(c1, c2)
    cp.type.should.equal('Array')
    cp.value.should.eql([c1, c2])
  })
})
