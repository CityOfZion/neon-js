import { u, wallet } from "@cityofzion/neon-core";
import * as abi from "../src/abi";

function randomScriptHash() {
  let hash = "";
  for (let i = 0; i < 40; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  return hash;
}

function randomAddress() {
  return "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
}

const scriptHash = randomScriptHash();
const fromAddr = randomAddress();
const toAddr = randomAddress();

test("name", () => {
  const resultFunction = abi.name(scriptHash);
  const resultScript = resultFunction();
  expect(resultScript).toBe(`00046e616d6567${u.reverseHex(scriptHash)}`);
});

test("decimals", () => {
  const resultFunction = abi.decimals(scriptHash);
  const resultScript = resultFunction();
  expect(resultScript).toBe(
    `0008646563696d616c7367${u.reverseHex(scriptHash)}`
  );
});

test("totalSupply", () => {
  const resultFunction = abi.totalSupply(scriptHash);
  const resultScript = resultFunction();
  expect(resultScript).toBe(
    `000b746f74616c537570706c7967${u.reverseHex(scriptHash)}`
  );
});

test("balanceOf", () => {
  const resultFunction = abi.balanceOf(scriptHash);
  const resultScript = resultFunction(fromAddr);
  expect(resultScript).toBe(
    `14${u.reverseHex(
      wallet.getScriptHashFromAddress(fromAddr)
    )}51c10962616c616e63654f6667${u.reverseHex(scriptHash)}`
  );
});
