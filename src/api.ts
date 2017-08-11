import axios from 'axios';
import { getAccountsFromWIFKey, transferTransaction, signatureData, addContract, claimTransaction } from './wallet';

export * from './wallet';

// hard-code asset ids for NEO and GAS
export const neoId = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
export const gasId = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
export const allAssetIds = [neoId, gasId];

// switch between APIs for MainNet and TestNet
export const getAPIEndpoint = function(net : String) : string {
  if (net === "MainNet"){
    return "http://api.wallet.cityofzion.io";
  } else {
    return "http://testnet-api.wallet.cityofzion.io";
  }
};

// return the best performing (highest block + fastest) node RPC
export const getRPCEndpoint = function(net : string): Promise<any> {
  const apiEndpoint = getAPIEndpoint(net);
  return axios.get(apiEndpoint + '/v1/network/best_node').then((response) => {
      return response.data.node;
  });
};

// wrapper for querying node RPC
const queryRPC = function(net : string, method : string, params : object, id : number = 1): Promise<any> {
  let jsonRequest = axios.create({
    headers: {"Content-Type": "application/json"}
  });
  const jsonRpcData = {"jsonrpc": "2.0", "method": method, "params": params, "id": id};
  return getRPCEndpoint(net).then((rpcEndpoint) => {
    return jsonRequest.post(rpcEndpoint, jsonRpcData).then((response) => {
      return response.data;
    });
  });
};

// get amounts of available (spent) and unavailable claims
export const getClaimAmounts = (net : String, address : String) => {
  const apiEndpoint = getAPIEndpoint(net);
  return axios.get(apiEndpoint + '/v1/address/claims/' + address).then((res) => {
    return {available: parseInt(res.data.total_claim), unavailable:parseInt(res.data.total_unspent_claim)};
  });
}

// do a claim transaction on all available (spent) gas
export const doClaimAllGas = function(net : string, fromWif : string): Promise<any> {
  const apiEndpoint = getAPIEndpoint(net);
  const accounts = getAccountsFromWIFKey(fromWif);
  if (accounts === -1 || accounts === -2) {
    throw "Account Error";
  }
  const account = accounts[0];
  // TODO: when fully working replace this with mainnet/testnet switch
  return axios.get(apiEndpoint + "/v1/address/claims/" + account.address).then((response) => {
    const claims = response.data["claims"];
    const total_claim = response.data["total_claim"];
    const txData = claimTransaction(claims, account.publickeyEncoded, account.address, total_claim);
    const sign = signatureData(txData, account.privatekey);
    const txRawData = addContract(txData, sign, account.publickeyEncoded);
    return queryRPC(net, "sendrawtransaction", [txRawData], 2);
  });
}

interface Balance {
  [key : string]: number | object,
  Neo : number,
  Gas : number,
  unspent: {
    [key : string] : number,
    Neo : number,
    Gas : number,
  }
}

// get Neo and Gas balance for an account
export const getBalance = function(net : String, address : String): Promise<Balance> {
    const apiEndpoint = getAPIEndpoint(net);
    return axios.get(apiEndpoint + '/v1/address/balance/' + address)
      .then((res) => {
          return <Balance>{
            Neo: res.data.NEO.balance,
            Gas: res.data.GAS.balance,
            unspent: {
              Neo: res.data.NEO.unspent,
              Gas: res.data.GAS.unspent
            }
          };
      })
};

/**
 * @function
 * @description
 * Hit the coinmarketcap api ticket to fetch the latest USD to NEO price
 *
 * @param {number} amount - The current NEO amount in wallet
 * @return {string} - The converted NEO to USD fiat amount
 */
export const getMarketPriceUSD = function(amount : number): Promise<string> {
  return axios.get('https://api.coinmarketcap.com/v1/ticker/NEO/?convert=USD').then((response) => {
      let lastUSDNEO = Number(response.data[0].price_usd);
      return `$${(lastUSDNEO * amount).toFixed(2).toString()}`;
  });
};

// get transaction history for an account
export const getTransactionHistory = function(net : string, address : string): Promise<any> {
  const apiEndpoint = getAPIEndpoint(net);
  return axios.get(apiEndpoint + '/v1/address/history/' + address).then((response) => {
    return response.data.history;
  });
};

// get the current height of the light wallet DB
export const getWalletDBHeight = function(net : string): Promise<number> {
  const apiEndpoint = getAPIEndpoint(net);
  return axios.get(apiEndpoint + '/v1/block/height').then((response) => {
    return parseInt(response.data.block_height);
  });
}

// send an asset to an address
export const doSendAsset = function(net : string, toAddress : string, fromWif : string, assetType : string, amount : number): Promise<any> {
  let assetId : string, assetName : string, assetSymbol : string;
  if (assetType === "Neo"){
    assetId = neoId;
  } else {
    assetId = gasId;
  }
  const accounts = getAccountsFromWIFKey(fromWif);
  if (accounts === -1 || accounts === -2) {
    throw "Account Error";
  }
  const fromAccount = accounts[0];
  return getBalance(net, fromAccount.address).then((balance : Balance) => {
    const coinsData = {
      "assetid": assetId,
      "list": balance.unspent[assetType],
      "balance": balance[assetType],
      "name": assetType
    }
    const txData = transferTransaction(coinsData, fromAccount.publickeyEncoded, toAddress, amount);
    if (txData === -1) {
      throw "transfer data failed";
    }
    const sign = signatureData(txData, fromAccount.privatekey);
    const txRawData = addContract(txData, sign, fromAccount.publickeyEncoded);
    return queryRPC(net, "sendrawtransaction", [txRawData], 4);
  });
};
