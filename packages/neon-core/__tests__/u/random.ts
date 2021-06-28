import { generateRandomArray } from "../../src/u/basic/random";

it("returns empty array when 0", () => {
  const result = generateRandomArray(0);
  expect(result.length).toBe(0);
});

it("returns correct length of bytes", () => {
  const result = generateRandomArray(10);

  expect(result.length).toBe(10);
});

it("returns numbers within 0-255", () => {
  const randomNumbers = generateRandomArray(100);

  randomNumbers.forEach((n) => {
    expect(n).toBeLessThanOrEqual(255);
    expect(n).toBeGreaterThanOrEqual(0);
  });
});
