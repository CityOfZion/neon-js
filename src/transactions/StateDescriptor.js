import { hexstring2str, num2hexstring, num2VarInt, str2hexstring } from '../utils'

export const StateType = {
  Account: 0x40,
  Validator: 0x48
}

export class StateDescriptor {
  constructor (obj) {
    // Indicates the role of the transaction sender
    this.type = obj.type || StateType.Account
    // The signing field of the transaction sender (scripthash for voting)
    this.key = obj.key || ''
    // Indicates action for this descriptor
    this.field = obj.field || ''
    // Data depending on field. For voting, this is the list of publickeys to vote for.
    this.value = obj.value || ''
  }

  static deserialize (ss) {
    const type = parseInt(ss.read(), 16)
    const key = ss.readVarBytes()
    const field = hexstring2str(ss.readVarBytes())
    const value = ss.readVarBytes()
    return new StateDescriptor({ type, key, field, value })
  }

  serialize () {
    let out = num2hexstring(this.type)
    out += num2VarInt(this.key.length / 2)
    out += this.key
    const hexField = str2hexstring(this.field)
    out += num2VarInt(hexField.length / 2)
    out += hexField
    out += num2VarInt(this.value.length / 2)
    out += this.value
    return out
  }
}

export default StateDescriptor
