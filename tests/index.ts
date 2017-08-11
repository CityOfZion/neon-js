import * as chai from 'chai';
import { ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes } from '../src/utils';
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
    }
  };

  const testNet = new api.NeonAPI("TestNet");

  // TODO: this works, but will not work repeatedly for obvious reasons :)
  // it('should claim ANC', (done) =>{
  //   api.claimAllGAS(api.MAINNET, testKeys.c.wif).then((response) => {
  //     console.log(response);
  //     done();
  //   })
  // });

  it('should generate a new private key', (done) => {
    const privateKey = ab2hexstring(api.generatePrivateKey());
    privateKey.should.have.length(64);
    done();
  });

  it('should generate a valid WIF', (done) => {
    const privateKey = api.generatePrivateKey();
    const wif = api.getWIFFromPrivateKey(privateKey);
    const accounts = api.getAccountsFromWIFKey(wif);
    if (accounts === -1 || accounts === -2)
      throw "Accounts error";
    const account = accounts[0];
    account.privatekey.should.equal(ab2hexstring(privateKey));
    done();
  });

  it('should get keys from a WIF', (done) =>{
    const accounts = api.getAccountsFromWIFKey(testKeys.a.wif);
    if (accounts === -1 || accounts === -2)
      throw "Accounts error";
    const account = accounts[0];
    account.privatekey.should.be.a('string');
    account.address.should.equal(testKeys.a.address);
    done();
  });

  it('should verify publicKeyEncoded', (done) => {
    const privateKey = ab2hexstring(api.generatePrivateKey());
    const accounts = api.getAccountsFromPrivateKey(privateKey);
    accounts.should.not.equal(-1);
    if (accounts === -1) return;
    const verify = api.verifyPublicKeyEncoded(accounts[0].publickeyEncoded);
    verify.should.equal(true);
    done();
  });

  it('should verify address', (done) => {
    const privateKey = ab2hexstring(api.generatePrivateKey());
    const accounts = api.getAccountsFromPrivateKey(privateKey);
    accounts.should.not.equal(-1);
    if (accounts === -1) return;
    const verify = api.verifyAddress(accounts[0].address);
    verify.should.equal(true);
    done();
  });

  it('should get balance from address', (done) => {
    testNet.getBalance(testKeys.a.address).then((response) =>{
      response.Neo.should.be.a('number');
      response.Gas.should.be.a('number');
      done();
    });
  });

  it('should get unspent transactions', (done) => {
    testNet.getBalance(testKeys.a.address)
    .then((response) => {
      response.unspent.Neo.should.be.an('array');
      response.unspent.Gas.should.be.an('array');
      done();
    })
  });

  // it('should send NEO', (done) => {
  //   testNet.doSendAsset(testKeys.b.address, testKeys.a.wif, "Neo", 1)
  //   .then((response) => {
  //     console.log(response);
  //     response.result.should.equal(true);
  //     // send back so we can re-run
  //     testNet.doSendAsset( testKeys.a.address, testKeys.b.wif, "Neo", 1)
  //     .then((response) => {
  //       response.result.should.equal(true);
  //       done();
  //     })
  //   })
  //   .catch((err) => done(err));
  // });

  // it('should send GAS', (done) => {
  //   testNet.doSendAsset(testKeys.b.address, testKeys.a.wif, "Gas", 1)
  //   .then((response) => {
  //     response.result.should.equal(true);
  //     // send back so we can re-run
  //     testNet.doSendAsset(testKeys.a.address, testKeys.b.wif, "Gas", 1)
  //     .then((response) => {
  //       response.result.should.equal(true);
  //       done();
  //     })
  //   })
  //   .catch((err) => done(err));
  // });
});
