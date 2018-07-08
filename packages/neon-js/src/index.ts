import * as api from "@cityofzion/neon-api";
import { CONST, rpc, sc, settings, tx, u, wallet } from "@cityofzion/neon-core";
import * as nep5 from "@cityofzion/neon-nep5";
import defaultNetworks from "./networks";
const bootstrap: { [net: string]: Partial<rpc.NetworkJSON> } = defaultNetworks;
Object.keys(bootstrap).map(key => {
  settings.networks[key] = new rpc.Network(bootstrap[key] as rpc.NetworkJSON);
});

export default {
  sendAsset: api.sendAsset,
  claimGas: api.claimGas,
  doInvoke: api.doInvoke,
  create: {
    account: (k: string) => new wallet.Account(k),
    privateKey: wallet.generatePrivateKey,
    signature: wallet.generateSignature,
    wallet: (k: wallet.WalletJSON) => new wallet.Wallet(k),
    claimTx: () => new tx.ClaimTransaction,
    contractTx:() => new tx.ContractTransaction,
    invocationTx: () => new tx.InvocationTransaction,
    contractParam: (type: keyof typeof sc.ContractParamType, value: any) =>
      new sc.ContractParam(type, value),
    script: sc.createScript,
    scriptBuilder: () => new sc.ScriptBuilder(),
    deployScript: (args: any) => sc.generateDeployScript(args),
    rpcClient: (net: string, version: string) =>
      new rpc.RPCClient(net, version),
    query: (req: rpc.RPCRequest) => new rpc.Query(req)
  },
  deserialize: {
    attribute: tx.TransactionAttribute.deserialize,
    input: tx.TransactionInput.deserialize,
    output: tx.TransactionOutput.deserialize,
    script: tx.Witness.deserialize,
    tx: tx.Transaction.deserialize
  },
  is: {
    address: wallet.isAddress,
    publicKey: wallet.isPublicKey,
    encryptedKey: wallet.isNEP2,
    privateKey: wallet.isPrivateKey,
    wif: wallet.isWIF,
    scriptHash: wallet.isScriptHash
  },
  encrypt: {
    privateKey: wallet.encrypt
  },
  decrypt: {
    privateKey: wallet.decrypt
  },
  get: {
    privateKeyFromWIF: wallet.getPrivateKeyFromWIF,
    WIFFromPrivateKey: wallet.getWIFFromPrivateKey,
    publicKeyFromPrivateKey: wallet.getPublicKeyFromPrivateKey,
    scriptHashFromPublicKey: wallet.getScriptHashFromPublicKey,
    addressFromScriptHash: wallet.getAddressFromScriptHash,
    scriptHashFromAddress: wallet.getScriptHashFromAddress
  },
  sign: {
    message: wallet.sign
  },
  verify: {
    message: wallet.verify
  },
  u,
  CONST
};

export * from "@cityofzion/neon-core";
export { settings, api, nep5 };
