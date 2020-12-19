import { ContractParam } from "../../../src/sc";
import { Nep17Contract } from "../../../src/sc/contracts/Nep17Contract";
import testWallet from "../../testWallet.json";

const scriptHash = "de5f57d430d3dece511cf975a8d37848cb9e0525";
const contract = new Nep17Contract(scriptHash);

const address = testWallet.accounts[0].address;
const addressScriptHash = testWallet.accounts[0].extra.scriptHash;

const addressTwo = testWallet.accounts[1].address;
const addressTwoScriptHash = testWallet.accounts[1].extra.scriptHash;

describe("default methods", () => {
  test("totalSupply", () => {
    const result = contract.totalSupply();

    expect(result).toEqual({
      scriptHash,
      operation: "totalSupply",
      args: [],
    });
  });

  test("decimals", () => {
    const result = contract.decimals();

    expect(result).toEqual({
      scriptHash,
      operation: "decimals",
      args: [],
    });
  });

  test("symbol", () => {
    const result = contract.symbol();

    expect(result).toEqual({
      scriptHash,
      operation: "symbol",
      args: [],
    });
  });

  test("balanceOf", () => {
    const result = contract.balanceOf(address);

    expect(result).toEqual({
      scriptHash,
      operation: "balanceOf",
      args: [ContractParam.hash160(addressScriptHash)],
    });
  });

  test("transfer", () => {
    const result = contract.transfer(address, addressTwo, 100000000, null);

    expect(result).toEqual({
      scriptHash,
      operation: "transfer",
      args: [
        ContractParam.hash160(addressScriptHash),
        ContractParam.hash160(addressTwoScriptHash),
        ContractParam.integer(100000000),
        ContractParam.any(),
      ],
    });
  });
});
