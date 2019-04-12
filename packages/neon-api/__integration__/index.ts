import { CONST } from "../../../../neon-core/src/rpc/index";
import * as neonCore from "../../../../neon-core/src/";
import * as rpc from "../../../../neon-core/src/rpc/";
import { Network } from "../../../../neon-core/src/rpc/index";
import { settings } from "../../../../neon-core/src/";
import * as u from "../../../../neon-core/src/u/";
import { Fixed8 } from "../../../../neon-core/src/u/index";
import * as wallet from "../../../../neon-core/src/wallet/";
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
      "logging"
    ])
  );
});

test("Plugin settings merged correctly", () => {
  const result = apiPlugin(neonCore).settings;

  expect(result.httpsOnly).toBeDefined();
  result.httpsOnly = true;
  expect(result.httpsOnly).toBeTruthy();
});
