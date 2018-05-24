import StackItemType from './StackItemType'
import { reverseHex } from './../utils'

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
        } else if (_result.type === 'Map') {
          // Map is basically JSON, each entry has 2 values (first is the key, second the actual value)
          // But both key and value will be StackItems, we'll store them as an array of key-value pairs...
          // until we have a better solution of course
          _result.value.push({
            key: stackItemIterator(),
            value: stackItemIterator()
          })
        }
      } else if (!hasChildren) {
        if (_result.type === 'Boolean') {
          setIteratedByte()
          _result.value = parseInt(iteratedByte, 16) > 0 // true if the byte is nonzero; otherwise, false.
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
    let length = ''
    const base = setIteratedByte()
    base.toLowerCase()
    if (base === 'fd' || base === 'fe' || base === 'ff') {
      const byteLength = determineByteLength(base)
      for (let i = 0; i < byteLength; i++) {
        length += setIteratedByte()
      }
      length = reverseHex(length)
    } else {
      length += base
    }

    return parseInt(length, 16)
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
  if (type === 'Array' || type === 'Struct' || type === 'Map') return true
  // TODO: map
  return false
}

// This sets the type and base value for _result
const setResultBase = byte => {
  const type = determineType(byte)
  let value

  if (type === 'Array' || type === 'Struct' || type === 'Map') {
    value = []
  } else if (type === 'Boolean') {
    // Initializing boolean to undefined, because we'd never use a push or += equivalent with booleans
    value = undefined
  } else {
    // if (type === 'ByteArray' || type === 'Integer') {
    value = '' // Integer = bigInt aka hexstring
  }

  // TODO: Map

  return { type, value }
}

export default Deserialize
