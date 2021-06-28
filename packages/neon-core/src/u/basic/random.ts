import { lib } from "crypto-js";
/**
 * Generates a arrayBuffer filled with random bytes.
 * @param length - length of buffer.
 */
export const generateRandomArray = (length: number): number[] => {
  // Round up to nearest multiple of 4 so that the words generated is more than what we need.
  const numberOfWords = length % 4 === 0 ? length : length + (length % 4);

  // This converts the generated words into a hexstring.
  const wordArray = lib.WordArray.random(numberOfWords).toString();

  // Chunk the hexstring into chunks of 2 which represents 1 byte each
  const hexStrings = wordArray.substr(0, length * 2).match(/.{1,2}/g) || [];
  return hexStrings.map((hexstr) => parseInt(hexstr, 16));
};
