import { settings, rpc } from "@cityofzion/neon-core";
import WebSocket from "isomorphic-ws";
import notifications from "../../src/notifications/class";
jest.mock("isomorphic-ws");

const UnitTestNetUrl = "wss://testurl.com";
beforeEach(() => {
  jest.resetModules();
  WebSocket.mockClear();
  settings.networks.UnitTestNet = new rpc.Network({
    name: "UnitTestNet",
    extra: {
      neoscan: "http://wrongurl.com",
      neonDB: "http://wrongurl.com",
      notifications: UnitTestNetUrl
    }
  });
});

describe("constructor", () => {
  test("url", () => {
    const expectedUrl = "www.test.com";
    const result = new notifications(expectedUrl);
    expect(result.name).toMatch(expectedUrl);
  });

  test("Network name", () => {
    const result = new notifications("UnitTestNet");
    expect(result.name).toMatch(UnitTestNetUrl);
  });
});

const contract = "0x314b5aac1cdd01d10661b00886197f2194c3c89b";
describe("subscribe", () => {
  test("subscribe opens correct websocket connection", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    expect(WebSocket).toBeCalledWith(UnitTestNetUrl + "?contract=" + contract);
  });
  test("subscribe relays messages properly", async () => {
    const callback = jest.fn();
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, callback);
    const eventSample = {
      event: [
        {
          type: "ByteArray",
          value: "7472616e73666572"
        },
        {
          type: "ByteArray",
          value: "30074a2d88bab26f74142c188231e92ad401dbf6"
        },
        {
          type: "ByteArray",
          value: "8ba6205856117b0f3909cd88209aa919ec9c14b8"
        },
        {
          type: "ByteArray",
          value: "00c39dd000"
        }
      ],
      contract: "0x314b5aac1cdd01d10661b00886197f2194c3c89b",
      txid: "0xd6f5185a19abad3f3bbea88ac4ec63b449ac38908bd7761dce75e445502bc76f"
    };
    WebSocket.mock.instances[0].onmessage({
      data: JSON.stringify(eventSample)
    });
    expect(callback).toBeCalledWith(eventSample);
  });
});

describe("unsubscribe", () => {
  test("unsubscribe closes the websocket connection", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    subscriptions.unsubscribe(contract);
    expect(WebSocket.mock.instances[0].close).toHaveBeenCalledTimes(1);
  });
});
