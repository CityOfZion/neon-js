import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../src/index";

test("Plugin", () => {
  const result = apiPlugin(neonCore);

  expect(Object.keys(result)).toEqual(
    expect.arrayContaining([
      "api",
      "rpc",
      "sc",
      "tx",
      "wallet",
      "u",
      "CONST",
      "settings",
      "logging",
    ])
  );
});

test("Plugin settings merged correctly", () => {
  const result = apiPlugin(neonCore).settings;

  expect(result.httpsOnly).toBeDefined();
  result.httpsOnly = true;
  expect(result.httpsOnly).toBeTruthy();
});
