interface DeserializedResult {
  type: string
  value: string | DeserializedResult[]
}

export function Deserialize(d: string): DeserializedResult
