import StackItemType from './StackItemType'

const Deserialize = serializedArray => {
  // Split into bytes of 2 characters
  const byteArray = serializedArray.match(/.{2}/g)

  // Initialize under root byte
  let iterator = -1
  let iteratedByte

  const setIteratedByte = () => {
    iterator++
    iteratedByte = byteArray[iterator]
    return iteratedByte
  }

  const stackItemIterator = () => {
    setIteratedByte()
    const _result = setResultBase(iteratedByte)
    const hasChildren = determineChildren(_result.type)
    const length = intIterator()

    for (let i = 0; i < length; i++) {
      if (hasChildren) {
        if (_result.type === 'Array' || _result.type === 'Struct') {
          _result.value.push(stackItemIterator())
        }
      } else if (!hasChildren) {
        if (_result.type === 'Boolean') {
          setIteratedByte()
          _result.value = parseInt(iteratedByte, 16) === 1 // if 1 => true, else => false
        } else {
          setIteratedByte()
          // Integer = bigInt aka hexstring
          _result.value += iteratedByte
        }
      }
    }

    return _result
  }

  const intIterator = () => {
    const baseLength = setIteratedByte()
    baseLength.toLowerCase()
    if (baseLength === 'fd' || baseLength === 'fe' || baseLength === 'ff') {
      let length = 0
      const byteLength = determineByteLength(baseLength)
      for (let i = 0; i < byteLength; i++) {
        length += parseInt(setIteratedByte(), 16)
      }
      return length
    }

    return parseInt(baseLength, 16)
  }

  return stackItemIterator()
}

const determineByteLength = baseLength => {
  if (baseLength === 'fd') return 2
  else if (baseLength === 'fe') return 4
  else if (baseLength === 'ff') return 8
}

// StackItemType getter
const determineType = byte => StackItemType[byte]

// Determine if there's a nested set based on type
const determineChildren = type => {
  if (type === 'Array' || type === 'Struct') return true
  // TODO: map
  return false
}

// This sets the type and base value for _result
const setResultBase = byte => {
  const type = determineType(byte)
  let value

  if (type === 'Array' || type === 'Struct') {
    value = []
  } else if (type === 'ByteArray' || type === 'Integer') {
    value = '' // Integer = bigInt aka hexstring
  } else {
    // Initializing boolean to undefined, because we'd never use a push or += equivalent with booleans
    value = undefined
  }

  return { type, value }
}

export default Deserialize
