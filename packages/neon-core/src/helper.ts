export interface NeonObject {
  export(): unknown;
  equals<T>(other: Partial<T>): boolean;
}

export function compareNeonObjectArray(
  arr1: NeonObject[],
  arr2: any[] = []
): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (const c of arr1) {
    if (!arr2.find((cl) => c.equals(cl))) {
      return false;
    }
  }
  return true;
}

export function compareObject(
  current: { [key: string]: any },
  other: { [key: string]: any }
): boolean {
  const keys = Object.keys(current);
  const otherKeys = Object.keys(other);
  if (keys.length !== otherKeys.length) {
    return false;
  }
  for (const key of keys) {
    if (other[key] !== undefined && current[key] === other[key]) {
      continue;
    }
    return false;
  }
  return true;
}

export function compareUnsortedPlainArrays(
  current: any[],
  other: any[]
): boolean {
  if (
    !Array.isArray(current) ||
    !Array.isArray(other) ||
    current.length !== other.length
  ) {
    return false;
  }
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== other[i]) {
      return false;
    }
  }
  return true;
}

export function compareArray(current: any[], other: any[]): boolean {
  if (current.length !== other.length) {
    return false;
  }
  for (let i = 0; i < current.length; i++) {
    if (typeof current[i] === "object" && typeof other[i] === "object") {
      const objectEquality = compareObject(current[i], other[i]);
      if (!objectEquality) {
        return false;
      }
    }
    if (current[i] !== other[i]) {
      return false;
    }
  }
  return true;
}
