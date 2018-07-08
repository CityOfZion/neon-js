import secureRandom from "secure-random";

/**
 * Generates a arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 */
export const generateRandomArray = (length: number): number[] => {
  return secureRandom(length) as number[];
};
