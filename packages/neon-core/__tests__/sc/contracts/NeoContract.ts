import { NeoContract } from "../../../src/sc/contracts/NeoContract";
import { ContractParam } from "../../../src/sc";
import testWallet from "../../testWallet.json";

const contract = NeoContract.INSTANCE;
const address = testWallet.accounts[0].address;
const addressScriptHash = testWallet.accounts[0].extra.scriptHash as string;

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "de5f57d430d3dece511cf975a8d37848cb9e0525"
  );
});

describe("Neo specific methods", () => {
  test("unclaimedGas", () => {
    const result = contract.unclaimedGas(address, 123);

    expect(result).toEqual({
      scriptHash: "de5f57d430d3dece511cf975a8d37848cb9e0525",
      operation: "unclaimedGas",
      args: [
        ContractParam.hash160(addressScriptHash),
        ContractParam.integer(123),
      ],
    });
  });
});
