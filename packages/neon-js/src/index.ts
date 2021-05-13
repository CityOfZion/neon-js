import apiPlugin from "@cityofzion/neon-api";
import * as neonCore from "@cityofzion/neon-core";
import nepPlugin from "@cityofzion/neon-nep5";

const neonWithApi = apiPlugin(neonCore);
const neonJs = nepPlugin(neonWithApi);

export const { api, nep5, settings, sc, rpc, wallet, CONST, u, tx, logging } =
  neonJs;
import defaultNetworks from "./networks";
const bootstrap: {
  [net: string]: Partial<neonCore.rpc.NetworkJSON>;
} = defaultNetworks;
Object.keys(bootstrap).map((key) => {
  settings.networks[key] = new rpc.Network(
    bootstrap[key] as neonCore.rpc.NetworkJSON
  );
});

/**
 * Semantic path for creation of a resource.
 */
const create = {
  account: (k: string): neonCore.wallet.Account => new wallet.Account(k),
  privateKey: wallet.generatePrivateKey,
  signature: wallet.generateSignature,
  wallet: (k: neonCore.wallet.WalletJSON): neonCore.wallet.Wallet =>
    new wallet.Wallet(k),
  claimTx: (): neonCore.tx.ClaimTransaction => new tx.ClaimTransaction(),
  contractTx: (): neonCore.tx.ContractTransaction =>
    new tx.ContractTransaction(),
  invocationTx: (): neonCore.tx.InvocationTransaction =>
    new tx.InvocationTransaction(),
  stateTx: (): neonCore.tx.StateTransaction => new tx.StateTransaction(),
  contractParam: (
    type: keyof typeof sc.ContractParamType,
    value: any
  ): neonCore.sc.ContractParam => new sc.ContractParam(type, value),
  script: sc.createScript,
  scriptBuilder: (): neonCore.sc.ScriptBuilder => new sc.ScriptBuilder(),
  deployScript: (args: any): neonCore.sc.ScriptBuilder =>
    sc.generateDeployScript(args),
  rpcClient: (net: string, version: string): neonCore.rpc.RPCClient =>
    new rpc.RPCClient(net, version),
  query: (req: neonCore.rpc.RPCRequest): neonCore.rpc.Query =>
    new rpc.Query(req),
  network: (net: Partial<neonCore.rpc.NetworkJSON>): neonCore.rpc.Network =>
    new rpc.Network(net),
  stringStream: (str?: string): neonCore.u.StringStream =>
    new u.StringStream(str),
  fixed8: (i?: string | number): neonCore.u.Fixed8 => new u.Fixed8(i),
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
  input: tx.TransactionInput.deserialize,
  output: tx.TransactionOutput.deserialize,
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
  sendAsset: api.sendAsset,
  claimGas: api.claimGas,
  doInvoke: api.doInvoke,
  setupVote: api.setupVote,
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
  add: {
    network: (network: neonCore.rpc.Network, override = false): boolean => {
      if (override && settings.networks[network.name]) {
        return false;
      }
      settings.networks[network.name] = network;
      return true;
    },
  },
  remove: {
    network: (name: string): boolean => {
      if (settings.networks[name]) {
        delete settings.networks[name];
        return true;
      }
      return false;
    },
  },
  u,
  CONST,
};
