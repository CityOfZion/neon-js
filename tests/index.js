const chai = require('chai');
const should = chai.should();
import * as utils from '../src/utils';
import Wallet from '../src/index';

describe('Wallet', () => {
  it('should generate new wallet from new password', (done) => {
    const password = 'asdfasdf';
    const wallet = new Wallet();
    const privateKey = utils.ab2hexstring(wallet.generatePrivateKey());
    // console.log(privateKey);

    const walletBlob = wallet.generateWalletFileBlob(privateKey, password);
    walletBlob.should.be.an('Uint8Array');
    done();
  });

});
