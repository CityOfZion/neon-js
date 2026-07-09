type DapiErrorJSON = {
  code: DapiErrorCode;
  message: string;
};

export enum DapiErrorCode {
  UNKNOWN = 10000, // An unknown error has occurred.
  UNSUPPORTED = 10001, // The requested feature or operation is not supported.
  INVALID = 10002, // The input data is in an invalid format.
  NOTFOUND = 10003, // The requested data doesn't exist.
  FAILED = 10004, // The contract execution failed.
  TIMEOUT = 10005, // The requested operation was cancelled due to timeout.
  CANCELED = 10006, // The requested operation was cancelled by the user.
  INSUFFICIENT_FUNDS = 10007, // The requested operation failed due to insufficient balance.
  RPC_ERROR = 10008, // An exception was thrown by the RPC server.
}

const ERROR_CODE_BY_RPC_CODE: Record<number, DapiErrorCode> = {
  [-300]: DapiErrorCode.INSUFFICIENT_FUNDS,
  [-504]: DapiErrorCode.INSUFFICIENT_FUNDS,
  [-511]: DapiErrorCode.INSUFFICIENT_FUNDS,
  [-608]: DapiErrorCode.FAILED,
};

export class DapiError extends Error {
  code: DapiErrorCode;

  constructor(code: DapiErrorCode, message: string) {
    super(message);
    this.code = code;
  }

  toJSON(): DapiErrorJSON {
    return { code: this.code, message: this.message };
  }

  static parseError(error: unknown): DapiError {
    if (error instanceof DapiError) {
      return error;
    }

    if (error instanceof Error) {
      if ("code" in error && typeof error.code === "number") {
        return new DapiError(
          ERROR_CODE_BY_RPC_CODE[error.code] || DapiErrorCode.RPC_ERROR,
          error.message,
        );
      }

      return new DapiError(DapiErrorCode.UNKNOWN, error.message);
    }

    return new DapiError(DapiErrorCode.UNKNOWN, "Unknown error");
  }
}
