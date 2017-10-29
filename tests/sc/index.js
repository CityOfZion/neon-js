import { generateDeployScript } from '../../src/sc/index.js'

describe('Smart Contracts', function () {
  it('generate deploy script', () => {
    const script = generateDeployScript({
      script: '54c56b6c766b00527ac46c766b51527ac46c766b00c36c766b51c3936c766b52527ac46203006c766b52c3616c7566',
      name: 'Add',
      version: '1',
      author: 'Ethan Fast',
      email: 'test@test.com',
      description: 'Add',
      returnType: 5,
      paramaterList: '05'

    })
    script.str.should.equal('034164640d7465737440746573742e636f6d0a457468616e2046617374013103416464005501052f54c56b6c766b00527ac46c766b51527ac46c766b00c36c766b51c3936c766b52527ac46203006c766b52c3616c756668134e656f2e436f6e74726163742e437265617465')
  })
})
