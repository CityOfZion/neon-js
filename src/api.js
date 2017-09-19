import axios from 'axios';
import { getAccountsFromWIFKey, transferTransaction, signatureData, addContract, claimTransaction } from './wallet';

export * from './wallet.js';
export * from './nep2.js';

// hard-code asset ids for NEO and GAS
export const neoId = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b';
export const gasId = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7';
export const allAssetIds = [neoId, gasId];

// switch between APIs for MainNet and TestNet
export const getAPIEndpoint = (net) => {
  if (net === 'MainNet'){
    return 'http://api.wallet.cityofzion.io';
  } else {
    return 'http://testnet-api.wallet.cityofzion.io';
  }
};

// return the best performing (highest block + fastest) node RPC
export const getRPCEndpoint = (net) => {
  return axios.get(`${getAPIEndpoint(net)}/v2/network/best_node`).then((response) => response.data.node);
};

// wrapper for querying node RPC
const queryRPC = (net, method, params, id = 1) => {
  const jsonRequest = axios.create({
          headers: { 'Content-Type': 'application/json' }
        }),
        jsonRpcData = {
          method,
          params,
          id,
          jsonrpc: '2.0'
        };
  return getRPCEndpoint(net).then((rpcEndpoint) => {
    return jsonRequest.post(rpcEndpoint, jsonRpcData).then((response) => response.data);
  });
};

// get amounts of available (spent) and unavailable claims
export const getClaimAmounts = (net, address) => {
  return axios.get(`${getAPIEndpoint(net)}/v2/address/claims/${address}`).then(
    ({ data }) => ({
      available: parseInt(data.total_claim, 10),
      unavailable: parseInt(data.total_unspent_claim, 10)
    })
  );
};

// do a claim transaction on all available (spent) gas
export const doClaimAllGas = (net, fromWif) => {
  const { publickeyEncoded, address, privatekey } = getAccountsFromWIFKey(fromWif)[0];
  // TODO: when fully working replace this with mainnet/testnet switch
  return axios.get(`${getAPIEndpoint(net)}/v2/address/claims/${address}`).then((response) => {
    const { claims, total_claim: totalClaim } = response.data,
          txData = claimTransaction(claims, publickeyEncoded, address, totalClaim),
          sign = signatureData(txData, privatekey),
          txRawData = addContract(txData, sign, publickeyEncoded);
    return queryRPC(net, 'sendrawtransaction', [txRawData], 2);
  });
}

// get Neo and Gas balance for an account
export const getBalance = (net, address) => {
  return axios.get(`${getAPIEndpoint(net)}/v2/address/balance/${address}`)
    .then(
      ({ data }) => ({
        Neo: data.NEO.balance,
        Gas: data.GAS.balance,
        unspent: {
          Neo: data.NEO.unspent,
          Gas: data.GAS.unspent
        }
      })
    );
};

// get transaction history for an account
export const getTransactionHistory = (net, address) => {
  return axios.get(`${getAPIEndpoint(net)}/v2/address/history/${address}`).then((response) => response.data.history);
};

// get the current height of the light wallet DB
export const getWalletDBHeight = (net) => {
  return axios.get(`${getAPIEndpoint(net)}/v2/block/height`).then((response) => parseInt(response.data.block_height, 10));
}

// send an asset to an address
export const doSendAsset = (net, toAddress, fromWif, assetType, amount) => {
  const assetId = (assetType === 'Neo') ? neoId : gasId,
        { publickeyEncoded, address, privatekey } = getAccountsFromWIFKey(fromWif)[0];
  return getBalance(net, address).then((response) => {
    const coinsData = {
      assetid: assetId,
      list: response.unspent[assetType],
      balance: response[assetType],
      name: assetType
    }
    const txData = transferTransaction(coinsData, publickeyEncoded, toAddress, amount),
          sign = signatureData(txData, privatekey),
          txRawData = addContract(txData, sign, publickeyEncoded);
    return queryRPC(net, 'sendrawtransaction', [txRawData], 4);
  });
};
