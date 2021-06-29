/* eslint-disable @typescript-eslint/no-explicit-any */
import apiPlugin from "@cityofzion/neon-api";
import * as neonCore from "@cityofzion/neon-core";
const neonJs = apiPlugin(neonCore);
import * as experimental from "./experimental";

const { api, sc, rpc, wallet, CONST, u, tx, logging } = neonJs;

/**
 * Semantic path for creation of a resource.
 */
const create = {
  account: (k: string): neonCore.wallet.Account => new wallet.Account(k),
  privateKey: wallet.generatePrivateKey,
  signature: wallet.generateSignature,
  wallet: (k: neonCore.wallet.WalletJSON): neonCore.wallet.Wallet =>
    new wallet.Wallet(k),
  contractParam: (
    type: keyof typeof sc.ContractParamType,
    value?:
      | string
      | number
      | boolean
      | neonCore.sc.ContractParamJson[]
      | null
      | undefined
  ): neonCore.sc.ContractParam => sc.ContractParam.fromJson({ type, value }),
  script: sc.createScript,
  scriptBuilder: (): neonCore.sc.ScriptBuilder => new sc.ScriptBuilder(),
  rpcClient: (net: string): neonCore.rpc.RPCClient => new rpc.RPCClient(net),
  query: (
    req: neonCore.rpc.QueryLike<unknown[]>
  ): neonCore.rpc.Query<unknown[], unknown> => new rpc.Query(req),
  network: (net: Partial<neonCore.rpc.NetworkJSON>): neonCore.rpc.Network =>
    new rpc.Network(net),
  stringStream: (str?: string): neonCore.u.StringStream =>
    new u.StringStream(str),
};

/**
 * Semantic path for verification of a type.
 */
const is = {
  address: wallet.isAddress,
  publicKey: wallet.isPublicKey,
  encryptedKey: wallet.isNEP2,
  privateKey: wallet.isPrivateKey,
  wif: wallet.isWIF,
  scriptHash: wallet.isScriptHash,
};

/**
 * Semantic path for deserialization of object.
 */
const deserialize = {
  attribute: tx.TransactionAttribute.deserialize,
  script: tx.Witness.deserialize,
  tx: tx.Transaction.deserialize,
};

/**
 * Semantic path for signing using private key.
 */
const sign = {
  hex: wallet.sign,
  message: (msg: string, privateKey: string): string => {
    const hex = u.str2hexstring(msg);
    return wallet.sign(hex, privateKey);
  },
};

/**
 * Semantic path for verifying signatures using public key.
 */
const verify = {
  hex: wallet.verify,
  message: (msg: string, sig: string, publicKey: string): boolean => {
    const hex = u.str2hexstring(msg);
    return wallet.verify(hex, sig, publicKey);
  },
};

export default {
  create,
  deserialize,
  is,
  sign,
  verify,
  encrypt: {
    privateKey: wallet.encrypt,
  },
  decrypt: {
    privateKey: wallet.decrypt,
  },
  u,
  CONST,
  experimental,
};

export { experimental, api, sc, rpc, wallet, CONST, u, tx, logging };
