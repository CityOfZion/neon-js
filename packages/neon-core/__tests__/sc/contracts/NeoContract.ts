import { NeoContract } from "../../../src/sc/contracts/NeoContract";
import { ContractParam } from "../../../src/sc";
import testWallet from "../../testWallet.json";
import { CallFlags } from "../../../lib/sc";

const contract = NeoContract.INSTANCE;
const address = testWallet.accounts[0].address;
const addressScriptHash = testWallet.accounts[0].extra.scriptHash as string;

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "f61eebf573ea36593fd43aa150c055ad7906ab83"
  );
});

describe("Neo specific methods", () => {
  test("unclaimedGas", () => {
    const result = contract.unclaimedGas(address, 123);

    expect(result).toEqual({
      scriptHash: "f61eebf573ea36593fd43aa150c055ad7906ab83",
      callFlags: CallFlags.All,
      operation: "unclaimedGas",
      args: [
        ContractParam.hash160(addressScriptHash),
        ContractParam.integer(123),
      ],
    });
  });
});
