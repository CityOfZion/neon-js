// this file contains high level API functions for connecting with network resources

import axios from 'axios';
import { getAccountsFromWIFKey, transferTransaction, signatureData, addContract, claimTransactionRewrite } from './wallet.js';

const apiEndpoint = "http://testnet.antchain.xyz";
const rpcEndpoint = "http://api.otcgo.cn:20332"; // testnet = 20332

// network name variables
export const MAINNET = "MainNet";
export const TESTNET = "TestNet";

// hard-code asset ids for ANS and ANC
export const ansId = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
export const ancId = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
export const allAssetIds = [ansId, ancId];

// hard-code asset names for ANS and ANC
const ansName = "小蚁股";
const ancName = "小蚁币";

// destructure explorer json responses
const ANS = '\u5c0f\u8681\u80a1';
const ANC = '\u5c0f\u8681\u5e01';
const getAns = balance => balance.filter((val) => { return val.unit === ANS })[0];
const getAnc = balance => balance.filter((val) => { return val.unit === ANC })[0];

// return Netwok endpoints that correspond to MainNet and TestNet
export const getNetworkEndpoints = (net) => {
  if (net === MAINNET){
    return {
      apiEndpoint: "https://antchain.xyz",
      rpcEndpoint: "http://api.otcgo.cn:10332"
    }
  } else {
    return {
      apiEndpoint: "http://testnet.antchain.xyz",
      rpcEndpoint: "http://testnet.rpc.neeeo.org:20332/" // "http://api.otcgo.cn:20332" //
    }
  }
};

// wrapper for querying node RPC
// see antshares node API documentation for details
const queryRPC = (net, method, params, id = 1) => {
  const network = getNetworkEndpoints(net);
  let jsonRequest = axios.create({
    headers: {"Content-Type": "application/json"}
  });
  const jsonRpcData = {"jsonrpc": "2.0", "method": method, "params": params, "id": id};
  return jsonRequest.post(network.rpcEndpoint, jsonRpcData).then((response) => {
    return response.data;
  });
};

// get a given block by index, passing verbose (the "1" param) to have the node
// destructure metadata for us
export const getBlockByIndex = (net, block) => {
  return queryRPC(net, "getblock", [block, 1]);
}

// get the current height of the blockchain
export const getBlockCount = (net) => {
  return queryRPC(net, "getblockcount", []);
}

// use a public blockchain explorer (currently antchain.xyz) to get the current balance of an account
// returns dictionary with both ANS and ANC
export const getBalance = (net, address) => {
    const network = getNetworkEndpoints(net);
    return axios.get(network.apiEndpoint + '/api/v1/address/info/' + address)
      .then((res) => {
        if (res.data.result !== 'No Address!') {
          // get ANS
          const ans = getAns(res.data.balance);
          const anc = getAnc(res.data.balance);
          return {ANS: ans, ANC: anc};
        }
      })
};

// use a public blockchain explorer (currently antchain.xyz) to get unspent transaction for an account
// TODO: rename this to getUnspentTransactions
// TODO: what we really need is an API to get all transactions. new blockchain explorer!
export const getTransactions = (net, address, assetId) => {
  const network = getNetworkEndpoints(net);
  return axios.get(network.apiEndpoint + '/api/v1/address/utxo/' + address).then((response) => {
    return response.data.utxo[assetId];
  });
};

export const sendClaimTransaction = (net, fromWif) => {
  const network = getNetworkEndpoints(net);
  const account = getAccountsFromWIFKey(fromWif)[0];
  // TODO: when fully working replace this with mainnet/testnet switch
  return axios.get("http://localhost:5000/get_claim/" + account.address).then((response) => {
    const claims = response.data["claims"];
    const total_claim = response.data["total_claim"];
    const txData = claimTransactionRewrite(claims, account.publickeyEncoded, account.address, total_claim);
    const sign = signatureData(txData, account.privatekey);
    const txRawData = addContract(txData, sign, account.publickeyEncoded);
    return queryRPC(net, "sendrawtransaction", [txRawData], 2)
  });
}

// send ANS or ANC over the network
// "net" is "MainNet" or "TestNet"
// "toAddress" is reciever address as string
// "fromWif" is sender WIF as string
// "assetType" is "AntShares" or "AntCoins"
// "amount" is integer amount to send (or float for ANC)
export const sendAssetTransaction = (net, toAddress, fromWif, assetType, amount) => {
  const network = getNetworkEndpoints(net);
  let assetId, assetName, assetSymbol;
  if (assetType === "AntShares"){
    assetId = ansId;
    assetName = ansName;
    assetSymbol = 'ANS';
  } else if (assetType === "AntCoins") {
    assetId = ancId;
    assetName = ancName;
    assetSymbol = 'ANC';
  }
  const fromAccount = getAccountsFromWIFKey(fromWif)[0];
  return getBalance(net, fromAccount.address).then((response) => {
    const balance = response[assetSymbol];
    return getTransactions(net, fromAccount.address, assetId).then((transactions) => {
      const coinsData = {
        "assetid": assetId,
        "list": transactions,
        "balance": balance,
        "name": assetName
      }
      const txData = transferTransaction(coinsData, fromAccount.publickeyEncoded, toAddress, amount);
      const sign = signatureData(txData, fromAccount.privatekey);
      const txRawData = addContract(txData, sign, fromAccount.publickeyEncoded);
      let jsonRequest = axios.create({
        headers: {"Content-Type": "application/json"}
      });
      const jsonRpcData = {"jsonrpc": "2.0", "method": "sendrawtransaction", "params": [txRawData], "id": 4};
      return jsonRequest.post(network.rpcEndpoint, jsonRpcData).then((response) => {
        return response.data;
      });
    });
  });
};
