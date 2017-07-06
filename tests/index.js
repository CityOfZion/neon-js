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

const ANS = '\u5c0f\u8681\u80a1';
const ANC = '\u5c0f\u8681\u5e01';

describe('Wallet', function() {
  this.timeout(15000);

  let wallet;
  const testnet = {
		hostName	 : "Testnet otcgo",
		hostProvider : "otcgo.cn",
		restapi_host : "http://api.otcgo.cn",
		restapi_port : "20332",
		// webapi_host  : "http://testnet.antchain.org",
		webapi_host  : "http://testnet.antchain.xyz",
		webapi_port  : "80",
	}

  const myTestnetWallet = {
    'onlyWIF': {
      wif: 'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g'
    },
    address1: {
      address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
      privKey: "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69",
      pubKeyEncoded:"031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
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

  beforeEach(function() {
    wallet = new Wallet();
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

  it('should verify publicKeyEncoded', (done) => {
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    const accounts = wallet.GetAccountsFromPrivateKey(privateKey);
    accounts.should.not.equal(-1);
    const verify = wallet.VerifyPublicKeyEncoded(accounts[0].publickeyEncoded);
    verify.should.equal(true);
    done();
  });

  it('should verify address', (done) => {
    const privateKey = ab2hexstring(wallet.generatePrivateKey());
    const accounts = wallet.GetAccountsFromPrivateKey(privateKey);
    accounts.should.not.equal(-1);
    const verify = wallet.VerifyAddress(accounts[0].address);
    accounts.should.equal(true);
    done();
  });

  const getAns = balance => balance.filter((val) => { return val.unit === ANS })[0];
  const getAnc = balance => balance.filter((val) => { return val.unit === ANC })[0];

  const getBalance = address => {
    return axios.get(apiEndpoint + '/api/v1/address/info/' + address)
      .then((res) => {
        if (res.data.result !== 'No Address!') {
          // get ANS
          const ans = getAns(res.data.balance);
          if (typeof ans !== 'undefined') {
            parseInt(ans.balance).should.be.a('number');
          }
          // get ANC
          const anc = getAnc(res.data.balance);
          if (typeof anc !== 'undefined') {
            parseInt(anc.balance).should.be.a('number');
          }
          res.data.should.be.an('object');
          res.data.address.should.equal(address)
          res.data.balance.should.be.an('array');
        } else {
          res.data.result.should.equal('No Address!');
        }
      })
  }

  it('should get balance from wif', () => {
    const ret = wallet.GetAccountsFromWIFKey(myTestnetWallet.onlyWIF.wif);
    ret.should.not.equal(-1);
    const address = ret[0].address;
    address.should.be.a('string');
    return getBalance(address);
  });

  it('should get balance from private key', () => {
    const ret = wallet.GetAccountsFromPrivateKey(myTestnetWallet.address1.privKey);
    ret.should.not.equal(-1);

    const address = ret[0].address;
    address.should.be.a('string');
    // console.log(address);
    return getBalance(address);
  });

  it('should get balance from address', () => {
    return getBalance(myTestnetWallet.address1.address);
  })

  // it.only('should create signature data', (done) => {
  //   const txData = '8000000121d55c8859b58a36a28a88679f235409ff144ff509576e74f3588e22e108f70e0100029b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f505000000009847e26135152874355e324afd5cc99f002acb339b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500c6665e7400000035b20010db73bf86371075ddfba4e6596f1ff35d';
  //   const privKey = '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69';
  //   const sign = wallet.signatureData(txData, privKey);
  //   console.log(sign);
  //   done();
  // })

  it('should get the public key from private key', (done) => {
    const publicKey = wallet.getPublicKey(myTestnetWallet.address2.privKey, 'hex').toString('hex');
    // console.log('publicKey', publicKey);
    const publicKeyEncoded = wallet.getPublicKeyEncoded(publicKey);
    // console.log('publicKeyEncoded', publicKeyEncoded);
    publicKeyEncoded.should.equal(myTestnetWallet.address2.pubKeyEncoded);
    done();
  })

  it('should send ANS from address 1 to address 2', function() {

    const from = myTestnetWallet.address1;
    const to = myTestnetWallet.address2;

    // this is really just getting your public address e.g. ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s
    const ret = wallet.GetAccountsFromPrivateKey(from.privKey);
    ret.should.not.equal(-1);

    const address = ret[0].address;
    address.should.be.a('string');
    // console.log('address from', address);

    // gets a list of accounts (ANS or ANC) - should really be checking which account is ANC (小蚁币) or ANS (小蚁股)
    return axios.get(apiEndpoint + '/api/v1/address/info/' + address)
      .then((res) => {
        const data = res.data;
        data.address.should.equal(address);
        data.balance.should.be.a('array');
        // balance contains ANS, ANC or both.
        let balance = {};
        data.balance.forEach((e) => {
          parseInt(e.balance).should.be.a('number');
          if (e.unit === ANS) {
            balance['ANS'] = e;
          } else {
            balance['ANC'] = e;
          }
        })

        // only doing ANS for now
        // get transactions
        return axios.get(apiEndpoint + '/api/v1/address/utxo/' + address)
          .then((res) => {
            res.data.utxo.should.be.an('object');
            // console.log(res.data.utxo);
            // find the ANS transactions via the ANS asset id
            const ansTransactions = res.data.utxo[balance['ANS'].asset];
            // console.log(ansTransactions);

            const coinsData = {
              "assetid": balance['ANS'].asset,
              "list": ansTransactions,
              "balance": balance['ANS'].balance,
              "name": balance['ANS'].unit
            }
            const publicKeyEncoded = wallet.GetAccountsFromPrivateKey(from.privKey)[0].publickeyEncoded;
            const toAddress = to.address;
            // console.log('coinsData', coinsData);
            const amountToTransfer = 1;
            var txData = wallet.TransferTransaction(coinsData, publicKeyEncoded, toAddress, amountToTransfer);
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
            return instance.post(rpcEndpoint, jsonRpcData)
              .then((res) => {
                // console.log(res);
                // console.log(res.data);
                // res.data.result will be true for transaction that went through, or false for failed transaction
                var txhash = reverseArray(hexstring2ab(wallet.GetTxHash(txData.substring(0, txData.length - 103 * 2))));
                // console.log('txhash is', txhash);
                res.data.result.should.equal(true);
              })
        });
      }).catch((err) => {
        console.log('error', err);
        return Promise.reject(err);
      })
  })
});
