import InteropService from "./InteropService";
import NativeContractMethodPrices from "./NativeContractMethodPrices";
import { Fixed8 } from "../u";

const gasPerByte = 100000e-8;
const fixedPrices = {
  [InteropService.SYSTEM_EXECUTIONENGINE_GETSCRIPTCONTAINER]: 250e-8,
  [InteropService.SYSTEM_EXECUTIONENGINE_GETEXECUTINGSCRIPTHASH]: 400e-8,
  [InteropService.SYSTEM_EXECUTIONENGINE_GETCALLINGSCRIPTHASH]: 400e-8,
  [InteropService.SYSTEM_EXECUTIONENGINE_GETENTRYSCRIPTHASH]: 400e-8,
  [InteropService.SYSTEM_RUNTIME_PLATFORM]: 250e-8,
  [InteropService.SYSTEM_RUNTIME_GETTRIGGER]: 250e-8,
  [InteropService.SYSTEM_RUNTIME_CHECKWITNESS]: 30000e-8,
  [InteropService.SYSTEM_RUNTIME_NOTIFY]: 250e-8,
  [InteropService.SYSTEM_RUNTIME_LOG]: 300000e-8,
  [InteropService.SYSTEM_RUNTIME_GETTIME]: 250e-8,
  [InteropService.SYSTEM_RUNTIME_SERIALIZE]: 100000e-8,
  [InteropService.SYSTEM_RUNTIME_DESERIALIZE]: 500000e-8,
  [InteropService.SYSTEM_RUNTIME_GETINVOCATIONCOUNTER]: 400e-8,
  [InteropService.SYSTEM_RUNTIME_GETNOTIFICATIONS]: 10000e-8,
  [InteropService.SYSTEM_CRYPTO_VERIFY]: 1000000e-8,
  [InteropService.SYSTEM_BLOCKCHAIN_GETHEIGHT]: 400e-8,
  [InteropService.SYSTEM_BLOCKCHAIN_GETHEADER]: 7000e-8,
  [InteropService.SYSTEM_BLOCKCHAIN_GETBLOCK]: 2500000e-8,
  [InteropService.SYSTEM_BLOCKCHAIN_GETTRANSACTION]: 1000000e-8,
  [InteropService.SYSTEM_BLOCKCHAIN_GETTRANSACTIONHEIGHT]: 1000000e-8,
  [InteropService.SYSTEM_BLOCKCHAIN_GETCONTRACT]: 1000000e-8,
  [InteropService.SYSTEM_HEADER_GETINDEX]: 400e-8,
  [InteropService.SYSTEM_HEADER_GETHASH]: 400e-8,
  [InteropService.SYSTEM_HEADER_GETPREVHASH]: 400e-8,
  [InteropService.SYSTEM_HEADER_GETTIMESTAMP]: 400e-8,
  [InteropService.SYSTEM_BLOCK_GETTRANSACTIONCOUNT]: 400e-8,
  [InteropService.SYSTEM_BLOCK_GETTRANSACTIONS]: 10000e-8,
  [InteropService.SYSTEM_BLOCK_GETTRANSACTION]: 400e-8,
  [InteropService.SYSTEM_TRANSACTION_GETHASH]: 400e-8,
  [InteropService.SYSTEM_CONTRACT_CALL]: 1000000e-8,
  [InteropService.SYSTEM_CONTRACT_DESTROY]: 1000000e-8,
  [InteropService.SYSTEM_STORAGE_GETCONTEXT]: 400e-8,
  [InteropService.SYSTEM_STORAGE_GETREADONLYCONTEXT]: 400e-8,
  [InteropService.SYSTEM_STORAGE_GET]: 1000000e-8,
  [InteropService.SYSTEM_STORAGE_PUT]: undefined,
  [InteropService.SYSTEM_STORAGE_PUTEX]: undefined,
  [InteropService.SYSTEM_STORAGE_DELETE]: 1000000e-8,
  [InteropService.SYSTEM_STORAGECONTEXT_ASREADONLY]: 400e-8,
  [InteropService.NEO_NATIVE_DEPLOY]: 0e-8,
  [InteropService.NEO_CRYPTO_CHECKSIG]: 1000000e-8,
  [InteropService.NEO_CRYPTO_CHECKMULTISIG]: undefined,
  [InteropService.NEO_HEADER_GETVERSION]: 400e-8,
  [InteropService.NEO_HEADER_GETMERKLEROOT]: 400e-8,
  [InteropService.NEO_HEADER_GETNEXTCONSENSUS]: 400e-8,
  [InteropService.NEO_TRANSACTION_GETSCRIPT]: 400e-8,
  [InteropService.NEO_TRANSACTION_GETWITNESSES]: 10000e-8,
  [InteropService.NEO_WITNESS_GETVERIFICATIONSCRIPT]: 400e-8,
  [InteropService.NEO_ACCOUNT_ISSTANDARD]: 30000e-8,
  [InteropService.NEO_CONTRACT_CREATE]: undefined,
  [InteropService.NEO_CONTRACT_UPDATE]: undefined,
  [InteropService.NEO_CONTRACT_GETSCRIPT]: 400e-8,
  [InteropService.NEO_CONTRACT_ISPAYABLE]: 400e-8,
  [InteropService.NEO_STORAGE_FIND]: 1000000e-8,
  [InteropService.NEO_ENUMERATOR_CREATE]: 400e-8,
  [InteropService.NEO_ENUMERATOR_NEXT]: 1000000e-8,
  [InteropService.NEO_ENUMERATOR_VALUE]: 400e-8,
  [InteropService.NEO_ENUMERATOR_CONCAT]: 400e-8,
  [InteropService.NEO_ITERATOR_CREATE]: 400e-8,
  [InteropService.NEO_ITERATOR_KEY]: 400e-8,
  [InteropService.NEO_ITERATOR_KEYS]: 400e-8,
  [InteropService.NEO_ITERATOR_VALUES]: 400e-8,
  [InteropService.NEO_ITERATOR_CONCAT]: 400e-8,
  [InteropService.NEO_JSON_SERIALIZE]: 100000e-8,
  [InteropService.NEO_JSON_DESERIALIZE]: 500000e-8,
  [InteropService.NEO_NATIVE_POLICY]: undefined,
  [InteropService.NEO_NATIVE_TOKENS_NEO]: undefined,
  [InteropService.NEO_NATIVE_TOKENS_GAS]: undefined
};

function getStoragePrice(size: number): number {
  return size * gasPerByte;
}

function getCheckMultiSigPrice(size: number): number {
  return size * fixedPrices[InteropService.NEO_CRYPTO_CHECKSIG];
}

export function getInteropSericePrice(
  service: InteropService,
  size?: number,
  method?: string
): number {
  switch (service) {
    case InteropService.NEO_CRYPTO_CHECKMULTISIG:
      if (size === undefined) {
        throw new Error(
          `size param is necessary for interopService ${service}`
        );
      }
      return getCheckMultiSigPrice(size);
    case InteropService.SYSTEM_STORAGE_PUT:
    case InteropService.SYSTEM_STORAGE_PUTEX:
    case InteropService.NEO_CONTRACT_CREATE:
    case InteropService.NEO_CONTRACT_UPDATE:
      if (size === undefined) {
        throw new Error(
          `size param is necessary for interopService ${service}`
        );
      }
      return getStoragePrice(size);
    case InteropService.NEO_NATIVE_TOKENS_NEO:
      if (method === undefined) {
        throw new Error(
          `method param is necessary for interopService ${service}`
        );
      }
      return (
        NativeContractMethodPrices.get(method) || new Fixed8(0)
      ).toNumber();
    case InteropService.NEO_NATIVE_TOKENS_GAS:
      if (method === undefined) {
        throw new Error(
          `method param is necessary for interopService ${service}`
        );
      }
      return (
        NativeContractMethodPrices.get(method) || new Fixed8(0)
      ).toNumber();
    case InteropService.NEO_NATIVE_POLICY:
      if (method === undefined) {
        throw new Error(
          `method param is necessary for interopService ${service}`
        );
      }
      return (
        NativeContractMethodPrices.get(method) || new Fixed8(0)
      ).toNumber();
    default:
      return fixedPrices[service];
  }
}
