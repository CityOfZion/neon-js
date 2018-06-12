/**
 * Enum for StackItem types
 * @readonly
 * @enum {string}
 */

const StackItemType = {
  '00': 'ByteArray',
  '01': 'Boolean',
  '02': 'Integer',
  '04': 'InteropInterface',
  '80': 'Array',
  '81': 'Struct',
  '82': 'Map'
}

/**
 * Determine if there's a nested set based on type
 * @function hasChildren
 */
export const hasChildren = type => {
  if (type === 'Array' || type === 'Struct' || type === 'Map') return true
  return false
}

/**
 * This sets the type and base value for _result
 * @function setResultBase
 */
export const setResultBase = byte => {
  const type = StackItemType[byte]
  let value

  if (type === 'Array' || type === 'Struct' || type === 'Map') {
    value = []
  } else if (type === 'Boolean') {
    // Initializing boolean to undefined, because we'd never use a push or += equivalent with booleans
    value = undefined
  } else {
    value = ''
  }

  return { type, value }
}

export default StackItemType
