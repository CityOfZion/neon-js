import * as api from "@cityofzion/neon-api";
import { CONST, rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";
import * as nep5 from "@cityofzion/neon-nep5";

export default {
  sendAsset: api.sendAsset,
  claimGas: api.claimGas,
  doInvoke: api.doInvoke,
  create: {
    account: (k: string) => new wallet.Account(k),
    privateKey: wallet.generatePrivateKey,
    signature: wallet.generateSignature,
    wallet: (k: wallet.WalletLike) => new wallet.Wallet(k),
    tx: (args: tx.Transaction) => new tx.Transaction(args),
    claimTx: tx.Transaction.createClaimTx,
    contractTx: tx.Transaction.createContractTx,
    invocationTx: tx.Transaction.createInvocationTx,
    contractParam: (type: string, value: any) =>
      new sc.ContractParam(type, value),
    script: sc.createScript,
    scriptBuilder: () => new sc.ScriptBuilder(),
    deployScript: (args: any) => sc.generateDeployScript(args),
    rpcClient: (net: string, version: string) =>
      new rpc.RPCClient(net, version),
    query: (req: rpc.RPCRequest) => new rpc.Query(req)
  },
  deserialize: {
    attribute: tx.deserializeTransactionAttribute,
    input: tx.deserializeTransactionInput,
    output: tx.deserializeTransactionOutput,
    script: tx.deserializeWitness,
    exclusiveData: tx.deserializeExclusive,
    tx: tx.deserializeTransaction
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
    scriptHashFromAddress: wallet.getScriptHashFromAddress,
    transactionHash: tx.getTransactionHash
  },
  serialize: {
    attribute: tx.serializeTransactionAttribute,
    input: tx.serializeTransactionInput,
    output: tx.serializeTransactionOutput,
    script: tx.serializeWitness,
    exclusiveData: tx.serializeExclusive,
    tx: tx.serializeTransaction
  },
  sign: {
    message: wallet.signMessage,
    transaction: tx.signTransaction
  },
  verify: {
    message: wallet.verifyMessage
  },
  u,
  CONST
};

export * from "@cityofzion/neon-core";
export { api, nep5 };
