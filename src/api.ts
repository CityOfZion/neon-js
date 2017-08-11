import axios from 'axios';
import { getAccountsFromWIFKey, transferTransaction, signatureData, addContract, claimTransaction } from './wallet';
import * as t from "./typings";

export * from './wallet';

// hard-code asset ids for NEO and GAS
export const neoId = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
export const gasId = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
export const allAssetIds = [neoId, gasId];

export class NeonAPI {
  public net : t.Network;
  public rpcEndpoint : string;
  public apiEndpoint : string;

  constructor (net : t.Network) {
    this.net = net;
    this.getAPIEndpoint();
    this.getRPCEndpoint();

  }

  public getAPIEndpoint(): void{
    if (this.net === "MainNet"){
      this.apiEndpoint = "http://api.wallet.cityofzion.io";
    } else {
      this.apiEndpoint = "http://testnet-api.wallet.cityofzion.io";
    }
  };

  public getRPCEndpoint(): void {
    axios.get(this.apiEndpoint + '/v1/network/best_node').then((response) => {
        this.rpcEndpoint = response.data.node;
    });
  };

  private queryRPC(method : string, params : object, id : number = 1): Promise<any> {
    let jsonRequest = axios.create({
      headers: {"Content-Type": "application/json"}
    });
    const jsonRpcData = {"jsonrpc": "2.0", "method": method, "params": params, "id": id};
    return jsonRequest.post(this.rpcEndpoint, jsonRpcData).then(response => response.data);
  };

  public getClaimAmounts(address : String): Promise<any> {
    return axios.get(this.apiEndpoint + '/v1/address/claims/' + address).then((res) => {
      return {available: parseInt(res.data.total_claim), unavailable:parseInt(res.data.total_unspent_claim)};
    });
  }

  public doClaimAllGas(fromWif : string): Promise<any> {
    const accounts = getAccountsFromWIFKey(fromWif);
    if (accounts === -1) {
      throw "BasicEncodingError: getAccountsFromWIFKey";
    }
    else if(accounts === -2) {
      throw "WIFError: getAccountsFromWIFKey";
    }
    const account = accounts[0];
    // TODO: when fully working replace this with mainnet/testnet switch
    return axios.get(this.apiEndpoint + "/v1/address/claims/" + account.address).then((response) => {
      const claims = response.data["claims"];
      const total_claim = response.data["total_claim"];
      const txData = claimTransaction(claims, account.publickeyEncoded, account.address, total_claim);
      const sign = signatureData(txData, account.privatekey);
      const txRawData = addContract(txData, sign, account.publickeyEncoded);
      return this.queryRPC("sendrawtransaction", [txRawData], 2);
    });
  };

  public getBalance(address : String): Promise<t.Balance> {
    return axios.get(this.apiEndpoint + '/v1/address/balance/' + address)
      .then((res) => {
          return <t.Balance>{
            Neo: <t.AssetTransaction[]>res.data.NEO.balance,
            Gas: <t.AssetTransaction[]>res.data.GAS.balance,
            unspent: {
              Neo: <t.AssetTransaction[]>res.data.NEO.unspent,
              Gas: <t.AssetTransaction[]>res.data.GAS.unspent
            }
          };

      })
  };

  public getMarketPriceUSD(amount : number): Promise<string> {
    return axios.get('https://api.coinmarketcap.com/v1/ticker/NEO/?convert=USD').then((response) => {
        let lastUSDNEO = Number(response.data[0].price_usd);
        return `$${(lastUSDNEO * amount).toFixed(2).toString()}`;
    });
  };

  public getTransactionHistory(net : string, address : string): Promise<any> {
    return axios.get(this.apiEndpoint + '/v1/address/history/' + address).then((response) => {
      return response.data.history;
    });
  };

  public getWalletDBHeight(): Promise<number> {
    return axios.get(this.apiEndpoint + '/v1/block/height').then((response) => {
      return parseInt(response.data.block_height);
    });
  }

  public doSendAsset(toAddress : string, fromWif : string, assetType : t.AssetName, amount : number): Promise<any> {
    let assetId : t.AssetID,
        assetName : t.AssetName;

    if (assetType === "Neo"){
      assetId = neoId;
    } else if (assetType === "Gas") {
      assetId = gasId;
    } else {
      throw `Asset type ${assetType} is unknown.`;
    }

    const accounts = getAccountsFromWIFKey(fromWif);
    if (accounts === -1) {
      throw "BasicDecodingError: getAccountsFromWIFKey";
    } else if (accounts === -2) {
      throw "WIFError: getAccountsFromWIFKey";
    }

    const fromAccount = accounts[0];
    return this.getBalance(fromAccount.address).then((balance : t.Balance) => {
      const coinsData = <t.CoinData>{
        assetid: assetId,
        list: balance.unspent[assetType],
        balance: balance[assetType],
        name: assetType
      }
      const txData = transferTransaction(coinsData, fromAccount.publickeyEncoded, toAddress, amount);
      if (txData === -1) {
        throw "BasicEncodingError: TransferTransaction";
      }
      const sign = signatureData(txData, fromAccount.privatekey);
      const txRawData = addContract(txData, sign, fromAccount.publickeyEncoded);
      return this.queryRPC("sendrawtransaction", [txRawData], 4);
    });
  };
}
