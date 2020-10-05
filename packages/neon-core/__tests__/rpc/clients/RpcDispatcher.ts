import { rpc } from "../../../src";

test("throws on url without http", () => {
  expect(() => new rpc.RpcDispatcher("localhost:20332")).toThrowError(
    "starts with http"
  );
});

test("throws on url with typoed http", () => {
  expect(() => new rpc.RpcDispatcher("http:/localhost:20332")).toThrowError(
    "starts with http"
  );
});
