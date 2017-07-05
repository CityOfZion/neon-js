import chai from 'chai';
import { ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes } from '../src/utils';
import Wallet from '../src/index';
import axios from 'axios';
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();


describe('Wallet', () => {
  let wallet;
  const testnet = {
		hostName	 : "Testnet otcgo",
		hostProvider : "otcgo.cn",
		restapi_host : "http://api.otcgo.cn",
		restapi_port : "20332",
		webapi_host  : "http://testnet.antchain.org",
		webapi_port  : "80",
	}

  const myTestnetWallet = {
    address1: {
      address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
      privKey: "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69",
      pubKeyEncoded:"021d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
    },

    address2: {
      address: "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
      privKey: "3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b",
      pubKeyEncoded: "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa",
      wif: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG"
    }
  }

  const rpcEndpoint = testnet.restapi_host + ":" + testnet.restapi_port;
  const apiEndpoint = testnet.webapi_host;

  beforeEach((done) => {
    wallet = new Wallet();
    done();
  })

  it('should connect to the testnet node and get block count', (done) => {
    var instance = axios.create({
      headers: {"Content-Type": "application/json"}
    });

    const jsonRpcData = {"jsonrpc": "2.0", "method": "getblockcount", "params": [], "id": 4};
    instance.post(rpcEndpoint, jsonRpcData)
      .then((res) => {
        res.status.should.equal(200);
        res.data.result.should.be.a('number');
        done();
      })
  })

  it('should generate a new private key', (done) => {
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    privateKey.should.have.length(64);
    done();
  });

  it('should generate new wallet from new password', (done) => {
    const password =  Math.random().toString(36).slice(-8); // generates a random password
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    // console.log(privateKey);

    const walletBlob = wallet.generateWalletFileBlob(privateKey, password);
    walletBlob.should.be.an('Uint8Array');
    done();
  });

  it('should open wallet and get a balance', (done) => {
    const ret = wallet.GetAccountsFromPrivateKey(myTestnetWallet.address1.privKey);
    ret.should.not.equal(-1);

    const address = ret[0].address;
    address.should.be.a('string');
    // console.log(address);

    axios.get(apiEndpoint + '/api/v1/address/get_unspent/' + address)
      .then((res) => {
        console.log(res.data);
        res.data.should.be.an('array');
        parseInt(res.data[0].balance).should.be.a('number');
        done();
      })
  });

  // it.only('should create signature data', (done) => {
  //   const txData = '8000000121d55c8859b58a36a28a88679f235409ff144ff509576e74f3588e22e108f70e0100029b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f505000000009847e26135152874355e324afd5cc99f002acb339b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500c6665e7400000035b20010db73bf86371075ddfba4e6596f1ff35d';
  //   const privKey = '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69';
  //   const sign = wallet.signatureData(txData, privKey);
  //   console.log(sign);
  //   done();
  // })

  it('should get the public key from private key', (done) => {
    const publicKey = wallet.getPublicKey(myTestnetWallet.address2.privKey, 'hex').toString('hex');
    console.log('publicKey', publicKey);
    publicKey.should.equal(myTestnetWallet.address2.pubKeyEncoded);
    done();
  })

  it('should send ANS from address 1 to address 2', (done) => {
    const from = myTestnetWallet.address1;
    const to = myTestnetWallet.address2;

    // this is really just getting your public address e.g. ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s
    const ret = wallet.GetAccountsFromPrivateKey(from.privKey);
    ret.should.not.equal(-1);

    const address = ret[0].address;
    address.should.be.a('string');
    // console.log('address from', address);

    // gets a list of accounts (ANS or ANC) - should really be checkingwhich account is ANC (小蚁币) or ANS (小蚁股)
    return axios.get(apiEndpoint + '/api/v1/address/get_unspent/' + address)
      .then((res) => {
        // console.log("res.data",  res.data);
        var publicKeyEncoded = from.pubKeyEncoded;
        const toAddress = to.address;
        var txData = wallet.TransferTransaction(res.data[0], publicKeyEncoded, toAddress, 1);
        var privateKey = from.privKey;
        // console.log('txData', txData);
        // console.log('privateKey', privateKey)
        var sign = wallet.signatureData(txData, privateKey);
        // console.log('sign', sign);
        var txRawData = wallet.AddContract(txData, sign, publicKeyEncoded);

        var instance = axios.create({
          headers: {"Content-Type": "application/json"}
        });

        const jsonRpcData = {"jsonrpc": "2.0", "method": "sendrawtransaction", "params": [txRawData], "id": 4};
        return instance.post(rpcEndpoint, jsonRpcData);
      }).then(function(res) {
        // console.log(res.status);
        // console.log(res.data);

        // res.data.result will be true for transaction that went through, or false for failed transaction
        if (res.status == 200) {
          // var txhash = reverseArray(hexstring2ab(wallet.GetTxHash(txData.substring(0, txData.length - 103 * 2))));
          // console.log('txhash is', txhash);
          res.data.result.should.equal(true);
        }
        done();
      }).catch((err) => {
        console.log('error', err);
        done(err)
      })
  })
});
