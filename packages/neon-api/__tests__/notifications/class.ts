import { settings, rpc } from "@cityofzion/neon-core";
import WebSocket from "isomorphic-ws";
import notifications from "../../src/notifications/class";
jest.mock("isomorphic-ws");

const unitTestNetUrl = "wss://testurl.com";
beforeEach(() => {
  jest.resetModules();
  WebSocket.mockClear();
  settings.networks.UnitTestNet = new rpc.Network({
    name: "UnitTestNet",
    extra: {
      neoscan: "http://wrongurl.com",
      neonDB: "http://wrongurl.com",
      notifications: unitTestNetUrl,
    },
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
    expect(result.name).toMatch(unitTestNetUrl);
  });
});

const contract = "0x314b5aac1cdd01d10661b00886197f2194c3c89b";
const contract2 = "0x314b5aac1cdd01d10661b00886197f2194c3c89c";
const sampleEvent = {
  event: [
    {
      type: "ByteArray",
      value: "7472616e73666572",
    },
    {
      type: "ByteArray",
      value: "30074a2d88bab26f74142c188231e92ad401dbf6",
    },
    {
      type: "ByteArray",
      value: "8ba6205856117b0f3909cd88209aa919ec9c14b8",
    },
    {
      type: "ByteArray",
      value: "00c39dd000",
    },
  ],
  contract,
  txid: "0xd6f5185a19abad3f3bbea88ac4ec63b449ac38908bd7761dce75e445502bc76f",
};

function triggerWebsocketSampleEvent(): void {
  WebSocket.mock.instances[0].onmessage({
    data: JSON.stringify(sampleEvent),
  });
}

describe("subscribe", () => {
  test("subscribe opens correct websocket connection", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, jest.fn());
    expect(WebSocket).toBeCalledWith(unitTestNetUrl + "?contract=" + contract);
  });
  test("subscribe works with non-0x-prefixed contracts", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract.slice(2), jest.fn());
    expect(WebSocket).toBeCalledWith(unitTestNetUrl + "?contract=" + contract);
  });
  test("subscribe relays messages properly", async () => {
    const callback = jest.fn();
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, callback);
    triggerWebsocketSampleEvent();
    expect(callback).toBeCalledWith(sampleEvent);
  });
  test("same subscription can be repeated", async () => {
    const callback = jest.fn();
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, callback);
    subscriptions.subscribe(contract, callback);
    triggerWebsocketSampleEvent();
    expect(callback).toBeCalledTimes(2);
  });
  test("subscription name is correct", async () => {
    const subscriptions = new notifications("UnitTestNet");
    const subscription = subscriptions.subscribe(contract, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    expect(subscription.name).toBe(`Subscription[${contract}]`);
  });
  test("null subscription is accepted", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(null, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
  });
});

describe("unsubscribe", () => {
  test("unsubscribe can be called several times on the same subscription without problem", async () => {
    const subscriptions = new notifications("UnitTestNet");
    const subscription = subscriptions.subscribe(contract, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    subscription.unsubscribe();
    subscription.unsubscribe();
  });
  test("unsubscribe only removes a single instance of a repeated subscription", async () => {
    const callback = jest.fn();
    const subscriptions = new notifications("UnitTestNet");
    const subscription = subscriptions.subscribe(contract, callback);
    subscriptions.subscribe(contract, callback);
    subscription.unsubscribe();
    triggerWebsocketSampleEvent();
    expect(callback).toBeCalledTimes(1);
  });
  test("unsubscribe closes the websocket connection when there's only 1 subscription", async () => {
    const subscriptions = new notifications("UnitTestNet");
    const subscription = subscriptions.subscribe(contract, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    subscription.unsubscribe();
    expect(WebSocket.mock.instances[0].close).toHaveBeenCalledTimes(1);
  });
});

describe("unsubscribeContract", () => {
  test("unsubscribeContract closes the websocket connection and works with non-0x-prefixed strings", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    subscriptions.unsubscribeContract(contract.slice(2));
    expect(WebSocket.mock.instances[0].close).toHaveBeenCalledTimes(1);
  });
  test("unsubscribeContract can be called on a non-subscribed contract", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.unsubscribeContract(contract);
  });
});

describe("unsubscribeAll", () => {
  test("closes all websocket connections", async () => {
    const subscriptions = new notifications("UnitTestNet");
    subscriptions.subscribe(contract, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    subscriptions.subscribe(contract2, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    subscriptions.unsubscribeAll();
    expect(WebSocket.mock.instances[0].close).toHaveBeenCalledTimes(1);
    expect(WebSocket.mock.instances[1].close).toHaveBeenCalledTimes(1);
  });
});
