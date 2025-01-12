import { NeoContract } from "../../../src/sc/contracts/NeoContract";
import { ContractParam, CallFlags } from "../../../src/sc";
import testWallet from "../../testWallet.json";

const contract = NeoContract.INSTANCE;
const address = testWallet.accounts[0].address;
const addressScriptHash = testWallet.accounts[0].extra.scriptHash as string;

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
  );
});

describe("Neo specific methods", () => {
  test("unclaimedGas", () => {
    const result = contract.unclaimedGas(address, 123);

    expect(result).toEqual({
      scriptHash: "ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
      callFlags: CallFlags.All,
      operation: "unclaimedGas",
      args: [
        ContractParam.hash160(addressScriptHash),
        ContractParam.integer(123),
      ],
    });
  });
});
