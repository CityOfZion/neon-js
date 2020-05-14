import { getAltStatusMessage } from "@ledgerhq/hw-transport";

export enum ErrorCode {
  VALID_STATUS = 0x9000,
  MSG_TOO_BIG = 0x6d08,
  APP_CLOSED = 0x6e00,
  TX_DENIED = 0x6985,
}

export interface TransportStatusError extends Error {
  name: "TransportStatusError";
  message: string;
  stack: Error["stack"];
  statusCode: number;
  statusText: string;
}

/**
 * Evaluates Transport Error thrown and rewrite the error message to be more user friendly.
 * @return error with modified message if found.
 */
export function evalTransportError(err: Error): Error {
  const transportErr = err as TransportStatusError;
  switch (transportErr.statusCode) {
    case ErrorCode.APP_CLOSED:
      transportErr.message = "Your NEO app is closed! Please login.";
      break;
    case ErrorCode.MSG_TOO_BIG:
      transportErr.message =
        "Your transaction is too big for the ledger to sign!";
      break;
    case ErrorCode.TX_DENIED:
      transportErr.message = "Transaction signing denied";
      break;
    default:
      transportErr.message = getAltStatusMessage(transportErr.statusCode);
  }
  return err;
}

export default ErrorCode;
