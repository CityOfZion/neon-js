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
