import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../../src/index";

const neonJs = apiPlugin(neonCore);
let notificationsClient: import("@cityofzion/neon-api/src/notifications").instance;
beforeAll(() => {
  notificationsClient = new neonJs.api.notifications.instance(
    "wss://pubsub.main.neologin.io/event"
  );
});

afterEach(() => {
  notificationsClient.unsubscribeAll();
});

describe("notifications", () => {
  test("smoke test", done => {
    notificationsClient.subscribe(null, response => {
      expect(response.contract).toBeDefined();
      expect(response.event).toBeDefined();
      expect(response.txid).toBeDefined();
      done();
    });
  }, 30000);
});
