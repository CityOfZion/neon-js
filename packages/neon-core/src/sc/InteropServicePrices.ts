import InteropServiceCode from "./InteropServiceCode";
import NativeContractMethodPrices from "./NativeContractMethodPrices";
import { Fixed8 } from "../u";

export interface InteropServicePriceParam {
  size: number;
  method: string;
}

const GAS_PER_BYTE = 100000e-8;
const fixedPrices = {
  [InteropServiceCode.SYSTEM_EXECUTIONENGINE_GETSCRIPTCONTAINER]: 250e-8,
  [InteropServiceCode.SYSTEM_EXECUTIONENGINE_GETEXECUTINGSCRIPTHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_EXECUTIONENGINE_GETCALLINGSCRIPTHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_EXECUTIONENGINE_GETENTRYSCRIPTHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_PLATFORM]: 250e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTRIGGER]: 250e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_CHECKWITNESS]: 30000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_NOTIFY]: 250e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_LOG]: 300000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTIME]: 250e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_SERIALIZE]: 100000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_DESERIALIZE]: 500000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETINVOCATIONCOUNTER]: 400e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETNOTIFICATIONS]: 10000e-8,
  [InteropServiceCode.SYSTEM_CRYPTO_VERIFY]: 1000000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETHEIGHT]: 400e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETHEADER]: 7000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETBLOCK]: 2500000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTION]: 1000000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTIONHEIGHT]: 1000000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETCONTRACT]: 1000000e-8,
  [InteropServiceCode.SYSTEM_HEADER_GETINDEX]: 400e-8,
  [InteropServiceCode.SYSTEM_HEADER_GETHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_HEADER_GETPREVHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_HEADER_GETTIMESTAMP]: 400e-8,
  [InteropServiceCode.SYSTEM_BLOCK_GETTRANSACTIONCOUNT]: 400e-8,
  [InteropServiceCode.SYSTEM_BLOCK_GETTRANSACTIONS]: 10000e-8,
  [InteropServiceCode.SYSTEM_BLOCK_GETTRANSACTION]: 400e-8,
  [InteropServiceCode.SYSTEM_TRANSACTION_GETHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_CALL]: 1000000e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_DESTROY]: 1000000e-8,
  [InteropServiceCode.SYSTEM_STORAGE_GETCONTEXT]: 400e-8,
  [InteropServiceCode.SYSTEM_STORAGE_GETREADONLYCONTEXT]: 400e-8,
  [InteropServiceCode.SYSTEM_STORAGE_GET]: 1000000e-8,
  [InteropServiceCode.SYSTEM_STORAGE_PUT]: undefined,
  [InteropServiceCode.SYSTEM_STORAGE_PUTEX]: undefined,
  [InteropServiceCode.SYSTEM_STORAGE_DELETE]: 1000000e-8,
  [InteropServiceCode.SYSTEM_STORAGECONTEXT_ASREADONLY]: 400e-8,
  [InteropServiceCode.NEO_NATIVE_DEPLOY]: 0e-8,
  [InteropServiceCode.NEO_CRYPTO_CHECKSIG]: 1000000e-8,
  [InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG]: undefined,
  [InteropServiceCode.NEO_HEADER_GETVERSION]: 400e-8,
  [InteropServiceCode.NEO_HEADER_GETMERKLEROOT]: 400e-8,
  [InteropServiceCode.NEO_HEADER_GETNEXTCONSENSUS]: 400e-8,
  [InteropServiceCode.NEO_TRANSACTION_GETSCRIPT]: 400e-8,
  [InteropServiceCode.NEO_TRANSACTION_GETWITNESSES]: 10000e-8,
  [InteropServiceCode.NEO_WITNESS_GETVERIFICATIONSCRIPT]: 400e-8,
  [InteropServiceCode.NEO_ACCOUNT_ISSTANDARD]: 30000e-8,
  [InteropServiceCode.NEO_CONTRACT_CREATE]: undefined,
  [InteropServiceCode.NEO_CONTRACT_UPDATE]: undefined,
  [InteropServiceCode.NEO_CONTRACT_GETSCRIPT]: 400e-8,
  [InteropServiceCode.NEO_CONTRACT_ISPAYABLE]: 400e-8,
  [InteropServiceCode.NEO_STORAGE_FIND]: 1000000e-8,
  [InteropServiceCode.NEO_ENUMERATOR_CREATE]: 400e-8,
  [InteropServiceCode.NEO_ENUMERATOR_NEXT]: 1000000e-8,
  [InteropServiceCode.NEO_ENUMERATOR_VALUE]: 400e-8,
  [InteropServiceCode.NEO_ENUMERATOR_CONCAT]: 400e-8,
  [InteropServiceCode.NEO_ITERATOR_CREATE]: 400e-8,
  [InteropServiceCode.NEO_ITERATOR_KEY]: 400e-8,
  [InteropServiceCode.NEO_ITERATOR_KEYS]: 400e-8,
  [InteropServiceCode.NEO_ITERATOR_VALUES]: 400e-8,
  [InteropServiceCode.NEO_ITERATOR_CONCAT]: 400e-8,
  [InteropServiceCode.NEO_JSON_SERIALIZE]: 100000e-8,
  [InteropServiceCode.NEO_JSON_DESERIALIZE]: 500000e-8,
  [InteropServiceCode.NEO_NATIVE_POLICY]: undefined,
  [InteropServiceCode.NEO_NATIVE_TOKENS_NEO]: undefined,
  [InteropServiceCode.NEO_NATIVE_TOKENS_GAS]: undefined
};

function getStoragePrice(size: number): number {
  return size * GAS_PER_BYTE;
}

function getCheckMultiSigPrice(size: number): number {
  return size * fixedPrices[InteropServiceCode.NEO_CRYPTO_CHECKSIG];
}

export function getInteropServicePrice(
  service: InteropServiceCode,
  param?: Partial<InteropServicePriceParam>
): number {
  switch (service) {
    case InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG:
      if (!param || !param.size) {
        throw new Error(
          `size param is necessary for InteropServiceCode ${service}`
        );
      }
      return getCheckMultiSigPrice(param.size);
    case InteropServiceCode.SYSTEM_STORAGE_PUT:
    case InteropServiceCode.SYSTEM_STORAGE_PUTEX:
    case InteropServiceCode.NEO_CONTRACT_CREATE:
    case InteropServiceCode.NEO_CONTRACT_UPDATE:
      if (!param || !param.size) {
        throw new Error(
          `size param is necessary for InteropServiceCode ${service}`
        );
      }
      return getStoragePrice(param.size);
    case InteropServiceCode.NEO_NATIVE_TOKENS_NEO:
    case InteropServiceCode.NEO_NATIVE_TOKENS_GAS:
    case InteropServiceCode.NEO_NATIVE_POLICY:
      if (!param || !param.method) {
        throw new Error(
          `method param is necessary for InteropServiceCode ${service}`
        );
      }
      return (
        NativeContractMethodPrices.get(param.method) || new Fixed8(0)
      ).toNumber();
    default:
      return fixedPrices[service];
  }
}
