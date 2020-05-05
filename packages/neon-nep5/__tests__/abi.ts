import { u, wallet } from "@cityofzion/neon-core";
import * as abi from "../src/abi";

function randomScriptHash(): string {
  let hash = "";
  for (let i = 0; i < 40; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  return hash;
}

function randomAddress(): string {
  return "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
}

const scriptHash = randomScriptHash();
const fromAddr = randomAddress();

test("name", () => {
  const resultFunction = abi.name(scriptHash);
  const resultScript = resultFunction().str;
  expect(resultScript).toBe(`00c1046e616d6567${u.reverseHex(scriptHash)}`);
});

test("decimals", () => {
  const resultFunction = abi.decimals(scriptHash);
  const resultScript = resultFunction().str;
  expect(resultScript).toBe(
    `00c108646563696d616c7367${u.reverseHex(scriptHash)}`
  );
});

test("totalSupply", () => {
  const resultFunction = abi.totalSupply(scriptHash);
  const resultScript = resultFunction().str;
  expect(resultScript).toBe(
    `00c10b746f74616c537570706c7967${u.reverseHex(scriptHash)}`
  );
});

test("balanceOf", () => {
  const resultFunction = abi.balanceOf(scriptHash, fromAddr);
  const resultScript = resultFunction().str;
  expect(resultScript).toBe(
    `14${u.reverseHex(
      wallet.getScriptHashFromAddress(fromAddr)
    )}51c10962616c616e63654f6667${u.reverseHex(scriptHash)}`
  );
});

test.each([
  [
    "d7678dd97c000be3f33e9362e673101bac4ca654",
    "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
    "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
    0.00000001,
    "51143775292229eccdf904f16fff8e83e7cffdc0f0ce1435b20010db73bf86371075ddfba4e6596f1ff35d53c1087472616e736665726754a64cac1b1073e662933ef3e30b007cd98d67d7",
  ],
  [
    "5b7074e873973a6ed3708862f219a6fbf4d1c411",
    "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
    "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
    42.93967296,
    "05c0bdf0ff00143775292229eccdf904f16fff8e83e7cffdc0f0ce149847e26135152874355e324afd5cc99f002acb3353c1087472616e736665726711c4d1f4fba619f2628870d36e3a9773e874705b",
  ],
])(
  "%s: %s -> %s %d",
  (
    scriptHash: string,
    sendingAddr: string,
    receivingAddr: string,
    amt: number,
    expected: string
  ) => {
    const resultFunction = abi.transfer(
      scriptHash,
      sendingAddr,
      receivingAddr,
      amt
    );
    const resultScript = resultFunction().str;
    expect(resultScript).toBe(expected);
  }
);

test("transfer", () => {
  const account = new wallet.Account(
    "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69"
  );
  const amtToSendTest = 922.33720369;
  const generator = abi.transfer(
    "9488220e8654d798f9b9cb9e74bd611ecc83fd0f",
    account.address,
    account.address,
    amtToSendTest
  );
  const builder = generator();

  const script =
    "0531e28e79151435b20010db73bf86371075ddfba4e6596f1ff35d1435b20010db73bf86371075ddfba4e6596f1ff35d53c1087472616e73666572670ffd83cc1e61bd749ecbb9f998d754860e228894";
  expect(builder["str"]).toBe(script);
});
