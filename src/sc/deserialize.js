import { setResultBase, hasChildren } from './StackItemType'
import { reverseHex } from './../utils'

const determineByteLength = baseLength => {
  if (baseLength === 'fd') return 2
  else if (baseLength === 'fe') return 4
  else if (baseLength === 'ff') return 8
}

const deserialize = serializedArray => {
  // Split into bytes of 2 characters
  const byteArray = serializedArray.match(/.{2}/g)

  // Initialize under root byte
  let iterator = -1
  let iteratedByte

  const setIteratedByte = () => {
    iterator++
    iteratedByte = byteArray[iterator]
  }

  const stackItemIterator = () => {
    setIteratedByte()
    const _result = setResultBase(iteratedByte)
    const length = intIterator()

    for (let i = 0; i < length; i++) {
      if (hasChildren(_result.type)) {
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
      } else {
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
    setIteratedByte()
    const base = iteratedByte
    base.toLowerCase()
    if (base === 'fd' || base === 'fe' || base === 'ff') {
      const byteLength = determineByteLength(base)
      for (let i = 0; i < byteLength; i++) {
        setIteratedByte()
        length += iteratedByte
      }
      length = reverseHex(length)
    } else {
      length += base
    }

    return parseInt(length, 16)
  }

  return stackItemIterator()
}

export default deserialize
