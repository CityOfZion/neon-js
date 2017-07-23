import chai from 'chai';
import { ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes } from '../src/utils';
import * as wallet from '../src/wallet';
import * as api from '../src/api';
import axios from 'axios';
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();


describe('Wallet', function() {
  this.timeout(15000);

  const testKeys = {
    'a': {
      address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
      wif: 'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g'
    },
    b: {
      address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
      wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
    },
    c: {
      address: "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
      wif: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG"
    },
    d: {
      address: 'AdWDaCmhPmxgksr2iTVuGcLcncSouV6XGv',
      wif: 'L4xZjMnkwcN3eCfhMNPkoz7Q6xaj3oq586WYDUdVFAqMcasxGxVv'
    }
  }

  it('should claim ANC', (done) =>{
    api.sendClaimTransaction(api.TESTNET, testKeys.a.wif).then((response) => {
      console.log(response);
      done();
    })
  });

  it('should connect to the testnet node and get block count', (done) => {
    api.getBlockCount(api.TESTNET).then((response) => {
      response.result.should.be.a('number');
      done();
    });
  });

  it('should get a block from the testnet', (done) => {
    api.getBlockByIndex(api.TESTNET, 100000).then((response) => {
      response.result.should.be.an('object');
      done();
    });
  });

  it('should generate a new private key', (done) => {
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    privateKey.should.have.length(64);
    done();
  });

  it('should generate a valid WIF', (done) => {
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    const wif = wallet.getWIFFromPrivateKey(privateKey);
    const account = wallet.getAccountsFromWIFKey(wif)[0];
    account.privatekey.should.equal(privateKey);
    done();
  });

  it('should get keys from a WIF', (done) =>{
    const account = wallet.getAccountsFromWIFKey(testKeys.a.wif)[0];
    account.privatekey.should.be.a('string');
    account.address.should.equal(testKeys.a.address);
    done();
  });

  it('should verify publicKeyEncoded', (done) => {
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    const accounts = wallet.getAccountsFromPrivateKey(privateKey);
    accounts.should.not.equal(-1);
    const verify = wallet.verifyPublicKeyEncoded(accounts[0].publickeyEncoded);
    verify.should.equal(true);
    done();
  });

  it('should verify address', (done) => {
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    const accounts = wallet.getAccountsFromPrivateKey(privateKey);
    accounts.should.not.equal(-1);
    const verify = wallet.verifyAddress(accounts[0].address);
    verify.should.equal(true);
    done();
  });

  it('should get balance from address', (done) => {
    api.getBalance(api.TESTNET, testKeys.a.address).then((response) =>{
      response.ANS.should.be.an('object');
      response.ANC.should.be.an('object');
      done();
    });
  });

  it('should get unspent ANS transactions', (done) => {
    api.getTransactions(api.TESTNET, testKeys.a.address, api.ansId).then((response) => {
      response.should.be.an('array');
      done();
    })
  });

  it('should get unspent ANC transactions', (done) => {
    api.getTransactions(api.TESTNET, testKeys.a.address, api.ancId).then((response) => {
      response.should.be.an('array');
      done();
    })
  });

  it('should send ANS', (done) => {
    api.sendAssetTransaction(api.TESTNET, testKeys.b.address, testKeys.a.wif, "AntShares", 1).then((response) => {
      response.result.should.equal(true);
      // send back so we can re-run
      api.sendAssetTransaction(api.TESTNET, testKeys.a.address, testKeys.b.wif, "AntShares", 1).then((response) => {
        response.result.should.equal(true);
        done();
      });
    })
  });

  it('should send ANC', (done) => {
    api.sendAssetTransaction(api.TESTNET, testKeys.b.address, testKeys.a.wif, "AntCoins", 1).then((response) => {
      response.result.should.equal(true);
      // send back so we can re-run
      api.sendAssetTransaction(api.TESTNET, testKeys.a.address, testKeys.b.wif, "AntCoins", 1).then((response) => {
        response.result.should.equal(true);
        done();
      });
    })
  });
});
