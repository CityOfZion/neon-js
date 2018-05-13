import { ab2str, hexstring2ab } from '../utils'

/**
 * Parses the VM Stack and returns human readable strings
 * @param {any} res - RPC Response
 * @return {any[]} Array of results
 */
export const VMParser = (res) => {
  const stack = res.result.stack
  return stack.map((item) => {
    switch (item.type) {
      case 'ByteArray':
        return ab2str(hexstring2ab(item.value))
      case 'Integer':
        return parseInt(item.value, 10)
      default:
        throw Error(`Unknown type: ${item.type}`)
    }
  })
}

/**
 * Parses and extracts the VM Stack as is
 * @param {any} res - RPC Response
 * @return {any[]} Array of results
 */
export const VMExtractor = (res) => {
  const stack = res.result.stack
  return stack.map((item) => item.value)
}

/**
 * Extracts the VM stack into an array and zips it with the provided array of parsing functions.
 * @param {function[]} funcs - An array of parsing functions.
 * @return {function} A parser function
 */
export const VMZip = (...args) => {
  return (res) => {
    const stack = res.result.stack
    if (stack.length !== args.length) throw new RangeError(`Invalid results length! Expected ${args.length} but got ${stack.length}`)
    return stack.map((item, i) => args[i](item.value))
  }
}
