interface StackItem {
  type: string
  value: string | StackItem[]
}

export function deserialize(d: string): StackItem
