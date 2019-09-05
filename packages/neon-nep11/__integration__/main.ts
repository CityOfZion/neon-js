import { logging, wallet } from "@cityofzion/neon-core";
import {
  buildIteratorScript
} from "../src/main";

describe("buildIteratorScript", () => {
  test("buildIteratorScript with contract", async () => {
    const avm = await buildIteratorScript(
      new wallet.Account("ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"),
      "c938e29961a8d05fcf2a9847e95aebae9003c8be",
      0,
      1000
    );
    expect(avm).toBe('5dc56b14cef0c0fdcfe7838eff6ff104f9cdec29222975376a00527ac408746f6b656e734f666a00c351c176c97ce10102bec80390aeeb5ae947982acf5fd0a86199e238c96a51527ac4006a52527ac400c176c96a53527ac402e8036a54527ac4006a54c3956a55527ac461616a51c368134e656f2e456e756d657261746f722e4e6578746441006a52c36a54c39f6437006a52c36a55c3a2641f006a53c36a51c368124e656f2e4974657261746f722e56616c756561c8616a52c351936a52527ac462a9ff6161616a53c36c7566');
  });
});
