import { RPCResponse } from './rpc'

/** Parses the VM Stack and returns human readable strings */
export function VMParser(res: RPCResponse): Array<any>

/** Parses and extracts the VM Stack as is */
export function VMExtractor(res: RPCResponse): Array<any>

/** Extracts the VM stack into an array and zips it with the provided array of parsing functions. */
export function VMZip(...args: any[]): (res: RPCResponse) => any[]
