import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../../src/index";

const neonJs = apiPlugin(neonCore);
let notificationsClient: import("@cityofzion/neon-api/src/notifications").instance;
beforeAll(() => {
  notificationsClient = new neonJs.api.notifications.instance(
    "wss://pubsub.main.neologin.io/event"
  );
});

afterEach(async () => {
  await notificationsClient.unsubscribeAll();
}, 10000);

describe("notifications", () => {
  test.skip("smoke test", (done) => {
    notificationsClient.subscribe(null, (response) => {
      expect(response.contract).toBeDefined();
      expect(response.event).toBeDefined();
      expect(response.txid).toBeDefined();
      done();
    });
  }, 30000);
});
