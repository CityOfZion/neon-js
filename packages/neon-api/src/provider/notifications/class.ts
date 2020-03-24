import { logging, settings } from "@cityofzion/neon-core";
import WebSocket from 'isomorphic-ws';
import { NotificationMessage } from "./responses";
const log = logging.default("api");

export class Notifications {
  private url: string;

  public get name(): string {
    return `Notifications[${this.url}]`;
  }

  private websocketSubscriptions: Map<string, WebSocket[]>;

  public constructor(url: string) {
    if (settings.networks[url] && settings.networks[url].extra.notifications) {
      this.url = settings.networks[url].extra.notifications;
    } else {
      this.url = url;
    }
    this.websocketSubscriptions = new Map<string, WebSocket[]>();
    log.info(`Created Notifications Provider: ${this.url}`);
  }

  public subscribe(contract: string, callback: (message: NotificationMessage) => void) {
    const ws = new WebSocket(this.url + "?contract=" + contract);
    ws.onmessage = (event: WebSocket.MessageEvent) => {
      callback(JSON.parse(event.data as string) as NotificationMessage);
    };
    if(this.websocketSubscriptions.has(contract)){
      this.websocketSubscriptions.get(contract)!.push(ws);
    } else {
      this.websocketSubscriptions.set(contract, [ws]);
    }
  }

  public unsubscribe(contract: string) {
    if(!this.websocketSubscriptions.has(contract)){
      return; // Not throwing an exception in order to allow unlimited calling of this function
    }
    for(const ws of this.websocketSubscriptions.get(contract)!){
      ws.close();
    }
    this.websocketSubscriptions.delete(contract);
  }
}

export default Notifications;
