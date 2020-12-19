import { NeoContract } from "../../../src/sc/contracts/NeoContract";
import { ContractParam } from "../../../src/sc";
import testWallet from "../../testWallet.json";

const contract = NeoContract.INSTANCE;
const address = testWallet.accounts[0].address;
const addressScriptHash = testWallet.accounts[0].extra.scriptHash as string;

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "0a46e2e37c9987f570b4af253fb77e7eef0f72b6"
  );
});

describe("Neo specific methods", () => {
  test("unclaimedGas", () => {
    const result = contract.unclaimedGas(address, 123);

    expect(result).toEqual({
      scriptHash: "0a46e2e37c9987f570b4af253fb77e7eef0f72b6",
      operation: "unclaimedGas",
      args: [
        ContractParam.hash160(addressScriptHash),
        ContractParam.integer(123),
      ],
    });
  });
});
