import { wallet } from "@cityofzion/neon-core";
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
    expect(avm).toBe('');
  });
});
