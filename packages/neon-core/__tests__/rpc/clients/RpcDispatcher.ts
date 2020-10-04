import { rpc } from "../../../src";

test("throws on url without http", () => {
  expect(() => new rpc.RpcDispatcher("localhost:20332")).toThrowError(
    "starts with http"
  );
});
