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

describe.only('Wallet', () => {
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
      pubKey: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
      privKey: "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69",
      pubKeyEncoded:"031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
    },

    address2: {
      pubKey: "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
      privKey: "3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b",
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
    const privateKey = utils.ab2hexstring(wallet.generatePrivateKey());
    privateKey.should.have.length(64);
    done();
  });

  it('should generate new wallet from new password', (done) => {
    const password =  Math.random().toString(36).slice(-8); // generates a random password
    const privateKey = utils.ab2hexstring(wallet.generatePrivateKey());
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
    console.log(address);

    axios.get(apiEndpoint + '/api/v1/address/get_unspent/' + address)
      .then((res) => {
        console.log(res.data);
        res.data.should.be.an('array');
        parseInt(res.data[0].balance).should.be.a('number');
        done();
      })
  });

  it.only('should send ANC from address 1 to address 2', (done) => {
    const ret = wallet.GetAccountsFromPrivateKey(myTestnetWallet.address1.privKey);
    ret.should.not.equal(-1);

    const address = ret[0].address;
    address.should.be.a('string');

    return axios.get(apiEndpoint + '/api/v1/address/get_unspent/' + address)
      .then((res) => {
        var txData = wallet.TransferTransaction(res.data[0], myTestnetWallet.address1.pubKeyEncoded, myTestnetWallet.address2.pubKey, 1);
        var sign = wallet.signatureData(txData, myTestnetWallet.address1.privKey);
        var txRawData = wallet.AddContract(txData, sign, myTestnetWallet.address1.pubKeyEncoded);
        var instance = axios.create({
          headers: {"Content-Type": "application/json"}
        });

        const jsonRpcData = {"jsonrpc": "2.0", "method": "sendrawtransaction", "params": [txRawData], "id": 4};
        return instance.post(rpcEndpoint, jsonRpcData)        
      }).then(function(res) {
        console.log(res.status);
        // console.log(res.data);
        if (res.status == 200) {
          // var txhash = reverseArray(hexstring2ab(wallet.GetTxHash(txData.substring(0, txData.length - 103 * 2))));
          // console.log('txhash is', txhash);
          res.data.result.should.equal(true);
          done()
        }
      }).catch((err) => {
        done(err)
      })
  })
});
