/**
 * Parses a string, number or enum to an enum.
 */
export function parseEnum<T>(
  input: string | number | T[keyof T],
  enumType: T
): T[keyof T] {
  if (typeof input === "string") {
    if (input in enumType) {
      return enumType[input as keyof typeof enumType];
    }
    throw new Error(`${input} not found in ${enumType}!`);
  }
  return input as T[keyof T];
}

/**
 * Simple type helper to merge types that have the same field names.
 */
export type NeonLike<NeonType, JsonType> = {
  [Property in keyof NeonType & keyof JsonType]:
    | NeonType[Property]
    | JsonType[Property];
};
